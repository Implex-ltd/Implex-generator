package test

import (
	"fmt"
	"testing"

	"github.com/Implex-ltd/implex/pkg/itertools"
)

func TestNewIterator(t *testing.T) {
	type args struct {
		items []string
	}
	tests := []struct {
		name string
		args args
		want *itertools.Iterator
	}{
		{
			name: "string iterator",
			args: args{
				items: []string{
					"never",
					"gonna",
					"give",
					"you",
					"up",
					"l",
					"m",
					"a",
					"o",
				},
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := itertools.NewIterator(tt.args.items)

			fmt.Println("index (base):", got.I)
			for i := 0; i < 5; i++ {
				fmt.Println(got.Next())
			}

			got.RandomiseIndex()

			fmt.Println("index (new):", got.I)
			for i := 0; i < 5; i++ {
				fmt.Println(got.Next())
			}
		})
	}
}
