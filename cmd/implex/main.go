package main

import (
	"fmt"
	"math/rand"
	"net/http"
	"os"
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

	var invite = ""
	if Config.Discord.JoinOnRegister {
		invite = Config.Discord.Invite
	}

	resp, err := api.Register(&discord.RegisterConfig{
		Username:   UsernameList.Next(),
		InviteCode: invite,
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

	//console.Log(fmt.Sprintf("[+] %s", resp.Token[:len(resp.Token)-len(resp.Token)/2]))
	Generated++

	go func() {
		_, err = api.WsConnect()
		if err != nil {
			Error++
			Locked++ // not really locked, but it's to not destroy stats
			return
		}

		if Config.Discord.TryJoin {
			go api.JoinGuild(&discord.JoinConfig{
				InviteCode: Config.Discord.Invite,
				GuildID:    Config.Discord.InviteGuildID,
				ChannelID:  Config.Discord.InviteChannelID,
			})
		}

		if err := api.SetBirth(&discord.EditBirthConfig{
			Date: "1999-05-01",
		}); err != nil {
			console.Log(fmt.Sprintf("[ locked ] %s (%s)", resp.Token[:len(resp.Token)-len(resp.Token)/2], err))
			Locked++
			return
		}

		if Config.Discord.Humanize {
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
		}

		if Config.Discord.SendMessage {
			go api.SendMessage(&discord.SendMessageConfig{
				Content:   Config.Discord.SendMessageContent,
				ChannelID: Config.Discord.SendChannelID,
			})
		}

		time.Sleep(25 * time.Second)
		locked, err := api.IsLocked()
		if err != nil {
			utils.AppendFile("output/unknown.txt", resp.Token)
			fmt.Println(err)
			return
		}

		if locked {
			console.Log(fmt.Sprintf("[ locked ] %s (%s)", resp.Token[:len(resp.Token)-len(resp.Token)/2], err))
			Locked++
			return
		}

		Unlocked++
		utils.AppendFile("output/unlocked.txt", resp.Token)
		console.Log(fmt.Sprintf("[unlocked] %s", resp.Token[:len(resp.Token)-len(resp.Token)/2]))
	}()
}

func worker(fp *fpclient.Fingerprint) {
	proxy := strings.Replace(ProxyList.Next(), Config.Spoof.SessionReplaceMe, utils.RandomString(10), -1)

	http, err := cleanhttp.NewCleanHttpClient(&cleanhttp.Config{
		BrowserFp: fp,
		Proxy:     Config.Spoof.ProxyType + "://" + proxy,
	})
	if err != nil {
		return
	}

	hc := hcaptcha.NewHcaptchaClient(&hcaptcha.HcaptchaConfig{
		Sitekey:       Config.Hcaptcha.SiteKey,
		Domain:        "discord.com",
		Version:       Config.Hcaptcha.Version,
		Lang:          Config.Hcaptcha.Lang,
		HttpClient:    http,
		SubmitDelay:   time.Second * time.Duration(Config.Hcaptcha.SubmitTime),
		HswAddress:    Config.Hcaptcha.HswAddress,
		SolverAddress: Config.Hcaptcha.SolverAddress,
		Scrape:        false,
	})

	t := time.Now()
	response, err := hc.SolveImage()
	if err != nil {
		if Config.Performances.Debug {
			console.Log(err.Error())
		}
		Error++
		return
	}

	duration := time.Since(t)

	Solved++
	Durations = append(Durations, &duration)
	AvgImgProcDuration = append(AvgImgProcDuration, response.AnswerProcessing)
	AvgHswProcDuration = append(AvgHswProcDuration, response.HswProcessing)
	console.Log(fmt.Sprintf("[>] %s (%vs) (img-proc: %vms) (hsw-proc: %vms)", response.Token[:50], duration.Seconds(), response.AnswerProcessing.Milliseconds(), response.HswProcessing.Milliseconds()))
	go job(response.Token, proxy, http)
}

func scrapeWorker(fp *fpclient.Fingerprint) {
	proxy := strings.Replace(ProxyList.Next(), Config.Spoof.SessionReplaceMe, utils.RandomString(10), -1)

	http, err := cleanhttp.NewCleanHttpClient(&cleanhttp.Config{
		BrowserFp: fp,
		Proxy:     Config.Spoof.ProxyType + "://" + proxy,
	})
	if err != nil {
		return
	}

	hc := hcaptcha.NewHcaptchaClient(&hcaptcha.HcaptchaConfig{
		Sitekey:       Config.Hcaptcha.SiteKey,
		Domain:        "discord.com",
		Version:       Config.Hcaptcha.Version,
		Lang:          Config.Hcaptcha.Lang,
		HttpClient:    http,
		SubmitDelay:   time.Second * time.Duration(Config.Hcaptcha.SubmitTime),
		HswAddress:    Config.Hcaptcha.HswAddress,
		SolverAddress: Config.Hcaptcha.SolverAddress,
		Scrape:        true,
	})

	_, err = hc.SolveImage()
	if err != nil {
		if Config.Performances.Debug {
			console.Log(err.Error())
		}
		ScrapeError++
		return
	}
}

func hswStatus() {
	req, err := http.NewRequest("GET", fmt.Sprintf("%s/n", Config.Hcaptcha.HswAddress), nil)
	if err != nil {
		panic(err)
	}

	client := &http.Client{
		Timeout: time.Second * 3,
	}
	resp, err := client.Do(req)
	if err != nil {
		panic("hsw server offline, please use `make engine`")
	}

	defer resp.Body.Close()

	console.Log("Hsw server online!")
}

func main() {
	if _, err := toml.DecodeFile("../../scripts/config.toml", &Config); err != nil {
		panic(err)
	}

	console.Current = console.RandomTheme(Config.Extra.Theme)
	console.PrintLogo()

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

	if len(os.Args) > 1 {
		switch os.Args[1] {
		case "scrape":
			console.PrintLogo()
			console.Log("[*] Init scraper")
			Task = TASK_SCRAPE

			for {
				c.Wait()

				go func() {
					defer c.Done()
					scrapeWorker(fp)
				}()
			}
		}
	} else {
		hswStatus()
		Task = TASK_GEN

		for {
			c.Wait()

			go func() {
				defer c.Done()
				worker(fp)
			}()
		}
	}
}
