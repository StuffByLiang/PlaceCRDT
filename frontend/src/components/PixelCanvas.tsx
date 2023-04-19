import React, { useRef, useEffect } from 'react';

interface PixelCanvasProps {
  width: number;
  height: number;
  pixelSize: number;
  canvasData: string[][];
  onPixelClick: (x: number, y: number) => void;
}

const PixelCanvas = ({ width, height, pixelSize, canvasData, onPixelClick }: PixelCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWidth = width * pixelSize;
  const canvasHeight = height * pixelSize;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!canvas || !ctx) {
      return;
    }

    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    canvasData.forEach((row, y) => {
      row.forEach((color, x) => {
        ctx.fillStyle = color;
        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
      });
    });
  }, [canvasData, canvasHeight, canvasWidth, pixelSize]);

  return (
    <div className="PixelCanvas-container" style={{ width: canvasWidth, height: canvasHeight }}>
      <canvas
        className="PixelCanvas"
        data-testid="pixel-canvas"
        width={canvasWidth}
        height={canvasHeight}
        onClick={event => {
          const rect = event.currentTarget.getBoundingClientRect();
          const x = Math.floor((event.clientX - rect.left) / pixelSize);
          const y = Math.floor((event.clientY - rect.top) / pixelSize);
          onPixelClick(x, y);
        }}
        ref={canvasRef}
      />
    </div>
  );
};

export default PixelCanvas;