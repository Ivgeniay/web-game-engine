import { circle, defineIcon, stroke } from '@/icons/icon';

export const successIcon = defineIcon({
  md: [circle(7.5, 7.5, 6), stroke('M4.5 7.5 L6.5 9.5 L10.5 5.5')],
  sm: [circle(5.5, 5.5, 4), stroke('M3.5 5.5 L4.5 6.5 L6.5 4.5')],
});
