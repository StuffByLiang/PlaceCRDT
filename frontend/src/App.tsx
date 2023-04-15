import React, { useState } from 'react';
import './App.css';
import PixelCanvas from './components/PixelCanvas';
import ColorPicker from './components/ColorPicker';

const colors = ['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff'];

function App() {
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const width = 40;
  const height = 40;
  const [canvasData, setCanvasData] = useState<string[][]>(Array(width).fill(Array(height).fill('#FFFFFF')));

  const handlePixelClick = (x: number, y: number) => {
    // create a copy of the canvas data so we can modify it
    const newData = canvasData.map(row => [...row]);

    // set the clicked pixel to the currently selected color
    newData[y][x] = selectedColor;

    // update the canvas data in state
    setCanvasData(newData);
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };

  return (
    <div className="App">
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