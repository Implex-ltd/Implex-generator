package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	"github.com/Implex-ltd/cleanhttp/cleanhttp"
	"github.com/Implex-ltd/fingerprint-client/fpclient"
	"github.com/Implex-ltd/implex/internal/utils"
	u "github.com/Implex-ltd/ucdiscord/ucdiscord"
	"github.com/zenthangplus/goccm"
	"go.uber.org/zap"
)

var (
	threads = 100
	invite  = "2ceWx77x"
)

func solve(proxy string) string {
	payload, _ := json.Marshal(BodyNewSolveTask{
		UserAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
		Domain:    "discord.com",
		SiteKey:   "4c672d35-0701-42b2-88c3-78380b0db560",
		Proxy:     proxy,
	})

	for {
		client := http.Client{
			Timeout: 30 * time.Second,
		}

		req, err := http.NewRequest("POST", fmt.Sprintf("%s/solve", "http://127.0.0.1:1337"), strings.NewReader(string(payload)))
		if err != nil {
			logger.Error("NewRequest",
				zap.String("error", err.Error()),
			)
			Error++
			continue
		}

		resp, err := client.Do(req)
		if err != nil {
			logger.Error("DoRequest",
				zap.String("error", err.Error()),
			)
			Error++
			continue
		}

		defer resp.Body.Close()

		body, err := io.ReadAll(resp.Body)
		if err != nil {
			logger.Error("ReadAll",
				zap.String("error", err.Error()),
			)
			Error++
			continue
		}

		var out TaskResponse
		if err := json.Unmarshal(body, &out); err != nil {
			fmt.Println(err)
			Error++
			continue
		}

		if !out.Success {
			logger.Error("solve error",
				zap.Int64("hsw_process", out.Data.Metrics.HswProcess),
				zap.Int64("img_process", out.Data.Metrics.ImgProcess),
				zap.Int64("ttl_process", out.Data.Metrics.TTLProcess),
				zap.Int64("task_process", out.Data.Metrics.TaskProcess),
				zap.Int64("retry", out.Data.Err.Retry),
			)
			Error++
			continue
		}

		logger.Info("solved",
			zap.String("key", out.Data.Token.CAPTCHAKey[:50]),
			zap.Int64("hsw_process", out.Data.Metrics.HswProcess),
			zap.Int64("img_process", out.Data.Metrics.ImgProcess),
			zap.Int64("ttl_process", out.Data.Metrics.TTLProcess),
			zap.Int64("task_process", out.Data.Metrics.TaskProcess),
			zap.Int64("retry", out.Data.Err.Retry),
		)

		return out.Data.Token.CAPTCHAKey
	}
}

func handleNewAccount(token, username string, client *u.Client) {
	wsresp, err := client.WsConnect()
	if err != nil {
		logger.Error("ws connect",
			zap.String("error", err.Error()),
		)
		return
	}

	logger.Info("connected",
		zap.String("sessionID", wsresp.D.SessionID),
		zap.String("username", wsresp.D.User.Username),
	)

	cfg := u.JoinConfig{
		InviteCode: invite,
		GuildID:    "1140717857047584798",
		ChannelID:  "1140717857047584801",
	}

	resp, err := client.JoinGuild(&cfg)
	if err != nil {
		logger.Error("can't join",
			zap.String("error", err.Error()),
		)
		return
	}

	fmt.Println(resp)

	logger.Info("joined",
		zap.String("name", resp.Guild.Name),
		zap.String("invite", cfg.InviteCode),
		zap.String("channelID", cfg.ChannelID),
		zap.String("guildID", cfg.GuildID),
	)

	locked, err := client.IsLocked()
	if err != nil {
		logger.Error("is-locked",
			zap.String("error", err.Error()),
		)
	}

	if locked {
		Locked++
		logger.Warn("locked",
			zap.String("username", username),
			zap.String("token", token),
		)
		return
	}

	Unlocked++
	logger.Info("unlocked",
		zap.String("username", username),
		zap.String("token", token),
	)

	if err := utils.AppendFile("output/unlocked.txt", token); err != nil {
		logger.Error("save-token",
			zap.String("error", err.Error()),
		)
		return
	}
}

func worker(fp *fpclient.Fingerprint) {
	// Load proxy
	proxy, err := data["proxies"].Next()
	if err != nil {
		logger.Error("get-proxy",
			zap.String("error", err.Error()),
		)
		return
	}

	// Load username
	username, err := data["username"].Next()
	if err != nil {
		logger.Error("get-username",
			zap.String("error", err.Error()),
		)
		return
	}

	// Create channels to receive results
	solveResultCh := make(chan string)
	discordClientCh := make(chan *u.Client)

	go func() {
		hcap := solve("http://" + proxy)
		Solved++
		solveResultCh <- hcap
	}()

	go func() {
		// Load http client
		http, err := cleanhttp.NewCleanHttpClient(&cleanhttp.Config{
			BrowserFp: fp,
			Proxy:     "http://" + proxy,
		})
		if err != nil {
			logger.Error("load-http",
				zap.String("error", err.Error()),
			)
			discordClientCh <- nil
			return
		}

		// Load discord client
		client, err := u.NewClient(&u.ClientConfig{
			GetCookies:  true,
			BuildNumber: 221235,
			Client:      http,
		})
		if err != nil {
			logger.Error("load-discord",
				zap.String("error", err.Error()),
			)
			discordClientCh <- nil
			return
		}
		
		discordClientCh <- client
	}()

	// Receive results from channels
	hcapResult := <-solveResultCh
	discordClient := <-discordClientCh

	if discordClient == nil {
		return
	}


	/*http.Do(cleanhttp.RequestOption{
		Url:    "discord.com",
		Header: client.HttpClient.GetDefaultHeader(),
		Method: "GET",
	})

	client.Register(&u.RegisterConfig{
		Username:   username,
		InviteCode: invite,
	})*/

	// Create account
	resp, err := discordClient.Register(&u.RegisterConfig{
		Username:   username,
		InviteCode: invite,
		CaptchaKey: hcapResult,
	})
	if err != nil {
		logger.Error("register",
			zap.String("error", err.Error()),
		)
		return
	}

	if resp.Token == "" {
		logger.Error("register",
			zap.String("site-key", resp.CaptchaSitekey),
		)
		return
	}

	Generated++
	logger.Info("registered",
		zap.String("username", username),
		zap.String("token", resp.Token),
	)

	go handleNewAccount(resp.Token, username, discordClient)
}

func main() {
	LoadSettings()
	go ConsoleTitle()
	c := goccm.New(threads)

	fp, err := fpclient.LoadFingerprint(&fpclient.LoadingConfig{
		FilePath: "../../assets/input/chrome.json",
	})
	if err != nil {
		panic(err)
	}

	for {
		c.Wait()

		go func() {
			defer c.Done()
			for {
				worker(fp)
			}
		}()
	}
}
