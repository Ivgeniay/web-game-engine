import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { TreeItem } from "../icons/types";
import type { ContextMenuItem, ContextMenuPosition } from "./types";

const SCREEN_PADDING = 15;

interface ContextMenuProps {
  items: ContextMenuItem[];
  position: ContextMenuPosition;
  treeItem: TreeItem;
  onClose: () => void;
}

interface SubMenuProps {
  items: ContextMenuItem[];
  treeItem: TreeItem;
  onClose: () => void;
  parentRect: DOMRect;
}

function SubMenu({
  items,
  treeItem,
  onClose,
  parentRect,
}: SubMenuProps): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let left = parentRect.right;
    let top = parentRect.top;

    if (left + rect.width + SCREEN_PADDING > vw) {
      left = parentRect.left - rect.width;
    }
    if (top + rect.height + SCREEN_PADDING > vh) {
      top = vh - rect.height - SCREEN_PADDING;
    }

    setPos({ top, left });
  }, [parentRect]);

  return (
    <div
      ref={ref}
      className="context-menu"
      style={{
        position: "fixed",
        top: pos?.top ?? parentRect.top,
        left: pos?.left ?? parentRect.right,
        opacity: pos ? 1 : 0,
        zIndex: 10001,
      }}
    >
      <MenuItems items={items} treeItem={treeItem} onClose={onClose} />
    </div>
  );
}

interface MenuItemRowProps {
  item: ContextMenuItem;
  treeItem: TreeItem;
  onClose: () => void;
}

function MenuItemRow({
  item,
  treeItem,
  onClose,
}: MenuItemRowProps): React.ReactElement {
  const [subOpen, setSubOpen] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);
  const [rowRect, setRowRect] = useState<DOMRect | null>(null);

  if (item.separator) {
    return <div className="context-menu-separator" />;
  }

  const isDisabled = item.disabled?.(treeItem) ?? false;
  const hasChildren = item.children && item.children.length > 0;

  const handleClick = () => {
    if (isDisabled) return;
    if (hasChildren) return;
    item.action?.(treeItem);
    onClose();
  };

  const handleMouseEnter = () => {
    if (!hasChildren) return;
    if (rowRef.current) setRowRect(rowRef.current.getBoundingClientRect());
    setSubOpen(true);
  };

  const handleMouseLeave = () => {
    setSubOpen(false);
  };

  return (
    <div
      ref={rowRef}
      className={[
        "context-menu-item",
        isDisabled ? "context-menu-item-disabled" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {item.icon && (
        <span className="context-menu-item-icon">
          <item.icon size={14} />
        </span>
      )}
      <span className="context-menu-item-label">{item.label}</span>
      {hasChildren && <span className="context-menu-item-arrow">›</span>}
      {subOpen && rowRect && hasChildren && (
        <SubMenu
          items={item.children!}
          treeItem={treeItem}
          onClose={onClose}
          parentRect={rowRect}
        />
      )}
    </div>
  );
}

interface MenuItemsProps {
  items: ContextMenuItem[];
  treeItem: TreeItem;
  onClose: () => void;
}

function MenuItems({
  items,
  treeItem,
  onClose,
}: MenuItemsProps): React.ReactElement {
  return (
    <>
      {items.map((item, i) => (
        <MenuItemRow
          key={item.id ?? `sep-${i}`}
          item={item}
          treeItem={treeItem}
          onClose={onClose}
        />
      ))}
    </>
  );
}

export function ContextMenu({
  items,
  position,
  treeItem,
  onClose,
}: ContextMenuProps): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let left = position.x;
    let top = position.y;

    if (left + rect.width + SCREEN_PADDING > vw) {
      left = position.x - rect.width;
    }
    if (top + rect.height + SCREEN_PADDING > vh) {
      top = position.y - rect.height;
    }

    left = Math.max(SCREEN_PADDING, left);
    top = Math.max(SCREEN_PADDING, top);

    setPos({ top, left });
  }, [position]);

  useEffect(() => {
    const handleDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("mousedown", handleDown);
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  return createPortal(
    <div
      ref={ref}
      className="context-menu"
      style={{
        position: "fixed",
        top: pos?.top ?? position.y,
        left: pos?.left ?? position.x,
        opacity: pos ? 1 : 0,
        zIndex: 10000,
      }}
    >
      <MenuItems items={items} treeItem={treeItem} onClose={onClose} />
    </div>,
    document.body,
  );
}
