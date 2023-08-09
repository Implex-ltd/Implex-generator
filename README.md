```
    ____           __
   /  _/_ _  ___  / /____ __
  _/ //  ' \/ _ \/ / -_) \ /
 /___/_/_/_/ .__/_/\__/_\_\ 㞔
         /_/               
```

# Implex generator Documentation

## Table of Contents
- [Implex generator Documentation](#implex-generator-documentation)
	- [Table of Contents](#table-of-contents)
	- [Introduction](#introduction)
	- [Usage](#usage)
	- [Requirements](#requirements)
	- [Installation](#installation)
	- [Troubleshooting](#troubleshooting)
	- [See PoC on Youtube](#see-poc-on-youtube)

## Introduction
Implex's Generator is a Discord token generator aimed at creating accounts en masse. It incorporates a technology that enables solving CAPTCHA challenges using the power of artificial intelligence, along with technologies designed to mitigate Hcaptcha fingerprinting.

Blazing fast, built in golang ! Up to 2200 account / minutes.

## Usage
To use the generator, follow these steps:
1. [Download](#installation) Follow steps.

## Requirements
Before installing and using the generator, ensure that the following requirements are met:
- Operating System: Windows 10/11, Linux
- Golang 1.20
- Python 3.10.0
- Gologin
- Make

## Installation
1. Clone or download the repository from [Here](https://github.com/Implex-ltd/Implex-generator).
2. Download and Install make ([windows](https://stackoverflow.com/questions/32127524/how-to-install-and-use-make-in-windows), [Linux](https://linuxhint.com/install-make-ubuntu/)).
3. Configure proxies, avatars, etc.. `assets/input/avatars/xx.png, ...` .
4. Download [Gologin](https://gologin.com/) and create api-key, then add it into `/cmd/engine/config.json`
5. Go into `/scripts` directory.
6. Install dependencies `make install`.
7. Run the HSW browser engine: `make engine` (Make sure that you are using 0 threads during the initial launch.).
8. Run the AI solver: `make ai`.
9. Run the generator: `make implex`.

## Troubleshooting
If you encounter any issues while using this tool, try the following troubleshooting steps:

1. Update golang, python, nodejs.
2. Make sur to install everything.
3. Use right proxies.
4. Check config.

If the problem persists, feel free to open an issue on the GitHub repository for support.

## Update models
You feel free to update models when they are adding challenge using [hcaptcha-model-factory](https://github.com/captcha-challenger/hcaptcha-model-factory)

## Packages
This library is using our custom packages that you can include into your project such as

- [cloudflare-reverse](https://github.com/Implex-ltd/cloudflare-reverse) __cf_bm cookie
- [fingerprint-client](https://github.com/Implex-ltd/fingerprint-client) Fingerprint evasion library for HTTP clients and webdrivers.
- [cleanhttp](https://github.com/Implex-ltd/cleanhttp) Human like HTTP Library powered by fpclient and tls_client.

## Donation / Support us

```
LTC: ltc1qkh766d6hnhwu4twvdvuvcnz348etvur5vcqcgc
Contact: 0xF7A4C6@proton.me | https://t.me/Vichy1337
Follow: https://discord.gg/exU5xahvnE | https://t.me/implex_ltd
```

## See PoC on Youtube

[![Preview](https://img.youtube.com/vi/z6Ea-SRY-qs/0.jpg)](https://www.youtube.com/watch?v=z6Ea-SRY-qs&ab_channel=Armv7l)
