import { commonMessages } from '@/core/i18n/commonMessages';
import { messageRef } from '@/core/i18n/translate';
import { defineContextMenu } from '@/core/menus/contextMenuRegistry';
import type { WindowTabTarget } from './windowType';

export const windowTabMenu = defineContextMenu<WindowTabTarget>({
  id: 'window-tab',
  label: messageRef(commonMessages, 'tab'),
});

export const WINDOW_TAB_MENU_FRAMEWORK_GROUP = 1000;
