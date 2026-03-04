export const enum DebugLevel {
  Verbose = 0,
  Debug = 1,
  Info = 2,
  Warning = 3,
  Error = 4,
  Fatal = 5,
}

export const enum MessageStyle {
  None = 0,
  Bold = 1 << 0,
  Italic = 1 << 1,
  NotSelectable = 1 << 2,
  JsonHighlight = 1 << 3,
}
