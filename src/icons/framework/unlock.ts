import { defineIcon, fillRect, stroke } from '@/icons/icon';

export const unlockIcon = defineIcon({
  md: [
    stroke('M3.5 7.5 H11.5 V12.5 H3.5 Z'),
    stroke('M5.5 7.5 V4.5 A2 2 0 0 1 9.5 4.5'),
    fillRect(7, 9, 1, 2),
  ],
});
