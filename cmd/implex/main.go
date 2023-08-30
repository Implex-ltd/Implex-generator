package main

import (
	"fmt"
	"math/rand"
	"time"

	"github.com/Implex-ltd/cleanhttp/cleanhttp"
	"github.com/Implex-ltd/fingerprint-client/fpclient"
	"github.com/Implex-ltd/implex/internal/hcaptcha"
	"github.com/Implex-ltd/implex/internal/utils"
	u "github.com/Implex-ltd/ucdiscord/ucdiscord"
	"github.com/zenthangplus/goccm"
	"go.uber.org/zap"
)

func GetData() (string, string, error) {
	proxy, err := Assets["proxies"].Next()
	if err != nil {
		return "", "", err
	}

	username, err := Assets["username"].Next()
	if err != nil {
		return "", "", err
	}

	return "http://" + proxy, username, nil
}

func handleNewAccount(token, username string, client *u.Client) {
	go func() {
		wsresp, err := client.WsConnect()
		if err != nil {
			Logger.Error("ws connect",
				zap.String("error", err.Error()),
			)
			return
		}

		Logger.Info("connected",
			zap.String("sessionID", wsresp.D.SessionID),
			zap.String("username", wsresp.D.User.Username),
		)

		if Config.Discord.JoinAfter {
			cfg := u.JoinConfig{
				InviteCode: Config.Discord.Invite,
				GuildID:    Config.Discord.GuildID,
				ChannelID:  Config.Discord.ChannelID,
			}

			resp, err := client.JoinGuild(&cfg)
			if err != nil {
				Logger.Error("can't join",
					zap.String("error", err.Error()),
				)
				return
			}

			Logger.Info("joined",
				zap.String("name", resp.Guild.Name),
				zap.String("invite", cfg.InviteCode),
				zap.String("channelID", cfg.ChannelID),
				zap.String("guildID", cfg.GuildID),
			)
		}
	}()

	locked, err := client.IsLocked()
	if err != nil {
		Logger.Error("is-locked",
			zap.String("error", err.Error()),
		)
	}

	if locked {
		Logger.Warn("locked",
			zap.String("username", username),
			zap.String("token", token),
		)
		Locked++
		return
	}

	avatar, err := Assets["avatars"].Next()
	if err != nil {
		Logger.Error("get-avatar",
			zap.String("error", err.Error()),
		)
		return
	}

	if err := client.SetBirth(&u.EditBirthConfig{
		Date: fmt.Sprintf("200%d-0%d-0%d", utils.RandomNumber(1, 5), utils.RandomNumber(1, 9), utils.RandomNumber(1, 9)),
	}); err != nil {
		Logger.Error("set-birth",
			zap.String("error", err.Error()),
		)
		Locked++
		return
	}

	if err := client.SetAvatar(&u.AvatarConfig{
		FilePath: fmt.Sprintf("../../assets/input/avatars/%s", avatar),
	}); err != nil {
		Logger.Error("set-avatar",
			zap.String("error", err.Error()),
		)
		Locked++
		return
	}

	bio, err := Assets["bio"].Next()
	if err != nil {
		Logger.Error("get-bio",
			zap.String("error", err.Error()),
		)
		return
	}

	if err := client.SetProfil(&u.EditProfilConfig{
		Bio: bio,
	}); err != nil {
		Logger.Error("set-bio",
			zap.String("error", err.Error()),
		)
		Locked++
		return
	}

	Unlocked++
	Logger.Info("unlocked",
		zap.String("username", username),
		zap.String("token", token),
	)

	if err := utils.AppendFile("output/unlocked.txt", token); err != nil {
		Logger.Error("save-token",
			zap.String("error", err.Error()),
		)
		return
	}
}

func worker(fp *fpclient.Fingerprint) {
	proxy, username, err := GetData()
	if err != nil {
		Logger.Error("get profile data",
			zap.String("err", err.Error()),
		)
		return
	}

	captchaKey := make(chan string)
	discordClient := make(chan *u.Client)

	go func() {
		for {
			hcap, err := hcaptcha.NewSolve(fp.Navigator.UserAgent, proxy, Config.Hcaptcha.TaskType)
			if err != nil {
				Logger.Warn("solve",
					zap.String("err", err.Error()),
				)
				Error++
				continue
			}

			Logger.Info("solved",
				zap.String("key", hcap[:50]),
			)

			Solved++
			captchaKey <- hcap
			break
		}
	}()

	go func() {
		for {
			http, err := cleanhttp.NewCleanHttpClient(&cleanhttp.Config{
				BrowserFp: fp,
				Proxy:     proxy,
			})

			if err != nil {
				Logger.Error("load-http",
					zap.String("error", err.Error()),
				)
				continue
			}

			client, err := u.NewClient(&u.ClientConfig{
				GetCookies:  true,
				BuildNumber: 222352,
				Client:      http,
			})
			if err != nil {
				Logger.Error("load-discord",
					zap.String("error", err.Error()),
				)
				continue
			}

			discordClient <- client
			break
		}
	}()

	key := <-captchaKey
	client := <-discordClient

	resp, err := client.Register(&u.RegisterConfig{
		Username:   username,
		InviteCode: Config.Discord.Invite,
		CaptchaKey: key,
	})
	if err != nil {
		Logger.Error("register",
			zap.String("error", err.Error()),
		)
		return
	}

	if resp.Token == "" {
		Logger.Error("register",
			zap.String("site-key", resp.CaptchaSitekey),
		)
		return
	}

	Logger.Info("registered",
		zap.String("token", resp.Token),
		zap.String("username", username),
	)

	Generated++
	go handleNewAccount(resp.Token, username, client)
}

func main() {
	rand.New(rand.NewSource(time.Now().UnixNano()))

	SetupLogger()
	if err := LoadStorage(); err != nil {
		panic(err)
	}

	fp, err := fpclient.LoadFingerprint(&fpclient.LoadingConfig{
		FilePath: "../../assets/input/chrome.json",
	})

	if err != nil {
		panic(err)
	}

	go ConsoleTitle()

	c := goccm.New(Config.Performances.Threads)

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
