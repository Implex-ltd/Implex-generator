const puppeteer = require('puppeteer-core');
const GoLogin = import('gologin');
const { connect } = puppeteer;
const config = require('./config.json');
const express = require('express');
const createCursor = require('ghost-cursor').createCursor

const app = express();

let clients = [];
let clientx = [];
let clientIndex = 0;
const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

async function safeExit() {
    console.log('> Closing servers and deleting profiles...');
    await Promise.all(clients.map((client) => client.stop()));
    console.log('> Servers closed and profiles deleted. Exiting...');
    process.exit(0);
}

function getRandomLanguage() {
    const languages = [
        'af', 'af-ZA', 'am', 'am-ET', 'ar', 'ar-AE', 'ar-BH', 'ar-DZ', 'ar-EG', 'ar-IQ',
        'ar-JO', 'ar-KW', 'ar-LB', 'ar-LY', 'ar-MA', 'arn', 'arn-CL', 'ar-OM', 'ar-QA',
        'ar-SA', 'ar-SY', 'ar-TN', 'ar-YE', 'as', 'as-IN', 'az', 'az-Cyrl', 'az-Cyrl-AZ',
        'az-Latn', 'az-Latn-AZ', 'ba', 'ba-RU', 'be', 'be-BY', 'bg', 'bg-BG', 'bn', 'bn-BD',
        'bn-IN', 'bo', 'bo-CN', 'br', 'br-FR', 'bs', 'bs-Cyrl', 'bs-Cyrl-BA', 'bs-Latn',
        'bs-Latn-BA', 'ca', 'ca-ES', 'co', 'co-FR', 'cs', 'cs-CZ', 'cy', 'cy-GB', 'da', 'da-DK',
        'de', 'de-AT', 'de-CH', 'de-DE', 'de-LI', 'de-LU', 'dsb', 'dsb-DE', 'dv', 'dv-MV', 'el',
        'el-GR', 'en', 'en-029', 'en-AU', 'en-BZ', 'en-CA', 'en-GB', 'en-IE', 'en-IN', 'en-JM',
        'en-MY', 'en-NZ', 'en-PH', 'en-SG', 'en-TT', 'en-US', 'en-ZA', 'en-ZW', 'es', 'es-AR',
        'es-BO', 'es-CL', 'es-CO', 'es-CR', 'es-DO', 'es-EC', 'es-ES', 'es-GT', 'es-HN', 'es-MX',
        'es-NI', 'es-PA', 'es-PE', 'es-PR', 'es-PY', 'es-SV', 'es-US', 'es-UY', 'es-VE', 'et',
        'et-EE', 'eu', 'eu-ES', 'fa', 'fa-IR', 'fi', 'fi-FI', 'fil', 'fil-PH', 'fo', 'fo-FO', 'fr',
        'fr-BE', 'fr-CA', 'fr-CH', 'fr-FR', 'fr-LU', 'fr-MC', 'fy', 'fy-NL', 'ga', 'ga-IE', 'gd',
        'gd-GB', 'gl', 'gl-ES', 'gsw', 'gsw-FR', 'gu', 'gu-IN', 'ha', 'ha-Latn', 'ha-Latn-NG',
        'he', 'he-IL', 'hi', 'hi-IN', 'hr', 'hr-BA', 'hr-HR', 'hsb', 'hsb-DE', 'hu', 'hu-HU', 'hy',
        'hy-AM', 'id', 'id-ID', 'ig', 'ig-NG', 'ii', 'ii-CN', 'is', 'is-IS', 'it', 'it-CH', 'it-IT',
        'iu', 'iu-Cans', 'iu-Cans-CA', 'iu-Latn', 'iu-Latn-CA', 'ja', 'ja-JP', 'ka', 'ka-GE', 'kk',
        'kk-KZ', 'kl', 'kl-GL', 'km', 'km-KH', 'kn', 'kn-IN', 'ko', 'ko-KR', 'kok', 'kok-IN', 'ky',
        'ky-KG', 'lb', 'lb-LU', 'lo', 'lo-LA', 'lt', 'lt-LT', 'lv', 'lv-LV', 'mi', 'mi-NZ', 'mk',
        'mk-MK', 'ml', 'ml-IN', 'mn', 'mn-Cyrl', 'mn-MN', 'mn-Mong', 'mn-Mong-CN', 'moh', 'moh-CA',
        'mr', 'mr-IN', 'ms', 'ms-BN', 'ms-MY', 'mt', 'mt-MT', 'nb', 'nb-NO', 'ne', 'ne-IN', 'ne-NP',
        'nl', 'nl-BE', 'nl-NL', 'nn', 'nn-NO', 'no', 'nso', 'nso-ZA', 'oc', 'oc-FR', 'or', 'or-IN',
        'pa', 'pa-IN', 'pl', 'pl-PL', 'prs', 'prs-AF', 'ps', 'ps-AF', 'pt', 'pt-BR', 'pt-PT', 'qut',
        'qut-GT', 'quz', 'quz-BO', 'quz-EC', 'quz-PE', 'rm', 'rm-CH', 'ro', 'ro-RO', 'ru', 'ru-RU',
        'rw', 'rw-RW', 'sa', 'sa-IN', 'sah', 'sah-RU', 'se', 'se-FI', 'se-NO', 'se-SE', 'si', 'si-LK',
        'sk', 'sk-SK', 'sl', 'sl-SI', 'sma', 'sma-NO', 'sma-SE', 'smj', 'smj-NO', 'smj-SE', 'smn',
        'smn-FI', 'sms', 'sms-FI', 'sq', 'sq-AL', 'sr', 'sr-Cyrl', 'sr-Cyrl-BA', 'sr-Cyrl-CS',
        'sr-Cyrl-ME', 'sr-Cyrl-RS', 'sr-Latn', 'sr-Latn-BA', 'sr-Latn-CS', 'sr-Latn-ME', 'sr-Latn-RS',
        'sv', 'sv-FI', 'sv-SE', 'sw', 'sw-KE', 'syr', 'syr-SY', 'ta', 'ta-IN', 'te', 'te-IN', 'tg',
        'tg-Cyrl', 'tg-Cyrl-TJ', 'th', 'th-TH', 'tk', 'tk-TM', 'tn', 'tn-ZA', 'tr', 'tr-TR', 'tt',
        'tt-RU', 'tzm', 'tzm-Latn', 'tzm-Latn-DZ', 'ug', 'ug-CN', 'uk', 'uk-UA', 'ur', 'ur-PK', 'uz',
        'uz-Cyrl', 'uz-Cyrl-UZ', 'uz-Latn', 'uz-Latn-UZ', 'vi', 'vi-VN', 'wo', 'wo-SN', 'xh', 'xh-ZA',
        'yo', 'yo-NG', 'zh', 'zh-CN', 'zh-HK', 'zh-MO', 'zh-SG', 'zh-TW', 'zu', 'zu-ZA'
    ];

    const randomIndex = Math.floor(Math.random() * languages.length);
    return languages[randomIndex];
}

