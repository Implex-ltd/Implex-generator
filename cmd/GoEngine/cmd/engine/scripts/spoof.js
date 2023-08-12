let resolution = "1920x1080"
let userAgent = navigator.userAgent
let platform = "Win32"


Object.defineProperty(window, 'MediaStreamTrack', {
    get: function () {
        return undefined;
    }
});

Object.defineProperty(window, 'RTCPeerConnection', {
    get: function () {
        return undefined;
    }
});

Object.defineProperty(window, 'RTCSessionDescription', {
    get: function () {
        return undefined;
    }
});

Object.defineProperty(window, 'webkitMediaStreamTrack', {
    get: function () {
        return undefined;
    }
});

Object.defineProperty(window, 'webkitRTCPeerConnection', {
    get: function () {
        return undefined;
    }
});

Object.defineProperty(window, 'webkitRTCSessionDescription', {
    get: function () {
        return undefined;
    }
});

Object.defineProperty(window.navigator, 'getUserMedia', {
    get: function () {
        return undefined;
    }
});

Object.defineProperty(window.navigator, 'webkitGetUserMedia', {
    get: function () {
        return undefined;
    }
});


Object.defineProperty(window.navigator, 'hardwareConcurrency', {
    get: function () {
        return 16;
    }
});

Object.defineProperty(window.navigator, 'deviceMemory', {
    get: function () {
        return 8;
    }
});

Object.defineProperty(window.navigator, 'userAgent', {
    get: function () {
        return userAgent;
    }
});

Object.defineProperty(window.navigator, 'platform', {
    get: function () {
        return platform;
    }
});

Object.defineProperty(window.navigator, 'appName', {
    get: function () {
        return 'Netscape';
    }
});

Object.defineProperty(window.navigator, 'appVersion', {
    get: function () {
        return userAgent.substring(userAgent.indexOf('/') + 1, userAgent.length);
    }
});




delete Object.getPrototypeOf(navigator).webdriver;

// Set window.ContentIndex
window.ContentIndex = 42;

// ContactsManager
const ContactsManager = {
    contacts: [],

    addContact: function (name, email) {
        this.contacts.push({ name, email });
    },

    getContacts: function () {
        return this.contacts;
    }
};

window.ContactsManager = ContactsManager;

// Check and modify NetworkInformation prototype
const networkInfoPrototype = window.NetworkInformation?.prototype || {};
networkInfoPrototype.downlinkMax = 100;

if (window.NetworkInformation) {
    window.NetworkInformation.prototype = networkInfoPrototype;
}

// canvas
const canvas = document.createElement('canvas');
canvas.width = 220;
canvas.height = 30;
const ctx = canvas.getContext('2d');

for (let x = 0; x < canvas.width; x++) {
    for (let y = 0; y < canvas.height; y++) {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(x, y, 1, 1);
    }
}

const randomDataURL = canvas.toDataURL('image/png');
const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;

// Override the toDataURL method for specific dimensions
HTMLCanvasElement.prototype.toDataURL = function (type) {
    if (type === 'image/png' && this.width === 220 && this.height === 30) {
        return randomDataURL;
    }
    return originalToDataURL.apply(this, arguments);
};