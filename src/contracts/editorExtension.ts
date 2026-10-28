import type { Unsubscribe } from '@/core/unsubscribe';
import type { EditorRegistries } from '@/state/registries/editorRegistries';

export type EditorExtension = (editor: EditorRegistries) => Unsubscribe;
