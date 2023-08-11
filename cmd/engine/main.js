import express from 'express';
import { delay, getRandomLanguage, getRandomScreenHeight, getRandomScreenWidth } from './lib/utils.js';
import { createProfile } from './lib/wrapper.js';
import path from './lib/path.js';
import config from './config.json'assert { type: "json" };

const app = express();
let browser_pool = [];
let browserId = 0

async function startBrowser(thread_id) {
    try {
        const response = await createProfile();

        if (!response.success) {
            console.log(`[#${thread_id}] [-] Failed to launch engine`);
            return
        }

        const page = await response.browser.newPage();

        await page.setViewport({
            width: response.x,
            height: response.y
        });

        await page.setRequestInterception(true);
        page.on('request', (request) => {
            switch (request.url()) {
                case 'https://discord.com/api/v9/auth/register':
                    request.respond({
                        status: 400,
                        contentType: 'application/json',
                        body: JSON.stringify({
                            "captcha_key": ["captcha-required"],
                            "captcha_sitekey": "4c672d35-0701-42b2-88c3-78380b0db560",
                            "captcha_service": "hcaptcha"
                        })
                    });
                    break;
                default:
                    request.continue()
            }
        });

        await page.goto('https://discord.com');

        await page.waitForSelector(path.login_button, { visible: true, timeout: 10000 });
        await page.click(path.login_button);

        try {
            await page.click(path.checkbox_tos);
        } catch { };

        await page.type(path.username_input, 'ifuckdiscordtosuwu', { delay: 10 });
        await page.click(path.submit);
        await delay(1500)

        console.log(`[#${thread_id}] [*] Waiting for hcaptcha frame`);
        await page.waitForXPath(path.frame, { timeout: 15000 });

        const box = { x: 869.5, y: 536.875, width: 109.21875, height: 19 }
        page.mouse.click(box.x + box.width, box.y + box.height)
        await (await page.$x(path.frame))[0].click()

        console.log(`[#${thread_id}] [+] Hcaptcha challenge ok, looking for iframe`);

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
                await delay(1000);
            }
        }

        if (hswExists && challengeFrame) {
            console.log(`[#${thread_id}] [+] Browser successfully hooked`);
            browser_pool.push(challengeFrame);
        }

        setInterval(async () => {
            let index = browser_pool.indexOf(challengeFrame);
            if (index > -1) {
                browser_pool.splice(index, 1);
            }

            console.log(`[#${thread_id}] [*] Restarting browser`);

            await response.browser.close();
            startBrowser(thread_id);
        }, (config.refresh_browser_minutes * 60 * 1000));
    } catch (err) {
        console.log(err)
    }
}

app.get('/n', async (req, res) => {
    const client = browser_pool[browserId];
    browserId = (browserId + 1) % browser_pool.length;

    if (client) {
        console.log(browserId, req.query.req)
        try {
            res.send(
                await client.evaluate((jwt, lang, w, h) => {
                    // canvas
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

                        return HTMLCanvasElement.prototype.toDataURL.apply(this, arguments);
                    };

                    // dimmension
                    window.resizeTo(w, h);

                    // lang
                    document.documentElement.setAttribute('lang', lang);

                    // hsw
                    return hsw(jwt)
                }, req.query.req, getRandomLanguage(), getRandomScreenWidth(), getRandomScreenHeight())
            );
        } catch (err) {
            console.log(err)
            res.status(500).json({ error: 'cant run hsw' })

            let index = browser_pool.indexOf(client);
            if (index > -1) {
                browser_pool.splice(index, 1);
            }
        }
    } else {
        res.send('- No available browsers');
    }
});

(async () => {
    console.log(`+ WebSocket servers running on port https://127.0.0.1:${config.server_port}`);

    for (let i = 0; i <= config.browser_amount; i++) {
        setTimeout(() => startBrowser(i), 1);
    }

    app.listen(config.server_port, '0.0.0.0', () => {
        console.log(`+ Server open on port ${config.server_port}`);
    });
})();