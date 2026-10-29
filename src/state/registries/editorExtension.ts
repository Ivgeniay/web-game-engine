import type { Unsubscribe } from '@/core/unsubscribe';
import type { EditorRegistries } from './editorRegistries';

export type EditorExtension = (editor: EditorRegistries) => Unsubscribe;
