package cloudflare

type Fingerprint struct {
	Results []string `json:"results"`
}

type FingerprintPayload struct {
	Wp string `json:"wp"`
	S  string `json:"s"`
}

type CfParams struct {
	R string `json:"r"`
	M string `json:"m"`
}
