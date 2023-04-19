import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import '@testing-library/jest-dom';
import PixelCanvas from '../../src/components/PixelCanvas';

describe('PixelCanvas', () => {
    // Renders the canvas with the right size
    it('should render the canvas with the right size', () => {
        const width = 40;
        const height = 40;
        const pixelSize = 16;
        const canvasData = Array.from({ length: height }, () => Array.from({ length: width }, () => 'red'));
        const onPixelClick = jest.fn();
        const { getByTestId } = render(
            <PixelCanvas
                width={width}
                height={height}
                pixelSize={pixelSize}
                canvasData={canvasData}
                onPixelClick={onPixelClick}
            />
        );

        const canvas = getByTestId('pixel-canvas');
        // console.log(canvas.style.width);
        // console.log(canvas.style.height);
        // console.log(canvas.style);
        expect(canvas).toHaveStyle(`width: ${width}px`);
        expect(canvas).toHaveStyle(`height: ${height}px`);
    });
});
