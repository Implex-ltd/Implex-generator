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
const memCount = ['6', '8', '16'];

export const getRandomLatitude = () => {
    return Math.random() * (90 - (-90)) + (-90);
};

export const getRandomLongitude = () => {
    return Math.random() * (180 - (-180)) + (-180);
};

export const getRandomScreenWidth = () => {
    return Math.floor(Math.random() * (2560 - 320 + 1) + 320); // 320px - 2560px
};

export const getRandomScreenHeight = () => {
    return Math.floor(Math.random() * (1600 - 240 + 1) + 240); // 240px - 1600px
};

export const getRandomLanguage = () => {
    const randomIndex = Math.floor(Math.random() * languages.length);
    return languages[randomIndex];
};

export const getRandomMemory = () => {
    const randomMem = memCount[Math.floor(Math.random() * memCount.length)];
    return randomMem;
};

export const delay = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time));
};
