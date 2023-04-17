import { Board, Color, Pixel } from "./types";
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
        origin: ["http://localhost:3000", "https://placecrdtfrontend.stuffbyliang.com"],
    }
});

// new Uint8Array() 17000 (ten times less) 1600
// uint8array of size 1600
// given index, y = Math.floor(index / 40), x = index % 40 
// 

let board = createAutomergeBoard(40);
// print out size of Automerge.save(board)
console.log(Automerge.save(board).length);

// Initialize an empty board
function initBoard(size: number): Board {
    const pixels = new Array(size * size).fill(0);
    return { pixels };
}

// Initialize an Automerge document with a new board
function createAutomergeBoard(size: number): Automerge.Doc<Board> {
    const board = initBoard(size);
    return Automerge.from(board);
}

io.on('connection', (socket: any) => {
    console.log('a user connected');
    socket.emit('board', { boardBinary: Automerge.save(board) }); // send initial board

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('board', ({ boardBinary }: any) => {
        const otherBoard: any = Automerge.load(new Uint8Array(boardBinary));
        console.log("received board of size" + boardBinary.length)
        board = Automerge.merge(board, otherBoard);
        // broadcast to all clients the merged board
        io.emit('board', { boardBinary: Automerge.save(board) });
    });
});

server.listen(4161, () => {
    console.log('listening on *:4161');
});