import { ButtonPage } from '@/showcase/pages/components/button/ButtonPage';
import { CheckboxPage } from '@/showcase/pages/components/checkbox/CheckboxPage';
import { DialogPage } from '@/showcase/pages/components/dialog/DialogPage';
import { IconButtonPage } from '@/showcase/pages/components/iconButton/IconButtonPage';
import { KbdPage } from '@/showcase/pages/components/kbd/KbdPage';
import { LabelPage } from '@/showcase/pages/components/label/LabelPage';
import { MenuPage } from '@/showcase/pages/components/menu/MenuPage';
import { PopoverPage } from '@/showcase/pages/components/popover/PopoverPage';
import { PopupLayerPage } from '@/showcase/pages/components/popupLayer/PopupLayerPage';
import { RadioGroupPage } from '@/showcase/pages/components/radioGroup/RadioGroupPage';
import { RovingFocusPage } from '@/showcase/pages/components/rovingFocus/RovingFocusPage';
import { SelectPage } from '@/showcase/pages/components/select/SelectPage';
import { SeparatorPage } from '@/showcase/pages/components/separator/SeparatorPage';
import { ToggleButtonPage } from '@/showcase/pages/components/toggleButton/ToggleButtonPage';
import { ToggleButtonGroupPage } from '@/showcase/pages/components/toggleButtonGroup/ToggleButtonGroupPage';
import { TooltipPage } from '@/showcase/pages/components/tooltip/TooltipPage';
import { ToolbarPage } from '@/showcase/pages/components/toolbar/ToolbarPage';
import { ColorsPage } from '@/showcase/pages/foundations/ColorsPage';
import { ContrastPage } from '@/showcase/pages/foundations/ContrastPage';
import { IconsPage } from '@/showcase/pages/foundations/icons/IconsPage';
import { LocalizationPage } from '@/showcase/pages/foundations/localization/LocalizationPage';
import { LayersAndMotionPage } from '@/showcase/pages/foundations/LayersAndMotionPage';
import { RadiusAndShadowsPage } from '@/showcase/pages/foundations/RadiusAndShadowsPage';
import { SizesPage } from '@/showcase/pages/foundations/SizesPage';
import { SpacingPage } from '@/showcase/pages/foundations/SpacingPage';
import { ThemesPage } from '@/showcase/pages/foundations/themes/ThemesPage';
import { TypographyPage } from '@/showcase/pages/foundations/TypographyPage';
import { OverviewPage } from '@/showcase/pages/overview/OverviewPage';
import { CommandsPage } from '@/showcase/pages/shell/commands/CommandsPage';
import type { ShowcasePage } from './showcasePage';

export const OVERVIEW_PAGE_ID = 'overview';

