package test

import (
	"fmt"
	"testing"

	h "github.com/0xF7A4C6/implex/internal/hcaptcha"
)

func TestGetMotion(t *testing.T) {
	type args struct {
		answers map[string]string
	}
	tests := []struct {
		name string
		args args
		want string
	}{
		{
			name: "motion-data",
			args: args{
				answers: map[string]string{
					`a`: `"false"`,
					`b`: `"false"`,
					`c`: `"true"`,
					`d`: `"false"`,
					`e`: `"false"`,
					`f`: `"true"`,
					`g`: `"false"`,
					`h`: `"true"`,
					`i`: `"false"`,
					`j`: `"false"`,
				},
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			m := h.GenerateMotionGet(1920, 1080)
			fmt.Println(m)

			fmt.Println("=======================================================================================")

			m = h.GenerateMotionCheck(tt.args.answers, 1920, 1080)
			fmt.Println(m)
		})
	}
}
