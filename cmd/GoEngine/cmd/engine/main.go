package main

import (
	"engine/internal/browser"
	"log"
	"os"
	"sync"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/zenthangplus/goccm"
)

var (
	browsers = 5

	pool []*browser.Instance
	mt   sync.Mutex
	curr = 0
)

func next() *browser.Instance {
	mt.Lock()
	defer mt.Unlock()

	if curr >= len(pool) {
		curr = 0
	}

	c := pool[curr]
	curr++

	return c
}

func initBrowser() {
	c := goccm.New(browsers)

	for {
		c.Wait()

		go func() {
			defer c.Done()

			client, err := browser.NewInstance(true)
			if err != nil {
				log.Println(err)
				return
			}

			defer client.CloseInstance()

			if err := client.NavigateToDiscord(); err != nil {
				log.Println(err)
				return
			}

			if err := client.TriggerCaptcha(); err != nil {
				log.Println(err)
				return
			}

			log.Println("Hooked!")

			mt.Lock()
			pool = append(pool, client)
			mt.Unlock()

			defer func() {
				mt.Lock()
				defer mt.Unlock()

				for i, c := range pool {
					if c == client {
						pool = append(pool[:i], pool[i+1:]...)
						break
					}
				}
			}()
			select {}
		}()
	}
}

func solveHandler(c *fiber.Ctx) error {
	token := c.Query("req")

	if token == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Token is missing",
		})
	}

	log.Println("recv", token[:61])

	t := time.Now()
	pow, err := next().Hsw(token)
	if err != nil {
		return c.Send([]byte(""))
	}

	log.Printf("solved (%dms): %s\n", time.Since(t).Milliseconds(), pow[:50])
	return c.Send([]byte(pow))
}

func engine() {
	go initBrowser()

	app := fiber.New()

	app.Get("/n", solveHandler)

	err := app.Listen(":4000")
	if err != nil {
		log.Fatalf("Error starting the server: %v", err)
	}
}

func debug() {
	log.Println("ctrl+c to exit.")


	client, err := browser.NewInstance(true)
	if err != nil {
		log.Println(err)
		return
	}

	defer client.CloseInstance()

	client.Page.Goto("https://abrahamjuliot.github.io/creepjs/")
	select {}
}

func main() {
	switch os.Args[1] {
	case "debug":
		debug()
	case "engine":
		engine()
	default:
		panic("invalid args. use: debug, engine")
	}
}
