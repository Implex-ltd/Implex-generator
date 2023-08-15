package browser

import (
	"errors"
	"fmt"
	"os"
	"time"

	"github.com/playwright-community/playwright-go"
)

var (
	ARGS = []string{
		"--user-agent=5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
		"--disable-popup-blocking", // "discord ask access to position, lol?, no way!"

		"--no-sandbox",
		"--disable-setuid-sandbox",
		"--disable-infobars",
		"--disable-dev-shm-usage",
		"--enable-gpu",
		//"--headless",
	}
)

func NewInstance(spoof, headless bool, threads int) (*Instance, error) {
	pw, err := playwright.Run()
	if err != nil {
		return nil, err
	}

	browser, err := pw.Chromium.Launch(playwright.BrowserTypeLaunchOptions{
		Headless: playwright.Bool(headless),
		Args:     ARGS,
	})
	if err != nil {
		return nil, err
	}

	context, err := browser.NewContext(playwright.BrowserNewContextOptions{
		Locale:     playwright.String("en-us"),
		TimezoneId: playwright.String("America/New_York"),
		Screen: &playwright.ScreenSize{
			Width:  playwright.Int(1920),
			Height: playwright.Int(1080),
		},
		Viewport: &playwright.ViewportSize{
			Width:  1920,
			Height: 1080,
		},
		ColorScheme: playwright.ColorSchemeDark,
	})
	if err != nil {
		return nil, err
	}

	hsw, err := os.ReadFile("../../cmd/engine/scripts/hsw.js")
	if err != nil {
		panic(err)
	}

	context.Route("**https://discord.com/api/v9/auth/register**", func(r playwright.Route) {
		r.Fulfill(playwright.RouteFulfillOptions{
			Status:      playwright.Int(400),
			ContentType: playwright.String("application/json"),
			Body:        []byte(`{"captcha_key": ["captcha-required"],"captcha_sitekey": "4c672d35-0701-42b2-88c3-78380b0db560","captcha_service": "hcaptcha"}`),
		})
	})

	context.Route("**https://newassets.hcaptcha.com/c/a91272a/hsw.js**", func(r playwright.Route) {
		r.Fulfill(playwright.RouteFulfillOptions{
			Status: playwright.Int(200),
			Body:   hsw,
		})
	})

	page, err := context.NewPage()
	if err != nil {
		return nil, err
	}

	if spoof {
		if err := page.AddInitScript(playwright.PageAddInitScriptOptions{
			Path: playwright.String("./scripts/spoof.js"),
		}); err != nil {
			return nil, err
		}
	}

	return &Instance{
		Pw:      pw,
		Br:      browser,
		Page:    page,
		Manager: make(chan struct{}, threads),
	}, nil
}

func (I *Instance) CloseInstance() error {
	if err := I.Page.Close(); err != nil {
		return err
	}
	if err := I.Br.Close(); err != nil {
		return err
	}
	if err := I.Pw.Stop(); err != nil {
		return err
	}

	return nil
}

func (I *Instance) NavigateToDiscord() error {
	if _, err := I.Page.Goto("https://discord.com", playwright.PageGotoOptions{
		Timeout:   playwright.Float(10000),
		WaitUntil: playwright.WaitUntilStateDomcontentloaded,
	}); err != nil {
		return err
	}

	bl, err := I.Page.WaitForSelector(BUTTON_LOGIN, playwright.PageWaitForSelectorOptions{
		State:   playwright.WaitForSelectorStateAttached,
		Timeout: playwright.Float(5000),
	})

	if err != nil {
		return err
	}

	if err := bl.Click(playwright.ElementHandleClickOptions{
		Timeout: playwright.Float(2500),
	}); err != nil {
		return err
	}

	if err := I.Page.Type(USERNAME_INPUT, "vichyontop1337", playwright.PageTypeOptions{
		Timeout: playwright.Float(2500),
		Delay:   playwright.Float(0),
	}); err != nil {
		return err
	}

	I.Page.Click(CHECKBOX_TOS, playwright.PageClickOptions{
		Timeout: playwright.Float(2500),
		Delay:   playwright.Float(0),
	})

	if err := I.Page.Click(BUTTON_SUBMIT, playwright.PageClickOptions{
		Timeout: playwright.Float(2500),
		Delay:   playwright.Float(0),
	}); err != nil {
		return err
	}

	return nil
}

func (I *Instance) TriggerCaptcha() error {
	bl, err := I.Page.WaitForSelector(HCAPTCHA_FRAME, playwright.PageWaitForSelectorOptions{
		State:   playwright.WaitForSelectorStateAttached,
		Timeout: playwright.Float(5000),
	})
	if err != nil {
		return err
	}

	time.Sleep(time.Second * 5)

	if err := bl.Click(playwright.ElementHandleClickOptions{
		Timeout: playwright.Float(3000),
	}); err != nil {
		return err
	}

	timeout := time.After(time.Second * 5)

	ticker := time.NewTicker(time.Millisecond * 250)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			for _, frame := range I.Page.Frames() {
				r, err := frame.Evaluate(`typeof hsw !== "undefined"`)
				if err != nil {
					continue
				}

				if r == true {
					I.Frame = frame
					return nil
				}
			}

		case <-timeout:
			return errors.New("timeout: hsw not found after 5 seconds")
		}
	}
}

func (I *Instance) Hsw(jwt string) (string, error) {
	I.Manager <- struct{}{}
	defer func() {
		<-I.Manager
	}()

	answer, err := I.Frame.Evaluate(fmt.Sprintf("spoofall();hsw(`%s`)", jwt)) // const getParameter=WebGLRenderingContext.getParameter,a=setInterval(()=>{if(document.body){clearInterval(a);var e=document.createElement(`script`);e.type=`text/javascript`,e.text='WebGLRenderingContext.prototype.getParameter = function(parameter) {if (parameter === 37445) { return `Intel Open Source Technology Center`; };if (parameter === 37446) { return `Mesa DRI Intel(R) Ivybridge Mobile ` }; return getParameter(parameter);}",document.body.appendChild(e)}},1);const canvas=document.createElement(`canvas`);canvas.width=220,canvas.height=30;const ctx=canvas.getContext(`2d`);for(let x=0;x<canvas.width;x++)for(let y=0;y<canvas.height;y++){let a=Math.floor(256*Math.random()),t=Math.floor(256*Math.random()),o=Math.floor(256*Math.random());ctx.fillStyle=`rgb(${a},${t},${o})`,ctx.fillRect(x,y,1,1)}const randomDataURL=canvas.toDataURL(`image/png`),originalToDataURL=HTMLCanvasElement.prototype.toDataURL;HTMLCanvasElement.prototype.toDataURL=function(a){return`image/png`===a&&220===this.width&&30===this.height?randomDataURL:originalToDataURL.apply(this,arguments)};

	if err != nil {
		fmt.Println(err)
		return "", err
	}

	return fmt.Sprintf("%s", answer), nil
}
