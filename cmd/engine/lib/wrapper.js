import { GoLogin } from 'gologin';
import config from '../config.json'assert { type: "json" };
import { getRandomScreenWidth, getRandomScreenHeight, getRandomMemory } from './utils.js';
import Puppeteer from "puppeteer-extra";
import Stealth from 'puppeteer-extra-plugin-stealth'
import Adblocker from 'puppeteer-extra-plugin-adblocker'

export const createProfile = async () => {
    let b = undefined
    let success = true;

    let x = 1920 //getRandomScreenWidth();
    let y = 1080 //getRandomScreenHeight();

    try {
        const profile_id = await new GoLogin({ token: config.token }).create({
            name: 'profile_win',
            os: 'win',
            navigator: {
                language: 'fr-FR',
                resolution: `${x}x${y}`,
                platform: 'Win32',
                userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0 Safari/537.36",
                hardwareConcurrency: getRandomMemory(),
                deviceMemory: getRandomMemory(),
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

        const GL = new GoLogin({
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

        let extra = Puppeteer
        extra.use(Stealth())
        extra.use(Adblocker({ blockTrackers: true }))

        const browser = await extra.connect({ browserWSEndpoint: wsUrl.toString(), ignoreHTTPSErrors: true });
        b = browser
    } catch (err) {
        console.log(err)
        success = false
    }

    return {
        browser: b,
        x: x,
        y: y,
        success: success
    };
};
