import { circle, defineIcon, fillRect } from '@/icons/icon';

export const settingsIcon = defineIcon({
  md: [
    circle(7.5, 7.5, 4),
    circle(7.5, 7.5, 2),
    fillRect(6, 1, 3, 2),
    fillRect(6, 12, 3, 2),
    fillRect(1, 6, 2, 3),
    fillRect(12, 6, 2, 3),
    fillRect(3, 3, 2, 2),
    fillRect(10, 3, 2, 2),
    fillRect(3, 10, 2, 2),
    fillRect(10, 10, 2, 2),
  ],
});
