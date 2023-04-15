import React from 'react';

interface ColorPickerProps {
    colors: string[];
    onSelectColor: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ colors, onSelectColor }) => {
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
                    style={{ backgroundColor: color }}
                    data-color={color}
                    onClick={handleColorClick}
                />
            ))}
        </div>
    );
};

export default ColorPicker;