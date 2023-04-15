// types.ts
import { List } from "@automerge/automerge";

export type Color = [number, number, number]; // RGB color represented as an array of three numbers
export type Pixel = { position: [number, number], color: Color };
export type Board = { pixels: Pixel[][] };
