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
    cors: {
        origin: "https://placecrdt.stuffbyliang.com"
    }
});

let board = createAutomergeBoard(40);

// Initialize an empty board
function initBoard(size: number): Board {
    const pixels: Pixel[][] = Array.from({ length: size }, (_, i) =>
        Array.from({ length: size }, (_, j) => ({
            position: [i, j],
            color: "#ffffff", // Default color: white
        }))
    );
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

    // print hash of automerge.save(board)
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('board', ({ boardBinary }: any) => {
        const otherBoard: any = Automerge.load(new Uint8Array(boardBinary));
        console.log("received board")
        board = Automerge.merge(board, otherBoard);
        // broadcast to all clients the merged board
        io.emit('board', { boardBinary: Automerge.save(board) });
    });
});

server.listen(4161, () => {
    console.log('listening on *:4161');
});