package hcaptcha

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"time"
)

func (c *Client) GetHsw(req string, w, h int64) string {
	for {
		req, err := http.NewRequest("GET", fmt.Sprintf("%s/n?req=%s&width=%d&height=%d", c.Config.HswAddress, req, w, h), nil)
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

		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			time.Sleep(50 * time.Millisecond)
			continue
		}

		b := string(body)

		if b == "nop" {
			continue
		}

		return b
	}
}
