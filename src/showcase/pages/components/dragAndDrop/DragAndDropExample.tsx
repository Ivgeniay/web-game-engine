import { useState } from 'react';
import { Button } from '@/ui/button/Button';
import type { DragData } from '@/contracts/dragData';
import { useDragSource } from '@/ui/dragAndDrop/useDragSource';
import { useDropTarget } from '@/ui/dragAndDrop/useDropTarget';
import { Label } from '@/ui/label/Label';
import styles from './DragAndDropExample.module.css';

const TEXTURE_TYPE = 'texture';
const MESH_TYPE = 'mesh';
const EMPTY_SLOT = 'None';
const TEXTURE_SLOT = 'Albedo texture';
const MESH_SLOT = 'Mesh';

interface Asset {
  readonly id: string;
  readonly name: string;
  readonly type: string;
}

const ASSETS: readonly Asset[] = [
  { id: 'grass', name: 'Grass.png', type: TEXTURE_TYPE },
  { id: 'stone', name: 'Stone.png', type: TEXTURE_TYPE },
  { id: 'rock', name: 'Rock.mesh', type: MESH_TYPE },
];

interface AssetButtonProps {
  readonly asset: Asset;
}

function AssetButton({ asset }: AssetButtonProps) {
  const { startDrag } = useDragSource();

  return (
    <Button
      onPointerDown={(event) => {
        startDrag(event, () => ({ type: asset.type, ids: [asset.id], label: asset.name }));
      }}
    >
      {asset.name}
    </Button>
  );
}

interface AssetSlotProps {
  readonly caption: string;
  readonly accepts: string;
}

function AssetSlot({ caption, accepts }: AssetSlotProps) {
  const [assetName, setAssetName] = useState(EMPTY_SLOT);
  const { dropTargetProps, isOver } = useDropTarget({
    accepts: [accepts],
    onDragOver: () => true,
    onDrop: (data: DragData) => {
      setAssetName(data.label);
    },
  });

  return (
    <div className={styles.slot} data-over={isOver || undefined} {...dropTargetProps}>
      <Label tone="secondary">{caption}</Label>
      <Label>{assetName}</Label>
    </div>
  );
}

export function DragAndDropExample() {
  return (
    <div className={styles.root}>
      <div className={styles.assets}>
        {ASSETS.map((asset) => (
          <AssetButton key={asset.id} asset={asset} />
        ))}
      </div>
      <AssetSlot caption={TEXTURE_SLOT} accepts={TEXTURE_TYPE} />
      <AssetSlot caption={MESH_SLOT} accepts={MESH_TYPE} />
    </div>
  );
}
