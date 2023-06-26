package main

var (
	Config = Cfg{}
)

type Cfg struct {
	Discord struct {
		Invite  string `toml:"invite"`
		Version int    `toml:"version"`
	} `toml:"discord"`
	Hcaptcha struct {
		Lang          string `toml:"lang"`
		Version       string `toml:"version"`
		SubmitTime    int    `toml:"submitTime"`
		HswAddress    string `toml:"hswAddress"`
		SolverAddress string `toml:"SolverAddress"`
	} `toml:"hcaptcha"`
	Spoof struct {
		Cfbm        bool   `toml:"cfbm"`
		ProfilePath string `toml:"profilePath"`
	} `toml:"spoof"`
	Performances struct {
		Goroutines int  `toml:"goroutines"`
		Debug      bool `toml:"debug"`
	} `toml:"performances"`
}
