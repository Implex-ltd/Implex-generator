package discord

import (
	"fmt"
	"github.com/Implex-ltd/cleanhttp/cleanhttp"
	"github.com/Implex-ltd/fingerprint-client/fpclient"
	"github.com/Implex-ltd/generator/internal/utils"
	"github.com/Implex-ltd/ucdiscord/ucdiscord"
)

var (
	Fp, _ = fpclient.LoadFingerprint(&fpclient.LoadingConfig{
		FilePath: "../../assets/input/chrome.json",
	})
	Build = 227559
)

func NewWorker(c *Config) (*Worker, error) {
	client, err := cleanhttp.NewCleanHttpClient(&cleanhttp.Config{
		Proxy:     c.Proxy,
		Log:       false,
		BrowserFp: Fp,
	})

	if err != nil {
		return nil, err
	}

	ws, err := ucdiscord.NewWebsocket("x", &ucdiscord.XProp{
		BrowserVersion:    client.BaseHeader.UaInfo.BrowserVersion,
		Browser:           client.BaseHeader.UaInfo.BrowserName,
		OsVersion:         client.BaseHeader.UaInfo.OSVersion,
		Os:                client.BaseHeader.UaInfo.OSName,
		BrowserUserAgent:  Fp.Navigator.UserAgent,
		ReleaseChannel:    "stable",
		SystemLocale:      "fr-FR",
		ClientBuildNumber: Build,
		Device:            "",
	})

	if err != nil {
		return nil, err
	}

	discord, err := ucdiscord.NewClient(&ucdiscord.Config{
		Build:      Build,
		Http:       client,
		GetCookies: true,
		Ws:         ws,
	})

	if err != nil {
		return nil, err
	}

	return &Worker{
		HcaptchaKey: c.HcaptchaKey,
		Proxy:       c.Proxy,
		Http:        client,
		Client:      discord,
		Invite:      c.Invite,
		Username:    c.Username,
	}, nil
}

func (w *Worker) Generate() error {
	_, data, err := w.Client.Register(&ucdiscord.Config{
		Username:   w.Username,
		Invite:     w.Invite,
		CaptchaKey: w.HcaptchaKey,
	})

	if err != nil {
		return err
	}

	if data.Token == "" {
		return fmt.Errorf("registration failed")
	}

	if err := w.Check(); err != nil {
		return err
	}

	return nil
}

func (w *Worker) Websocket() error {
	if err := w.Client.Ws.Login(); err != nil {
		return err
	}

	defer w.Client.Ws.Close()

	return nil
}

func (w *Worker) Humanize(c *HumanizeConfig) error {
	if c.Tutorial {
		if _, err := w.Client.SupressTutorial(); err != nil {
			return err
		}
	}

	if c.Date != "" || c.Avatar != "" {
		if resp, _, err := w.Client.PatchUser(&ucdiscord.Config{
			Date:   c.Date,
			Avatar: c.Avatar,
		}); err != nil || resp.Status != 200 {
			return fmt.Errorf("cannot patch user, response code %d, error: %v", resp.Status, err.Error())
		}
	}

	if c.Pronouns != "" || c.Bio != "" {
		if resp, _, err := w.Client.PatchProfil(&ucdiscord.Config{
			Bio:      c.Bio,
			Pronouns: c.Pronouns,
		}); err != nil || resp.Status != 200 {
			return fmt.Errorf("cannot patch profil, response code %d, error: %v", resp.Status, err.Error())
		}
	}

	if c.Hypesquad {
		resp, err := w.Client.JoinHypesquad(utils.RandomNumber(1, 3))
		if err != nil || resp.Status != 204 {
			return fmt.Errorf("cannot join hypesquad, response code %d, error: %v", resp.Status, err.Error())
		}
	}

	return nil
}

func (w *Worker) Check() error {
	locked, status, err := w.Client.IsLocked()
	if err != nil {
		return err
	}

	if locked {
		switch status {
		case 401:
			return fmt.Errorf("token is banned")
		case 403:
			return fmt.Errorf("token is locked")
		}
	}

	return nil
}
