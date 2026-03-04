export interface EditorConfig {
  console: {
    maxMessages: number;
  };
}

export const defaultEditorConfig: EditorConfig = {
  console: {
    maxMessages: 200,
  },
};
