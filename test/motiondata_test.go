package test

import (
	"fmt"
	"testing"

	"github.com/Implex-ltd/cleanhttp/cleanhttp"
	"github.com/Implex-ltd/fingerprint-client/fpclient"
	h "github.com/Implex-ltd/implex/internal/hcaptcha"
)

func TestGetMotion(t *testing.T) {
	type args struct {
		answers map[string]string
	}
	tests := []struct {
		name string
		args args
		want string
	}{
		{
			name: "motion-data",
			args: args{
				answers: map[string]string{
					`a`: `"false"`,
					`b`: `"false"`,
					`c`: `"true"`,
					`d`: `"false"`,
					`e`: `"false"`,
					`f`: `"true"`,
					`g`: `"false"`,
					`h`: `"true"`,
					`i`: `"false"`,
					`j`: `"false"`,
				},
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			fp, _ := fpclient.LoadFingerprint(&fpclient.LoadingConfig{
				FilePath: "../assets/fingerprints/chrome.json",
			})

			req, _ := cleanhttp.NewCleanHttpClient(&cleanhttp.Config{
				BrowserFp: fp,
			})

			c := h.NewHcaptchaClient(&h.HcaptchaConfig{
				HttpClient: req,
			})

			m := c.GenerateMotionGet()
			fmt.Println(m)

			fmt.Println("=======================================================================================")

			m = c.GenerateMotionCheck(map[string]string{"x": "true", "y": "true", "z": "true"})
			fmt.Println(m)
		})
	}
}
