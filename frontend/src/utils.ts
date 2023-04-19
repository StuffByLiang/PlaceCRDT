/*
Util Functions
*/

// All the available colors - Max is 2^8 colours since Uint8
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

// Map from Color to uint8
export const colorToUint8 = colors.reduce((acc, color, i) => {
    acc[color] = i;
    return acc;
  }, {} as { [color: string]: number });

// Map from uint8 to Color
export const uint8ToColor = colors.reduce((acc, color, i) => {
    acc[i] = color;
    return acc;
  }, {} as { [uint8: number]: string });