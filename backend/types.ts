// types.ts
import { List } from "@automerge/automerge";

export type Color = string; // RGB color represented as hex
export type Pixel = { position: [number, number], color: Color };
export type Board = { pixels: Array<number> };
