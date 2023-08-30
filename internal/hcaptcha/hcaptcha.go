package hcaptcha

import (
	"encoding/json"
	"fmt"
	"io"
	_"log"
	"net/http"
	"strings"
	"time"
)

func NewSolve(UserAgent, Proxy string, TaskType int) (string, error) {
	payload, _ := json.Marshal(BodyNewSolveTask{
		UserAgent: UserAgent,
		Domain:    "discord.com",
		SiteKey:   "4c672d35-0701-42b2-88c3-78380b0db560",
		Proxy:     Proxy,
		TaskType:  TaskType,
	})

	// create task
	client := http.Client{
		Timeout: 15 * time.Second,
	}

	req, err := http.NewRequest("POST", fmt.Sprintf("%s/api/task/new", SERVER_ADDR), strings.NewReader(string(payload)))
	if err != nil {
		return "", err
	}
	req.Header.Add("content-type", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}

	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	var out TaskResponse
	if err := json.Unmarshal(body, &out); err != nil {
		return "", err
	}

	if !out.Success {
		return "", fmt.Errorf(out.Message)
	}

	//log.Printf("Created task (%v)\n", out.Data[0].ID)

	// get result
	for {
		req, err := http.NewRequest("GET", fmt.Sprintf("%s/api/task/%s", SERVER_ADDR, out.Data[0].ID), strings.NewReader(string(payload)))
		if err != nil {
			return "", nil
		}
		req.Header.Add("content-type", "application/json")

		resp, err := client.Do(req)
		if err != nil {
			return "", err
		}

		defer resp.Body.Close()

		body, err := io.ReadAll(resp.Body)
		if err != nil {
			return "", err
		}

		var checkresp CheckResponse
		if err := json.Unmarshal(body, &checkresp); err != nil {
			return "", err
		}

		switch checkresp.Data.Status {
		case STATUS_ERROR:
			return "", fmt.Errorf(out.Message)
		case STATUS_SOLVED:
			return checkresp.Data.Token, nil
		case STATUS_SOLVING:
			time.Sleep(1 * time.Second)
		}
	}
}
