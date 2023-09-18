package main

import (
	"fmt"
	"github.com/Implex-ltd/crapsolver/crapsolver"
	"github.com/Implex-ltd/generator/internal/console"
	"github.com/Implex-ltd/generator/internal/discord"
	"github.com/Implex-ltd/generator/internal/utils"
	"github.com/zenthangplus/goccm"
	"log"
	"time"
)

var (
	Threads = 150
	Invite  = "r8Qhh5Wf"
)

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

			Crap := crapsolver.NewSolver()

			proxy, err := Assets["proxies"].Next()
			if err != nil {
				return
			}

			username, err := Assets["username"].Next()
			if err != nil {
				return
			}

			avatars, err := Assets["avatars"].Next()
			if err != nil {
				return
			}

			bio, err := Assets["bio"].Next()
			if err != nil {
				return
			}

			St := time.Now()

			capKey, err := Crap.Solve(&crapsolver.TaskConfig{
				UserAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
				Proxy:     "http://" + proxy,
				SiteKey:   "4c672d35-0701-42b2-88c3-78380b0db560",
				Domain:    "discord.com",
				A11YTfe:   true,
				Turbo:     true,
				TurboSt:   3200,
				TaskType:  crapsolver.TASKTYPE_ENTERPRISE,
			})
			if err != nil {
				return
			}

			console.Log(fmt.Sprintf("<fg=5e61b5>Solved</> (%.2fs): <fg=5e61b5>%s</>", time.Since(St).Seconds(), capKey[:50]))

			go func(captcha, proxy, username, avatar, bio string, st time.Time) {
				worker, err := discord.NewWorker(&discord.Config{
					HcaptchaKey: captcha,
					Proxy:       proxy,
					Invite:      Invite,
					Username:    username,
				})

				if err != nil {
					log.Println(err.Error())
					return
				}

				if err := worker.Generate(); err != nil {
					log.Println(err.Error())
					return
				}

				if err := worker.Humanize(&discord.HumanizeConfig{
					Tutorial:  true,
					Hypesquad: true,
					Date:      fmt.Sprintf("200%d-0%d-0%d", utils.RandomNumber(1, 5), utils.RandomNumber(1, 9), utils.RandomNumber(1, 9)),
					//Avatar:    fmt.Sprintf("../../assets/input/avatars/%s", avatar),
					Bio:      bio,
					Pronouns: "he/him",
				}); err != nil {
					log.Println(err.Error())
					return
				}

				if err := worker.Websocket(); err != nil {
					log.Println(err.Error())
					return
				}

				if err := utils.AppendFile("output/unlocked.txt", worker.Client.Config.Token); err != nil {
					log.Println(err.Error())
					return
				}

				console.Log(fmt.Sprintf("<fg=fc95a3>Unlocked</> (%.2fs): <fg=fc95a3>%s</>", time.Since(st).Seconds(), capKey[:50]))
			}(capKey, "http://"+proxy, username, avatars, bio, St)
		}()
	}

	c.WaitAllDone()
}
