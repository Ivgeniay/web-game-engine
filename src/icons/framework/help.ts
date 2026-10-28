import { circle, defineIcon, fillRect, stroke } from '@/icons/icon';

export const helpIcon = defineIcon({
  md: [
    circle(7.5, 7.5, 6),
    stroke('M5.5 5.5 A2 2 0 0 1 9.5 5.5 L7.5 7.5 V8.5'),
    fillRect(7, 10, 1, 1),
  ],
});
