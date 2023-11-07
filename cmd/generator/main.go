package main

import (
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/Implex-ltd/bridge/bridge"
	"github.com/Implex-ltd/crapsolver/crapsolver"
	"github.com/Implex-ltd/fingerprint-client/fpclient"
	"github.com/Implex-ltd/generator/internal/console"
	"github.com/Implex-ltd/generator/internal/discord"
	"github.com/Implex-ltd/generator/internal/utils"
	"github.com/zenthangplus/goccm"
)

var (
	Fp, _ = fpclient.LoadFingerprint(&fpclient.LoadingConfig{
		FilePath: "../../assets/input/chrome.json",
	})

	bridgeClient = &bridge.Client{}
)

func main() {
	console.PrintLogo()
	if err := LoadStorage(); err != nil {
		panic(err)
	}

	var err error

	if Config.Bridge.Enable {
		bridgeClient, err = bridge.NewClient(Config.Bridge.Address, Config.Bridge.Port)
		if err != nil {
			panic(err)
		}
	}

	go console.ConsoleTitle()

	c := goccm.New(Config.Performances.Threads)

	for {
		c.Wait()

		go func() {
			defer c.Done()
			F := Fp

			Crap, _ := crapsolver.NewSolver("user:ggxl9uip42bnq0tgs4ch")
			Crap.SetWaitTime(time.Millisecond * 3000)

			proxy, err := Assets["proxies"].Next()
			if err != nil {
				return
			}

			proxy = strings.ReplaceAll(proxy, "xxxxxxxx", utils.RandomString(8))

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

			resp, err := Crap.Solve(&crapsolver.TaskConfig{
				UserAgent: F.Navigator.UserAgent,
				Proxy:     "http://" + proxy,
				SiteKey:   "4c672d35-0701-42b2-88c3-78380b0db560",
				Domain:    "discord.com",
				A11YTfe:   Config.Solver.Text,
				Turbo:     Config.Solver.Turbo,
				TurboSt:   Config.Solver.TuboSt,
				TaskType:  Config.Solver.TaskType,
				Href:      fmt.Sprintf("https://discord.com/invite/%s", Config.Discord.Invite),
			})
			if err != nil {
				console.Error++
				return
			}

			F.Navigator.UserAgent = resp.Data.UserAgent

			console.Log(fmt.Sprintf("%dms  | <fg=fccb42>Solved</>: <fg=fccb42>%s</>", time.Since(St).Milliseconds(), resp.Data.Token[:62]))

			console.StMut.Lock()
			console.SolveTime = append(console.SolveTime, time.Since(St))
			console.StMut.Unlock()

			console.Solved++

			go func(captcha, proxy, username, avatar, bio string, st time.Time) {
				//iv, _ := Assets["invites"].Next()
				worker, err := discord.NewWorker(&discord.Config{
					HcaptchaKey: captcha,
					Proxy:       proxy,
					Invite:      Config.Discord.Invite,
					Username:    username,
					Build:       Config.Discord.Build,
					Fingerprint: F,
				})

				if err != nil {
					console.Log(fmt.Sprintf("%dms | <fg=f5382f>Error-a</>: <fg=f5382f>%s</>", time.Since(st).Milliseconds(), err.Error()))
					console.Error++
					return
				}

				if err := worker.Generate(); err != nil {
					console.Log(fmt.Sprintf("%dms | <fg=f5382f>Error-b</>: <fg=f5382f>%s</>", time.Since(st).Milliseconds(), err.Error()))
					console.Error++
					return
				}

				console.Generated++

				if err := worker.Websocket(); err != nil {
					console.Log(fmt.Sprintf("%dms | <fg=f5382f>Error-c</>: <fg=f5382f>%s</>", time.Since(st).Milliseconds(), err.Error()))
					console.Locked++
					return
				}

				if err := worker.Humanize(&discord.HumanizeConfig{
					Tutorial:  true,
					Hypesquad: true,
					Date:      fmt.Sprintf("200%d-0%d-0%d", utils.RandomNumber(1, 5), utils.RandomNumber(1, 9), utils.RandomNumber(1, 9)),
					Avatar:    fmt.Sprintf("../../assets/input/avatars/%s", avatar),
					Bio:       bio, //fmt.Sprintf("%s %s", bio, utils.RandomString(utils.RandomNumber(3, 10))),
					Pronouns:  "he/him",
				}); err != nil {
					console.Log(fmt.Sprintf("%dms | <fg=f5382f>Error</>: <fg=f5382f>%s</>", time.Since(st).Milliseconds(), err.Error()))
					console.Locked++
					return
				}

				if Config.Bridge.Enable {
					if err := bridgeClient.PushData(worker.Client.Config.Token); err != nil {
						log.Println(err)
					}
				}

				time.Sleep(time.Second * time.Duration(Config.Discord.CheckSleep))

				if err := worker.Check(); err != nil {
					console.Log(fmt.Sprintf("%dms | <fg=f5382f>Error</>: <fg=f5382f>%s</>", time.Since(st).Milliseconds(), err.Error()))
					console.Locked++
					return
				}

				console.Unlocked++

				if !Config.Bridge.Enable {
					if err := utils.AppendFile("output/unlocked.txt", worker.Client.Config.Token); err != nil {
						console.Log(fmt.Sprintf("%dms | <fg=f5382f>Error</>: <fg=f5382f>%s</>", time.Since(st).Milliseconds(), err.Error()))
						return
					}
				}

				console.Log(fmt.Sprintf("%dms | <fg=3eed44>Unlock</>: <fg=3eed44>%s</>", time.Since(st).Milliseconds(), worker.Client.Config.Token))
			}(resp.Data.Token, "http://"+proxy, username, avatars, bio, St)
		}()
	}
}
