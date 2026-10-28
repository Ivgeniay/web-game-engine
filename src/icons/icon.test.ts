import { describe, expect, it } from 'vitest';
import { unknownIcon } from '@/icons/framework/unknown';
import { frameworkIcons } from './frameworkIcons';
import { defineIcon, defineIcons, iconRef, stroke } from './icon';
import { resolveIcon } from './resolveIcon';

const pinIcon = defineIcon({ md: [stroke('M7.5 2.5 V12.5')] });

const integrationIcons = defineIcons({ pin: pinIcon });

describe('resolveIcon', () => {
  it('returns an icon definition as is', () => {
    expect(resolveIcon(frameworkIcons.close)).toEqual({
      definition: frameworkIcons.close,
      missingName: undefined,
    });
  });

  it('finds a known name in its set', () => {
    expect(resolveIcon(iconRef(frameworkIcons, 'warning'))).toEqual({
      definition: frameworkIcons.warning,
      missingName: undefined,
    });
  });

  it('finds a name in an integration set', () => {
    expect(resolveIcon(iconRef(integrationIcons, 'pin')).definition).toBe(pinIcon);
  });

  it('falls back to the unknown icon for a missing name', () => {
    expect(resolveIcon(iconRef(frameworkIcons, 'teleport'))).toEqual({
      definition: unknownIcon,
      missingName: 'teleport',
    });
  });

  it('looks only at the icons of the given set', () => {
    expect(resolveIcon(iconRef(integrationIcons, 'close')).missingName).toBe('close');
  });

  it('ignores names inherited from the object prototype', () => {
    expect(resolveIcon(iconRef(frameworkIcons, 'constructor')).definition).toBe(unknownIcon);
  });
});
