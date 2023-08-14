.PHONY: all clean build install implex ai engine scrape debug

clear:
	cls||clear

all: clear
	@echo "Specify a target: implex, ai, engine, install, clean, build, scrape, debug"

clean: clear
	cd ../cmd/ai && rm -rf __pycache__ datas/logs datas/temp_cache/ imgs/*

build: clear
	cd ../cmd/implex && go build -o ../../scripts/

install: clear
	cd ../cmd/GoEngine/cmd/engine && go get -u github.com/playwright-community/playwright-go
	cd ../cmd/GoEngine/cmd/engine && go run github.com/playwright-community/playwright-go/cmd/playwright@latest install --with-deps

	pip install -r requirements.txt || pip3 install -r requirements.txt
	cd ../cmd/ai && mkdir imgs
	cd ../cmd/implex && go get .

	cd ../cmd/GoEngine/cmd/engine && go get .
	cd ../cmd/GoEngine/cmd/engine && mkdir img
	cd ../cmd/GoEngine/cmd/engine/img && mkdir headfull
	cd ../cmd/GoEngine/cmd/engine/img && mkdir headless
	
	cd ../assets && mkdir scrapped

implex: clear
	cd ../cmd/implex && go run .

ai: clear
	cd ../cmd/ai && uvicorn main:app --reload --port 1338

engine: clear
	cd ../cmd/GoEngine/cmd/engine && go run . engine

debug: clear
	cd ../cmd/GoEngine/cmd/engine && go run . debug

scrape: clear
	cd ../cmd/implex && go run . scrape