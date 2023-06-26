package cleanhttp

import (
	"io"

	fp "github.com/0xF7A4C6/implex/pkg/fpclient"
	http "github.com/bogdanfinn/fhttp"
	tls_client "github.com/bogdanfinn/tls-client"
)

type CleanHttp struct {
	Config    *Config
	TlsClient tls_client.HttpClient
	Cookies   []*http.Cookie
}

type Config struct {
	Proxy     string
	Timeout   int
	BrowserFp *fp.Fingerprint
	TlsFp     *fp.TlsFingerprint
	Profile   tls_client.ClientProfile
}

type RequestOption struct {
	Method string
	Body   io.Reader
	Url    string
	Header http.Header
}

type UserAgentInfo struct {
	BrowserName    string
	BrowserVersion string
	OSName         string
	OSVersion      string
	UaVersion      string
}

type HeaderBuilder struct {
	SecChUa         string
	SecChUaPlatform string
	secChUaMobile   string
	AcceptLanguage  string
	Cookies         string
}
