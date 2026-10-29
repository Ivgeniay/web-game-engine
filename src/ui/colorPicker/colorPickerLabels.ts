import type { NumberFieldMessages } from '@/ui/numberField/numberText';
import type { ColorChannelName, ColorMode } from './colorChannels';

export interface ColorPickerLabels {
  readonly area: string;
  readonly areaRole: string;
  readonly areaValue: (saturation: number, brightness: number) => string;
  readonly hue: string;
  readonly alpha: string;
  readonly model: string;
  readonly models: Readonly<Record<ColorMode, string>>;
  readonly channels: Readonly<Record<ColorChannelName, string>>;
  readonly hex: string;
  readonly invalidHex: string;
  readonly eyedropper: string;
  readonly numberMessages: (min: number, max: number) => NumberFieldMessages;
}
