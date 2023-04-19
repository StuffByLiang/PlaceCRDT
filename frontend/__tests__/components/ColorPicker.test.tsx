import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ColorPicker from '../../src/components/ColorPicker';

describe('ColorPicker', () => {
  // Picks the right color and set the state
  it('should pick the right color and trigger onSelectColor callback', () => {
    const colors = ['red', 'green', 'blue'];
    const onSelectColor = jest.fn();
    const { getByText } = render(<ColorPicker colors={colors} onSelectColor={onSelectColor} />);

    const redColorDiv = getByText((_, element) => {
        // Check if the element is an HTMLElement and if the backgroundColor is 'red'
        return element instanceof HTMLElement && element.style.backgroundColor === 'red';
    });    

    fireEvent.click(redColorDiv);

    expect(onSelectColor).toHaveBeenCalledTimes(1);
    expect(onSelectColor).toHaveBeenCalledWith('red');
  });
});
