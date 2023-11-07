package cloudflarereverse

import (
	"fmt"
	"testing"

	"github.com/Implex-ltd/fingerprint-client/fpclient"
)

func Test_formatFingerprint(t *testing.T) {
	brFp, err := fpclient.LoadFingerprint(&fpclient.LoadingConfig{
		FilePath: "../assets/fingerprints/macos.json",
	})

	if err != nil {
		panic(err)
	}

	type args struct {
		fp *fpclient.Fingerprint
	}
	tests := []struct {
		name string
		args args
		want string
	}{

		{
			name: "test-format-fingerprint",
			args: args{
				fp: brFp,
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(_ *testing.T) {
			res := formatFingerprint(tt.args.fp)
			fmt.Println(res)
		})
	}
}
