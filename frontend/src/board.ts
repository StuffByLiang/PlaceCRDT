// board.ts
import * as Automerge from "@automerge/automerge";
import { Board } from "./types";
import localforage from "localforage";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { colorToUint8, uint8ToColor } from "./utils";

export const url = process.env.NODE_ENV === "development" ? "localhost:4161" : "https://placecrdtbackend.stuffbyliang.com";

let board: Automerge.Doc<Board>;
export const socket = io(url, {
  autoConnect: false
});
let syncState = Automerge.initSyncState(); // in-memory sync state


export function useBoard() {
  const [canvasData, setCanvasData] = useState(getCanvasData());
  const [syncedWithServer, setSyncedWithServer] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadBoard();
    socket.connect();

    socket.on("board", ({ boardBinary }: any) => {
      // receiving the board from the server
      const otherBoard: any = Automerge.load(new Uint8Array(boardBinary));
      let newBoard = Automerge.merge(board, otherBoard)
      updateBoard(newBoard);
      setSyncedWithServer(true);
    })

    // on reconnect
    socket.on("reconnect", () => {
      console.log("reconnected")
      syncBoard();
    })

    socket.on("synced", () => {
      console.log("synced")
      setSyncedWithServer(true);
    })

    socket.on("sync", ({ syncMessage }: any) => {
      // receiving the sync message from the server
      console.log("sync received")
      const [nextBoard, nextSyncState, patch] = Automerge.receiveSyncMessage(board, syncState, new Uint8Array(syncMessage));
      syncState = nextSyncState;
      updateBoard(nextBoard);
      let synced = syncBoard();
      if (synced) {
        setSyncedWithServer(true);
      }
    })

    // check for disconnect
    socket.on("disconnect", () => {
      console.log("disconnected")
      setSyncedWithServer(false);
    })
  }, []);

  function syncBoard() {
    const [nextSyncState, syncMessage] = Automerge.generateSyncMessage(board, syncState);
    syncState = nextSyncState;

    if (syncMessage) {
      socket.emit("sync", { syncMessage });
      console.log("sync sent")
      return false;
    } else {
      return true;
    }
  }

  // Set the color of a pixel at the specified position
  function setColor(x: number, y: number, color: number) {
    const newBoard = Automerge.change(board, (board) => {
      board.pixels[y * 40 + x] = color;
    });
    updateBoard(newBoard);
    syncBoard();

    // the following would send the entire board
    // socket.emit("board", { boardBinary: Automerge.save(newBoard) });
    // console.log("board sent")
  }

  async function loadBoard() {
    const binary: Uint8Array | null = await localforage.getItem("board");
    let newboard: Board;
    if (binary) {
      newboard = Automerge.merge(createAutomergeBoard(40), Automerge.load(binary));
      console.log("board loaded from local storage")
    } else {
      console.log("no board found in local storage")
      newboard = createAutomergeBoard(40);
    }
    setLoaded(true);
    updateBoard(newboard);
    syncBoard();
  }

  function updateBoard(newBoard: Automerge.Doc<Board>) {
    board = newBoard;
    //@ts-ignore
    window.board = board;
    let binary = Automerge.save(newBoard)
    localforage.setItem("board", binary).catch(err => console.log(err))
    setCanvasData(getCanvasData());
  }

  return { canvasData: getCanvasData(), setColor, syncedWithServer, loaded };
}


// Initialize an empty board
export function initBoard(size: number): Board {
  const pixels = new Array(size * size).fill(0);
  return { pixels };
}



// Initialize an Automerge document with a new board
export function createAutomergeBoard(size: number): Automerge.Doc<Board> {
  const board = initBoard(size);
  return Automerge.from(board);
}

export function getCanvasData(): string[][] {
  // given board.pixel array, return a 2d array of colors
  const canvasData: string[][] = [];

  if (!board) {
    return canvasData;
  }

  for (let i = 0; i < 40; i++) {
    canvasData.push([]);
    for (let j = 0; j < 40; j++) {
      canvasData[i].push(uint8ToColor[board.pixels[i * 40 + j]]);
    }
  }
  return canvasData;
}
