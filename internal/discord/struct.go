package discord

import (
	"github.com/Implex-ltd/cleanhttp/cleanhttp"
)

type ClientConfig struct {
	Token               string
	GetCookies          bool
	GetCloudflareCookes bool
	BuildNumber         int
	Client              *cleanhttp.CleanHttp
}

type JoinConfig struct {
	InviteCode string
	GuildID    string
	ChannelID  string
}

type JoinPayload struct {
	SessionID string `json:"session_id"`
}

type RegisterConfig struct {
	Username   string
	InviteCode string
	CaptchaKey string
}

type RegisterPayload struct {
	Consent     bool   `json:"consent"`
	Fingerprint string `json:"fingerprint"`
	Username    string `json:"username"`
	CaptchaKey  string `json:"captcha_key"`

	// invite code page
	Invite        string `json:"invite"`
	GiftCodeSkuID any    `json:"gift_code_sku_id"`
}

type RegisterResponse struct {
	// no captcha key provided
	CaptchaKey     []string `json:"captcha_key"`
	CaptchaSitekey string   `json:"captcha_sitekey"`
	CaptchaService string   `json:"captcha_service"`

	// success
	Token string `json:"token"`
}

type AvatarConfig struct {
	FilePath     string
	Base64String string
	IsFromBase64 bool
}

type EditProfilConfig struct {
	Bio         string
	AccentColor int
}

type EditProfilPayload struct {
	Bio         string `json:"bio"`
	AccentColor int    `json:"accent_color"`
}

type Client struct {
	Config       *ClientConfig
	HttpClient   *cleanhttp.CleanHttp
	WsProperties WsLoginResponse
	SessionID    string
	BuildNumber  int
	UaInfo       *cleanhttp.UserAgentInfo
	xfingerprint string
}

type XProperties struct {
	Os                     string `json:"os"`
	Browser                string `json:"browser"`
	Device                 string `json:"device"`
	SystemLocale           string `json:"system_locale"`
	BrowserUserAgent       string `json:"browser_user_agent"`
	BrowserVersion         string `json:"browser_version"`
	OsVersion              string `json:"os_version"`
	Referrer               string `json:"referrer"`
	ReferringDomain        string `json:"referring_domain"`
	ReferrerCurrent        string `json:"referrer_current"`
	ReferringDomainCurrent string `json:"referring_domain_current"`
	ReleaseChannel         string `json:"release_channel"`
	ClientBuildNumber      int    `json:"client_build_number"`
	ClientEventSource      any    `json:"client_event_source"`
}

type ContextProperties struct {
	Location            string `json:"location"`
	LocationGuildID     string `json:"location_guild_id"`
	LocationChannelID   string `json:"location_channel_id"`
	LocationChannelType int    `json:"location_channel_type"`
}

type HeaderConfig struct {
	Join     *JoinConfig
	IsXtrack bool
}

type FingerprintResponse struct {
	Fingerprint string  `json:"fingerprint"`
	Assignments [][]any `json:"assignments"`
}

type JoinServerResponse struct {
	// in case of error
	Message        string   `json:"message"`
	CaptchaKey     []string `json:"captcha_key"`
	CaptchaSitekey string   `json:"captcha_sitekey"`
	CaptchaService string   `json:"captcha_service"`
	CaptchaRqdata  string   `json:"captcha_rqdata"`
	CaptchaRqtoken string   `json:"captcha_rqtoken"`

	Code      string `json:"code"`
	Type      int    `json:"type"`
	ExpiresAt any    `json:"expires_at"`
	Guild     struct {
		ID                       string   `json:"id"`
		Name                     string   `json:"name"`
		Splash                   string   `json:"splash"`
		Banner                   string   `json:"banner"`
		Description              any      `json:"description"`
		Icon                     string   `json:"icon"`
		Features                 []string `json:"features"`
		VerificationLevel        int      `json:"verification_level"`
		VanityURLCode            string   `json:"vanity_url_code"`
		PremiumSubscriptionCount int      `json:"premium_subscription_count"`
		Nsfw                     bool     `json:"nsfw"`
		NsfwLevel                int      `json:"nsfw_level"`
		WelcomeScreen            struct {
			Description     string `json:"description"`
			WelcomeChannels []struct {
				ChannelID   string `json:"channel_id"`
				Description string `json:"description"`
				EmojiID     string `json:"emoji_id"`
				EmojiName   string `json:"emoji_name"`
			} `json:"welcome_channels"`
		} `json:"welcome_screen"`
	} `json:"guild"`
	Channel struct {
		ID   string `json:"id"`
		Name string `json:"name"`
		Type int    `json:"type"`
	} `json:"channel"`
	NewMember bool `json:"new_member"`
}

type SendMessageConfig struct {
	Content   string
	Nonce     string
	Tts       bool
	Flags     int
	ChannelID string
}

type MessagePayload struct {
	Content string `json:"content"`
	Nonce   string `json:"nonce"`
	Tts     bool   `json:"tts"`
	Flags   int    `json:"flags"`
}
