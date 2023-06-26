package discord

import (
	"encoding/base64"
	"encoding/json"
	http "github.com/bogdanfinn/fhttp"
	"strings"
)

func (c *Client) getProperties(isXtrack bool) (string, string) {
	build := 9999
	headerName := "x-track"

	if !isXtrack {
		build = c.BuildNumber
		headerName = "x-context-properties"
	}

	payload, _ := json.Marshal(&XProperties{
		Os:                     c.UaInfo.OSName,
		Browser:                c.UaInfo.BrowserName,
		Device:                 "",
		SystemLocale:           c.HttpClient.Config.BrowserFp.Navigator.Language,
		BrowserUserAgent:       c.HttpClient.Config.BrowserFp.Navigator.UserAgent,
		BrowserVersion:         c.UaInfo.BrowserVersion,
		OsVersion:              c.UaInfo.OSVersion,
		Referrer:               "",
		ReferringDomain:        "",
		ReferrerCurrent:        "",
		ReferringDomainCurrent: "",
		ReleaseChannel:         "stable",
		ClientBuildNumber:      build,
		ClientEventSource:      nil,
	})

	return headerName, addBase64Padding(base64.RawStdEncoding.EncodeToString(payload))
}

func (c *Client) getContextProperties(config *JoinConfig) string {
	payload, _ := json.Marshal(&ContextProperties{
		LocationGuildID:     config.GuildID,
		LocationChannelID:   config.ChannelID,
		LocationChannelType: 0,
		Location:            "Join Guild",
	})

	return addBase64Padding(base64.RawStdEncoding.EncodeToString(payload))
}

func (c *Client) getHeader(config *HeaderConfig) http.Header {
	ctx := ""
	if config.Join != nil {
		ctx = c.getContextProperties(config.Join)
	}

	headerName, properties := c.getProperties(config.IsXtrack)
	base := c.HttpClient.GenerateBaseHeaders()

	return http.Header{
		`accept`:               {`*/*`},
		`accept-encoding`:      {`gzip, deflate, br`},
		`accept-language`:      {base.AcceptLanguage},
		`authorization`:        {c.Config.Token},
		`content-type`:         {`application/json`},
		`cookie`:               {base.Cookies},
		`origin`:               {"https://discord.com"},
		`referer`:              {`https://discord.com/channels/@me`},
		`sec-ch-ua`:            {base.SecChUa},
		`sec-ch-ua-mobile`:     {`?0`},
		`sec-ch-ua-platform`:   {base.SecChUaPlatform},
		`sec-fetch-dest`:       {`empty`},
		`sec-fetch-mode`:       {`cors`},
		`sec-fetch-site`:       {`same-origin`},
		`user-agent`:           {c.HttpClient.Config.BrowserFp.Navigator.UserAgent},
		`x-context-properties`: {ctx},
		`x-debug-options`:      {`bugReporterEnabled`},
		`x-discord-locale`:     {strings.Split(c.HttpClient.Config.BrowserFp.Navigator.Language, "-")[0]},
		`x-discord-timezone`:   {`Europe/Paris`}, // todo: add country by ip or header language
		headerName:             {properties},

		http.HeaderOrderKey: {
			`authority`,
			`accept`,
			`accept-encoding`,
			`accept-language`,
			`authorization`,
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
			`x-context-properties`,
			`x-track`,
			`x-debug-options`,
			`x-discord-locale`,
			`x-discord-timezone`,
			headerName,
		},
	}
}
