// app.ts
import * as Automerge from "@automerge/automerge";
// import * as assert from "assert";
import { createAutomergeBoard, setColor, getColor } from "./board";
import { Board } from "./types";
import { Doc } from "@automerge/automerge";

const main = () => {
    const noConflict = false;
    /* Non Conflicting Case */
    if (noConflict) {
    // Initialize a new Automerge document with a 100x100 pixel board for each player
        let doc1 = createAutomergeBoard();
        let doc2 = Automerge.merge(Automerge.init(), doc1) as Doc<Board>;
        //   let doc2 = createAutomergeBoard();

        // Simulate player 1 setting the color of the pixel at position (5, 5) to red
        doc1 = setColor(doc1, 5, 5, [255, 0, 0]);
        // Simulate player 2 setting the color of the pixel at position (10, 10) to blue
        doc2 = setColor(doc2, 10, 10, [0, 0, 255]);

        doc1 = Automerge.merge(doc1, doc2) as Doc<Board>;
        doc2 = Automerge.merge(doc2, doc1) as Doc<Board>;

        // Check if both documents have the same state after merging
        console.log("Both documents have the same state:", Automerge.equals(doc1, doc2));

        // Get the color of the pixel at position (5, 5) for each player
        const color1 = getColor(doc1, 5, 5);
        const color2 = getColor(doc2, 5, 5);
        console.log("Player 1 color at (5, 5):", color1); // [255, 0, 0]
        console.log("Player 2 color at (5, 5):", color2); // [255, 0, 0]

        // Get the color of the pixel at position (10, 10) for each player
        const color3 = getColor(doc1, 10, 10);
        const color4 = getColor(doc2, 10, 10);
        console.log("Player 1 color at (10, 10):", color3); // [0, 0, 255]
        console.log("Player 2 color at (10, 10):", color4); // [0, 0, 255]
    }
    /* Conflicting Case */
    else {
    // Initialize a new Automerge document with a 100x100 pixel board for each player
        let doc1 = createAutomergeBoard();
        let doc2 = Automerge.merge(Automerge.init(), doc1) as Doc<Board>;
        //   let doc2 = createAutomergeBoard();

        // Simulate player 1 setting the color of the pixel at position (5, 5) to red
        doc1 = setColor(doc1, 5, 5, [255, 0, 0]);
        // Simulate player 2 setting the color of the pixel at position (10, 10) to blue
        doc2 = setColor(doc2, 5, 5, [0, 0, 255]);

        doc1 = Automerge.merge(doc1, doc2) as Doc<Board>;
        doc2 = Automerge.merge(doc2, doc1) as Doc<Board>;

        // Check if both documents have the same state after merging
        console.log("Both documents have the same state:", Automerge.equals(doc1, doc2));

        // assert.deepEqual(doc1, doc2);
        console.log(Automerge.getConflicts(doc1, 'pixels[5][5].color'));
        console.log(Automerge.getConflicts(doc2, 'pixels[5][5].color'));

        // Get the color of the pixel at position (5, 5) for each player
        const color1 = getColor(doc1, 5, 5);
        const color2 = getColor(doc2, 5, 5);
        console.log("Player 1 color at (5, 5):", color1); // [255, 0, 0]
        console.log("Player 2 color at (5, 5):", color2); // [255, 0, 0]
    }
};

main();
