"use client"

import { format, parseISO } from "date-fns"
import { MapPin, Calendar, Clock, Plane, Hotel, Utensils, Car, Compass, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Event } from "./travel-timeline"

interface EventCardProps {
  event: Event
  onEdit: () => void
  onDelete: () => void
  isLocked?: boolean
}

export function EventCard({ event, onEdit, onDelete, isLocked = false }: EventCardProps) {
  const typeIcons = {
    flight: <Plane className="h-5 w-5" />,
    hotel: <Hotel className="h-5 w-5" />,
    activity: <Compass className="h-5 w-5" />,
    transport: <Car className="h-5 w-5" />,
    food: <Utensils className="h-5 w-5" />,
    other: <MoreHorizontal className="h-5 w-5" />,
  }

  const typeColors = {
    flight: "bg-blue-100 text-blue-700",
    hotel: "bg-purple-100 text-purple-700",
    activity: "bg-green-100 text-green-700",
    transport: "bg-amber-100 text-amber-700",
    food: "bg-rose-100 text-rose-700",
    other: "bg-slate-100 text-slate-700",
  }

  const typeBackgrounds = {
    flight: "bg-blue-50",
    hotel: "bg-purple-50",
    activity: "bg-green-50",
    transport: "bg-amber-50",
    food: "bg-rose-50",
    other: "bg-slate-50",
  }

  return (
    <div className="relative ml-12 flex items-center">
      <div
        className={`absolute -left-[44px] flex h-10 w-10 items-center justify-center rounded-full border ${typeBackgrounds[event.type]}`}
      >
        {typeIcons[event.type]}
      </div>
      <Card className="w-full overflow-hidden">
        <div className="p-6">
          <div className="mb-4">
            <span className={`inline-block rounded-full px-4 py-1 text-sm font-medium ${typeColors[event.type]}`}>
              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
            </span>
          </div>

          <div className="mb-4 flex items-start justify-between">
            <h3 className="text-2xl font-bold">{event.title}</h3>

            {!isLocked && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
                  <DropdownMenuItem onClick={onDelete} className="text-destructive">
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <div className="space-y-3 text-gray-600">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <span className="text-base">{format(parseISO(event.date), "EEEE, MMMM d, yyyy")}</span>
            </div>

            {event.time && (
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <span className="text-base">{event.time}</span>
              </div>
            )}

            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-gray-400" />
              <span className="text-base">{event.location}</span>
            </div>
          </div>

          {event.description && <p className="mt-4 text-base">{event.description}</p>}
        </div>
      </Card>
    </div>
  )
}
