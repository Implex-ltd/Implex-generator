package cloudflare

import (
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"math/rand"
	"regexp"
	"strings"
	"time"

	"github.com/0xF7A4C6/implex/pkg/cleanhttp"
	"github.com/0xF7A4C6/implex/pkg/fpclient"
	http "github.com/bogdanfinn/fhttp"
)

var (
	re      = regexp.MustCompile(`[0-9]*\.[0-9]+:[0-9]+:`)
	version = "19ad4730"
)

func Init() {
	rand.Seed(time.Now().UnixNano())
}

func randInt(min int, max int) int {
	return min + rand.Intn(max-min)
}

func randHexString(n int) string {
	b := make([]byte, n)
	_, _ = rand.Read(b)
	return hex.EncodeToString(b)
}

func GetCfbm(brFp *fpclient.Fingerprint, proxy string) (string, error) {
	client, err := cleanhttp.NewCleanHttpClient(&cleanhttp.Config{
		Proxy:     proxy,
		BrowserFp: brFp,
	})
	if err != nil {
		return "", err
	}

	head := client.GenerateBaseHeaders()

	resp, err := client.Do(cleanhttp.RequestOption{
		Method: "GET",
		Url:    "https://discord.com",
		Header: http.Header{
			`accept`:             {`text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7`},
			`accept-encoding`:    {`gzip, deflate, br`},
			`accept-language`:    {head.AcceptLanguage},
			`cookie`:             {head.Cookies},
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
	})
	if err != nil {
		return "", err
	}

	defer resp.Body.Close()

	response, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	Cf := &CfParams{
		R: strings.Split(strings.Split(string(response), "r:'")[1], "',m")[0],
		M: strings.Split(strings.Split(string(response), "m:'")[1], "'};")[0],
	}

	resp, err = client.Do(cleanhttp.RequestOption{
		Method: "GET",
		Url:    fmt.Sprintf("https://discord.com/cdn-cgi/challenge-platform/h/g/scripts/jsd/%s/invisible.js", version),
		Header: http.Header{
			`sec-ch-ua`:        {head.SecChUa},
			`sec-ch-ua-mobile`: {`?0`},
			`user-agent`:       {brFp.Navigator.UserAgent},

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
	})
	if err != nil {
		return "", err
	}

	defer resp.Body.Close()

	response, err = ioutil.ReadAll(resp.Body)
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
	S := Base + strings.Split(JsScript, Base)[1][:43]

	jsonPayload, _ := json.Marshal(FingerprintPayload{
		S:  S,
		Wp: strings.Split(Compress(FormatFingerprint(brFp), Pass), "===")[0],
	})

	p := string(jsonPayload)
	head = client.GenerateBaseHeaders()

	resp, err = client.Do(cleanhttp.RequestOption{
		Method: "POST",
		Url:    fmt.Sprintf("https://discord.com/cdn-cgi/challenge-platform/h/b/cv/result/%s", Cf.R),
		Header: http.Header{
			`accept`:             {`*/*`},
			`accept-encoding`:    {`gzip, deflate, br`},
			`accept-language`:    {head.AcceptLanguage},
			`content-type`:       {`application/json`},
			`cookie`:             {head.Cookies},
			`origin`:             {"https://discord.com"},
			`sec-ch-ua`:          {head.SecChUa},
			`sec-ch-ua-mobile`:   {`?0`},
			`sec-ch-ua-platform`: {head.SecChUaPlatform},
			`sec-fetch-dest`:     {`empty`},
			`sec-fetch-mode`:     {`cors`},
			`sec-fetch-site`:     {`same-origin`},
			`user-agent`:         {brFp.Navigator.UserAgent},
			`content-length`:     {fmt.Sprintf("%d", len(p))},

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
		Body: strings.NewReader(p),
	})
	if err != nil {
		return "", err
	}

	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		return "", fmt.Errorf("cant submit answer status code %d", resp.StatusCode)
	}

	for _, c := range client.Cookies {
		if c.Name == "__cf_bm" {
			return c.Value, nil
		}
	}

	return "", fmt.Errorf("no cookie found")
}
