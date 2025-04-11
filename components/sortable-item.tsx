"use client"

import type React from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"

interface SortableItemProps {
  id: string
  children: React.ReactNode
  disabled?: boolean
}

export function SortableItem({ id, children, disabled = false }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="relative mb-6">
      <div
        {...attributes}
        {...listeners}
        className={`absolute -left-8 top-1/2 -translate-y-1/2 ${
          disabled ? "cursor-not-allowed opacity-30" : "cursor-grab opacity-40 hover:opacity-100"
        } rounded-md p-1.5`}
      >
        <GripVertical className="h-5 w-5" />
        <span className="sr-only">{disabled ? "Timeline locked" : "Drag to reorder"}</span>
      </div>
      {children}
    </div>
  )
}
