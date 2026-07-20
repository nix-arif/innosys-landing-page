"use client";

import { useState, type ReactNode } from "react";

interface DragListProps<T> {
  items: T[];
  getId: (item: T) => string;
  onReorder: (items: T[]) => void;
  renderItem: (item: T, index: number) => ReactNode;
  className?: string;
  itemClassName?: string;
}

/** Generic native-HTML5 drag-and-drop reorderable list, used for both the
 * section sidebar and any repeatable field list (features, socials, ...). */
export function DragList<T>({
  items,
  getId,
  onReorder,
  renderItem,
  className = "",
  itemClassName = "",
}: DragListProps<T>) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  function handleDrop(targetId: string) {
    if (draggedId && draggedId !== targetId) {
      const fromIndex = items.findIndex((item) => getId(item) === draggedId);
      const toIndex = items.findIndex((item) => getId(item) === targetId);
      if (fromIndex !== -1 && toIndex !== -1) {
        const next = [...items];
        const [moved] = next.splice(fromIndex, 1);
        next.splice(toIndex, 0, moved);
        onReorder(next);
      }
    }
    setDraggedId(null);
    setOverId(null);
  }

  return (
    <div className={className}>
      {items.map((item) => {
        const id = getId(item);
        const isOver = overId === id && draggedId !== null && draggedId !== id;
        return (
          <div
            key={id}
            draggable
            onDragStart={() => setDraggedId(id)}
            onDragOver={(event) => {
              event.preventDefault();
              if (overId !== id) setOverId(id);
            }}
            onDragLeave={() =>
              setOverId((current) => (current === id ? null : current))
            }
            onDrop={(event) => {
              event.preventDefault();
              handleDrop(id);
            }}
            onDragEnd={() => {
              setDraggedId(null);
              setOverId(null);
            }}
            className={`${itemClassName} ${draggedId === id ? "opacity-40" : ""} ${
              isOver ? "ring-2 ring-sky-blue" : ""
            }`}
          >
            {renderItem(item, items.indexOf(item))}
          </div>
        );
      })}
    </div>
  );
}
