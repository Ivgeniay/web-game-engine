import { circle, defineIcon, fillRect, stroke } from '@/icons/icon';

export const infoIcon = defineIcon({
  md: [circle(7.5, 7.5, 6), fillRect(7, 4, 1, 1), stroke('M7.5 6.5 V10.5')],
  sm: [circle(5.5, 5.5, 4), fillRect(5, 3, 1, 1), stroke('M5.5 5.5 V7.5')],
});
