package hcaptcha

import (
	"time"

	"github.com/Implex-ltd/cleanhttp/cleanhttp"
)

type Box struct {
	Start, End Point
}

type Point struct {
	X, Y, T int64
}

type HcaptchaConfig struct {
	Sitekey       string
	Domain        string
	Version       string
	Lang          string
	HttpClient    *cleanhttp.CleanHttp
	SubmitDelay   time.Duration
	HswAddress    string
	SolverAddress string
	Scrape        bool
}

type Client struct {
	Config  *HcaptchaConfig
}

type SiteConfig struct {
	Features struct {
		A11YChallenge bool `json:"a11y_challenge"`
	} `json:"features"`
	C struct {
		Type string `json:"type"`
		Req  string `json:"req"`
	} `json:"c"`
	Pass bool `json:"pass"`
}

type ImgCaptcha struct {
	C struct {
		Type string `json:"type"`
		Req  string `json:"req"`
	} `json:"c"`
	ChallengeURI  string `json:"challenge_uri"`
	Key           string `json:"key"`
	RequestConfig struct {
		Version                      int    `json:"version"`
		ShapeType                    any    `json:"shape_type"`
		MinPoints                    any    `json:"min_points"`
		MaxPoints                    any    `json:"max_points"`
		MinShapesPerImage            any    `json:"min_shapes_per_image"`
		MaxShapesPerImage            any    `json:"max_shapes_per_image"`
		RestrictToCoords             any    `json:"restrict_to_coords"`
		MinimumSelectionAreaPerShape any    `json:"minimum_selection_area_per_shape"`
		MultipleChoiceMaxChoices     int    `json:"multiple_choice_max_choices"`
		MultipleChoiceMinChoices     int    `json:"multiple_choice_min_choices"`
		OverlapThreshold             any    `json:"overlap_threshold"`
		AnswerType                   string `json:"answer_type"`
		MaxValue                     any    `json:"max_value"`
		MinValue                     any    `json:"min_value"`
		MaxLength                    any    `json:"max_length"`
		MinLength                    any    `json:"min_length"`
		SigFigs                      any    `json:"sig_figs"`
		KeepAnswersOrder             bool   `json:"keep_answers_order"`
	} `json:"request_config"`
	RequestType       string `json:"request_type"`
	RequesterQuestion struct {
		En string `json:"en"`
	} `json:"requester_question"`
	RequesterQuestionExample []string `json:"requester_question_example"`
	Tasklist                 []struct {
		DatapointURI string `json:"datapoint_uri"`
		TaskKey      string `json:"task_key"`
	} `json:"tasklist"`
	BypassMessage string `json:"bypass-message"`
}

type TxtCaptcha struct {
	C struct {
		Type string `json:"type"`
		Req  string `json:"req"`
	} `json:"c"`
	ChallengeURI      string `json:"challenge_uri"`
	Key               string `json:"key"`
	RequestType       string `json:"request_type"`
	RequesterQuestion struct {
		Fr string `json:"en"`
	} `json:"requester_question"`
	Tasklist []struct {
		DatapointHash string `json:"datapoint_hash"`
		DatapointText struct {
			Fr string `json:"en"`
		} `json:"datapoint_text"`
		TaskKey string `json:"task_key"`
	} `json:"tasklist"`
	Rq            bool   `json:"rq"`
	BypassMessage string `json:"bypass-message"`
}

type AnswerStruct struct {
	Text string `json:"text"`
}

type PayloadCheckCaptcha struct {
	V            string                  `json:"v"`
	JobMode      string                  `json:"job_mode"`
	Answers      map[string]AnswerStruct `json:"answers"`
	Serverdomain string                  `json:"serverdomain"`
	Sitekey      string                  `json:"sitekey"`
	MotionData   string                  `json:"motionData"`
	N            string                  `json:"n"`
	C            string                  `json:"c"`
}

type PayloadCheckImgCaptcha struct {
	V            string            `json:"v"`
	JobMode      string            `json:"job_mode"`
	Answers      map[string]string `json:"answers"`
	Serverdomain string            `json:"serverdomain"`
	Sitekey      string            `json:"sitekey"`
	MotionData   string            `json:"motionData"`
	N            string            `json:"n"`
	C            string            `json:"c"`
}

type PayloadCheckLabelImgCaptcha struct {
	V            string              `json:"v"`
	JobMode      string              `json:"job_mode"`
	Answers      map[string][]string `json:"answers"`
	Serverdomain string              `json:"serverdomain"`
	Sitekey      string              `json:"sitekey"`
	MotionData   string              `json:"motionData"`
	N            string              `json:"n"`
	C            string              `json:"c"`
}

type ResponseCheckCaptcha struct {
	C struct {
		Type string `json:"type"`
		Req  string `json:"req"`
	} `json:"c"`
	Pass              bool   `json:"pass"`
	GeneratedPassUUID string `json:"generated_pass_UUID"`
	Expiration        int    `json:"expiration"`
}

// motion

