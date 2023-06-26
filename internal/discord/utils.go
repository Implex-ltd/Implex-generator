package discord

import "strings"

func addBase64Padding(base64String string) string {
	paddingCount := 4 - (len(base64String) % 4)
	padding := strings.Repeat("=", paddingCount)

	return base64String + padding
}
