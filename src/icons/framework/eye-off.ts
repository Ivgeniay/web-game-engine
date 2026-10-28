import { defineIcon, fillRect, stroke } from '@/icons/icon';

export const eyeOffIcon = defineIcon({
  md: [
    stroke('M2.5 7.5 A5.5 5.5 0 0 1 12.5 7.5 A5.5 5.5 0 0 1 2.5 7.5 Z'),
    fillRect(6, 6, 3, 3),
    stroke('M2.5 2.5 L12.5 12.5'),
  ],
});
