/**
 * npm i ws express
 * node server.js
 * -> inject script.js (how many browser as you want)
 * -> edit config.toml hsw server port to 3030
 */

const Websocket = require('ws');
const { EventEmitter } = require('events');

const app = require('express')();

class SocketListener extends EventEmitter {
    constructor() {
        super();

        this.clients = [];
        this.clientIndex = 0;

        this.server = new Websocket.Server({
            port: 3200
        });
    }

    async start() {
        this.server.on('connection', (socket) => {
            console.log('Connected');
            this.clients.push(socket);

            socket.on('message', (data) => this.emit('resolve', socket, data));

            this.emit('ready');
        });
    }

    send(socket, data) {
        socket.send(JSON.stringify(data));
    }

    getNextClient() {
        if (this.clients.length > 0) {
            const nextClient = this.clients[this.clientIndex];
            this.clientIndex = (this.clientIndex + 1) % this.clients.length;
            return nextClient;
        }
        return undefined;
    }
}

const Client = new SocketListener();

app.get('/n', async (req, res) => {
    const nextClient = Client.getNextClient();
    if (nextClient) {
        const responsePromise = new Promise((resolve) => {
            nextClient.once('message', (data) => {
                const parsedData = JSON.parse(data);
                resolve(parsedData.token);
            });
        });

        Client.send(nextClient, {
            solve: req.query.req
        });

        const response = await responsePromise;
        res.send(response);
    } else {
        res.send('No available clients');
    }
});

app.listen(3030, async () => {
    await Client.start();
});