function getRandomLatitude() {
    return Math.random() * (90 - (-90)) + (-90);
}

function getRandomLongitude() {
    return Math.random() * (180 - (-180)) + (-180);
}

function getRandomScreenWidth() {
    return Math.floor(Math.random() * (2560 - 320 + 1) + 320); // 320px - 2560px
}

function getRandomScreenHeight() {
    return Math.floor(Math.random() * (1600 - 240 + 1) + 240); // 240px - 1600px
}

let spoof = true

app.get('/n', async (req, res) => {
    const client = clientx[clientIndex];
    clientIndex = (clientIndex + 1) % clientx.length;

    if (client) {
        try {
            console.log(clientIndex, req.query.req)

            if (spoof) {
                // spoof driver canvas each 5 HSW to avoid CPU GO BRRR
               await client.evaluate((language, latitude, longitude, width, height) => {
                        const originalFunction = HTMLCanvasElement.prototype.toDataURL;
                        HTMLCanvasElement.prototype.toDataURL = function (type) {
                            if (type === 'image/png') {
                                const canvas = document.createElement('canvas');
                                const ctx = canvas.getContext('2d');
                                const width = Math.floor(Math.random() * 100) + 200;
                                const height = Math.floor(Math.random() * 30) + 20;

                                canvas.width = width;
                                canvas.height = height;

                                const isColor = Math.random() < 0.5;
                                if (isColor) {
                                    const r = Math.floor(Math.random() * 256);
                                    const g = Math.floor(Math.random() * 256);
                                    const b = Math.floor(Math.random() * 256);
                                    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                                    ctx.fillRect(0, 0, width, height);
                                } else {
                                    const patternCanvas = document.createElement('canvas');
                                    const patternCtx = patternCanvas.getContext('2d');
                                    patternCanvas.width = 10;
                                    patternCanvas.height = 10;
                                    patternCtx.fillStyle = '#000000';
                                    patternCtx.fillRect(0, 0, 10, 10);
                                    patternCtx.fillStyle = '#FFFFFF';
                                    patternCtx.fillRect(0, 0, 5, 5);
                                    patternCtx.fillRect(5, 5, 5, 5);
                                    ctx.fillStyle = ctx.createPattern(patternCanvas, 'repeat');
                                    ctx.fillRect(0, 0, width, height);
                                }

                                return canvas.toDataURL('image/png');
                            }
                            return originalFunction.apply(this, arguments);
                        };

                        // lang
                         document.documentElement.setAttribute('lang', language);
 
                         window.innerWidth = width;
                         window.innerHeight = height;
                         window.width = width
                         window.height = height
                         
                         // geo
                         navigator.geolocation.getCurrentPosition = (successCallback) => {
                             const position = {
                                 coords: {
                                     latitude: latitude,
                                     longitude: longitude,
                                 },
                             };
                             successCallback(position);
                         };
 
                         // rects
                         const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
                         Element.prototype.getBoundingClientRect = function () {
                             const rect = originalGetBoundingClientRect.call(this);
 
                             rect.x += 100;
                             rect.y += 50;
 
                             const maxCoordinate = 1000;
                             if (rect.x > maxCoordinate || rect.y > maxCoordinate || rect.width > maxCoordinate || rect.height > maxCoordinate) {
                                 rect.x = 0;
                                 rect.y = 0;
                                 rect.width = 0;
                                 rect.height = 0;
                             }
 
                             return rect;
                         };


                    }, getRandomLanguage(), getRandomLatitude(), getRandomLongitude(), getRandomScreenWidth(), getRandomScreenHeight())
                
            }
            //let n = await client.evaluate((token) => { return hsw(token) }, req.query.req);
            let n = await client.evaluate(`1;\nhsw("${req.query.req}")`);

            res.send(n);
        } catch (err) {
            console.log(err)
            res.send(err);
            let index = clientx.indexOf(client);
            if (index > -1) {
                clientx.splice(index, 1);
            }
        }
    } else {
        res.send('- No available browsers');
    }
});

