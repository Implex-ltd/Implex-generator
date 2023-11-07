package cloudflarereverse

type Fingerprint struct {
	Results []string `json:"results"`
	//Timing  int      `json:"timing"`
}

type FingerprintPayload struct {
	//Src string  `json:"src"`
	Wp string `json:"wp"`
	//M   string  `json:"m"`
	S string `json:"s"`
	//T   float64 `json:"t"`

	//Fp Fingerprint `json:"fp"
}

type CfParams struct {
	R string `json:"r"`
	M string `json:"m"`
}
