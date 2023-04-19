import { colors, colorToUint8, uint8ToColor } from '../src/utils';

describe('Utils', () => {
  it('should correctly convert color to uint8', () => {
    const expectedUint8s = Array.from({ length: colors.length }, (_, i) => i);

    colors.forEach((color, index) => {
      expect(colorToUint8[color]).toBe(expectedUint8s[index]);
    });
  });

  it('should correctly convert uint8 to color', () => {
    const expectedColors = colors;

    colors.forEach((_, index) => {
      expect(uint8ToColor[index]).toBe(expectedColors[index]);
    });
  });

  it('should maintain consistency between colorToUint8 and uint8ToColor', () => {
    colors.forEach((color, index) => {
      const uint8 = colorToUint8[color];
      expect(uint8ToColor[uint8]).toBe(color);
    });
  });
});
