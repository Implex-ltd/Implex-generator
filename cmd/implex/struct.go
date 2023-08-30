package main

var Config = Cfg{}

type Cfg struct {
	Discord struct {
		Invite    string `toml:"invite"`
		JoinAfter bool   `toml:"join_after"`
	} `toml:"discord"`
	Hcaptcha struct {
		TaskType int `toml:"task_type"`
	} `toml:"hcaptcha"`
	Performances struct {
		Threads int `toml:"threads"`
	} `toml:"performances"`
	Asset struct {
		ClearDups bool `toml:"clear_dups"`
		Randomize bool `toml:"randomize"`
	} `toml:"asset"`
}
