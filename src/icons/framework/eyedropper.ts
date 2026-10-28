import { circle, defineIcon, stroke } from '@/icons/icon';

export const eyedropperIcon = defineIcon({
  md: [
    stroke('M8.5 4.5 L2.5 10.5 V12.5 H4.5 L10.5 6.5'),
    stroke('M7.5 3.5 L11.5 7.5'),
    circle(11.5, 3.5, 2),
  ],
});
