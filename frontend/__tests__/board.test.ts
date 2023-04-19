import {
    createAutomergeBoard,
    initBoard,
    getCanvasData,
    useBoard,
    // setColor,
    // updateBoard,
    url,
    socket
  } from "../src/board"
  import { renderHook, act } from "@testing-library/react-hooks";
//   import { io } from "socket.io-client";
  
  jest.mock("socket.io-client");
  
  describe("Board", () => {
    // beforeEach(() => {
    //   io.mockClear();
    // });
  
    it("should initialize a board with the given size", () => {
      const size = 40;
      const board = initBoard(size);
  
      expect(board.pixels.length).toBe(size * size);
      expect(board.pixels.every((pixel) => pixel === 0)).toBeTruthy();
    });
  
    it("should create an Automerge board with the given size", () => {
      const size = 40;
      const automergeBoard = createAutomergeBoard(size);
  
      expect(automergeBoard).toHaveProperty("pixels");
      expect(automergeBoard.pixels.length).toBe(size * size);
      expect(automergeBoard.pixels.every((pixel) => pixel === 0)).toBeTruthy();
    });
  
    it("should get canvas data from the board", () => {
      const canvasData = getCanvasData();
  
      expect(canvasData.length).toBe(40);
      canvasData.forEach((row) => {
        expect(row.length).toBe(40);
      });
    });
  
    // it("should use the correct URL and socket options", () => {
    //   expect(url).toBeTruthy();
    //   expect(socket).toBeTruthy();
    //   expect(socket.autoConnect).toBe(false);
    // });
  
    describe("useBoard", () => {
      it("should return the initial state", () => {
        const { result } = renderHook(() => useBoard());
  
        expect(result.current.canvasData).toEqual(getCanvasData());
        expect(result.current.setColor).toBeInstanceOf(Function);
        expect(result.current.syncedWithServer).toBe(false);
      });
  
      // TODO: Add more tests for socket events and interactions
    });
  
    // TODO: Add tests for setColor, updateBoard, and other socket-related functions
  });
  