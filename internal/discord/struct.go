package discord

import (
	"github.com/Implex-ltd/cleanhttp/cleanhttp"
	"github.com/Implex-ltd/ucdiscord/ucdiscord"
)

type Config struct {
	HcaptchaKey, Proxy, Invite, Username string
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