type Data struct {
	St       int64     `json:"st"`
	Dct      int64     `json:"dct"`
	Mm       [][]int64 `json:"mm"`
	MmMp     float64   `json:"mm-mp"`
	Md       [][]int64 `json:"md"`
	MdMp     float64   `json:"md-mp"`
	Mu       [][]int64 `json:"mu"`
	MuMp     float64   `json:"mu-mp"`
	TopLevel TopLevel  `json:"topLevel"`
	V        int64     `json:"v"`
}

type TopLevel struct {
	St   int64     `json:"st"`
	Sc   Sc        `json:"sc"`
	Nv   Nv        `json:"nv"`
	DR   string    `json:"dr"`
	Inv  bool      `json:"inv"`
	Exec bool      `json:"exec"`
	Wn   [][]int64 `json:"wn"`
	WnMp float64   `json:"wn-mp"`
	Xy   [][]int64 `json:"xy"`
	XyMp float64   `json:"xy-mp"`
	Mm   [][]int64 `json:"mm"`
	MmMp float64   `json:"mm-mp"`
	//Md   [][]int64 `json:"md"`
	//MdMp int64     `json:"md-mp"`
	//Mu   [][]int64 `json:"mu"`
	//MuMp int64     `json:"mu-mp"`
}

type Nv struct {
	VendorSub              string        `json:"vendorSub"`
	ProductSub             string        `json:"productSub"`
	Vendor                 string        `json:"vendor"`
	MaxTouchPoints         int64         `json:"maxTouchPoints"`
	Scheduling             Bluetooth     `json:"scheduling"`
	UserActivation         Bluetooth     `json:"userActivation"`
	DoNotTrack             interface{}   `json:"doNotTrack"`
	Geolocation            Bluetooth     `json:"geolocation"`
	Connection             Bluetooth     `json:"connection"`
	PDFViewerEnabled       bool          `json:"pdfViewerEnabled"`
	WebkitTemporaryStorage Bluetooth     `json:"webkitTemporaryStorage"`
	HardwareConcurrency    int64         `json:"hardwareConcurrency"`
	CookieEnabled          bool          `json:"cookieEnabled"`
	AppCodeName            string        `json:"appCodeName"`
	AppName                string        `json:"appName"`
	AppVersion             string        `json:"appVersion"`
	Platform               string        `json:"platform"`
	Product                string        `json:"product"`
	UserAgent              string        `json:"userAgent"`
	Language               string        `json:"language"`
	Languages              []string      `json:"languages"`
	OnLine                 bool          `json:"onLine"`
	Webdriver              bool          `json:"webdriver"`
	Bluetooth              Bluetooth     `json:"bluetooth"`
	// Standalone             bool          `json:"standalone"` // iphone
	Clipboard              Bluetooth     `json:"clipboard"`
	Credentials            Bluetooth     `json:"credentials"`
	Keyboard               Bluetooth     `json:"keyboard"`
	Managed                Bluetooth     `json:"managed"`
	MediaDevices           Bluetooth     `json:"mediaDevices"`
	Storage                Bluetooth     `json:"storage"`
	ServiceWorker          Bluetooth     `json:"serviceWorker"`
	VirtualKeyboard        Bluetooth     `json:"virtualKeyboard"`
	WakeLock               Bluetooth     `json:"wakeLock"`
	DeviceMemory           int64         `json:"deviceMemory"`
	Ink                    Bluetooth     `json:"ink"`
	HID                    Bluetooth     `json:"hid"`
	Locks                  Bluetooth     `json:"locks"`
	MediaCapabilities      Bluetooth     `json:"mediaCapabilities"`
	MediaSession           Bluetooth     `json:"mediaSession"`
	Permissions            Bluetooth     `json:"permissions"`
	Presentation           Bluetooth     `json:"presentation"`
	Serial                 Bluetooth     `json:"serial"`
	USB                    Bluetooth     `json:"usb"`
	WindowControlsOverlay  Bluetooth     `json:"windowControlsOverlay"`
	Xr                     Bluetooth     `json:"xr"`
	UserAgentData          UserAgentData `json:"userAgentData"`
	Plugins                []string      `json:"plugins"`
}

type Bluetooth struct {
}

type UserAgentData struct {
	Brands   []Brand `json:"brands"`
	Mobile   bool    `json:"mobile"`
	Platform string  `json:"platform"`
}

type Brand struct {
	Brand   string `json:"brand"`
	Version string `json:"version"`
}

type Sc struct {
	AvailWidth  int64       `json:"availWidth"`
	AvailHeight int64       `json:"availHeight"`
	Width       int64       `json:"width"`
	Height      int64       `json:"height"`
	ColorDepth  int64       `json:"colorDepth"`
	PixelDepth  int64       `json:"pixelDepth"`
	AvailLeft   int64       `json:"availLeft"`
	AvailTop    int64       `json:"availTop"`
	Onchange    interface{} `json:"onchange"`
	IsExtended  bool        `json:"isExtended"`
}

// motion get captcha