app.get('/workers', (req, res) => {
    res.send({ "success": true, "browsers": clientx.length });
});

app.listen(config.server_port, '0.0.0.0', () => {
    console.log(`+ Server open on port ${config.server_port}`);
});

process.on('SIGINT', safeExit);

async function startBrowser(client) {
    try {
        const G = new (await GoLogin).GoLogin({ token: config.token });
        const memCount = ['6', '8', '16'];
        const randomMem = memCount[Math.floor(Math.random() * memCount.length)];

        /*
            os:
            mac, win, lin

            audioContext:
            mode: noise, off

            canvas:
            mode: noise, block, off

            webRTC:
            mode: alerted, disabled, real

            webGL:
            mode: noise, off

            clientRects:
            mode: noise, off

            webGLMetadata:
            mode: mask, off
            */

        const profile_id = await G.create({
            name: 'profile_win',
            os: 'win',
            navigator: {
                language: 'fr-FR', // dont change
                resolution: '1920x1080',//`${getRandomScreenWidth()}x${getRandomScreenHeight()}`,
                platform: 'Win32',
                userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0 Safari/537.36",
                hardwareConcurrency: randomMem,
                deviceMemory: randomMem,
                maxTouchPoints: 0,
            },
            proxyEnabled: false,
            proxy: {
                mode: 'none'
            },
            audioContext: {
                mode: 'noise'
            },
            canvas: {
                mode: 'noise'
            },
            webRTC: {
                mode: 'disabled'
            },
            webGL: {
                mode: 'noise'
            },
            clientRects: {
                mode: 'noise'
            },
            webGLMetadata: {
                mode: 'mask'
            },
            fonts: { "families": ["string"], "enableMasking": true, "enableDomRect": true }
        });

        console.log('+ New profile:', profile_id);

        const GL = new (await GoLogin).GoLogin({
            token: config.token,
            profile_id,
            extra_params: config.browser_args,
            autoUpdateBrowser: false,
            fontsMasking: true
        });

        const { status, wsUrl } = await GL.start().catch((e) => {
            console.trace(e);
            return { status: 'failure' };
        });

        if (status !== 'success') {
            console.log('Invalid status');
            return;
        }

        const browser = await connect({ browserWSEndpoint: wsUrl.toString(), ignoreHTTPSErrors: true });

        const pages = await browser.pages();
        const page = pages[0];
        await page.emulateTimezone('Europe/London')
        await page.setViewport({ width: 1920, height: 1080 });
        const cursor = createCursor(page)

        // Fuck the rate limit XD
        await page.setRequestInterception(true);
        page.on('request', (request) => {
            if (request.url() === 'https://discord.com/api/v9/auth/register') {
                request.respond({
                    status: 400,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        "captcha_key": ["captcha-required"],
                        "captcha_sitekey": "4c672d35-0701-42b2-88c3-78380b0db560",
                        "captcha_service": "hcaptcha"
                    })
                });
            } else {
                request.continue();
            }
        });

        await page.goto('https://discord.com');
        await page.waitForSelector('#app-mount > div > div > div.grid-3d2PVT.heroBackground-itJzsn > div.row-31oovZ.heroContainer-3YphMz > div > div.ctaContainer-5100Xg > button');

        await page.click('#app-mount > div > div > div.grid-3d2PVT.heroBackground-itJzsn > div.row-31oovZ.heroContainer-3YphMz > div > div.ctaContainer-5100Xg > button');

        // tos checkbox sometimes dont spawn
        try {
            await page.click('#app-mount > div > div > div.grid-3d2PVT.heroBackground-itJzsn > div.row-31oovZ.heroContainer-3YphMz > div > div.formContainer-1Mw7aR > div > div > div');
        } catch (err) {
            console.log(err)
        }

        await page.type('#app-mount > div > div > div.grid-3d2PVT.heroBackground-itJzsn > div.row-31oovZ.heroContainer-3YphMz > div > div.formContainer-1Mw7aR > form > input', 'ifuckdiscordtosuwu', { delay: 10 });
        await page.click('#app-mount > div > div > div.grid-3d2PVT.heroBackground-itJzsn > div.row-31oovZ.heroContainer-3YphMz > div > div.formContainer-1Mw7aR > form > button > img');

        console.log('* Waiting for hcaptcha frame');
        await delay(1500)


        await page.waitForXPath(`//iframe[contains(@title,'Widget contenant une case à cocher pour le défi de sécurité hCaptcha')]`, { timeout: 10000 })
        //await cursor.click(`//iframe[contains(@title,'Widget contenant une case à cocher pour le défi de sécurité hCaptcha')]`)
        await (await page.$x(`//iframe[contains(@title,'Widget contenant une case à cocher pour le défi de sécurité hCaptcha')]`))[0].click()

        console.log('+ Hcaptcha challenge ok, looking for iframe');

        let hswExists = false;
        let challengeFrame;

        while (!hswExists) {
            const frames = await page.frames();

            for (const frame of frames) {
                try {
                    hswExists = await frame.evaluate(() => typeof hsw !== 'undefined');

                    if (hswExists) {
                        challengeFrame = frame;
                        break;
                    }
                } catch (err) {
                    console.error('Error checking hsw function:', err);
                }
            }

            if (!hswExists) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        if (hswExists && challengeFrame) {
            console.log('+ Browser successfully hooked');
            clientx.push(challengeFrame);
            await page.mouse.move(Math.random() * 100, Math.random() * 100);
        }

        setInterval(async () => {
            let index = clientx.indexOf(challengeFrame);
            if (index > -1) {
                clientx.splice(index, 1);
            }

            console.log('Restarting browser...');

            await browser.close();
            await GL.stop();
            await GL.delete(profile_id);

            startBrowser(client);
        }, (config.refresh_browser_minutes * 60 * 1000));
    } catch (err) {
        console.log(err);
    }
}

(async () => {
    for (let i = 0; i <= config.browser_amount; i++) {
        clients.push(8000 + i);
    }

    console.log(`+ WebSocket servers running on port https://127.0.0.1:${config.server_port}`);

    for (const [index, client] of clients.entries()) {
        setTimeout(() => startBrowser(client), 1);
    }
})();