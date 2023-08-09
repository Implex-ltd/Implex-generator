package test

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"testing"

	"github.com/Implex-ltd/cleanhttp/cleanhttp"
	"github.com/Implex-ltd/fingerprint-client/fpclient"
)

func Test_parseUserAgent(t *testing.T) {
	type args struct {
		userAgentString string
	}

	tests := []struct {
		name string
		args args
	}{
		{
			name: "windows-ua",
			args: args{
				userAgentString: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
			},
		},
		{
			name: "macos-ua",
			args: args{
				userAgentString: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := cleanhttp.ParseUserAgent(tt.args.userAgentString)
			fmt.Println(result)
		})
	}
}

func TestCleanHttp_Do(t *testing.T) {
	fp, _ := fpclient.LoadFingerprint(&fpclient.LoadingConfig{
		FilePath: "../assets/login.json",
	})

	c, _ := cleanhttp.NewCleanHttpClient(&cleanhttp.Config{
		BrowserFp: fp,
	})

	type args struct {
		request cleanhttp.RequestOption
	}
	tests := []struct {
		name    string
		c       *cleanhttp.CleanHttp
		args    args
		want    *http.Response
		wantErr bool
	}{
		{
			name: "tls",
			c:    c,
			args: args{
				request: cleanhttp.RequestOption{
					Method: "GET",
					Url:    "https://tls.peet.ws/api/all",
				},
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := tt.c.Do(tt.args.request)
			if err != nil {
				panic(err)
			}

			defer got.Body.Close()

			c, err := ioutil.ReadAll(got.Body)
			if err != nil {
				panic(err)
			}

			fmt.Println(string(c))
		})
	}
}
