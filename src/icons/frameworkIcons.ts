import { chevronRightIcon } from '@/icons/framework/chevron-right';
import { closeIcon } from '@/icons/framework/close';
import { unknownIcon } from '@/icons/framework/unknown';
import { warningIcon } from '@/icons/framework/warning';
import { defineIcons } from './icon';

export const frameworkIcons = defineIcons({
  close: closeIcon,
  'chevron-right': chevronRightIcon,
  warning: warningIcon,
  unknown: unknownIcon,
});
