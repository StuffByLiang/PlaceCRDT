/*
Board Functions
*/
import { Board } from "./types";
import * as Automerge from "@automerge/automerge";

// Initialize an empty board
export function initBoard(size: number): Board {
    const pixels = new Array(size * size/2).fill(0);
    return { pixels };
}

// Initialize an Automerge document with a new board
export function createAutomergeBoard(size: number): Automerge.Doc<Board> {
    const board = initBoard(size);
    return Automerge.from(board);
}