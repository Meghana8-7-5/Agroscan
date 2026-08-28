import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
}

function SortableItem({ id, children }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.85 : 1,
    position: "relative" as const,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      {/* Drag handle overlay */}
      <button
        type="button"
        {...listeners}
        className="absolute top-2 left-2 z-30 flex items-center gap-1 rounded-xl bg-amber-500 text-gray-950 px-2 py-1 shadow-md border border-white cursor-grab active:cursor-grabbing hover:bg-amber-400 transition-colors"
        title="Drag to reorder tile"
        aria-label={`Drag handle for tile ${id}`}
      >
        <GripVertical size={13} />
        <span className="text-[10px] font-extrabold">Drag</span>
      </button>
      {children}
    </div>
  );
}

interface DndDashboardGridProps {
  gridOrder: string[];
  onReorder: (newOrder: string[]) => void;
  renderTile: (tileId: string, index: number) => React.ReactNode;
}

export default function DndDashboardGrid({
  gridOrder,
  onReorder,
  renderTile,
}: DndDashboardGridProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = gridOrder.indexOf(String(active.id));
      const newIndex = gridOrder.indexOf(String(over.id));
      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(gridOrder, oldIndex, newIndex);
        onReorder(newOrder);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={gridOrder} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {gridOrder.map((tileId, index) => (
            <SortableItem key={tileId} id={tileId}>
              {renderTile(tileId, index)}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
