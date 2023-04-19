/*
Tests for Board Functions
*/
import { initBoard, createAutomergeBoard } from "../src/board";

describe("Board Functions", () => {
    test("initBoard", () => {
        const board = initBoard(40);
        expect(board.pixels.length).toBe(40 * 40);
        expect(board.pixels[0]).toBe(0);
        expect(board.pixels[40 * 40 - 1]).toBe(0);
    });
    
    test("createAutomergeBoard", () => {
        const board = createAutomergeBoard(40);
        expect(board.pixels.length).toBe(40 * 40);
        expect(board.pixels[0]).toBe(0);
        expect(board.pixels[40 * 40 - 1]).toBe(0);
    });
}