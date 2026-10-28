import { describe, expectTypeOf, it } from 'vitest';
import { frameworkIcons } from './frameworkIcons';
import { defineIcon, defineIcons, stroke } from './icon';
import type { IconDefinition, IconRef, IconSet, IconSource } from './icon';

const integrationIcons = defineIcons({ pin: defineIcon({ md: [stroke('M7.5 2.5 V12.5')] }) });

describe('icon types', () => {
  it('exposes framework icons by their names only', () => {
    expectTypeOf(frameworkIcons).toHaveProperty('close');
    expectTypeOf(frameworkIcons).toHaveProperty('chevron-right');
    expectTypeOf(frameworkIcons).not.toHaveProperty('clsoe');
  });

  it('gives an integration set the same type as the framework set', () => {
    expectTypeOf(integrationIcons).toEqualTypeOf<IconSet<'pin'>>();
    expectTypeOf(integrationIcons).not.toHaveProperty('close');
    expectTypeOf(frameworkIcons).toEqualTypeOf<IconSet<keyof typeof frameworkIcons>>();
  });

  it('accepts icons of any set where an icon source is expected', () => {
    expectTypeOf(frameworkIcons.close).toExtend<IconSource>();
    expectTypeOf(integrationIcons.pin).toExtend<IconSource>();
    expectTypeOf<IconRef>().toExtend<IconSource>();
    expectTypeOf(integrationIcons).toExtend<IconSet<string>>();
  });

  it('rejects a definition without the 16 pixel drawing', () => {
    expectTypeOf<{ readonly sm: IconDefinition['md'] }>().not.toExtend<IconDefinition>();
  });
});
