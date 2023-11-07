package cloudflarereverse

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"math/rand"
	"regexp"
	"strings"
	"time"

	"github.com/Implex-ltd/cleanhttp/cleanhttp"
	fp "github.com/Implex-ltd/fingerprint-client/fpclient"
	http "github.com/bogdanfinn/fhttp"
)

var (
	re      = regexp.MustCompile(`[0-9]*\.[0-9]+:[0-9]+:`)
	version = "61b90d1d"
)

func Init() {
	rand.New(rand.NewSource(time.Now().UnixNano()))
}

func GetCfbm(brFp *fp.Fingerprint, proxy string) (string, error) {
	client, err := cleanhttp.NewCleanHttpClient(&cleanhttp.Config{
		Proxy:     proxy,
		BrowserFp: brFp,
	})
	if err != nil {
		return "", err
	}

	resp, err := client.Do(cleanhttp.RequestOption{
		Method: "GET",
		Url:    "https://discord.com",
		Header: http.Header{
			"accept": {"text/html"},
		},
	})
	if err != nil {
		return "", err
	}

	defer resp.Body.Close()

	response, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}


	Cf := &CfParams{
		R: strings.Split(strings.Split(string(response), "r:'")[1], "',t")[0],
	}

	resp, err = client.Do(cleanhttp.RequestOption{
		Method: "GET",
		Url:    fmt.Sprintf("https://discord.com/cdn-cgi/challenge-platform/h/b/scripts/jsd/%s/main.js", version),
		Header: http.Header{
			"accept": {"text/html"},
		},
	})
	if err != nil {
		return "", err
	}

	defer resp.Body.Close()

	response, err = io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	JsScript := string(response)

	var Pass string
	for _, char := range strings.Split(strings.Split(JsScript, "'.split(';')")[0], ";") {
		if len(char) == 65 {
			Pass = char
		}
	}

	if Pass == "" {
		return "", fmt.Errorf("cant find encryption password")
	}

	Base := re.FindString(JsScript)

	jsonPayload, _ := json.Marshal(FingerprintPayload{
		S: Base + strings.Split(JsScript, Base)[1][:43],
		Wp: strings.Split(Compress(FormatFingerprint(brFp), Pass), "===")[0],
	})

	head := client.GenerateBaseHeaders()

	resp, err = client.Do(cleanhttp.RequestOption{
		Method: "POST",
		Url:    fmt.Sprintf("https://discord.com/cdn-cgi/challenge-platform/h/b/jsd/r/%s", Cf.R),
		Header: http.Header{
			`accept`:             {`*/*`},
			`accept-encoding`:    {`gzip, deflate, br`},
			`accept-language`:    {head.AcceptLanguage},
			`content-type`:       {`application/json`},
			`origin`:             {"https://discord.com"},
			`referer`:            {`https://discord.com/channels/@me`},
			`sec-ch-ua`:          {head.SecChUa},
			`sec-ch-ua-mobile`:   {`?0`},
			`sec-ch-ua-platform`: {head.SecChUaPlatform},
			`sec-fetch-dest`:     {`empty`},
			`sec-fetch-mode`:     {`cors`},
			`sec-fetch-site`:     {`same-origin`},
			`user-agent`:         {brFp.Navigator.UserAgent},

			http.HeaderOrderKey: {
				`accept`,
				`accept-encoding`,
				`accept-language`,
				`content-length`,
				`content-type`,
				`cookie`,
				`origin`,
				`referer`,
				`sec-ch-ua`,
				`sec-ch-ua-mobile`,
				`sec-ch-ua-platform`,
				`sec-fetch-dest`,
				`sec-fetch-mode`,
				`sec-fetch-site`,
				`user-agent`,
			},
		},
		Body: bytes.NewReader(jsonPayload),
	})
	if err != nil {
		return "", err
	}

	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		return "", fmt.Errorf("cant submit answer status code %d", resp.StatusCode)
	}

	for _, c := range resp.Cookies() {
		if c.Name == "cf_clearance" {
			return c.Value, nil
		}
	}

	return "", fmt.Errorf("no cookie found")
}