package hcaptcha

import (
	"encoding/json"
	"fmt"
	"io"
	"strings"

	http "github.com/bogdanfinn/fhttp"
)

// Get answers for images captchas.
func (c *Client) SolveImages(captcha *Challenge) (map[string]any, error) {
	if len(captcha.Tasklist) <= 0 {
		return nil, fmt.Errorf("no images found")
	}

	var payload []byte

	switch captcha.RequestType {
	case "image_label_area_select":
		var entity string

		for _, innerMap := range captcha.RequesterRestrictedAnswerSet {
			if value, ok := innerMap["en"]; ok {
				entity = value
			}
		}

		payload, _ = json.Marshal(LabelAreaSelect{
			TaskType:   captcha.RequestType,
			Question:   captcha.RequesterQuestion.En,
			EntityType: entity,
			Tasklist:   captcha.Tasklist,
		})
	case "image_label_binary":
		payload, _ = json.Marshal(LabelBinaryPayload{
			TaskType: captcha.RequestType,
			Question: captcha.RequesterQuestion.En,
			Tasklist: captcha.Tasklist,
		})
	}

	req, err := http.NewRequest("POST", fmt.Sprintf("%s/solve", c.Config.SolverAddress), strings.NewReader(string(payload)))
	if err != nil {
		return nil, err
	}

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()

	abody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var responseJSON AiSolverResponse
	if err := json.Unmarshal([]byte(abody), &responseJSON); err != nil {
		return nil, err
	}

	if len(responseJSON.Data) == 0 {
		return nil, fmt.Errorf("empty answer %s, %+v", captcha.RequestType, responseJSON)
	}

	return responseJSON.Data, nil
}