type GetData struct {
	St         int64       `json:"st"`
	Mm         [][]int64   `json:"mm"`
	MmMp       float64     `json:"mm-mp"`
	Md         [][]int64   `json:"md"`
	MdMp       int64       `json:"md-mp"`
	Mu         [][]int64   `json:"mu"`
	MuMp       int64       `json:"mu-mp"`
	V          int64       `json:"v"`
	TopLevel   GetTopLevel `json:"topLevel"`
	Session    []string    `json:"session"`
	WidgetList []string    `json:"widgetList"`
	WidgetID   string      `json:"widgetId"`
	Href       string      `json:"href"`
	Prev       GetPrev     `json:"prev"`
}

type GetPrev struct {
	Escaped          bool `json:"escaped"`
	Passed           bool `json:"passed"`
	ExpiredChallenge bool `json:"expiredChallenge"`
	ExpiredResponse  bool `json:"expiredResponse"`
}

type GetTopLevel struct {
	St   int64     `json:"st"`
	Sc   GetSc     `json:"sc"`
	Nv   GetNv     `json:"nv"`
	DR   string    `json:"dr"`
	Inv  bool      `json:"inv"`
	Exec bool      `json:"exec"`
	Wn   [][]int64 `json:"wn"`
	WnMp int64     `json:"wn-mp"`
	Xy   [][]int64 `json:"xy"`
	XyMp int64     `json:"xy-mp"`
	Mm   [][]int64 `json:"mm"`
	MmMp float64   `json:"mm-mp"`
}

type GetNv struct {
	VendorSub              string        `json:"vendorSub"`
	ProductSub             string        `json:"productSub"`
	Vendor                 string        `json:"vendor"`
	MaxTouchPoints         int64         `json:"maxTouchPoints"`
	Scheduling             Bluetooth     `json:"scheduling"`
	UserActivation         Bluetooth     `json:"userActivation"`
	DoNotTrack             interface{}   `json:"doNotTrack"`
	Geolocation            Bluetooth     `json:"geolocation"`
	Connection             Bluetooth     `json:"connection"`
	PDFViewerEnabled       bool          `json:"pdfViewerEnabled"`
	WebkitTemporaryStorage Bluetooth     `json:"webkitTemporaryStorage"`
	HardwareConcurrency    int64         `json:"hardwareConcurrency"`
	CookieEnabled          bool          `json:"cookieEnabled"`
	AppCodeName            string        `json:"appCodeName"`
	AppName                string        `json:"appName"`
	AppVersion             string        `json:"appVersion"`
	Platform               string        `json:"platform"`
	Product                string        `json:"product"`
	UserAgent              string        `json:"userAgent"`
	Language               string        `json:"language"`
	Languages              []string      `json:"languages"`
	OnLine                 bool          `json:"onLine"`
	Webdriver              bool          `json:"webdriver"`
	Standalone             bool          `json:"standalone"`
	Bluetooth              Bluetooth     `json:"bluetooth"`
	Clipboard              Bluetooth     `json:"clipboard"`
	Credentials            Bluetooth     `json:"credentials"`
	Keyboard               Bluetooth     `json:"keyboard"`
	Managed                Bluetooth     `json:"managed"`
	MediaDevices           Bluetooth     `json:"mediaDevices"`
	Storage                Bluetooth     `json:"storage"`
	ServiceWorker          Bluetooth     `json:"serviceWorker"`
	VirtualKeyboard        Bluetooth     `json:"virtualKeyboard"`
	WakeLock               Bluetooth     `json:"wakeLock"`
	DeviceMemory           int64         `json:"deviceMemory"`
	Ink                    Bluetooth     `json:"ink"`
	HID                    Bluetooth     `json:"hid"`
	Locks                  Bluetooth     `json:"locks"`
	MediaCapabilities      Bluetooth     `json:"mediaCapabilities"`
	MediaSession           Bluetooth     `json:"mediaSession"`
	Permissions            Bluetooth     `json:"permissions"`
	Presentation           Bluetooth     `json:"presentation"`
	Serial                 Bluetooth     `json:"serial"`
	GPU                    Bluetooth     `json:"gpu"`
	USB                    Bluetooth     `json:"usb"`
	WindowControlsOverlay  Bluetooth     `json:"windowControlsOverlay"`
	Xr                     Bluetooth     `json:"xr"`
	UserAgentData          UserAgentData `json:"userAgentData"`
	Plugins                []string      `json:"plugins"`
}

type GetUserAgentData struct {
	Brands   []Brand `json:"brands"`
	Mobile   bool    `json:"mobile"`
	Platform string  `json:"platform"`
}

type GetBrand struct {
	Brand   string `json:"brand"`
	Version string `json:"version"`
}

type GetSc struct {
	AvailWidth  int64       `json:"availWidth"`
	AvailHeight int64       `json:"availHeight"`
	Width       int64       `json:"width"`
	Height      int64       `json:"height"`
	ColorDepth  int64       `json:"colorDepth"`
	PixelDepth  int64       `json:"pixelDepth"`
	AvailLeft   int64       `json:"availLeft"`
	AvailTop    int64       `json:"availTop"`
	Onchange    interface{} `json:"onchange"`
	IsExtended  bool        `json:"isExtended"`
}
