import React from 'react';

interface ColorPickerProps {
    colors: string[];
    onSelectColor: (color: string) => void;
    color: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ colors, onSelectColor, color: selectedColor }) => {
    const handleColorClick = (event: React.MouseEvent<HTMLDivElement>) => {
        const color = event.currentTarget.dataset.color;
        if (color) {
            onSelectColor(color);
        }
    };

    return (
        <div className="ColorPicker">
            {colors.map((color) => (
                <div
                    key={color}
                    className="ColorPicker-color"
                    style={{ backgroundColor: color, border: color === selectedColor ? '2px solid black' : 'none' }}
                    data-color={color}
                    onClick={handleColorClick}
                />
            ))}
        </div>
    );
};

export default ColorPicker;