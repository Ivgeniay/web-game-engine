import { defineIcon, stroke } from '@/icons/icon';

export const unknownIcon = defineIcon({
  md: [
    stroke('M2.5 2.5 H12.5 V12.5 H2.5 Z'),
    stroke('M2.5 2.5 L12.5 12.5'),
    stroke('M12.5 2.5 L2.5 12.5'),
  ],
});
