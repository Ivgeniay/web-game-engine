import { defineDocMessages } from '@/showcase/i18n/docMessages';

export const layersAndMotionPageMessages = defineDocMessages({
  en: {
    pageTitle: 'Layers and motion',
    pageDescription: 'Stacking order of editor layers, transition durations and easing curves.',
    layersTitle: 'Layers',
    layersText:
      'Stacking order of editor layers, from the base content up to tooltips. Use these tokens instead of z-index numbers so layers never fight each other.',
    durationsTitle: 'Durations',
    durationsText:
      'Transition durations. When the user asks for reduced motion, they become `0ms`, so transitions built on them turn off on their own.',
    easingTitle: 'Easing',
    easingText: 'Timing curves for transitions.',
  },
  ru: {
    pageTitle: 'Слои и анимация',
    pageDescription: 'Порядок слоёв редактора, длительности переходов и кривые плавности.',
    layersTitle: 'Слои',
    layersText:
      'Порядок слоёв редактора, от основного содержимого до подсказок. Пользуйтесь этими токенами вместо чисел z-index, тогда слои не будут конфликтовать между собой.',
    durationsTitle: 'Длительности',
    durationsText:
      'Длительности переходов. Если пользователь попросил уменьшить движение, они становятся `0ms`, и построенные на них переходы выключаются сами.',
    easingTitle: 'Плавность',
    easingText: 'Кривые плавности для переходов.',
  },
});
