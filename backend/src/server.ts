import { createAutomergeBoard } from "./board";
import * as Automerge from "@automerge/automerge";

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


let board = createAutomergeBoard(40);

io.on('connection', (socket: any) => {
    console.log('a user connected');
    socket.emit('board', { boardBinary: Automerge.save(board) }); // send initial board

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('board', ({ boardBinary }: any) => {
        const otherBoard: any = Automerge.load(new Uint8Array(boardBinary));
        console.log("received board of size     " + boardBinary.length)
        board = Automerge.merge(board, otherBoard);
        // broadcast to all clients the merged board
        io.emit('board', { boardBinary: Automerge.save(board) });
    });
});

server.listen(4161, () => {
    console.log('listening on *:4161');
});