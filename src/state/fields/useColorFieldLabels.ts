import { useMemo } from 'react';
import { useMessages } from '@/state/language/useMessages';
import type { ColorFieldLabels } from '@/ui/colorField/ColorField';
import { colorFieldMessages } from './colorFieldMessages';
import { numberFieldMessages } from './numberFieldMessages';

export function useColorFieldLabels(): ColorFieldLabels {
  const t = useMessages(colorFieldMessages);
  const tNumber = useMessages(numberFieldMessages);

  return useMemo(
    () => ({
      picker: t('picker'),
      area: t('area'),
      areaRole: t('areaRole'),
      areaValue: (saturation: number, brightness: number) =>
        t('areaValue', { saturation, brightness }),
      hue: t('hue'),
      alpha: t('alpha'),
      model: t('model'),
      models: { rgb255: t('modelRgb255'), rgb1: t('modelRgb1'), hsv: t('modelHsv') },
      channels: {
        red: t('red'),
        green: t('green'),
        blue: t('blue'),
        hue: t('hue'),
        saturation: t('saturation'),
        brightness: t('brightness'),
        alpha: t('alpha'),
      },
      hex: t('hex'),
      invalidHex: t('invalidHex'),
      eyedropper: t('eyedropper'),
      numberMessages: (min: number, max: number) => ({
        incomplete: tNumber('incomplete'),
        belowMin: tNumber('belowMin', { min }),
        aboveMax: tNumber('aboveMax', { max }),
      }),
    }),
    [t, tNumber],
  );
}
