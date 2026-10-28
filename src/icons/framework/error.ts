import { circle, defineIcon, stroke } from '@/icons/icon';

export const errorIcon = defineIcon({
  md: [circle(7.5, 7.5, 6), stroke('M5.5 5.5 L9.5 9.5'), stroke('M9.5 5.5 L5.5 9.5')],
  sm: [circle(5.5, 5.5, 4), stroke('M3.5 3.5 L7.5 7.5'), stroke('M7.5 3.5 L3.5 7.5')],
});
