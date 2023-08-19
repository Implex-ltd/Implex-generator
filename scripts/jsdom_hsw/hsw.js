const fs      = require('fs')
const { JSDOM, ResourceLoader } = require("jsdom");

const hsw     = fs.readFileSync(__dirname + "/_.js", "utf-8");
let userAgent = `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36`

const {window}  = new JSDOM(``, {
    url                 : "https://discord.com",
    referrer            : "https://discord.com",
    contentType         : "text/html",
    includeNodeLocations: false,
    runScripts          : "outside-only",
    pretendToBeVisual   : true,
    resources           : new ResourceLoader({ userAgent })
});

__window__ = window;
__window__.eval(hsw)

const app = (require('express'))();


app.get('/n', async (req, res) => {
    __window__.test(req.query.req).then(function (result) {
        res.send(result);
    })
});

app.listen(4000, async () => {
    console.log('open')
});