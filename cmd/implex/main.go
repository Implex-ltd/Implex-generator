package main

import (
	"fmt"
	"math/rand"
	"strings"
	"time"

	"github.com/BurntSushi/toml"
	"github.com/Implex-ltd/cleanhttp/cleanhttp"
	"github.com/Implex-ltd/fingerprint-client/fpclient"
	"github.com/Implex-ltd/implex/internal/console"
	"github.com/Implex-ltd/implex/internal/discord"
	"github.com/Implex-ltd/implex/internal/hcaptcha"
	"github.com/Implex-ltd/implex/internal/utils"
	"github.com/zenthangplus/goccm"
)

func job(key, proxy string, client *cleanhttp.CleanHttp) {
	api, err := discord.NewClient(&discord.ClientConfig{
		GetCookies:          true,
		GetCloudflareCookes: Config.Spoof.Cfbm,
		BuildNumber:         Config.Discord.Version,
		Client:              client,
	})
	if err != nil {
		return
	}

	resp, err := api.Register(&discord.RegisterConfig{
		Username:   UsernameList.Next(),
		InviteCode: Config.Discord.Invite,
		CaptchaKey: key,
	})
	if err != nil {
		Error++
		return
	}

	go ProxyList.LockByTimeout(proxy, time.Second*120)

	if resp.Token == "" {
		Error++
		return
	}

	console.Log(fmt.Sprintf("[+] %s", resp.Token[:len(resp.Token)-len(resp.Token)/2]))
	Generated++

	_, err = api.WsConnect()
	if err != nil {
		Error++
		Locked++ // not really locked, but it's to not destroy stats
		return
	}

	if err := api.SetProfil(&discord.EditProfilConfig{
		Bio: BioList.Next(),
	}); err != nil {
		console.Log(fmt.Sprintf("[ locked ] %s (%s)", resp.Token[:len(resp.Token)-len(resp.Token)/2], err))
		Locked++
		return
	}

	if err := api.SetAvatar(&discord.AvatarConfig{
		FilePath: fmt.Sprintf("../../assets/input/avatars/%s", AvatarList.Next()),
	}); err != nil {
		console.Log(fmt.Sprintf("[ locked ] %s (%s)", resp.Token[:len(resp.Token)-len(resp.Token)/2], err))
		Locked++
		return
	}

	/*api.SendMessage(&discord.SendMessageConfig{
		Content: "@everyone unbeatable",
		ChannelID: "1138866316070105160",
	})*/

	Unlocked++
	utils.AppendFile("output/unlocked.txt", resp.Token)
	console.Log(fmt.Sprintf("[unlocked] %s", resp.Token[:len(resp.Token)-len(resp.Token)/2]))
}

func worker(fp *fpclient.Fingerprint) {
	proxy := strings.Replace(ProxyList.Next(), "REPLACE_ME", utils.RandomString(10), -1)

	http, err := cleanhttp.NewCleanHttpClient(&cleanhttp.Config{
		BrowserFp: fp,
		Proxy:     "http://" + proxy,
	})
	if err != nil {
		return
	}

	hc := hcaptcha.NewHcaptchaClient(&hcaptcha.HcaptchaConfig{
		Sitekey:       "4c672d35-0701-42b2-88c3-78380b0db560",
		Domain:        "discord.com",
		Version:       Config.Hcaptcha.Version,
		Lang:          Config.Hcaptcha.Lang,
		HttpClient:    http,
		SubmitDelay:   time.Second * time.Duration(Config.Hcaptcha.SubmitTime),
		HswAddress:    Config.Hcaptcha.HswAddress,
		SolverAddress: Config.Hcaptcha.SolverAddress,
	})

	key, err := hc.SolveImage()
	if err != nil {
		if Config.Performances.Debug {
			fmt.Println(err, proxy)
		}
		Error++
		return
	}

	Solved++
	console.Log(fmt.Sprintf("[>] %s", key[:50]))
	go job(key, proxy, http)
}

func main() {
	console.PrintLogo()

	if _, err := toml.DecodeFile("../../scripts/config.toml", &Config); err != nil {
		panic(err)
	}

	rand.New(rand.NewSource(time.Now().UnixNano()))
	if err := LoadFiles(); err != nil {
		panic(err)
	}

	go ConsoleTitle()
	c := goccm.New(Config.Performances.Goroutines)

	fp, err := fpclient.LoadFingerprint(&fpclient.LoadingConfig{
		FilePath: Config.Spoof.ProfilePath,
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
