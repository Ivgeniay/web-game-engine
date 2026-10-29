import type { InspectorPropertyTarget, InspectorSectionTarget } from '@/contracts/inspector';
import { messageRef } from '@/core/i18n/translate';
import { defineContextMenu } from '@/core/menus/contextMenuRegistry';
import { inspectorMessages } from './inspectorMessages';

export const inspectorSectionMenu = defineContextMenu<InspectorSectionTarget>({
  id: 'inspector.section',
  label: messageRef(inspectorMessages, 'section'),
});

export const inspectorPropertyMenu = defineContextMenu<InspectorPropertyTarget>({
  id: 'inspector.property',
  label: messageRef(inspectorMessages, 'property'),
});
