import { defineMessages } from '@/core/i18n/messages';
import { useMessages } from '@/state/language/useMessages';

const SCENE_NAME = 'Main';
const VERTEX_COUNT = 12500;
const FRAME_NUMBER = 1024;

const statsMessages = defineMessages({
  en: {
    scene: 'Scene: {name}',
    vertices: 'Vertices: {count}',
    frame: 'Frame #{frame}',
  },
  ru: {
    scene: 'Сцена: {name}',
    vertices: 'Вершин: {count}',
    frame: 'Кадр № {frame}',
  },
});

export function InterpolationExample() {
  const t = useMessages(statsMessages);

  return (
    <ul>
      <li>{t('scene', { name: SCENE_NAME })}</li>
      <li>{t('vertices', { count: VERTEX_COUNT })}</li>
      <li>{t('frame', { frame: String(FRAME_NUMBER) })}</li>
    </ul>
  );
}
