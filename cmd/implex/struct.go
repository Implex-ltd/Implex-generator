package main

var Config = Cfg{}

type Cfg struct {
	Discord struct {
		Invite    string `toml:"invite"`
		GuildID   string `toml:"guild_id"`
		ChannelID string `toml:"channel_id"`
		JoinAfter bool   `toml:"join_after"`
	} `toml:"discord"`
	Hcaptcha struct {
		TaskType  int  `toml:"task_type"`
		SendEvent bool `toml:"send_event"`
	} `toml:"hcaptcha"`
	Performances struct {
		Threads int `toml:"threads"`
	} `toml:"performances"`
	Asset struct {
		ClearDups bool `toml:"clear_dups"`
		Randomize bool `toml:"randomize"`
	} `toml:"asset"`
}
