package main

var Config = Cfg{}

type Cfg struct {
	Discord struct {
		Invite     string `toml:"invite"`
		Build      int    `toml:"build"`
		CheckSleep int    `toml:"check_sleep"`
	} `toml:"discord"`
	Solver struct {
		Text     bool `toml:"text"`
		Turbo    bool `toml:"turbo"`
		TuboSt   int  `toml:"tubo_st"`
		TaskType int  `toml:"task_type"`
	} `toml:"solver"`
	Performances struct {
		Threads int `toml:"threads"`
	} `toml:"performances"`
	Bridge struct {
		Enable  bool   `toml:"enable"`
		Port    int    `toml:"port"`
		Address string `toml:"address"`
	} `toml:"bridge"`
}
