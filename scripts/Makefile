OS := $(shell echo %OS%)
ifeq ($(OS),Darwin)
    CLEAR := clear
else
    CLEAR := cls
endif

.PHONY: all clean build install implex ai engine

all:
	@$(CLEAR)
	@echo "Specify a target: implex, ai, engine, install, clean, build"

clean:
	@$(CLEAR)
	cd ../cmd/ai && rm -rf __pycache__ datas/logs datas/temp_cache/ imgs/*

build:
	@$(CLEAR)
	cd ../cmd/implex && go build -o ../../scripts/

install:
	@$(CLEAR)
	pip install -r requirements.txt || pip3 install -r requirements.txt
	cd ../cmd/implex && go get .
	cd ../cmd/engine && npm i

implex:
	@$(CLEAR)
	cd ../cmd/implex && go run .

ai:
	@$(CLEAR)
	cd ../cmd/ai && uvicorn main:app --reload --port 1337

engine:
	@$(CLEAR)
	cd ../cmd/engine && node main.js