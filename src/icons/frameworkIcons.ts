import { checkIcon } from '@/icons/framework/check';
import { chevronDownIcon } from '@/icons/framework/chevron-down';
import { chevronRightIcon } from '@/icons/framework/chevron-right';
import { closeIcon } from '@/icons/framework/close';
import { errorIcon } from '@/icons/framework/error';
import { infoIcon } from '@/icons/framework/info';
import { layoutIcon } from '@/icons/framework/layout';
import { maximizeIcon } from '@/icons/framework/maximize';
import { minusIcon } from '@/icons/framework/minus';
import { moreVerticalIcon } from '@/icons/framework/more-vertical';
import { plusIcon } from '@/icons/framework/plus';
import { restoreIcon } from '@/icons/framework/restore';
import { searchIcon } from '@/icons/framework/search';
import { settingsIcon } from '@/icons/framework/settings';
import { unknownIcon } from '@/icons/framework/unknown';
import { warningIcon } from '@/icons/framework/warning';
import { defineIcons } from './icon';

export const frameworkIcons = defineIcons({
  close: closeIcon,
  'chevron-right': chevronRightIcon,
  'chevron-down': chevronDownIcon,
  check: checkIcon,
  minus: minusIcon,
  search: searchIcon,
  'more-vertical': moreVerticalIcon,
  maximize: maximizeIcon,
  restore: restoreIcon,
  plus: plusIcon,
  info: infoIcon,
  warning: warningIcon,
  error: errorIcon,
  settings: settingsIcon,
  layout: layoutIcon,
  unknown: unknownIcon,
});
