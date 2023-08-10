package hcaptcha

import (
	"fmt"
	"strings"
	"time"

	"gopkg.in/square/go-jose.v2/jwt"
)

func HSLHashProof(request string) (string, error) {
	tok, err := jwt.ParseSigned(request)
	if err != nil {
		return "", err
	}

	var claims map[string]interface{}
	err = tok.UnsafeClaimsWithoutVerification(&claims)
	if err != nil {
		return "", err
	}

	now := time.Now().UTC().Format("2006-01-02T15:04:05.999Z")
	now = now[:len(now)-5]
	now = strings.ReplaceAll(now, "-", "")
	now = strings.ReplaceAll(now, ":", "")
	now = strings.ReplaceAll(now, "T", "")

	return strings.Join([]string{
		"1",
		fmt.Sprint(int(claims["s"].(float64))),
		now,
		claims["d"].(string),
		"",
		"1",
	}, ":"), nil
}
