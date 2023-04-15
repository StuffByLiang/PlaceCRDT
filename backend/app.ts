// app.ts
import * as Automerge from "@automerge/automerge";
import { createAutomergeBoard, setColor, getColor } from "./board";

const main = () => {
  // Initialize a new Automerge document with a 100x100 pixel board
  let doc = createAutomergeBoard();

  // Set the color of the pixel at position (5, 5) to red
  doc = setColor(doc, 5, 5, [255, 0, 0]);

  // Get the color of the pixel at position (5, 5)
  const color = getColor(doc, 5, 5);
  console.log(color); // [255, 0, 0]
};

main();
