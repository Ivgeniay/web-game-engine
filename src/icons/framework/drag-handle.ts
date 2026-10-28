import { defineIcon, fillRect } from '@/icons/icon';

export const dragHandleIcon = defineIcon({
  md: [
    fillRect(5, 3, 2, 2),
    fillRect(9, 3, 2, 2),
    fillRect(5, 7, 2, 2),
    fillRect(9, 7, 2, 2),
    fillRect(5, 11, 2, 2),
    fillRect(9, 11, 2, 2),
  ],
});
