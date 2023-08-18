package console

import (
	"fmt"
	"math/rand"
	"strings"
	"time"

	"github.com/gookit/color"
	"github.com/inancgumus/screen"
)

var (
	Pattern = map[string][]string{
		"red_rose": {
			"f2163e",
			"e83858",
			"e35670",
			"cc6477",
			"ba7985",
		},
		"blue_sky": {
			"4d8af0",
			"6ea0f0",
			"8cb6f0",
			"a9ccf0",
			"c7e2f0",
		},
		"purple_pink": {
			"9b59b6",
			"c16ecf",
			"e085e8",
			"ff9af0",
			"ffb0f0",
		},
		"green_lime": {
			"00ff00",
			"33ff33",
			"66ff66",
			"99ff99",
			"ccffcc",
		},
		"gold_orange": {
			"ffcc00",
			"ffdb4d",
			"ffea99",
			"fff9e5",
			"fffaf2",
		},
		"midnight_black": {
			"000000",
			"121212",
			"292929",
			"454545",
			"666666",
		},
		"ocean_wave": {
			"0099cc",
			"00bfff",
			"33ccff",
			"66d9ff",
			"99e6ff",
		},
		"fiery_red": {
			"ff3300",
			"ff6633",
			"ff9966",
			"ffcc99",
			"ffebcc",
		},
		"ocean_breeze": {
			"66ccff",
			"89d5ff",
			"a3ddff",
			"bce4ff",
			"d6ecff",
		},
		"sunset_warmth": {
			"ff6633",
			"ff824a",
			"ffa067",
			"ffb381",
			"ffcc9d",
		},
		"minty_fresh": {
			"66ffcc",
			"89ffda",
			"a3ffe8",
			"bcfff6",
			"d6ffff",
		},
	}

	Current []string
)

func RandomTheme(theme string) []string {
	if theme == "random" {
		themes := make([]string, 0, len(Pattern))
		for theme := range Pattern {
			themes = append(themes, theme)
		}

		return Pattern[themes[rand.Intn(len(themes))]]
	}

	if patterns, ok := Pattern[theme]; ok {
		return patterns
	}

	return Pattern["red_rose"]
}

func PrintLogo() {
	screen.Clear()
	screen.MoveTopLeft()

	color.Printf("<fg=%s>%s</>\n", Current[0], "     ____           __")
	color.Printf("<fg=%s>%s</>\n", Current[1], "    /  _/_ _  ___  / /____ __")
	color.Printf("<fg=%s>%s</>\n", Current[2], "   _/ //  ' \\/ _ \\/ / -_) \\ /")
	color.Printf("<fg=%s>%s</>\n", Current[3], "  /___/_/_/_/ .__/_/\\__/_\\_\\ 㞔")
	color.Printf("<fg=%s>%s</>\n", Current[4], "           /_/\n")
}

func Log(Content string) {
	date := strings.ReplaceAll(time.Now().Format("15:04:05"), ":", fmt.Sprintf("<fg=%s>:</>", Current[2]))
	content := fmt.Sprintf("[%s] %s.", date, Content)

	content = strings.ReplaceAll(content, "[", fmt.Sprintf("<fg=%s>[</>", Current[2]))
	content = strings.ReplaceAll(content, "]", fmt.Sprintf("<fg=%s>]</>", Current[2]))

	content = strings.ReplaceAll(content, "(", "<fg=6c7273;op=bold>(")
	content = strings.ReplaceAll(content, ")", ")</>")

	color.Println(content)
}

func SetTitle(title string) {
	fmt.Printf("\033]0;%s\007", title)
}
