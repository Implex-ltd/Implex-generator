package hcaptcha

import http "github.com/bogdanfinn/fhttp"

func (c *Client) HeaderCheckSiteConfig() http.Header {
	return http.Header{
		`authority`:          {`hcaptcha.com`},
		`accept`:             {`application/json`},
		`accept-language`:    {c.Config.HttpClient.BaseHeader.AcceptLanguage},
		`content-length`:     {`0`},
		`content-type`:       {`text/plain`},
		`origin`:             {`https://newassets.hcaptcha.com`},
		`referer`:            {`https://newassets.hcaptcha.com/`},
		`sec-ch-ua`:          {c.Config.HttpClient.BaseHeader.SecChUa},
		`sec-ch-ua-mobile`:   {c.Config.HttpClient.BaseHeader.SecChUaMobile},
		`sec-ch-ua-platform`: {c.Config.HttpClient.BaseHeader.SecChUaPlatform},
		`sec-fetch-dest`:     {`empty`},
		`sec-fetch-mode`:     {`cors`},
		`sec-fetch-site`:     {`same-site`},
		`user-agent`:         {c.Config.HttpClient.Config.BrowserFp.Navigator.UserAgent},

		http.HeaderOrderKey: {
			`authority`,
			`accept`,
			`accept-language`,
			`content-length`,
			`content-type`,
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
	}
}

func (c *Client) HeaderGetCaptcha() http.Header {
	return http.Header{
		`authority`:          {`hcaptcha.com`},
		`accept`:             {`application/json`},
		`accept-language`:    {c.Config.HttpClient.BaseHeader.AcceptLanguage},
		`content-type`:       {`application/x-www-form-urlencoded`},
		`origin`:             {`https://newassets.hcaptcha.com`},
		`referer`:            {`https://newassets.hcaptcha.com/`},
		`sec-ch-ua`:          {c.Config.HttpClient.BaseHeader.SecChUa},
		`sec-ch-ua-mobile`:   {c.Config.HttpClient.BaseHeader.SecChUaMobile},
		`sec-ch-ua-platform`: {c.Config.HttpClient.BaseHeader.SecChUaPlatform},
		`sec-fetch-dest`:     {`empty`},
		`sec-fetch-mode`:     {`cors`},
		`sec-fetch-site`:     {`same-site`},
		`user-agent`:         {c.Config.HttpClient.Config.BrowserFp.Navigator.UserAgent},

		http.HeaderOrderKey: {
			`authority`,
			`accept`,
			`accept-language`,
			`content-type`,
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
	}
}

func (c *Client) HeaderCheckCaptcha() http.Header {
	return http.Header{
		`authority`:          {`hcaptcha.com`},
		`accept`:             {`*/*`},
		`accept-language`:    {c.Config.HttpClient.BaseHeader.AcceptLanguage},
		`content-type`:       {`application/json;charset=UTF-8`},
		`cookie`:             {c.Config.HttpClient.FormatCookies()},
		`origin`:             {`https://newassets.hcaptcha.com`},
		`referer`:            {`https://newassets.hcaptcha.com/`},
		`sec-ch-ua`:          {c.Config.HttpClient.BaseHeader.SecChUa},
		`sec-ch-ua-mobile`:   {c.Config.HttpClient.BaseHeader.SecChUaMobile},
		`sec-ch-ua-platform`: {c.Config.HttpClient.BaseHeader.SecChUaPlatform},
		`sec-fetch-dest`:     {`empty`},
		`sec-fetch-mode`:     {`cors`},
		`sec-fetch-site`:     {`same-site`},
		`user-agent`:         {c.Config.HttpClient.Config.BrowserFp.Navigator.UserAgent},

		http.HeaderOrderKey: {
			`authority`,
			`accept`,
			`accept-language`,
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
	}
}
