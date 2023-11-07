package discord

import (
	"github.com/Implex-ltd/cleanhttp/cleanhttp"
	"github.com/Implex-ltd/fingerprint-client/fpclient"
	"github.com/Implex-ltd/ucdiscord/ucdiscord"
)

type Config struct {
	HcaptchaKey, Proxy, Invite, Username, Token string
	Fingerprint                                 *fpclient.Fingerprint
	Build                                       int
}

type Worker struct {
	HcaptchaKey, Proxy, Invite, Username string
	Http                                 *cleanhttp.CleanHttp
	Client                               *ucdiscord.Client
}

type HumanizeConfig struct {
	Tutorial, Hypesquad         bool
	Date, Avatar, Bio, Pronouns string
}
