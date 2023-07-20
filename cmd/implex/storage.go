package main

import (
	"fmt"
	"time"

	"github.com/Implex-ltd/implex/internal/console"
	"github.com/Implex-ltd/implex/internal/utils"
	"github.com/Implex-ltd/implex/pkg/itertools"
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
)

func LoadFiles() error {
	defer console.SetTitle("Ready!")
	console.SetTitle("Loading...")

	proxies, err := utils.ReadFile("input/proxies.txt")
	if err != nil {
		return err
	}

	ProxyList = itertools.NewIterator(proxies)
	ProxyList.RandomiseIndex()

	console.Log(fmt.Sprintf("[+] Loaded %d proxies...", len(proxies)))

	usernames, err := utils.ReadFile("input/username.txt")
	if err != nil {
		return err
	}

	UsernameList = itertools.NewIterator(usernames)
	UsernameList.RandomiseIndex()

	console.Log(fmt.Sprintf("[+] Loaded %d usernames...", len(usernames)))

	bio, err := utils.ReadFile("input/bio.txt")
	if err != nil {
		return err
	}

	BioList = itertools.NewIterator(bio)
	BioList.RandomiseIndex()

	console.Log(fmt.Sprintf("[+] Loaded %d bio...", len(bio)))

	pfp, err := utils.GetAllFilesInDirectory("input/avatars/")
	if err != nil {
		return err
	}

	AvatarList = itertools.NewIterator(pfp)
	AvatarList.RandomiseIndex()

	console.Log(fmt.Sprintf("[+] Loaded %d pfp...", len(pfp)))
	fmt.Println("")

	return nil
}

func ConsoleTitle() {
	start := time.Now()

	for {
		rate := float64(Unlocked) / float64(Generated) * 100
		rateStr := fmt.Sprintf("%.2f", rate)

		uptime := time.Since(start).Round(time.Second)
		uptimeStr := fmt.Sprintf("%02.fh %02.fm %02.fs", uptime.Hours(), uptime.Minutes(), uptime.Seconds())

		console.SetTitle(fmt.Sprintf("Implex 1.1 ⇸ Generated: %d, Unlocked: %d (%s%%), Locked: %d, CPM: %d, Solver CPM: %d, Errors: %d, Uptime: %s", Generated, Unlocked, rateStr, Locked, int(float64(Generated)/float64(minutesPassed(start))), int(float64(Solved)/float64(minutesPassed(start))), Error, uptimeStr))
		time.Sleep(50 * time.Millisecond)
	}
}

func minutesPassed(startTime time.Time) int {
	minutes := int(time.Since(startTime).Minutes())
	if minutes == 0 {
		return 1
	}
	return minutes
}
