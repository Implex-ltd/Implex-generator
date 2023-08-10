.PHONY: all clean build install implex ai engine scrape

all:
	cls||clear
	@echo "Specify a target: implex, ai, engine, install, clean, build, scrape"

clean:
	cls||clear
	cd ../cmd/ai && rm -rf __pycache__ datas/logs datas/temp_cache/ imgs/*

build:
	cls||clear
	cd ../cmd/implex && go build -o ../../scripts/

install:
	cls||clear
	pip install -r requirements.txt || pip3 install -r requirements.txt
	cd ../cmd/implex && go get .
	cd ../cmd/engine && npm i
	cd ../cmd/ai && mkdir imgs

implex:
	cls||clear
	cd ../cmd/implex && go run .

ai:
	cls||clear
	cd ../cmd/ai && uvicorn main:app --reload --port 1337

engine:
	cls||clear
	cd ../cmd/engine && node main.js

scrape:
	cls||clear
	cd ../cmd/implex && go run . scrape