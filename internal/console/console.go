package console

import (
	"fmt"
	"strings"
	"time"

	"github.com/gookit/color"
	"github.com/inancgumus/screen"
)

func PrintLogo() {
	screen.Clear()
	screen.MoveTopLeft()

	color.Printf("<fg=9b59b6>%s</>\n", "     ____           __")
	color.Printf("<fg=c16ecf>%s</>\n", "    /  _/_ _  ___  / /____ __")
	color.Printf("<fg=e085e8>%s</>\n", "   _/ //  ' \\/ _ \\/ / -_) \\ /")
	color.Printf("<fg=ff9af0>%s</>\n", "  /___/_/_/_/ .__/_/\\__/_\\_\\ 㞔")
	color.Printf("<fg=ffb0f0>%s</>\n", "           /_/\n")
}

func Log(Content string) {
	date := strings.ReplaceAll(time.Now().Format("15:04:05"), ":", "<fg=353a3b>:</>")
	content := fmt.Sprintf("[%s] %s.", date, Content)

	content = strings.ReplaceAll(content, "[", "<fg=e085e8>[</>")
	content = strings.ReplaceAll(content, "]", "<fg=e085e8>]</>")

	content = strings.ReplaceAll(content, "(", "<fg=6c7273;op=bold>(")
	content = strings.ReplaceAll(content, ")", ")</>")

	color.Println(content)
}

func SetTitle(title string) {
	fmt.Printf("\033]0;%s\007", title)
}
