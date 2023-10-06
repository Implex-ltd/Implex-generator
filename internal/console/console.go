package console

import (
	"fmt"
	"strings"
	"sync"
	"time"

	"github.com/gookit/color"
	"github.com/inancgumus/screen"
)

var (
	Generated int
	Locked    int
	Unlocked  int
	Error     int
	Solved    int

	TaskSt time.Time

	SolveTime []time.Duration
	StMut     = sync.Mutex{}
)

func PrintLogo() {
	screen.Clear()
	screen.MoveTopLeft()

	color.Printf("<fg=3d4047>%s</>\n", "     ____           __")
	color.Printf("<fg=3d4047>%s</>\n", "    /  _/_ _  ___  / /____ __")
	color.Printf("<fg=3d4047>%s</>\n", "   _/ //  ' \\/ _ \\/ / -_) \\ /")
	color.Printf("<fg=3d4047>%s</>\n", "  /___/_/_/_/ .__/_/\\__/_\\_\\ 㞔")
	color.Printf("<fg=3d4047>%s</>\n", "           /_/\n")
}

func Log(Content string) {
	date := strings.ReplaceAll(time.Now().Format("15:04:05"), ":", "<fg=353a3b>:</>")
	content := fmt.Sprintf("[%s] %s.", date, Content)

	content = strings.ReplaceAll(content, "[", "<fg=3d4047>[</>")
	content = strings.ReplaceAll(content, "]", "<fg=3d4047>]</>")

	content = strings.ReplaceAll(content, "(", "<fg=6c7273;op=bold>(")
	content = strings.ReplaceAll(content, ")", ")</>")

	color.Println(content)
}

func SetTitle(title string) {
	fmt.Printf("\033]0;%s\007", title)
}

func averageDuration() time.Duration {
	if len(SolveTime) == 0 {
		return 0
	}

	StMut.Lock()
	defer StMut.Unlock()

	var total time.Duration
	for _, dur := range SolveTime {
		total += dur
	}

	average := total / time.Duration(len(SolveTime))
	return average
}

func ConsoleTitle() {
	start := time.Now()
	TaskSt = time.Now()

	for {
		rate := float64(Unlocked) / float64(Unlocked+Locked) * 100
		rateStr := fmt.Sprintf("%.2f", rate)

		uptime := time.Since(start).Round(time.Second)
		uptimeStr := fmt.Sprintf("%02.fh %02.fm %02.fs", uptime.Hours(), uptime.Minutes(), uptime.Seconds())

		cpm := (float64(Generated) / float64(time.Since(TaskSt).Minutes()))

		bar := fmt.Sprintf("Gen: %d, Unlock: %d (%s%%), Locked: %d, Solved: %d, CPM: %.2f, SolverCPM: %d, Err: %d, Avg: %.2fs", Generated, Unlocked, rateStr, Locked, Solved, cpm, int(float64(Solved)/float64(time.Since(TaskSt).Minutes())), Error, averageDuration().Seconds())

		price := 0.007
		profit := (price * float64(Unlocked))
		profit_h := (cpm * 60) * price

		SetTitle(fmt.Sprintf("Implex v3 %s [%s] ⇸ %.2f$ (%.2f$/h)", uptimeStr, bar, profit, profit_h))
		time.Sleep(350 * time.Millisecond)
	}
}
