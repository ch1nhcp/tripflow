import { TravelTimeline } from "@/components/travel-timeline"

export default function HomePage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="mb-2 text-4xl font-bold tracking-tight">Travel Timeline</h1>
      <p className="mb-10 text-muted-foreground">
        Plan your trip by adding events and dragging them to reorder. Perfect for organizing your travel itinerary.
      </p>
      <TravelTimeline />
    </div>
  )
}
