package hcaptcha

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"strings"

	http "github.com/bogdanfinn/fhttp"
)

// Get answers for images captchas.
func (c *Client) SolveImages(captcha *ImgCaptcha) (map[string]string, error) {
	if len(captcha.Tasklist) <= 0 {
		return nil, fmt.Errorf("no images found")
	}

	type Task struct {
		DatapointURI string `json:"datapoint_uri"`
		TaskKey      string `json:"task_key"`
	}

	type UwU struct {
		Tasklist []Task `json:"tasklist"`
		Prompt   string `json:"prompt"`
	}

	task := []Task{}
	for _, t := range captcha.Tasklist {
		task = append(task, Task{
			DatapointURI: t.DatapointURI,
			TaskKey:      t.TaskKey,
		})
	}

	imgs, err := json.Marshal(UwU{
		Tasklist: task,
		Prompt:   captcha.RequesterQuestion.En,
	})
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequest("POST", fmt.Sprintf("%s/solve", c.Config.SolverAddress), strings.NewReader(string(imgs)))
	if err != nil {
		return nil, err
	}

	aresp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}

	defer aresp.Body.Close()

	abody, err := ioutil.ReadAll(aresp.Body)
	if err != nil {
		return nil, err
	}

	var responseJSON map[string]string
	if err := json.Unmarshal([]byte(abody), &responseJSON); err != nil {
		return nil, err
	}

	answers := make(map[string]string)
	for key, value := range responseJSON {
		if value == "true" || value == "[true]" {
			answers[key] = "true"
		} else {
			answers[key] = "false"
		}
	}

	if len(answers) == 0 {
		return nil, fmt.Errorf("no answers found")
	}

	return answers, nil
}