export const SHOWCASE_PAGES: readonly ShowcasePage[] = [
  {
    id: OVERVIEW_PAGE_ID,
    section: 'overview',
    title: 'Overview',
    description:
      'What the editor framework is, how this showcase is organized and how to read its pages.',
    component: OverviewPage,
  },
  {
    id: 'foundations/themes',
    section: 'foundations',
    title: 'Themes',
    description:
      'Theme modes, reading and changing the theme from code, and styling components with tokens.',
    component: ThemesPage,
  },
  {
    id: 'foundations/localization',
    section: 'foundations',
    title: 'Localization',
    description:
      'Languages, dictionaries, substitutions, plural forms and message references for interface texts.',
    component: LocalizationPage,
  },
  {
    id: 'foundations/icons',
    section: 'foundations',
    title: 'Icons',
    description:
      'Framework icons, the Icon component, icons in data, integration icon sets and drawing rules.',
    component: IconsPage,
  },
  {
    id: 'foundations/colors',
    section: 'foundations',
    title: 'Colors',
    description: 'All color tokens and their roles. Use them for every color in the interface.',
    component: ColorsPage,
  },
  {
    id: 'foundations/typography',
    section: 'foundations',
    title: 'Typography',
    description: 'Font families, sizes, weights and line heights for interface text and code.',
    component: TypographyPage,
  },
  {
    id: 'foundations/spacing',
    section: 'foundations',
    title: 'Spacing',
    description: 'The spacing scale for paddings, margins and gaps.',
    component: SpacingPage,
  },
  {
    id: 'foundations/sizes',
    section: 'foundations',
    title: 'Sizes',
    description: 'Sizes of controls, panels, icons, borders and scrollbars.',
    component: SizesPage,
  },
  {
    id: 'foundations/radius-and-shadows',
    section: 'foundations',
    title: 'Radius and shadows',
    description: 'Corner radii and shadows for surfaces and floating elements.',
    component: RadiusAndShadowsPage,
  },
  {
    id: 'foundations/layers-and-motion',
    section: 'foundations',
    title: 'Layers and motion',
    description: 'Stacking order of editor layers, transition durations and easing curves.',
    component: LayersAndMotionPage,
  },
  {
    id: 'foundations/contrast',
    section: 'foundations',
    title: 'Contrast',
    description: 'Contrast ratios of the color pairs used in the interface, for the current theme.',
    component: ContrastPage,
  },
  {
    id: 'components/button',
    section: 'components',
    title: 'Button',
    description: 'A button with text and an optional icon that runs an action.',
    component: ButtonPage,
  },
  {
    id: 'components/icon-button',
    section: 'components',
    title: 'IconButton',
    description: 'A square button with only an icon and a required label.',
    component: IconButtonPage,
  },
  {
    id: 'components/toggle-button',
    section: 'components',
    title: 'ToggleButton',
    description: 'A button that is switched on and off, with text or only an icon.',
    component: ToggleButtonPage,
  },
  {
    id: 'components/toggle-button-group',
    section: 'components',
    title: 'ToggleButtonGroup',
    description: 'A row of toggle buttons to choose one, none or one, or several options.',
    component: ToggleButtonGroupPage,
  },
  {
    id: 'components/checkbox',
    section: 'components',
    title: 'Checkbox',
    description: 'A box that switches a boolean value, with a mixed state for partial values.',
    component: CheckboxPage,
  },
  {
    id: 'components/radio-group',
    section: 'components',
    title: 'RadioGroup',
    description:
      'A list of labelled options to choose one value, with arrow keys that choose at once.',
    component: RadioGroupPage,
  },
  {
    id: 'components/toolbar',
    section: 'components',
    title: 'Toolbar',
    description: 'A row of controls along the edge of a window that is one Tab stop.',
    component: ToolbarPage,
  },
  {
    id: 'components/separator',
    section: 'components',
    title: 'Separator',
    description: 'A horizontal or vertical line between groups, or a flexible gap.',
    component: SeparatorPage,
  },
  {
    id: 'components/label',
    section: 'components',
    title: 'Label',
    description: 'A text in one of the text tones, with truncation and optional selection.',
    component: LabelPage,
  },
  {
    id: 'components/kbd',
    section: 'components',
    title: 'Kbd',
    description: 'A keyboard shortcut shown as text.',
    component: KbdPage,
  },
  {
    id: 'components/tooltip',
    section: 'components',
    title: 'Tooltip',
    description: 'A short hint with an optional shortcut, shown on hover and keyboard focus.',
    component: TooltipPage,
  },
  {
    id: 'components/menu',
    section: 'components',
    title: 'Menu',
    description:
      'A list of commands with submenus, opened from a button or at a point on the screen.',
    component: MenuPage,
  },
  {
    id: 'components/select',
    section: 'components',
    title: 'Select',
    description:
      'A field that chooses one value from a list, with icons, separators and an action.',
    component: SelectPage,
  },
  {
    id: 'components/popover',
    section: 'components',
    title: 'Popover',
    description: 'A floating panel with any content next to its trigger.',
    component: PopoverPage,
  },
  {
    id: 'components/dialog',
    section: 'components',
    title: 'Dialog',
    description: 'A modal window with a title, content and actions, above a dimmed editor.',
    component: DialogPage,
  },
  {
    id: 'components/roving-focus',
    section: 'components',
    title: 'Roving focus',
    description:
      'One Tab stop for a group of controls, with arrow keys inside: the mechanism behind toolbars and groups.',
    component: RovingFocusPage,
  },
  {
    id: 'components/popup-layer',
    section: 'components',
    title: 'Popup layer',
    description:
      'The shared layer for tooltips, menus, lists, popovers and dialogs: z-index and position.',
    component: PopupLayerPage,
  },
  {
    id: 'shell/commands',
    section: 'shell',
    title: 'Commands',
    description:
      'Command definitions and handlers, the integration entry point and registration for the lifetime of a component.',
    component: CommandsPage,
  },
];
