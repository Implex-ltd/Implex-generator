package main

import (
	"go.uber.org/zap"
	"sync"
	"time"
)

var (
	hashlist = map[string][]string{}
	logger   *zap.Logger
	mu       sync.Mutex
)

type Result struct {
	Hash  string
	Match bool
	Err   error
	St    time.Duration
	Url   string
	Key   string
}

type TaskList struct {
	DatapointURI string `json:"datapoint_uri"`
	TaskKey      string `json:"task_key"`
}

type BodyNewSolveTask struct {
	TaskType string     `json:"task_type"`
	Question string     `json:"question"`
	TaskList []TaskList `json:"tasklist"`
}

type SolveRepsonse struct {
	Success bool              `json:"success"`
	Data    map[string]string `json:"data"`
}
