import React, { useState } from 'react';
import './App.css';
import PixelCanvas from './components/PixelCanvas';
import ColorPicker from './components/ColorPicker';
import { useBoard } from './board';
import { colorToUint8, uint8ToColor, colors } from './utils';

function App() {
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const width = 40;
  const height = 40;
  const { canvasData, setColor, syncedWithServer, loaded } = useBoard();


  const handlePixelClick = (x: number, y: number) => {
    if (!loaded) return;
    // update the canvas data in state
    setColor(x, y, colorToUint8[selectedColor]);
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };

  return (
    <div className="App">
      <h1>Place CRDT</h1>
      <div>made by Liang and Alex. <a href='https://github.com/StuffByLiang/PlaceCRDT'>Github Repo</a></div>
      {syncedWithServer ? (
        // green sycned with server
        <div style={{ color: 'green' }}>Synced with server</div>
      ) : (
        // red working locally
        <div style={{ color: 'red' }}>Working locally</div>
      )}
      {loaded ? (
        // green sycned with server
        <></>
      ) : (
        // red working locally
        <div style={{ color: 'red' }}>Loading...</div>
      )}
      <PixelCanvas
        width={width}
        height={height}
        pixelSize={16}
        canvasData={canvasData}
        onPixelClick={handlePixelClick}
      />
      <ColorPicker color={selectedColor} colors={colors} onSelectColor={handleColorSelect} />
    </div>
  );
}

export default App;