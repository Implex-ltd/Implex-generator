package main

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/cespare/xxhash"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"go.uber.org/zap"
	"io"
	"net/http"
	"strings"
	"sync"
	"time"
)

func HashExistsInPrompt(prompt string, contentHash uint64) bool {
	hashes, exists := hashlist[prompt]
	if exists {
		for _, h := range hashes {
			if h == fmt.Sprintf("%x", contentHash) {
				return true
			}
		}
	}
	return false
}

func HashExistsInOtherPrompts(prompt string, contentHash uint64) bool {
	for otherPrompt, hashes := range hashlist {
		if otherPrompt != prompt {
			for _, h := range hashes {
				if h == fmt.Sprintf("%x", contentHash) {
					return true
				}
			}
		}
	}
	return false
}

func DownloadAndClassify(url, key, prompt string, results chan<- Result, wg *sync.WaitGroup) {
	defer wg.Done()
	st := time.Now()

	resp, err := http.Get(url)
	if err != nil {
		results <- Result{Hash: "", Match: false, Err: err, Url: url, St: time.Since(st), Key: key}
		return
	}
	defer resp.Body.Close()

	buff := make([]byte, 1024)
	_, err = io.ReadFull(resp.Body, buff)
	if err != nil {
		results <- Result{Hash: "", Match: false, Err: err, Url: url, St: time.Since(st), Key: key}
		return
	}

	content := bytes.Split(buff, []byte("$.' \",#\x1c\x1c(7)"))
	if len(content) < 1 {
		results <- Result{Hash: "", Match: false, Err: errors.New("cant split bytes"), Url: url, St: time.Since(st), Key: key}
		return
	}

	/**
		read from file require [:-6] extra byte if downloaded by discord
	    hcaptcha directly saved imgs doesnt require
	*/
	contentWithoutLast6Bytes := content[1] // [:len(content[1])-6]
	contentHash := xxhash.Sum64(contentWithoutLast6Bytes)

	// already solved [new feature !]
	if HashExistsInPrompt(prompt, contentHash) {
		results <- Result{Hash: fmt.Sprintf("%x", contentHash), Match: false, Err: nil, Url: url, St: time.Since(st), Key: key}
		return
	}

	// already solved in THIS prompt [old]
	if HashExistsInOtherPrompts(prompt, contentHash) {
		results <- Result{Hash: fmt.Sprintf("%x", contentHash), Match: false, Err: nil, Url: url, St: time.Since(st), Key: key}
		return
	}

	// Implement your classification logic here
	// If classification succeeds, add the hash to the prompt's hashlist
	// For now, let's assume classification succeeds and add the hash

	answer := false

	if answer {
		go func() {
			mu.Lock()
			hashlist[prompt] = append(hashlist[prompt], fmt.Sprintf("%x", contentHash))
			mu.Unlock()
		}()
	}

	results <- Result{Hash: fmt.Sprintf("%x", contentHash), Match: answer, Err: nil, Url: url, St: time.Since(st), Key: key}
}

func Task(task *BodyNewSolveTask) *SolveRepsonse {
	results := make(chan Result, len(task.TaskList))

	if strings.Contains(task.Question, "Please click each image containing a ") {
		task.Question = strings.Split(task.Question, "Please click each image containing a ")[1]
	}

	var wg sync.WaitGroup

	for _, t := range task.TaskList {
		wg.Add(1)
		go DownloadAndClassify(t.DatapointURI, t.TaskKey, task.Question, results, &wg)
	}

	wg.Wait()
	close(results)

	resp := map[string]string{}

	for result := range results {
		resp[result.Key] = fmt.Sprintf("%v", result.Match)

		if result.Err != nil {
			fmt.Println("Image download failed:", result.Err)
			return nil
		}

		logger.Info("Image classified",
			zap.String("hash", result.Hash),
			zap.String("prompt", task.Question),
			zap.Bool("match", result.Match),
			zap.Int64("st", result.St.Milliseconds()),
			//	zap.String("url", result.Url),
		)
	}

	return &SolveRepsonse{
		Success: true,
		Data:    resp,
	}
}

func HandlerSolve(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var requestBody BodyNewSolveTask

	err := decoder.Decode(&requestBody)
	if err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	defer r.Body.Close()

	resp := Task(&requestBody)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(resp)
}

func main() {
	LoadLogger()

	count, err := LoadHash()
	if err != nil {
		panic(err)
	}

	logger.Info("Loaded hash csv",
		zap.Int("count", count),
	)

	for k, v := range hashlist {
		logger.Info("Loaded hash",
			zap.String("prompt", k),
			zap.Int("count", len(v)),
		)
	}

	r := chi.NewRouter()

	r.Use(middleware.Logger)
	r.Post("/solve", HandlerSolve)

	err = http.ListenAndServe(":1332", r)
	if err != nil {
		panic(err)
	}
}

/*
func _main() {
	LoadLogger()

	count, err := LoadHash()
	if err != nil {
		panic(err)
	}

	logger.Info("Loaded hash csv",
		zap.Int("count", count),
	)

	for k, v := range hashlist {
		logger.Info("Loaded hash",
			zap.String("prompt", k),
			zap.Int("count", len(v)),
		)
	}

	prompt := []string{
		"dolphin",
		"robot",
		"laptop",
		"tree",
		"meerkat",
	}

	urls := []string{
		"https://media.discordapp.net/attachments/1140759790482636820/1141572120313344041/5spDoSe.png",
		"https://media.discordapp.net/attachments/1140759790482636820/1141572120544018502/xpX9Nuv.png",
		"https://media.discordapp.net/attachments/1140759790482636820/1141572120774725712/4OZMipc.png",
	}

	c := goccm.New(len(prompt))

	t := time.Now()
	for _, p := range prompt {
		c.Wait()

		go func(prompt string) {
			defer c.Done()
			Task(prompt, urls)
		}(p)
	}

	c.WaitAllDone()

	logger.Info("All task done",
		zap.Int("imgs", len(prompt)*len(urls)),
		zap.Int64("ms", time.Since(t).Milliseconds()),
	)
}
*/
