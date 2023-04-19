import { createAutomergeBoard } from "./board";
import * as Automerge from "@automerge/automerge";
import fs from "fs";
import { Board } from "./types";
import { Socket } from "socket.io";

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
    console.log("created board of size " + Automerge.save(board).length)
}
let counter = 0;

// global variables (but maybe don't use global variables)
let syncStates: { [key: string]: Automerge.SyncState } = {} // a hash of [socketId] containing in-memory sync states

io.on('connection', (socket: Socket) => {
    function updatePeers(initiatorSockedId: string) {
        console.log("updating peers")
        Object.entries(syncStates).forEach(([socketId, syncState]) => {
            const [nextSyncState, syncMessage] = Automerge.generateSyncMessage(
                board,
                syncState
            )
            console.log("sending sync message of size " + syncMessage?.length)
            syncStates[socketId] = nextSyncState
            if (syncMessage) {
                io.to(socketId).emit('sync', { syncMessage })
            } else if (socketId === initiatorSockedId) {
                io.to(socketId).emit('synced')
            }
        })
    }

    console.log('a user connected');
    syncStates[socket.id] = Automerge.initSyncState();

    socket.on('disconnect', () => {
        console.log('user disconnected');
        delete syncStates[socket.id];
    });

    socket.on('sync', ({ syncMessage }: any) => {
        counter++;
        console.log(syncMessage)
        console.log("received sync message of size " + syncMessage.length)
        const syncState = syncStates[socket.id];
        const [nextBoard, nextSyncState, patch] = Automerge.receiveSyncMessage(board, syncState, syncMessage);
        board = nextBoard;
        console.log("board is now of size " + Automerge.save(board).length)
        syncStates[socket.id] = nextSyncState;
        updatePeers(socket.id);
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