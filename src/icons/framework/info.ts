import { circle, defineIcon, fillRect, stroke } from '@/icons/icon';

export const infoIcon = defineIcon({
  md: [circle(7.5, 7.5, 6), fillRect(7, 4, 1, 1), stroke('M7.5 6.5 V10.5')],
});
