// board.ts
import * as Automerge from "@automerge/automerge";
import { Board } from "./types";
import localforage from "localforage";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export const colors = [
  "#ffffff", // white
  "#000000", // black
  "#c2c2c2", // light gray
  "#7f7f7f", // dark gray
  "#ff0000", // red
  "#00ff00", // green
  "#0000ff", // blue
  "#ffff00", // yellow
  "#ff00ff", // magenta
  "#00ffff", // cyan
  "#a349a4", // purple
  "#ffb5c5", // light pink
  "#ff7f00", // orange
  "#b87333", // brown
  "#4c2f27", // dark brown
];

// give us a mapping from color to uint8
export const colorToUint8 = colors.reduce((acc, color, i) => {
  acc[color] = i;
  return acc;
}, {} as { [color: string]: number });

// give us a mapping from uint8 to color
export const uint8ToColor = colors.reduce((acc, color, i) => {
  acc[i] = color;
  return acc;
}, {} as { [uint8: number]: string });

const url = process.env.NODE_ENV === "development" ? "localhost:4161" : "https://placecrdtbackend.stuffbyliang.com";

let board: Automerge.Doc<Board> = createAutomergeBoard(40);
const socket = io(url, {
  autoConnect: false
});

// array of size 1600
// given index, y = Math.floor(index / 40), x = index % 40 

export function useBoard() {
  const [canvasData, setCanvasData] = useState(getCanvasData());
  const [syncedWithServer, setSyncedWithServer] = useState(false);

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

    // check for disconnect
    socket.on("disconnect", () => {
      console.log("disconnected")
      setSyncedWithServer(false);
    })
  }, []);

  // Set the color of a pixel at the specified position
  function setColor(x: number, y: number, color: number) {
    console.log(x, y, color)
    // time this change
    const newBoard = Automerge.change(board, (board) => {
      board.pixels[y * 40 + x] = color;
      console.log(board.pixels)
    });
    console.log(newBoard.pixels)
    updateBoard(newBoard);
    socket.emit("board", { boardBinary: Automerge.save(newBoard) });
    console.log("board sent")
  }

  async function loadBoard() {
    const binary: any = await localforage.getItem("board");
    if (binary) {
      let newBoard = Automerge.merge(board, Automerge.load(binary))
      console.log("board loaded from local storage")
      updateBoard(newBoard);
    }
  }

  function updateBoard(newBoard: Automerge.Doc<Board>) {
    board = newBoard;
    let binary = Automerge.save(newBoard)
    localforage.setItem("board", binary).catch(err => console.log(err))
    setCanvasData(getCanvasData());
  }

  return { canvasData: getCanvasData(), setColor, syncedWithServer };
}


function initBoard(size: number): Board {
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
  for (let i = 0; i < 40; i++) {
    canvasData.push([]);
    for (let j = 0; j < 40; j++) {
      canvasData[i].push(uint8ToColor[board.pixels[i * 40 + j]]);
      if (board.pixels[i * 40 + j] != 0) {
        console.log(uint8ToColor[board.pixels[i * 40 + j]])
      }
    }
  }
  return canvasData;
}

// export function updateBoard(newBoard: Automerge.Doc<Board>): Automerge.Doc<Board> {
//   return Automerge.change(newBoard, (doc) => {
//     doc.pixels = newBoard.pixels;
//   });
// }