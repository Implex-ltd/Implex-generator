package main

import (
	"fmt"
	"time"
)

var (
	Generated int
	Locked    int
	Unlocked  int
	Error     int
	Solved    int

	TaskSt time.Time
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
		rate := float64(Unlocked) / float64(Unlocked+Locked) * 100
		rateStr := fmt.Sprintf("%.2f", rate)

		uptime := time.Since(start).Round(time.Second)
		uptimeStr := fmt.Sprintf("%02.fh %02.fm %02.fs", uptime.Hours(), uptime.Minutes(), uptime.Seconds())

		cpm := (float64(Generated) / float64(time.Since(TaskSt).Minutes()))

		bar := fmt.Sprintf("Gen: %d, Unlock: %d (%s%%), Locked: %d, Solved: %d, CPM: %v, SolverCPM: %d, Err: %d", Generated, Unlocked, rateStr, Locked, Solved, cpm, int(float64(Solved)/float64(time.Since(TaskSt).Minutes())), Error)

		profit := (0.006 * float64(Unlocked))
		profit_h := (cpm * 60) * 0.006

		SetTitle(fmt.Sprintf("Implex v2.5 %s [%s] ⇸ %v$ (%v$/h)", uptimeStr, bar, profit, profit_h))
		time.Sleep(1500 * time.Millisecond)
	}
}
