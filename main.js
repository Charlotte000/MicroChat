const express = require("express");
const { Server } = require('ws');

const PORT = process.env.PORT || 3000;

const app = express()
    .get('/', (req, res) => { res.send("HELlo"); })
    .listen(PORT, () => console.log(`Server started at ${PORT}`));


const wss = new Server({server: app});

let sessions = [];

wss.on('connection', ws => {
    console.log("Connected");
    let isConnected = false;
    for (let s of sessions) {
        if (s.length == 1) {
            s.push(ws);
            s[0].send('\x1b[36mSERVER >> Opponent joined the chat\x1b[37m');
            ws.send('\x1b[36mSERVER >> The opponent was found\x1b[37m');
            isConnected = true;
            break;
        }
    }
    if (!isConnected) {
        sessions.push([ws]);
        ws.send('\x1b[36mSERVER >> Wait for the opponent\x1b[37m');
    }

    ws.on('message', message => {
        for (let s of sessions) {
            if (s.length == 2 && s.includes(ws)) {
                s[(s.indexOf(ws) + 1) % 2].send(">> " + message);
            };
        }
    });

    ws.on('close', () => {
        for (let index in sessions) {
            if (sessions[index].includes(ws)) {
                sessions[index].splice(sessions[index].indexOf(ws), 1);
                if (sessions[index].length == 0) sessions.splice(index, 1);
                else sessions[index][0].send('\x1b[36mSERVER >> Opponent has left the chat\x1b[37m');
                console.log("Disconnect");
                break;
            }
        }
    });
});
