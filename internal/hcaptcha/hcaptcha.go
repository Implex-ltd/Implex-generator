package hcaptcha

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/url"
	"os"
	"strings"
	"time"

	"crypto/md5"
	"encoding/hex"

	"github.com/Implex-ltd/cleanhttp/cleanhttp"
	"github.com/Implex-ltd/implex/internal/utils"
)

var (
	Scrape int
	hsl    = false
)

func NewHcaptchaClient(config *HcaptchaConfig) *Client {
	return &Client{
		Config: config,
	}
}

func (c *Client) DownloadFile(url string, filePath string) error {
	h := c.HeaderCheckSiteConfig()

	resp, err := c.Config.HttpClient.Do(cleanhttp.RequestOption{
		Method: "GET",
		Url:    url,
		Header: h,
	})

	if err != nil {
		return err
	}

	if resp.Status != 200 {
		return errors.New("cant get img")
	}

	buff := []byte(resp.Body)

	x := md5.Sum(buff)
	hash := hex.EncodeToString(x[:])

	file, err := os.Create(fmt.Sprintf("%s/%s/%s.png", utils.BasePath, filePath, hash))
	if err != nil {
		return err
	}
	defer file.Close()

	_, err = file.Write(buff)
	if err != nil {
		return err
	}

	Scrape++
	return nil
}

func (c *Client) checkSiteConfig() (*SiteConfig, error) {
	resp, err := c.Config.HttpClient.Do(cleanhttp.RequestOption{
		Method: "POST",
		Url:    fmt.Sprintf("https://hcaptcha.com/checksiteconfig?v=%s&host=%s&sitekey=%s&sc=1&swa=1&spst=1", c.Config.Version, c.Config.Domain, c.Config.Sitekey),
		Header: c.HeaderCheckSiteConfig(),
	})
	if err != nil {
		return nil, err
	}

	//fmt.Println(resp.Body)

	var config SiteConfig
	if err := json.Unmarshal([]byte(resp.Body), &config); err != nil {
		return nil, err
	}

	return &config, nil
}

func (c *Client) getChallenge(config *SiteConfig) (*Challenge, error) {
	var pow string
	var err error

	hsl_start := time.Now()

	if hsl {
		pow, err = HSLHashProof(config.C.Req)
		if err != nil {
			return nil, err
		}
		config.C.Type = "hsl"
	} else {
		pow = c.GetHsw(config.C.Req)
	}

	pdc := &Pdc{
		S:   hsl_start.UTC().UnixNano() / 1e6,
		N:   0,
		P:   1,
		Gcs: int(time.Since(hsl_start).Milliseconds()),
	}

	fmt.Println(fmt.Sprintf(`{"s":%v,"n":%d,"p":%d,"gcs":%d}`, pdc.S, pdc.N, pdc.P, pdc.Gcs))

	payload := url.Values{}
	for name, value := range map[string]string{
		`v`:          c.Config.Version,
		`sitekey`:    c.Config.Sitekey,
		`host`:       c.Config.Domain,
		`hl`:         c.Config.Lang,
		`motionData`: c.GenerateMotionGet(),
		`pdc`:        fmt.Sprintf(`{"s":%v,"n":%d,"p":%d,"gcs":%d}`, pdc.S, pdc.N, pdc.P, pdc.Gcs),
		`n`:          pow,
		`c`:          fmt.Sprintf(`{"type":"%s","req":"%s"}`, config.C.Type, config.C.Req),
		`pst`:        `false`,
	} {
		payload.Set(name, value)
	}

	resp, err := c.Config.HttpClient.Do(cleanhttp.RequestOption{
		Method: "POST",
		Url:    fmt.Sprintf("https://hcaptcha.com/getcaptcha/%s", c.Config.Sitekey),
		Body:   []byte(payload.Encode()),
		Header: c.HeaderGetCaptcha(),
	})
	if err != nil {
		return nil, err
	}

	var captcha Challenge
	if err := json.Unmarshal([]byte(resp.Body), &captcha); err != nil {
		return nil, err
	}

	return &captcha, nil
}

