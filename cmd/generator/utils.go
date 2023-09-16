package main

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"sync"

	"github.com/Implex-ltd/GoCycle"
	"github.com/Implex-ltd/generator/internal/console"
	"github.com/Implex-ltd/generator/internal/utils"
)

var (
	Assets = make(map[string]*GoCycle.Cycle)
)

func LoadStorage() error {
	inputDir := "../../assets/input/"

	files, err := os.ReadDir(inputDir)
	if err != nil {
		return err
	}

	var wg sync.WaitGroup
	assetsMutex := sync.Mutex{}

	for _, file := range files {
		wg.Add(1)
		go func(file os.DirEntry) {
			defer wg.Done()

			if file.IsDir() {
				filePaths, err := utils.GetAllFilesInDirectory(filepath.Join(inputDir, file.Name()))
				if err != nil {
					panic(err)
				}

				c := GoCycle.New(&filePaths)
				console.Log(fmt.Sprintf("Loaded %s (%d)", file.Name(), len(c.List)))
				c.RandomiseIndex()

				assetsMutex.Lock()
				Assets[file.Name()] = c
				assetsMutex.Unlock()
			} else if strings.HasSuffix(file.Name(), ".txt") {
				filePath := filepath.Join(inputDir, file.Name())

				c, err := GoCycle.NewFromFile(filePath)
				if err != nil {
					panic(err)
				}

				c.RandomiseIndex()

				assetName := strings.Split(file.Name(), ".txt")[0]
				console.Log(fmt.Sprintf("Loaded %s (%d)", assetName, len(c.List)))

				assetsMutex.Lock()
				Assets[assetName] = c
				assetsMutex.Unlock()
			}
		}(file)
	}

	wg.Wait()
	return nil
}
