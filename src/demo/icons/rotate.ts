import { defineIcon, fillRect, stroke } from '@/icons/icon';

export const rotateIcon = defineIcon({
  md: [
    stroke('M2.5 7.5 A5 5 0 1 1 7.5 12.5'),
    stroke('M9.5 10.5 L7.5 12.5 L9.5 14.5'),
    fillRect(7, 7, 1, 1),
  ],
});
