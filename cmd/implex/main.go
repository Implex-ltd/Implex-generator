package main

import (
	"github.com/Implex-ltd/cleanhttp/cleanhttp"
	"github.com/Implex-ltd/fingerprint-client/fpclient"
	"github.com/Implex-ltd/implex/internal/utils"
	u "github.com/Implex-ltd/ucdiscord/ucdiscord"
	"github.com/zenthangplus/goccm"
	"go.uber.org/zap"
)

var (
	threads = 3
)

func handleNewAccount(token, username string, client *u.Client) {
	locked, err := client.IsLocked()
	logger.Error("is-locked",
		zap.String("error", err.Error()),
	)

	if locked {
		logger.Warn("locked",
			zap.String("username", username),
			zap.String("token", token),
		)
		return
	}

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

	// Load http client
	http, err := cleanhttp.NewCleanHttpClient(&cleanhttp.Config{
		BrowserFp: fp,
		Proxy:     "http://" + proxy,
	})
	if err != nil {
		logger.Error("cleanhttp",
			zap.String("error", err.Error()),
		)
		return
	}

	// Load discord client
	client, err := u.NewClient(&u.ClientConfig{
		GetCookies:  true,
		BuildNumber: 221235,
		Client:      http,
	})
	if err != nil {
		logger.Error("ucdiscord",
			zap.String("error", err.Error()),
		)
		return
	}

	// Create account
	resp, err := client.Register(&u.RegisterConfig{
		Username:   username,
		InviteCode: "6K64ygme",
		CaptchaKey: "",
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

	logger.Info("registered",
		zap.String("username", username),
		zap.String("token", resp.Token),
	)

	go handleNewAccount(resp.Token, username, client)
}

func main() {
	LoadSettings()
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
			worker(fp)
		}()
	}
}
