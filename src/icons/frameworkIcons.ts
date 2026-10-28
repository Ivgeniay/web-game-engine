import { arrowLeftIcon } from '@/icons/framework/arrow-left';
import { bellIcon } from '@/icons/framework/bell';
import { checkIcon } from '@/icons/framework/check';
import { chevronDownIcon } from '@/icons/framework/chevron-down';
import { chevronRightIcon } from '@/icons/framework/chevron-right';
import { closeIcon } from '@/icons/framework/close';
import { copyIcon } from '@/icons/framework/copy';
import { dragHandleIcon } from '@/icons/framework/drag-handle';
import { errorIcon } from '@/icons/framework/error';
import { externalLinkIcon } from '@/icons/framework/external-link';
import { eyeIcon } from '@/icons/framework/eye';
import { eyeOffIcon } from '@/icons/framework/eye-off';
import { eyedropperIcon } from '@/icons/framework/eyedropper';
import { fileIcon } from '@/icons/framework/file';
import { filterIcon } from '@/icons/framework/filter';
import { folderIcon } from '@/icons/framework/folder';
import { folderOpenIcon } from '@/icons/framework/folder-open';
import { gridViewIcon } from '@/icons/framework/grid-view';
import { helpIcon } from '@/icons/framework/help';
import { infoIcon } from '@/icons/framework/info';
import { layoutIcon } from '@/icons/framework/layout';
import { linkIcon } from '@/icons/framework/link';
import { listViewIcon } from '@/icons/framework/list-view';
import { lockIcon } from '@/icons/framework/lock';
import { maximizeIcon } from '@/icons/framework/maximize';
import { minusIcon } from '@/icons/framework/minus';
import { moreVerticalIcon } from '@/icons/framework/more-vertical';
import { plusIcon } from '@/icons/framework/plus';
import { refreshIcon } from '@/icons/framework/refresh';
import { resetIcon } from '@/icons/framework/reset';
import { restoreIcon } from '@/icons/framework/restore';
import { searchIcon } from '@/icons/framework/search';
import { settingsIcon } from '@/icons/framework/settings';
import { successIcon } from '@/icons/framework/success';
import { unknownIcon } from '@/icons/framework/unknown';
import { unlockIcon } from '@/icons/framework/unlock';
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
  success: successIcon,
  settings: settingsIcon,
  layout: layoutIcon,
  lock: lockIcon,
  unlock: unlockIcon,
  help: helpIcon,
  reset: resetIcon,
  'drag-handle': dragHandleIcon,
  eye: eyeIcon,
  'eye-off': eyeOffIcon,
  filter: filterIcon,
  folder: folderIcon,
  'folder-open': folderOpenIcon,
  file: fileIcon,
  eyedropper: eyedropperIcon,
  'external-link': externalLinkIcon,
  link: linkIcon,
  'list-view': listViewIcon,
  'grid-view': gridViewIcon,
  'arrow-left': arrowLeftIcon,
  refresh: refreshIcon,
  copy: copyIcon,
  bell: bellIcon,
  unknown: unknownIcon,
});
