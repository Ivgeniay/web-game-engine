import { describe, expect, it } from 'vitest';
import { parsePixelValue } from './popupPosition';

describe('parsePixelValue', () => {
  it.each([
    { value: '4px', pixels: 4 },
    { value: ' 8px ', pixels: 8 },
    { value: '0', pixels: 0 },
    { value: '2.5px', pixels: 2.5 },
  ])('reads $value as $pixels pixels', ({ value, pixels }) => {
    expect(parsePixelValue(value)).toBe(pixels);
  });

  it.each(['', 'auto', 'var(--space-4)'])('falls back to zero for "%s"', (value) => {
    expect(parsePixelValue(value)).toBe(0);
  });
});
