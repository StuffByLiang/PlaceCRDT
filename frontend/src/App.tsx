import React, { useState } from 'react';
import './App.css';
import PixelCanvas from './components/PixelCanvas';
import ColorPicker from './components/ColorPicker';
import { useBoard } from './board';

const colors = [
  "#000000", // black
  "#ffffff", // white
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

function App() {
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const width = 40;
  const height = 40;
  const { canvasData, setColor, syncedWithServer } = useBoard();


  const handlePixelClick = (x: number, y: number) => {
    // update the canvas data in state
    setColor(x, y, selectedColor);
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };

  return (
    <div className="App">
      <h1>Place CRDT</h1>
      <div>made by Liang and Alex</div>
      {syncedWithServer ? (
        // green sycned with server
        <div style={{ color: 'green' }}>Synced with server</div>
      ) : (
        // red working locally
        <div style={{ color: 'red' }}>Working locally</div>
      )}
      <PixelCanvas
        width={width}
        height={height}
        pixelSize={16}
        canvasData={canvasData}
        onPixelClick={handlePixelClick}
      />
      <ColorPicker colors={colors} onSelectColor={handleColorSelect} />
    </div>
  );
}

export default App;