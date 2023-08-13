package browser

import (
	"errors"
	"fmt"
	"time"

	"github.com/playwright-community/playwright-go"
)

var (
	ARGS       = []string{
		"--user-agent=5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
		"--disable-popup-blocking", // "discord ask access to position, lol?, no way!"

		"--no-sandbox",
		"--no-pings",
		"--no-zygote",
		"--mute-audio",
		"--no-first-run",
		"--no-default-browser-check",
		"--disable-software-rasterizer",
		"--disable-cloud-import",
		"--disable-gesture-typing",
		"--disable-setuid-sandbox",
		"--disable-offer-store-unmasked-wallet-cards",
		"--disable-offer-upload-credit-cards",
		"--disable-print-preview",
		"--disable-voice-input",
		"--disable-wake-on-wifi",
		"--disable-cookie-encryption",
		"--ignore-gpu-blocklist",
		"--enable-async-dns",
		"--enable-simple-cache-backend",
		"--enable-tcp-fast-open",
		//"--enable-webgl",
		"--prerender-from-omnibox=disabled",
		"--enable-web-bluetooth",
		// cannot be turned on because it will cause Chromium to ignore the certificate error
		// "--ignore-certificate-errors",
		// "--ignore-certificate-errors-spki-list",
		"--disable-site-isolation-trials",
		"--disable-features=AudioServiceOutOfProcess,IsolateOrigins,site-per-process,TranslateUI,BlinkGenPropertyTrees", // do not disable UserAgentClientHint
		"--aggressive-cache-discard",
		"--disable-extensions",
		"--disable-blink-features",
		"--disable-blink-features=AutomationControlled",
		"--disable-ipc-flooding-protection",
		"--enable-features=NetworkService,NetworkServiceInProcess,TrustTokens,TrustTokensAlwaysAllowIssuance", // support ServiceWorkers
		"--disable-component-extensions-with-background-pages",
		"--disable-default-apps",
		"--disable-breakpad",
		"--disable-component-update",
		"--disable-domain-reliability",
		"--disable-sync",
		"--disable-client-side-phishing-detection",
		"--disable-hang-monitor",
		"--disable-prompt-on-repost",
		"--metrics-recording-only",
		"--safebrowsing-disable-auto-update",
		"--password-store=basic",
		"--autoplay-policy=no-user-gesture-required",
		"--use-mock-keychain",
		"--force-webrtc-ip-handling-policy=default_public_interface_only",
		"--disable-session-crashed-bubble",
		"--disable-crash-reporter",
		"--disable-dev-shm-usage",
		"--force-color-profile=srgb",
		// Cannot be turned on, as it will cause the canvas hashcode to be different from the normal browser
		// "--disable-accelerated-2d-canvas",
		"--disable-translate",
		"--disable-background-networking",
		"--disable-background-timer-throttling",
		"--disable-backgrounding-occluded-windows",
		"--disable-infobars",
		"--hide-scrollbars",
		"--disable-renderer-backgrounding",
		"--font-render-hinting=none",
		"--disable-logging",
		"--use-gl=swiftshader", // better cpu usage with --use-gl=desktop rather than --use-gl=swiftshader, still needs more testing.

		// optimze fps
		"--enable-surface-synchronization",
		"--run-all-compositor-stages-before-draw",
		"--disable-threaded-animation",
		"--disable-threaded-scrolling",
		"--disable-checker-imaging",

		"--disable-new-content-rendering-timeout",
		"--disable-image-animation-resync",
		"--disable-partial-raster",

		"--blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4",

		// "--deterministic-mode",                          // Some friends commented that with this parameter mouse movement is stuck, so let"s comment it out
		// "--disable-web-security",
		// "--disable-cache",                               // cache
		// "--disable-application-cache",
		// "--disable-offline-load-stale-cache",
		// "--disable-gpu-shader-disk-cache",
		// "--media-cache-size=0",
		// "--disk-cache-size=0",
		// "--enable-experimental-web-platform-features",   // Make Chrome for Linux support Bluetooth. eg: navigator.bluetooth, window.BluetoothUUID
		// "--disable-gpu",                                 // Cannot be disabled: otherwise webgl will not work
		// "--disable-speech-api",                          // Cannot be disabled: some websites use speech-api as fingerprint
		// "--no-startup-window",                           // Cannot be enabled: Chrome won"t open the window and puppeteer thinks it"s not connected
		// "--disable-webgl",                               // Requires webgl fingerprint
		// "--disable-webgl2",
		// "--disable-notifications",                       // Cannot be disabled: notification-api not available, fingerprints will be dirty
	
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
		Locale:     playwright.String("fr"),
		TimezoneId: playwright.String("Europe/Paris"),
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

	context.Route("**https://discord.com/api/v9/auth/register**", func(r playwright.Route) {
		r.Fulfill(playwright.RouteFulfillOptions{
			Status:      playwright.Int(400),
			ContentType: playwright.String("application/json"),
			Body:        []byte(`{"captcha_key": ["captcha-required"],"captcha_sitekey": "4c672d35-0701-42b2-88c3-78380b0db560","captcha_service": "hcaptcha"}`),
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

	answer, err := I.Frame.Evaluate(fmt.Sprintf("hsw(`%s`)", jwt)) // const getParameter=WebGLRenderingContext.getParameter,a=setInterval(()=>{if(document.body){clearInterval(a);var e=document.createElement(`script`);e.type=`text/javascript`,e.text='WebGLRenderingContext.prototype.getParameter = function(parameter) {if (parameter === 37445) { return `Intel Open Source Technology Center`; };if (parameter === 37446) { return `Mesa DRI Intel(R) Ivybridge Mobile ` }; return getParameter(parameter);}',document.body.appendChild(e)}},1);const canvas=document.createElement(`canvas`);canvas.width=220,canvas.height=30;const ctx=canvas.getContext(`2d`);for(let x=0;x<canvas.width;x++)for(let y=0;y<canvas.height;y++){let a=Math.floor(256*Math.random()),t=Math.floor(256*Math.random()),o=Math.floor(256*Math.random());ctx.fillStyle=`rgb(${a},${t},${o})`,ctx.fillRect(x,y,1,1)}const randomDataURL=canvas.toDataURL(`image/png`),originalToDataURL=HTMLCanvasElement.prototype.toDataURL;HTMLCanvasElement.prototype.toDataURL=function(a){return`image/png`===a&&220===this.width&&30===this.height?randomDataURL:originalToDataURL.apply(this,arguments)};
	if err != nil {
		return "", err
	}

	return fmt.Sprintf("%s", answer), nil
}
