"use client"

import type React from "react"
import { useState } from "react"
import { format, parseISO } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { Event } from "./travel-timeline"

interface EventFormProps {
  event?: Event
  onSubmit: (event: Event | Omit<Event, "id">) => void
  onCancel: () => void
}

export function EventForm({ event, onSubmit, onCancel }: EventFormProps) {
  const [title, setTitle] = useState(event?.title || "")
  const [date, setDate] = useState<Date | undefined>(event?.date ? parseISO(event.date) : undefined)
  const [time, setTime] = useState(event?.time || "")
  const [location, setLocation] = useState(event?.location || "")
  const [description, setDescription] = useState(event?.description || "")
  const [type, setType] = useState<Event["type"]>(event?.type || "activity")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!title || !date || !location || !type) {
      return
    }

    const formattedDate = format(date, "yyyy-MM-dd")

    const newEvent = {
      ...(event ? { id: event.id } : {}),
      title,
      date: formattedDate,
      time: time || undefined,
      location,
      description: description || undefined,
      type,
    }

    onSubmit(newEvent as any)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-base">
            Event Title
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter event title"
            className="h-12"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type" className="text-base">
            Event Type
          </Label>
          <Select value={type} onValueChange={(value: Event["type"]) => setType(value)}>
            <SelectTrigger id="type" className="h-12">
              <SelectValue placeholder="Select event type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="flight">Flight</SelectItem>
              <SelectItem value="hotel">Hotel</SelectItem>
              <SelectItem value="activity">Activity</SelectItem>
              <SelectItem value="transport">Transport</SelectItem>
              <SelectItem value="food">Food</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="date" className="text-base">
            Date
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn("h-12 w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Select date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="time" className="text-base">
            Time (optional)
          </Label>
          <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} className="h-12" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location" className="text-base">
          Location
        </Label>
        <Input
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location"
          className="h-12"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-base">
          Description (optional)
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add any additional details"
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel} className="h-12 px-6">
          Cancel
        </Button>
        <Button type="submit" className="h-12 px-6">
          {event ? "Update Event" : "Add Event"}
        </Button>
      </div>
    </form>
  )
}
