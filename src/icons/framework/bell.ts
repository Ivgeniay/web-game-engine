import { defineIcon, fillRect, stroke } from '@/icons/icon';

export const bellIcon = defineIcon({
  md: [
    stroke('M4.5 11.5 V6.5 A3 3 0 0 1 10.5 6.5 V11.5'),
    stroke('M2.5 11.5 H12.5'),
    stroke('M6.5 13.5 H8.5'),
    fillRect(7, 2, 1, 1),
  ],
});
