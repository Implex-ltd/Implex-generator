package hcaptcha

import (
	"io/ioutil"
	"net/http"
	"os"
	"strings"

	"github.com/0xF7A4C6/implex/internal/utils"
)

var (
	AnswerList = map[string]string{}
)

func LoadAnswer() {
	lines, err := utils.ReadFile("questions.txt")

	if err != nil {
		return
	}

	for _, question := range lines {
		split := strings.Split(question, "|")
		AnswerList[split[0]] = split[1]
	}
}

func DownloadAnswer() error {
	resp, err := http.Get("https://raw.githubusercontent.com/0xF7A4C6/fuckcaptcha/master/questions.txt?token=xxxx")

	if err != nil {
		return err
	}
	defer resp.Body.Close()

	data, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	file, err := os.Create("questions.txt")
	if err != nil {
		return err
	}
	defer file.Close()

	_, err = file.Write(data)
	if err != nil {
		return err
	}

	return nil
}
