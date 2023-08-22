package main

import (
	"fmt"
	"time"
)

const (
	TASK_MENU   = 0
	TASK_GEN    = 1
	TASK_SCRAPE = 2
)

var (
	Generated int
	Locked    int
	Unlocked  int
	Error     int
	Solved    int

	TaskSt  time.Time
)

func averageDuration(durations []*time.Duration) time.Duration {
	if len(durations) == 0 {
		return 0
	}

	var total time.Duration
	for _, dur := range durations {
		total += *dur
	}

	return time.Duration((total / time.Duration(len(durations))).Seconds())
}

func SetTitle(title string) {
	fmt.Printf("\033]0;%s\007", title)
}

func ConsoleTitle() {
	start := time.Now()
	TaskSt = time.Now()

	for {
		rate := float64(Unlocked) / float64(Unlocked+Locked) * 100 // skip unchecked tokens
		rateStr := fmt.Sprintf("%.2f", rate)

		uptime := time.Since(start).Round(time.Second)
		uptimeStr := fmt.Sprintf("%02.fh %02.fm %02.fs", uptime.Hours(), uptime.Minutes(), uptime.Seconds())

		bar := fmt.Sprintf("Gen=%d, Unlock=%d (%s%%), Locked=%d, CPM=%d, SolverCPM=%d, Err=%d", Generated, Unlocked, rateStr, Locked, int(float64(Generated)/float64(time.Since(TaskSt).Minutes())), int(float64(Solved)/float64(time.Since(TaskSt).Minutes())), Error)

		SetTitle(fmt.Sprintf("Implex v2 %s [%s] ⇸ %s", uptimeStr, bar))
		time.Sleep(1500 * time.Millisecond)
	}
}
