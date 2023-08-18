package test

import (
	"fmt"
	"testing"
	"time"

	"github.com/Implex-ltd/cleanhttp/cleanhttp"
	"github.com/Implex-ltd/fingerprint-client/fpclient"
	"github.com/Implex-ltd/implex/internal/hcaptcha"
	"github.com/zenthangplus/goccm"
)

func TestClient_Solve(t *testing.T) {
	fp, err := fpclient.LoadFingerprint(&fpclient.LoadingConfig{
		FilePath: "../assets/fingerprints/chrome.json",
	})
	if err != nil {
		fmt.Println(err)
		return
	}

	http, err := cleanhttp.NewCleanHttpClient(&cleanhttp.Config{
		BrowserFp: fp,
	})
	if err != nil {
		fmt.Println(err)
		return
	}

	c := hcaptcha.NewHcaptchaClient(&hcaptcha.HcaptchaConfig{
		Sitekey:     "4c672d35-0701-42b2-88c3-78380b0db560",
		Domain:      "discord.com",
		Version:     "672044a",
		Lang:        "g",
		HttpClient:  http,
		SubmitDelay: time.Second * 4,
		HswAddress:  "http://192.168.1.26:4000",
	})

	tests := []struct {
		name    string
		c       *hcaptcha.Client
		want    string
		wantErr bool
		time    time.Duration
		threads int
	}{
		{
			name:    "hsw benchmark 5s - 150 threads",
			c:       c,
			time:    time.Second * 5,
			threads: 150,
		},
		{
			name:    "hsw benchmark 5s - 300 threads",
			c:       c,
			time:    time.Second * 5,
			threads: 300,
		},
		{
			name:    "hsw benchmark 5s - 600 threads",
			c:       c,
			time:    time.Second * 5,
			threads:600,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			ccm := goccm.New(tt.threads)
			result := []int{}

			for x := 0; x < 1; x++ {
				st := time.Now()

				i := 0
				for time.Since(st) < tt.time {
					ccm.Wait()
					go func() {
						defer ccm.Done()
						 tt.c.GetHsw("eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJmIjowLCJzIjoyLCJ0IjoidyIsImQiOiJ2V2lEdkhPRzE0SmRTbDl0aVJrOEN1TnM1bnZ0T3N2U1F5TUx0M1lnQUhLYmNYaWtIaU14Sm9EU2hLYmN0dWdxRzBVUDhOK3g1cko2MHdyUWF0b0dKS0c5NFBSV0dFb3FFdmptdGhtWWlMK0hPcDJ5K0pkODJTQ2pBVVlwTTdSSCsybnR4Z24vOHBGNzVyRXg3bFJ6OVUxdFpVTDVPWnpqRElVOUJVV0VJVTZYN3NrUGRCUzFrNTRBSlE9PUYxVUJGWmgyVjRuSUZoMTEiLCJsIjoiaHR0cHM6Ly9uZXdhc3NldHMuaGNhcHRjaGEuY29tL2MvYTkxMjcyYSIsImUiOjE2OTE4OTk1MTMsIm4iOiJoc3ciLCJjIjoxMDAwfQ.NvTZs7tLjsBdTTi4A3z9qqaSZEAgsp04IrzFeavSIAXMAXUqsDlavBACPnQXoxSf78YEa89gJl4-MIlxyasMZTKyR2oplqCdqe9JfzKMB3MqayXx_ZmuppdaWOWeUKf51eiZ8x7CpYM1ePoRkpprDs_WveoR5LnQ-XgMUM2lFBU")
						i++
					}()
				}

				result = append(result, i)
				fmt.Println(i)
			}

			fmt.Println(result)
		})
	}
}
