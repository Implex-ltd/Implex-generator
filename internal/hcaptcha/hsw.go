package hcaptcha

import (
	"fmt"
	"io"
	"net/http"
	"time"
)

func (c *Client) GetHsw(req string) string {
	for {
		req, err := http.NewRequest("GET", fmt.Sprintf("%s/n?req=%s", c.Config.HswAddress, req), nil)
		if err != nil {
			time.Sleep(50 * time.Millisecond)
			continue
		}

		resp, err := http.DefaultClient.Do(req)
		if err != nil {
			time.Sleep(50 * time.Millisecond)
			continue
		}

		defer resp.Body.Close()

		body, err := io.ReadAll(resp.Body)
		if err != nil {
			time.Sleep(50 * time.Millisecond)
			continue
		}

		b := string(body)

		if b == "nop" {
			continue
		}

		if b == "No available clients" {
			continue
		}
		
		return b
	}
}
