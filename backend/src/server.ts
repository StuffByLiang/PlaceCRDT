import { createAutomergeBoard } from "./board";
import * as Automerge from "@automerge/automerge";
import fs from "fs";
import { Board } from "./types";

const express = require('express');
const app = express();
const cors = require('cors')
app.use(cors())
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
    // add localhost and https://placecrdt.stuffbyliang.com as origin too
    cors: {
        origin: ["http://localhost:3000", "https://placecrdt.stuffbyliang.com"],
    }
});

let board: Board;

if (fs.existsSync('board')) {
    const boardBinary = fs.readFileSync('board');
    board = Automerge.load(new Uint8Array(boardBinary));
    console.log("loaded board of size " + boardBinary.length)
} else {
    board = createAutomergeBoard(40);

}
let counter = 0;

io.on('connection', (socket: any) => {
    console.log('a user connected');
    socket.emit('board', { boardBinary: Automerge.save(board) }); // send initial board

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('board', ({ boardBinary }: any) => {
        counter++;
        const otherBoard: any = Automerge.load(new Uint8Array(boardBinary));
        console.log("received board of size     " + boardBinary.length)
        board = Automerge.merge(board, otherBoard);

        // save board every 10 merges
        if (counter % 10 === 0) {
            console.log("saving board to disk" + Automerge.save(board).length)
            fs.writeFileSync('board', Automerge.save(board));
        }

        // broadcast to all clients the merged board
        io.emit('board', { boardBinary: Automerge.save(board) });
    });
});

server.listen(4161, () => {
    console.log('listening on *:4161');
});