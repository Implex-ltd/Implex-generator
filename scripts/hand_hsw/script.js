/**
 * Inject to browser
 * Go to discord.com -> trigger hcaptcha (click on checkbox) -> F12 -> console -> select hcaptcha iframe where `hsw` is defined and put this file (be sure that server.js is online)
 */

const se = new WebSocket("ws:/127.0.0.1:3200");
const originalFunction = HTMLCanvasElement.prototype.toDataURL;

var i = 0

se.onmessage = async (message) => {
  const payload = JSON.parse(message.data);

  const reply = {
    type: "solved",
    token: ""
  };

  try {
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
    reply.token = await hsw(payload.solve);
  } catch (err) {
    reply.type = "failed";
    reply.token = err.message
  } finally {
    se.send(JSON.stringify(reply));
  }
};
