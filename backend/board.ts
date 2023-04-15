// board.ts
import * as Automerge from "@automerge/automerge";
import { Board, Color, Pixel } from "./types";
import { List } from "@automerge/automerge";

// Initialize an empty board
export function initBoard(): Board {
  const pixels: Pixel[][] = Array.from({ length: 100 }, (_, i) =>
    Array.from({ length: 100 }, (_, j) => ({
      position: [i, j],
      color: [255, 255, 255], // Default color: white
    }))
  );
  return { pixels };
}

// Set the color of a pixel at the specified position
export function setColor(doc: Automerge.Doc<Board>, x: number, y: number, color: Color): Automerge.Doc<Board> {
  return Automerge.change(doc, `Set color at (${x}, ${y})`, (doc) => {
    doc.pixels[x][y].color = color as unknown as List<number>;
  });
}

// Get the current color of a pixel at the specified position
export function getColor(doc: Automerge.Doc<Board>, x: number, y: number): Color {
  return doc.pixels[x][y].color;
}

// Initialize an Automerge document with a new board
export function createAutomergeBoard(): Automerge.Doc<Board> {
  const board = initBoard();
  return Automerge.from(board);
}
