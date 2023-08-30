package hcaptcha

import "time"

const SERVER_ADDR = "http://127.0.0.1:3000"

const (
	STATUS_SOLVING = 0
	STATUS_SOLVED  = 1
	STATUS_ERROR   = 2
)

const (
	TYPE_ENTERPRISE = 0
	TYPE_NORMAL     = 1
	TYPE_TURBO      = 2
)

type BodyNewSolveTask struct {
	Domain    string `json:"domain"`
	SiteKey   string `json:"site_key"`
	UserAgent string `json:"user_agent"`
	Proxy     string `json:"proxy"`
	TaskType  int    `json:"task_type"`
}

type TaskResponse struct {
	Data []struct {
		CreatedAt  time.Time `json:"CreatedAt"`
		UpdatedAt  time.Time `json:"UpdatedAt"`
		DeletedAt  time.Time `json:"DeletedAt"`
		ID         string    `json:"id"`
		Status     int       `json:"status"`
		Token      string    `json:"token"`
		Error      string    `json:"error"`
		Success    bool      `json:"success"`
		Expiration int       `json:"expiration"`
	} `json:"data"`
	Message string `json:"message"`
	Success bool   `json:"success"`
}

type CheckResponse struct {
	Data struct {
		Error      string `json:"error"`
		Expiration int    `json:"expiration"`
		ID         string `json:"id"`
		Status     int    `json:"status"`
		Success    bool   `json:"success"`
		Token      string `json:"token"`
	} `json:"data"`
	Message string `json:"message"`
	Status  string `json:"status"`
}
