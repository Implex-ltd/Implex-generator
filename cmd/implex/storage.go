package main

import (
	"fmt"
	"github.com/Implex-ltd/GoCycle"
	"github.com/mattn/go-colorable"
	"github.com/zenthangplus/goccm"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

var (
	data = map[string]*GoCycle.Cycle{}
	toLoad = map[string]string{
		"username": "username.txt",
		"proxies":  "proxies.txt",
		"bio":      "bio.txt",
	}

	logger *zap.Logger
)

func LoadSettings() {
	encoder := zap.NewDevelopmentEncoderConfig()
	encoder.EncodeLevel = zapcore.CapitalColorLevelEncoder

	core := zapcore.NewTee(
		zapcore.NewCore(
			zapcore.NewConsoleEncoder(encoder),
			zapcore.AddSync(colorable.NewColorableStdout()),
			zapcore.DebugLevel,
		),
	)

	logger = zap.New(core)
	c := goccm.New(len(toLoad))

	for k, v := range toLoad {
		c.Wait()

		go func(k, v string) {
			defer c.Done()
			path := fmt.Sprintf("../../assets/input/%s", v)

			cycle, err := GoCycle.NewFromFile(path)
			if err != nil {
				panic(err)
			}

			cycle.ClearDuplicates()
			cycle.RandomiseIndex()
			data[k] = cycle

			logger.Info("Loaded file",
				zap.Int("amount", len(cycle.List)),
				zap.String("name", k),
			)
		}(k, v)

	}

	c.WaitAllDone()
}
