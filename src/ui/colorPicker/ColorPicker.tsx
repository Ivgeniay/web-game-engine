import { useId, useState } from 'react';
import type { Color } from '@/contracts/color';
import type { ValueChangeHandler, ValueChangePhase } from '@/contracts/valueChange';
import { frameworkIcons } from '@/icons/frameworkIcons';
import { classNames } from '@/ui/classNames';
import {
  alphaGradient,
  colorToHex,
  hueSpectrumGradient,
  MAX_HUE,
  parseHex,
  PERCENT_MAX,
} from '@/ui/color/colorModel';
import { isEyeDropperSupported, pickScreenColor } from '@/ui/color/eyeDropper';
import { IconButton } from '@/ui/iconButton/IconButton';
import { Label } from '@/ui/label/Label';
import { Select } from '@/ui/select/Select';
import type { SelectEntry } from '@/ui/select/selectOptions';
import { Slider } from '@/ui/slider/Slider';
import { TextField } from '@/ui/textField/TextField';
import { ColorArea } from './ColorArea';
import {
  COLOR_MODES,
  colorChannels,
  colorOfPicker,
  keepPickerColor,
  pickerColorOf,
} from './colorChannels';
import type { ColorMode, PickerColor } from './colorChannels';
import type { SaturationBrightness } from './colorKeys';
import styles from './ColorPicker.module.css';
import type { ColorPickerLabels } from './colorPickerLabels';
import { ColorStrip } from './ColorStrip';

interface ColorPickerProps {
  readonly value: Color;
  readonly onValueChange?: ValueChangeHandler<Color> | undefined;
  readonly showAlpha?: boolean | undefined;
  readonly colorMode?: ColorMode | undefined;
  readonly onColorModeChange?: ((mode: ColorMode) => void) | undefined;
  readonly labels: ColorPickerLabels;
  readonly className?: string | undefined;
}

const DEFAULT_COLOR_MODE: ColorMode = 'rgb255';
const HUE_STEPS = MAX_HUE;
const ALPHA_STEPS = PERCENT_MAX;

export function ColorPicker({
  value,
  onValueChange,
  showAlpha = true,
  colorMode,
  onColorModeChange,
  labels,
  className,
}: ColorPickerProps) {
  const hexId = useId();
  const [remembered, setRemembered] = useState<PickerColor>(() => pickerColorOf(value));
  const [innerMode, setInnerMode] = useState<ColorMode>(DEFAULT_COLOR_MODE);
  const current = keepPickerColor(remembered, value);
  const mode = colorMode ?? innerMode;
  const color = colorOfPicker(current);
  const eyeDropperSupported = isEyeDropperSupported();

  const modeOptions: readonly SelectEntry<ColorMode>[] = COLOR_MODES.map((item) => ({
    kind: 'option',
    value: item,
    label: labels.models[item],
  }));

  function emit(next: PickerColor, phase: ValueChangePhase): void {
    setRemembered(next);
    onValueChange?.(colorOfPicker(next), phase);
  }

  function emitColor(next: Color, phase: ValueChangePhase): void {
    emit(keepPickerColor(current, next), phase);
  }

  function changeMode(next: ColorMode): void {
    setInnerMode(next);
    onColorModeChange?.(next);
  }

  function pickFromScreen(): void {
    void pickScreenColor().then((hex) => {
      const picked = hex === undefined ? undefined : parseHex(hex, color.a);

      if (picked !== undefined) {
        emitColor(picked, 'commit');
      }
    });
  }

  function validateHex(text: string): string | undefined {
    return parseHex(text, color.a) === undefined ? labels.invalidHex : undefined;
  }

  return (
    <div className={classNames(styles.root, className)}>
      <ColorArea
        value={{ s: current.hsv.s, v: current.hsv.v }}
        hue={current.hsv.h}
        label={labels.area}
        roleDescription={labels.areaRole}
        valueText={labels.areaValue(
          Math.round(current.hsv.s * PERCENT_MAX),
          Math.round(current.hsv.v * PERCENT_MAX),
        )}
        onValueChange={({ s, v }: SaturationBrightness, phase) => {
          emit({ ...current, hsv: { ...current.hsv, s, v } }, phase);
        }}
      />
      <ColorStrip
        value={current.hsv.h / MAX_HUE}
        steps={HUE_STEPS}
        background={hueSpectrumGradient()}
        checkered={false}
        label={labels.hue}
        onValueChange={(position, phase) => {
          emit({ ...current, hsv: { ...current.hsv, h: position * MAX_HUE } }, phase);
        }}
      />
      {showAlpha && (
        <ColorStrip
          value={current.a}
          steps={ALPHA_STEPS}
          background={alphaGradient(color)}
          checkered
          label={labels.alpha}
          onValueChange={(alpha, phase) => {
            emit({ ...current, a: alpha }, phase);
          }}
        />
      )}
      <div className={styles.modeRow}>
        <Select
          aria-label={labels.model}
          className={styles.mode}
          options={modeOptions}
          value={mode}
          onValueChange={changeMode}
        />
        {eyeDropperSupported && (
          <IconButton
            label={labels.eyedropper}
            icon={frameworkIcons.eyedropper}
            onClick={pickFromScreen}
          />
        )}
      </div>
      <div className={styles.channels}>
        {colorChannels(mode, showAlpha).map((channel) => (
          <div key={channel.name} className={styles.channel}>
            <span className={styles.letter} aria-hidden="true">
              {channel.letter}
            </span>
            <Slider
              aria-label={labels.channels[channel.name]}
              value={channel.read(current)}
              min={channel.min}
              max={channel.max}
              kind={channel.kind}
              step={channel.step}
              precision={channel.precision}
              invalidMessages={labels.numberMessages(channel.min, channel.max)}
              onValueChange={(next, phase) => {
                emit(channel.write(current, next), phase);
              }}
            />
          </div>
        ))}
      </div>
      <div className={styles.hexRow}>
        <Label htmlFor={hexId} tone="secondary">
          {labels.hex}
        </Label>
        <TextField
          id={hexId}
          className={styles.hex}
          value={colorToHex(color, showAlpha)}
          validate={validateHex}
          onValueChange={(text, phase) => {
            const parsed = parseHex(text, color.a);

            if (phase === 'commit' && parsed !== undefined) {
              emitColor(showAlpha ? parsed : { ...parsed, a: color.a }, phase);
            }
          }}
        />
      </div>
    </div>
  );
}
