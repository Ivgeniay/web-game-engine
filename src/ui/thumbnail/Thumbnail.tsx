import { useEffect, useState } from 'react';
import type { ThumbnailLoader } from '@/contracts/thumbnail';
import type { IconSource } from '@/icons/icon';
import { classNames } from '@/ui/classNames';
import { Icon } from '@/ui/icon/Icon';
import styles from './Thumbnail.module.css';

interface ThumbnailProps {
  readonly id: string;
  readonly load?: ThumbnailLoader | undefined;
  readonly src?: string | undefined;
  readonly placeholder: IconSource;
  readonly className?: string | undefined;
}

interface LoadedImage {
  readonly id: string;
  readonly load: ThumbnailLoader;
  readonly url: string;
}

const DECORATIVE_ALT = '';

function ignoreFailure(): void {}

export function Thumbnail({ id, load, src, placeholder, className }: ThumbnailProps) {
  const [loaded, setLoaded] = useState<LoadedImage | null>(null);
  const [brokenUrl, setBrokenUrl] = useState<string | null>(null);

  useEffect(() => {
    if (load === undefined || src !== undefined) {
      return;
    }

    const controller = new AbortController();

    load(id, controller.signal).then((url) => {
      if (!controller.signal.aborted) {
        setLoaded({ id, load, url });
      }
    }, ignoreFailure);

    return () => {
      controller.abort();
    };
  }, [id, load, src]);

  const loadedUrl = loaded?.id === id && loaded.load === load ? loaded.url : undefined;
  const url = src ?? loadedUrl;
  const showImage = url !== undefined && url !== brokenUrl;

  return (
    <span className={classNames(styles.root, className)} aria-hidden="true">
      {showImage ? (
        <img
          className={styles.image}
          src={url}
          alt={DECORATIVE_ALT}
          draggable={false}
          onError={() => {
            setBrokenUrl(url);
          }}
        />
      ) : (
        <Icon icon={placeholder} />
      )}
    </span>
  );
}
