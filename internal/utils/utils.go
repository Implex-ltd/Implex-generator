package utils

import (
	"bufio"
	"fmt"
	"io/ioutil"
	"math/rand"
	"os"
)

var (
	basePath = "../../assets"
	charset  = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
)

func ReadFile(filePath string) ([]string, error) {
	var lines []string

	file, err := os.Open(fmt.Sprintf("%s/%s", basePath, filePath))
	if err != nil {
		return lines, err
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		lines = append(lines, scanner.Text())
	}

	if err := scanner.Err(); err != nil {
		return lines, err
	}

	return lines, nil
}

func AppendFile(filePath string, line string) error {
	f, err := os.OpenFile(fmt.Sprintf("%s/%s", basePath, filePath), os.O_APPEND|os.O_WRONLY, 0644)
	if err != nil {
		return err
	}
	defer f.Close()

	_, err = f.WriteString(line + "\n")
	if err != nil {
		return err
	}

	return nil
}

func GetAllFilesInDirectory(dirPath string) ([]string, error) {
	var files []string

	fileInfos, err := ioutil.ReadDir(fmt.Sprintf("%s/%s", basePath, dirPath))
	if err != nil {
		return nil, err
	}

	for _, fileInfo := range fileInfos {
		if fileInfo.IsDir() {
			continue
		}
		files = append(files, fileInfo.Name())
	}

	return files, nil
}

func RandomString(length int) string {
	result := make([]byte, length)
	for i := range result {
		result[i] = charset[rand.Intn(len(charset))]
	}

	return string(result)
}