func (c *Client) checkChallenge(captcha *Challenge) (*ResponseCheckCaptcha, error) {
	var payload []byte
	var pow string
	var answers map[string]any
	var err error

	resultChans := make(chan error)
	st := time.Now()

	// proccess img and hsw at the same time to be fasterrrr

	go func() {
		answers, err = c.SolveImages(captcha)
		if err != nil {
			resultChans <- err
			return
		}

		c.AnswerProcessTime = time.Since(st)
		resultChans <- nil
	}()

	fmt.Println(answers)

	go func() {
		if hsl {
			pow, err = HSLHashProof(captcha.C.Req)
			if err != nil {
				resultChans <- err
				return
			}
			captcha.C.Type = "hsl"
		} else {
			pow = c.GetHsw(captcha.C.Req)
		}

		c.HswProcessTime = time.Since(st)
		resultChans <- nil
	}()

	ttt := time.Now()
	for i := 0; i < 2; i++ {
		err := <-resultChans
		if err != nil {
			return nil, err
		}
	}
	fmt.Println("waiting workertime", time.Since(ttt).Seconds(), c.HswProcessTime, c.AnswerProcessTime)

	payload, err = json.Marshal(&PayloadCheckChallenge{
		V:            c.Config.Version,
		Sitekey:      c.Config.Sitekey,
		Serverdomain: c.Config.Domain,
		JobMode:      captcha.RequestType,
		MotionData:   c.GenerateMotionCheck(map[string]string{"x": "true", "y": "true", "z": "true"}),
		N:            pow,
		C:            fmt.Sprintf(`{"type":"%s","req":"%s"}`, captcha.C.Type, captcha.C.Req),
		Answers:      answers,
	})

	if err != nil {
		return nil, err
	}

	// We are smart boys 🧠, so we don't waste time !

	/*trrrr := time.Now()
	time.Sleep(c.Config.SubmitDelay - time.Since(st))
	fmt.Println("extra sleeptime:", time.Since(trrrr))*/

	t := time.Now()
	resp, err := c.Config.HttpClient.Do(cleanhttp.RequestOption{
		Url:    fmt.Sprintf("https://hcaptcha.com/checkcaptcha/%s/%s", c.Config.Sitekey, captcha.Key),
		Body:   payload,
		Method: "POST",
		Header: c.HeaderCheckCaptcha(),
	})
	fmt.Println("hcap response time:", time.Since(t))

	if err != nil {
		return nil, err
	}

	body := resp.Body

	var Resp ResponseCheckCaptcha
	if json.Unmarshal([]byte(body), &Resp) != nil {
		return nil, fmt.Errorf("checkCaptcha: %+v", err)
	}

	if !Resp.Pass {
		return nil, fmt.Errorf("checkCaptcha: failed to pass: %+v", string(body))
	}

	return &Resp, nil
}

func (c *Client) SolveImage() (*HcaptchaTaskResponse, error) {
	a := time.Now()
	config, err := c.checkSiteConfig()
	if err != nil {
		return nil, err
	}

	if !config.Pass {
		return nil, fmt.Errorf("checkSiteConfig wont pass: %+v", config)
	}

	imgCap, err := c.getChallenge(config)
	if err != nil {
		return nil, err
	}

	if imgCap.RequestType == "image_label_area_select" {
		return nil, errors.New("invalid")
	}

	if len(imgCap.Tasklist) <= 0 {
		fmt.Println(imgCap)
		return nil, fmt.Errorf("no images found")
	}

	if c.Config.Scrape && imgCap.RequestType == "image_label_binary" {
		if len(imgCap.Tasklist) <= 0 {
			return nil, fmt.Errorf("no images found")
		}

		for _, t := range imgCap.Tasklist {
			path := strings.ReplaceAll(imgCap.RequesterQuestion.En, " ", "_")
			utils.CreateFolderIfNotExist(fmt.Sprintf("scrapped/%s", path))

			c.DownloadFile(t.DatapointURI, fmt.Sprintf("scrapped/%s", path))
		}

		return nil, nil
	}

	/*if c.Config.Scrape {
		return nil, fmt.Errorf("invalid label for scraping")
	}*/

	t := time.Now()
	resp, err := c.checkChallenge(imgCap)
	if err != nil {
		return nil, err
	}
	fmt.Println("check time:", time.Since(t).Seconds())
	fmt.Println("all captcha time", time.Now().Sub(a).Seconds())

	if !resp.Pass {
		return nil, fmt.Errorf("SolveImage(): submit failed pass")
	}

	return &HcaptchaTaskResponse{
		Token:            resp.GeneratedPassUUID,
		AnswerProcessing: &c.AnswerProcessTime,
		HswProcessing:    &c.HswProcessTime,
	}, nil
}
