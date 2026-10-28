import { defineIcons } from '@/icons/icon';
import { moveIcon } from './icons/move';
import { pauseIcon } from './icons/pause';
import { playIcon } from './icons/play';
import { rotateIcon } from './icons/rotate';
import { scaleIcon } from './icons/scale';
import { stepIcon } from './icons/step';

export const demoIcons = defineIcons({
  play: playIcon,
  pause: pauseIcon,
  step: stepIcon,
  move: moveIcon,
  rotate: rotateIcon,
  scale: scaleIcon,
});
