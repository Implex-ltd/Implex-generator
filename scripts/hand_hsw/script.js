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
    // Generate a random number to add noise
    function generateNoise() {
      return Math.random() * 2 - 1; // Generates a random number between -1 and 1
    }

    // Modify the CanvasRenderingContext2D prototype to add noise
    function addNoiseToCanvas() {
      const originalFillText = CanvasRenderingContext2D.prototype.fillText;

      CanvasRenderingContext2D.prototype.fillText = function (text, x, y, maxWidth) {
        x += generateNoise();
        y += generateNoise();
        originalFillText.call(this, text, x, y, maxWidth);
      };
    }

    // Call the function to add noise to canvas rendering
    addNoiseToCanvas();


    reply.token = await hsw(payload.solve);
  } catch (err) {
    reply.type = "failed";
    reply.token = err.message
  } finally {
    se.send(JSON.stringify(reply));
  }
};
