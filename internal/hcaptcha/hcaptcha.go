package hcaptcha

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/url"
	"strings"
	"time"

	"github.com/0xF7A4C6/implex/internal/utils"
	"github.com/0xF7A4C6/implex/pkg/cleanhttp"
)

func NewHcaptchaClient(config *HcaptchaConfig) *Client {
	return &Client{
		Config: config,
	}
}

func (c *Client) checkSiteConfig() (*SiteConfig, error) {
	h := HeaderCheckSiteConfig()

	resp, err := c.Config.HttpClient.Do(cleanhttp.RequestOption{
		Method: "POST",
		Url:    fmt.Sprintf("https://hcaptcha.com/checksiteconfig?v=%s&host=%s&sitekey=%s&sc=1&swa=1&spst=0", c.Config.Version, c.Config.Domain, c.Config.Sitekey),
		Header: h,
	})
	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var config SiteConfig
	if err := json.Unmarshal(body, &config); err != nil {
		return nil, err
	}

	return &config, nil
}

func (c *Client) getImgCaptcha(id string, config *SiteConfig, w, hh int64) (*ImgCaptcha, error) {
	payload := url.Values{}
	for name, value := range map[string]string{
		`v`:          c.Config.Version,
		`sitekey`:    c.Config.Sitekey,
		`host`:       c.Config.Domain,
		`hl`:         c.Config.Lang,
		`motionData`: GenerateMotionGet(w, hh),
		`n`:          c.GetHsw(config.C.Req, w, hh),
		`c`:          fmt.Sprintf(`{"type":"%s","req":"%s"}`, config.C.Type, config.C.Req),
	} {
		payload.Set(name, value)
	}

	resp, err := c.Config.HttpClient.Do(cleanhttp.RequestOption{
		Method: "POST",
		Url:    fmt.Sprintf("https://hcaptcha.com/getcaptcha/%s", c.Config.Sitekey),
		Body:   strings.NewReader(payload.Encode()),
		Header: HeaderGetCaptcha(),
	})
	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var captcha ImgCaptcha
	if err := json.Unmarshal(body, &captcha); err != nil {
		return nil, err
	}

	return &captcha, nil
}

func (c *Client) checkImgCaptcha(captcha *ImgCaptcha, w, hh int64) (*ResponseCheckCaptcha, error) {
	st := time.Now()
	var payload []byte

	answers, err := c.SolveImages(captcha)
	if err != nil {
		return nil, err
	}

	payload, err = json.Marshal(&PayloadCheckImgCaptcha{
		V:            c.Config.Version,
		Sitekey:      c.Config.Sitekey,
		Serverdomain: c.Config.Domain,
		JobMode:      captcha.RequestType,
		MotionData:   GenerateMotionCheck(answers, w, hh),
		N:            c.GetHsw(captcha.C.Req, w, hh),
		C:            fmt.Sprintf(`{"type":"%s","req":"%s"}`, captcha.C.Type, captcha.C.Req),
		Answers:      answers,
	})

	if err != nil {
		return nil, err
	}

	// We are smart boys 🧠, so we don't waste time !
	time.Sleep(c.Config.SubmitDelay - time.Since(st))
	resp, err := c.Config.HttpClient.Do(cleanhttp.RequestOption{
		Url:    fmt.Sprintf("https://hcaptcha.com/checkcaptcha/%s/%s", c.Config.Sitekey, captcha.Key),
		Body:   bytes.NewReader(payload),
		Method: "POST",
		Header: c.HeaderCheckCaptcha(),
	})

	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var Resp ResponseCheckCaptcha
	if json.Unmarshal([]byte(body), &Resp) != nil {
		return nil, fmt.Errorf("checkCaptcha: %+v", err)
	}

	if !Resp.Pass {
		return nil, fmt.Errorf("checkCaptcha: failed to pass: %+v", string(body))
	}

	return &Resp, nil
}

func (c *Client) SolveImage() (string, error) {
	id := utils.RandomString(12)
	w, h := generateRandomBrowserSize(800, 1600)

	config, err := c.checkSiteConfig()
	if err != nil {
		return "", err
	}

	if !config.Pass {
		return "", fmt.Errorf("checkSiteConfig wont pass: %+v", config)
	}

	imgCap, err := c.getImgCaptcha(id, config, w, h)
	if err != nil {
		return "", err
	}

	resp, err := c.checkImgCaptcha(imgCap, w, h)
	if err != nil {
		return "", err
	}

	if !resp.Pass {
		return "", fmt.Errorf("SolveImage(): submit failed pass")
	}

	return resp.GeneratedPassUUID, nil
}
