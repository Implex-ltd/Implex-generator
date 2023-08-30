package main

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"sync"

	"github.com/BurntSushi/toml"
	"github.com/Implex-ltd/GoCycle"
	"github.com/Implex-ltd/implex/internal/utils"

	"context"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	"io"
	"log/slog"
)

var (
	Assets = make(map[string]*GoCycle.Cycle)
	Logger *zap.Logger
)

type PrettyHandlerOptions struct {
	ZapOpts zap.Config
}

type PrettyHandler struct {
	logger *zap.Logger
}

func (h *PrettyHandler) Handle(ctx context.Context, r slog.Record) error {
	level := r.Level.String()

	fields := make([]string, 0)
	r.Attrs(func(a slog.Attr) bool {
		fields = append(fields, fmt.Sprintf("%v=%v", a.Key, a.Value))
		return true
	})

	timeStr := r.Time.Format("[15:04:05.000]")
	msg := r.Message
	extraFields := strings.Join(fields, " ")

	h.logger.Info(fmt.Sprintf("%s %s %s %s", timeStr, level, msg, extraFields))

	return nil
}

func NewPrettyHandler(out io.Writer, opts PrettyHandlerOptions) *PrettyHandler {
	zapConfig := opts.ZapOpts
	zapConfig.EncoderConfig = zapcore.EncoderConfig{
		MessageKey:     "message",
		LevelKey:       "level",
		TimeKey:        "time",
		EncodeLevel:    zapcore.CapitalColorLevelEncoder, // This enables built-in level coloring
		EncodeTime:     zapcore.TimeEncoderOfLayout("[15:04:05.000]"),
		EncodeDuration: zapcore.StringDurationEncoder,
	}
	logger, _ := zapConfig.Build()

	return &PrettyHandler{
		logger: logger,
	}
}

func SetupLogger() {
	opts := PrettyHandlerOptions{
		ZapOpts: zap.NewDevelopmentConfig(),
	}
	handler := NewPrettyHandler(os.Stdout, opts)
	Logger = handler.logger
}

func LoadStorage() error {

	if _, err := toml.DecodeFile("../../scripts/config.toml", &Config); err != nil {
		panic(err)
	}

	inputDir := "../../assets/input/"

	files, err := os.ReadDir(inputDir)
	if err != nil {
		return err
	}

	var wg sync.WaitGroup
	assetsMutex := sync.Mutex{}

	for _, file := range files {
		wg.Add(1)
		go func(file os.DirEntry) {
			defer wg.Done()

			if file.IsDir() {
				filePaths, err := utils.GetAllFilesInDirectory(filepath.Join(inputDir, file.Name()))
				if err != nil {
					panic(err)
				}

				c := GoCycle.New(&filePaths)
				Logger.Info("Loaded",
					zap.String("file", file.Name()),
					zap.Int("amount", len(c.List)),
				)

				if Config.Asset.ClearDups {
					c.ClearDuplicates()
				}

				if Config.Asset.Randomize {
					c.RandomiseIndex()
				}

				assetsMutex.Lock()
				Assets[file.Name()] = c
				assetsMutex.Unlock()
			} else if strings.HasSuffix(file.Name(), ".txt") {
				filePath := filepath.Join(inputDir, file.Name())

				c, err := GoCycle.NewFromFile(filePath)
				if err != nil {
					panic(err)
				}

				if Config.Asset.ClearDups {
					c.ClearDuplicates()
				}

				if Config.Asset.Randomize {
					c.RandomiseIndex()
				}

				assetName := strings.Split(file.Name(), ".txt")[0]
				Logger.Info("Loaded",
					zap.String("file", assetName),
					zap.Int("amount", len(c.List)),
				)

				assetsMutex.Lock()
				Assets[assetName] = c
				assetsMutex.Unlock()
			}
		}(file)
	}

	wg.Wait()
	return nil
}
