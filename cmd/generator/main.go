package main

import (
	"fmt"
	"log"
	"time"

	"github.com/Implex-ltd/cleanhttp/cleanhttp"
	"github.com/Implex-ltd/crapsolver/crapsolver"
	"github.com/Implex-ltd/fingerprint-client/fpclient"
	"github.com/Implex-ltd/generator/internal/console"
	"github.com/Implex-ltd/generator/internal/utils"
	u "github.com/Implex-ltd/ucdiscord/ucdiscord"
	"github.com/zenthangplus/goccm"
)

var (
	Fp, _ = fpclient.LoadFingerprint(&fpclient.LoadingConfig{
		FilePath: "../../assets/input/chrome.json",
	})
	Build   = 227559
	Threads = 120
)

func worker(proxy string) {
	Crap := crapsolver.NewSolver()

	t := time.Now()
	cap_key, err := Crap.Solve(&crapsolver.TaskConfig{
		UserAgent: Fp.Navigator.UserAgent,
		Proxy:     proxy,
		SiteKey:   "4c672d35-0701-42b2-88c3-78380b0db560",
		Domain:    "discord.com",
		A11YTfe:   true,
		Turbo:     true,
		TurboSt:   3500,
		TaskType:  crapsolver.TASKTYPE_ENTERPRISE,
	})

	if err != nil {
		log.Println("fail")
		return
	}

	console.Log(fmt.Sprintf("<fg=5e61b5>Solved</> (%.2fs): <fg=5e61b5>%s</>", time.Since(t).Seconds(), cap_key[:50]))

	http, err := cleanhttp.NewCleanHttpClient(&cleanhttp.Config{
		Proxy:     proxy,
		BrowserFp: Fp,
	})

	if err != nil {
		log.Println(err)
		return
	}

	ws, err := u.NewWebsocket("x", &u.XProp{
		Os:                http.BaseHeader.UaInfo.OSName,
		Browser:           http.BaseHeader.UaInfo.BrowserName,
		Device:            "",
		SystemLocale:      "fr-FR",
		BrowserUserAgent:  Fp.Navigator.UserAgent,
		BrowserVersion:    http.BaseHeader.UaInfo.BrowserVersion,
		OsVersion:         http.BaseHeader.UaInfo.OSVersion,
		ReleaseChannel:    "stable",
		ClientBuildNumber: Build,
	})

	discord := u.NewClient(&u.Config{
		Build:      Build,
		Http:       http,
		Ws:         ws,
		GetCookies: true,
	})

	username, _ := Assets["username"].Next()
	_, data, err := discord.Register(&u.Config{
		Username:   username,
		CaptchaKey: cap_key,
		Invite:     "r8Qhh5Wf",
	})

	if err != nil {
		log.Println(err)
		return
	}

	if data.Token == "" {
		return
	}

	console.Log(data.Token)

	locked, s, err := discord.IsLocked()
	if err != nil {
		log.Println(err)
		return
	}

	if locked {
		console.Log(fmt.Sprintf("<fg=e3752b>locked:   %s</> (%d)", data.Token, s))
		return
	}

	console.Log(fmt.Sprintf("<fg=64ed61>unlocked: %s</> (%d)", data.Token, s))

	go func() {
		if err := discord.Ws.Login(); err == nil {
			defer discord.Ws.Close()
		}

		if err != nil {
			log.Println(err)
			return
		}

		if _, err := discord.SupressTutorial(); err != nil {
			log.Println("tutorial", err)
			return
		}

		avatar, _ := Assets["avatars"].Next()
		resp, _, err := discord.PatchUser(&u.Config{
			Date:   fmt.Sprintf("200%d-0%d-0%d", utils.RandomNumber(1, 3), utils.RandomNumber(1, 9), utils.RandomNumber(1, 9)),
			Avatar: fmt.Sprintf("../../assets/input/avatars/%s", avatar),
		})
		if err != nil {
			log.Println("avatar", err)
			return
		}

		log.Println("patch birth/avatar", resp.Status)

		bio, _ := Assets["bio"].Next()
		resp, _, err = discord.PatchProfil(&u.Config{
			Bio:      bio,
			Pronouns: "he/him",
		})

		if err != nil {
			log.Println(err)
			return
		}

		log.Println("patch bio/pronouns", resp.Status)

		resp, err = discord.JoinHypesquad(utils.RandomNumber(1, 3))
		if err != nil {
			log.Println(err)
			return
		}

		log.Println("set hypesquad", resp.Status)

		utils.AppendFile("output/unlocked.txt", data.Token)
	}()
}

func main() {
	console.PrintLogo()
	if err := LoadStorage(); err != nil {
		panic(err)
	}

	c := goccm.New(Threads)

	for {
		c.Wait()

		go func() {
			defer c.Done()
			proxy, _ := Assets["proxies"].Next()
			worker("http://" + proxy)
		}()

	}

	c.WaitAllDone()
}
