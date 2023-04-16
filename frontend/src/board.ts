// board.ts
import * as Automerge from "@automerge/automerge";
import { Board, Color, Pixel } from "./types";
import localforage from "localforage";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const url = process.env.NODE_ENV === "development" ? "localhost:4161" : "https://placecrdtbackend.stuffbyliang.com";

let board: Automerge.Doc<Board> = createAutomergeBoard(40);
const socket = io(url, {
  autoConnect: false
});

export function useBoard() {
  const [canvasData, setCanvasData] = useState(getCanvasData());
  const [syncedWithServer, setSyncedWithServer] = useState(false);

  useEffect(() => {
    loadBoard();
    socket.connect();

    socket.on("board", ({ boardBinary }: any) => {
      console.log("board received")
      const otherBoard: any = Automerge.load(new Uint8Array(boardBinary));
      let newBoard = Automerge.merge(board, otherBoard)
      board = newBoard;
      let newbinary = Automerge.save(newBoard)
      localforage.setItem("board", newbinary).catch(err => console.log(err))
      setCanvasData(getCanvasData());
      setSyncedWithServer(true);
    })

    // check for disconnect
    socket.on("disconnect", () => {
      console.log("disconnected")
      setSyncedWithServer(false);
    })
  }, []);

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

  // Set the color of a pixel at the specified position
  function setColor(x: number, y: number, color: Color) {
    // time this change
    const newBoard = Automerge.change(board, `Set color at (${x}, ${y})`, (board) => {
      board.pixels[y][x].color = color;
    });
    updateBoard(newBoard);
    socket.emit("board", { boardBinary: Automerge.save(newBoard) });
    console.log("board sent")
  }

  return { canvasData: getCanvasData(), setColor, syncedWithServer };
}


// Initialize an empty board
export function initBoard(size: number): Board {
  const pixels: Pixel[][] = Array.from({ length: size }, (_, i) =>
    Array.from({ length: size }, (_, j) => ({
      position: [i, j],
      color: "#ffffff", // Default color: white
    }))
  );
  return { pixels };
}

// Get the current color of a pixel at the specified position
export function getColor(x: number, y: number): Color {
  return board.pixels[y][x].color;
}

// Initialize an Automerge document with a new board
export function createAutomergeBoard(size: number): Automerge.Doc<Board> {
  const board = initBoard(size);
  return Automerge.from(board);
}

export function getCanvasData(): string[][] {
  return board.pixels.map(row => row.map(pixel => pixel.color))
}

// export function updateBoard(newBoard: Automerge.Doc<Board>): Automerge.Doc<Board> {
//   return Automerge.change(newBoard, (doc) => {
//     doc.pixels = newBoard.pixels;
//   });
// }