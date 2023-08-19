package main

import (
	"fmt"
	"time"

	"github.com/Implex-ltd/implex/internal/console"
	"github.com/Implex-ltd/implex/internal/hcaptcha"
	"github.com/Implex-ltd/implex/internal/utils"
	"github.com/Implex-ltd/implex/pkg/itertools"
)

const (
	TASK_MENU   = 0
	TASK_GEN    = 1
	TASK_SCRAPE = 2
)

var (
	UsernameList *itertools.Iterator
	ProxyList    *itertools.Iterator
	AvatarList   *itertools.Iterator
	BioList      *itertools.Iterator

	Generated int
	Locked    int
	Unlocked  int
	Error     int
	Solved    int

	Scraped     int
	ScrapeError int

	version = "1.2"
	Task    = TASK_MENU
	TaskSt  time.Time

	Durations          []*time.Duration
	AvgImgProcDuration []*time.Duration
	AvgHswProcDuration []*time.Duration
)

func LoadFiles() error {
	defer console.SetTitle("Ready!")
	console.SetTitle("Loading...")

	proxies, err := utils.ReadFile("input/proxies.txt")
	if err != nil {
		return err
	}

	ProxyList = itertools.NewIterator(proxies)

	if err := ProxyList.RandomiseIndex(); err != nil {
		panic("please put at least 2 proxies")
	}

	console.Log(fmt.Sprintf("[+] Loaded %d proxies...", len(proxies)))

	usernames, err := utils.ReadFile("input/username.txt")
	if err != nil {
		return err
	}

	UsernameList = itertools.NewIterator(usernames)
	if err := UsernameList.RandomiseIndex(); err != nil {
		panic("please put at least 2 usernames")
	}

	console.Log(fmt.Sprintf("[+] Loaded %d usernames...", len(usernames)))

	bio, err := utils.ReadFile("input/bio.txt")
	if err != nil {
		return err
	}

	BioList = itertools.NewIterator(bio)
	if err := BioList.RandomiseIndex(); err != nil {
		panic("please put at least 2 bios")
	}

	console.Log(fmt.Sprintf("[+] Loaded %d bio...", len(bio)))

	pfp, err := utils.GetAllFilesInDirectory("input/avatars/")
	if err != nil {
		return err
	}

	AvatarList = itertools.NewIterator(pfp)
	if err := AvatarList.RandomiseIndex(); err != nil {
		panic("please put at least 2 avatars")
	}

	console.Log(fmt.Sprintf("[+] Loaded %d pfp...", len(pfp)))
	fmt.Println("")

	return nil
}

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

func ConsoleTitle() {
	start := time.Now()
	var Lt int

	for {
		if Task != Lt {
			TaskSt = time.Now()
		}
		Lt = Task

		rate := float64(Unlocked) / float64(Unlocked+Locked) * 100 // skip unchecked tokens
		rateStr := fmt.Sprintf("%.2f", rate)

		uptime := time.Since(start).Round(time.Second)
		uptimeStr := fmt.Sprintf("%02.fh %02.fm %02.fs", uptime.Hours(), uptime.Minutes(), uptime.Seconds())

		var bar string

		switch Task {
		case TASK_MENU:
			bar = "Menu"
		case TASK_GEN:
			bar = fmt.Sprintf("Gen=%d, Unlock=%d (%s%%), Locked=%d, CPM=%d, SolverCPM=%d, Err=%d, SolveT=%ds, ImgProcT=%ds, HswProcT=%ds", Generated, Unlocked, rateStr, Locked, int(float64(Generated)/float64(time.Since(TaskSt).Minutes())), int(float64(Solved)/float64(time.Since(TaskSt).Minutes())), Error, averageDuration(Durations), averageDuration(AvgImgProcDuration), averageDuration(AvgHswProcDuration))
			console.Log(bar)
		case TASK_SCRAPE:
			Scraped = hcaptcha.Scrape
			bar = fmt.Sprintf("Scrape=%d, CPS=%d, CPM=%d, Err=%d", Scraped, int(float64(Scraped)/float64(time.Since(TaskSt).Seconds())), int(float64(Scraped)/float64(time.Since(TaskSt).Minutes())), ScrapeError)
			console.Log(bar)
		}

		console.SetTitle(fmt.Sprintf("Implex %s [%s] ⇸ %s", version, uptimeStr, bar))
		time.Sleep(1500 * time.Millisecond)
	}
}