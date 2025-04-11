"use client"

import { useState, useRef } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Plus, Lock, Unlock, Download } from "lucide-react"

// Add these imports for the download functionality
import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"

import { Button } from "@/components/ui/button"
import { EventCard } from "./event-card"
import { EventForm } from "./event-form"
import { SortableItem } from "./sortable-item"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export type Event = {
  id: string
  title: string
  date: string
  time?: string
  location: string
  description?: string
  type: "flight" | "hotel" | "activity" | "transport" | "food" | "other"
}

// Sample data
const initialEvents: Event[] = [
  {
    id: "1",
    title: "Flight to Paris",
    date: "2024-06-10",
    time: "08:30",
    location: "JFK Airport",
    description: "Air France AF123",
    type: "flight",
  },
  {
    id: "2",
    title: "Check-in at Hotel",
    date: "2024-06-10",
    time: "15:00",
    location: "Le Grand Hotel",
    description: "Reservation #12345",
    type: "hotel",
  },
  {
    id: "3",
    title: "Eiffel Tower Visit",
    date: "2024-06-11",
    time: "10:00",
    location: "Eiffel Tower",
    description: "Skip the line tickets",
    type: "activity",
  },
  {
    id: "4",
    title: "Dinner at Le Jules Verne",
    date: "2024-06-11",
    time: "19:30",
    location: "Eiffel Tower, 2nd floor",
    description: "Reservation required",
    type: "food",
  },
]

export function TravelTimeline() {
  const [events, setEvents] = useState<Event[]>(initialEvents)
  const [isAddingEvent, setIsAddingEvent] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [isLocked, setIsLocked] = useState(false)
  const timelineRef = useRef<HTMLDivElement>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  function handleDragEnd(event: DragEndEvent) {
    if (isLocked) return

    const { active, over } = event

    if (active.id !== over?.id) {
      setEvents((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over?.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  function addEvent(event: Omit<Event, "id">) {
    const newEvent = {
      ...event,
      id: crypto.randomUUID(),
    }
    setEvents([...events, newEvent])
    setIsAddingEvent(false)
  }

  function updateEvent(updatedEvent: Event) {
    setEvents(events.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)))
    setEditingEvent(null)
  }

  function deleteEvent(id: string) {
    setEvents(events.filter((event) => event.id !== id))
  }

  async function downloadAsImage() {
    if (!timelineRef.current) return

    try {
      const canvas = await html2canvas(timelineRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
      })

      const dataUrl = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.download = "travel-timeline.png"
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error("Error generating image:", error)
    }
  }

  async function downloadAsPDF() {
    if (!timelineRef.current) return

    try {
      const canvas = await html2canvas(timelineRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
      })

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
      })

      const imgWidth = 210 // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)
      pdf.save("travel-timeline.pdf")
    } catch (error) {
      console.error("Error generating PDF:", error)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Itinerary</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsLocked(!isLocked)}
            title={isLocked ? "Unlock timeline" : "Lock timeline"}
            className="h-10 w-10 rounded-full"
          >
            {isLocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
            <span className="sr-only">{isLocked ? "Unlock timeline" : "Lock timeline"}</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" title="Download timeline" className="h-10 w-10 rounded-full">
                <Download className="h-4 w-4" />
                <span className="sr-only">Download timeline</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={downloadAsImage}>Download as PNG</DropdownMenuItem>
              <DropdownMenuItem onClick={downloadAsPDF}>Download as PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={() => setIsAddingEvent(true)} disabled={isLocked} className="rounded-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        </div>
      </div>

      {isAddingEvent && (
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-xl font-semibold">Add New Event</h3>
          <EventForm onSubmit={addEvent} onCancel={() => setIsAddingEvent(false)} />
        </div>
      )}

      {editingEvent && (
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-xl font-semibold">Edit Event</h3>
          <EventForm event={editingEvent} onSubmit={updateEvent} onCancel={() => setEditingEvent(null)} />
        </div>
      )}

      <div className="relative" ref={timelineRef}>
        <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-200" />

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} autoScroll={true}>
          <SortableContext items={events.map((e) => e.id)} strategy={verticalListSortingStrategy}>
            {events.length > 0 ? (
              events.map((event) => (
                <SortableItem key={event.id} id={event.id} disabled={isLocked}>
                  <EventCard
                    event={event}
                    onEdit={() => !isLocked && setEditingEvent(event)}
                    onDelete={() => !isLocked && deleteEvent(event.id)}
                    isLocked={isLocked}
                  />
                </SortableItem>
              ))
            ) : (
              <div className="ml-12 rounded-lg border p-6 text-center text-muted-foreground">
                No events yet. Add your first event to start planning your trip!
              </div>
            )}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  )
}
