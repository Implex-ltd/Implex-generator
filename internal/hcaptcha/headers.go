package hcaptcha

import http "github.com/bogdanfinn/fhttp"

func HeaderCheckSiteConfig() http.Header {
	return http.Header{
		`authority`:          {`hcaptcha.com`},
		`accept`:             {`application/json`},
		`accept-language`:    {`fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7`},
		`content-length`:     {`0`},
		`content-type`:       {`text/plain`},
		`origin`:             {`https://newassets.hcaptcha.com`},
		`referer`:            {`https://newassets.hcaptcha.com/`},
		`sec-ch-ua`:          {`"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"`},
		`sec-ch-ua-mobile`:   {`?0`},
		`sec-ch-ua-platform`: {`"Windows"`},
		`sec-fetch-dest`:     {`empty`},
		`sec-fetch-mode`:     {`cors`},
		`sec-fetch-site`:     {`same-site`},
		`user-agent`:         {`Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36`},

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

func HeaderGetCaptcha() http.Header {
	return http.Header{
		`authority`:          {`hcaptcha.com`},
		`accept`:             {`application/json`},
		`accept-language`:    {`fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7`},
		`content-type`:       {`application/x-www-form-urlencoded`},
		`origin`:             {`https://newassets.hcaptcha.com`},
		`referer`:            {`https://newassets.hcaptcha.com/`},
		`sec-ch-ua`:          {`"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"`},
		`sec-ch-ua-mobile`:   {`?0`},
		`sec-ch-ua-platform`: {`"Windows"`},
		`sec-fetch-dest`:     {`empty`},
		`sec-fetch-mode`:     {`cors`},
		`sec-fetch-site`:     {`same-site`},
		`user-agent`:         {`Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36`},

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
		`accept-language`:    {`fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7`},
		`content-type`:       {`application/json;charset=UTF-8`},
		`cookie`:             {c.Config.HttpClient.FormatCookies()},
		`origin`:             {`https://newassets.hcaptcha.com`},
		`referer`:            {`https://newassets.hcaptcha.com/`},
		`sec-ch-ua`:          {`"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"`},
		`sec-ch-ua-mobile`:   {`?0`},
		`sec-ch-ua-platform`: {`"Windows"`},
		`sec-fetch-dest`:     {`empty`},
		`sec-fetch-mode`:     {`cors`},
		`sec-fetch-site`:     {`same-site`},
		`user-agent`:         {`Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36`},

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
