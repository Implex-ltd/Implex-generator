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
	hcaptcha.LoadAnswer()

	fp, err := fpclient.LoadFingerprint(&fpclient.LoadingConfig{
		FilePath: "../assets/fingerprints/safari.json",
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
		Lang:        "en",
		HttpClient:  http,
		SubmitDelay: time.Second * 6,
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
			name:    "hsw benchmark 5s",
			c:       c,
			time:    time.Second * 5,
			threads: 50,
		},
		{
			name:    "hsw benchmark 10s",
			c:       c,
			time:    time.Second * 10,
			threads: 50,
		},
		{
			name:    "hsw benchmark 20s",
			c:       c,
			time:    time.Second * 20,
			threads: 50,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			ccm := goccm.New(tt.threads)
			result := []int{}

			for x := 0; x < 3; x++ {
				st := time.Now()

				i := 0
				for time.Since(st) < tt.time {
					ccm.Wait()
					go func() {
						defer ccm.Done()
						tt.c.GetHsw("eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJmIjowLCJzIjoyLCJ0IjoidyIsImQiOiJ2eWNGRTlOb0w4WE41Wlh6VXVwOTlIbkdWdHh5TzB5VFNhVi9id0RrUCsyL0JJbFEzTFZ1UGJsQWRTN1JIaDFIUG9nZytGeUk4dmZDNzAwczg2SVFKTDZoZmg2VVZDcjg2V2FHU3Rrc3FEU3pTWXJVUTNxSytEWFBrWjRKWGU0bHJseWN5Wnc5SW1kVzFZa0dGcnlxekdEQnhZN1BrNGJTMkNwYkNLZmdwN2ZGVHR0a09kWHl4cVhtR1E9PTM3NmtKeFlFUyt4YjZNYmsiLCJsIjoiaHR0cHM6Ly9uZXdhc3NldHMuaGNhcHRjaGEuY29tL2MvNDRmYTA5YyIsImUiOjE2ODcxNjAyOTYsIm4iOiJoc3ciLCJjIjoxMDAwfQ.mbZyzV8JJrg0gHbyjohyUuWF_KiGc0rVhK4cUUM8aFHR94SH5ILT6kfqvLKXlqKRufwfaY7DyNBP-QYt-r-fqVhjMvejWQDdgcHORwIuSYsz18PhWjEbn9-Dy0SJXBndTjmDNjlTA03ka5cAIadeOX3VSV66pH2uv6JqhELKFcDKXzXn8qVO3GXubcpYy-mP0oyxkxDvRlw7WU1JfS2toMTCfya8s_Qsy6AnWQjQVEGVMeC6p6UklLXP5lQqSdcY3a-CwR9cAIHLTzLZqBGCtrY4XrKtvCH6wWF_qyb8-D6yvBnlIorAabb-mfF1MmhfxcmpxN_WPwg9a1H8iSWWPQ")
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
