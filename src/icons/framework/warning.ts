import { defineIcon, fillRect, stroke } from '@/icons/icon';

export const warningIcon = defineIcon({
  md: [stroke('M7.5 2.5 L12.5 13.5 H2.5 Z'), stroke('M7.5 6.5 V9.5'), fillRect(7, 11, 1, 1)],
});
