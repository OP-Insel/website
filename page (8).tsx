"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"

export default function CalendarPage() {
  const { hasPermission } = useAuth()
  const canManageEvents = hasPermission("manage_events")

  const [date, setDate] = useState<Date | undefined>(new Date())
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Server Maintenance",
      date: new Date(2023, 10, 15),
      description: "Scheduled downtime for plugin updates",
    },
    {
      id: 2,
      title: "Community Event",
      date: new Date(2023, 10, 18),
      description: "Building competition with prizes",
    },
    {
      id: 3,
      title: "Staff Meeting",
      date: new Date(2023, 10, 20),
      description: "Discuss upcoming server changes",
    },
  ])

  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    time: "",
    description: "",
  })

  // Function to check if a date has events
  const hasEvent = (day: Date) => {
    return events.some(
      (event) =>
        event.date.getDate() === day.getDate() &&
        event.date.getMonth() === day.getMonth() &&
        event.date.getFullYear() === day.getFullYear(),
    )
  }

  // Get events for selected date
  const selectedDateEvents = events.filter(
    (event) =>
      date &&
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear(),
  )

  // Function to create a new event
  const createEvent = () => {
    if (!newEvent.title || !newEvent.date) return

    const [year, month, day] = newEvent.date.split("-").map(Number)
    const eventDate = new Date(year, month - 1, day)

    if (newEvent.time) {
      const [hours, minutes] = newEvent.time.split(":").map(Number)
      eventDate.setHours(hours, minutes)
    }

    const newEventObj = {
      id: events.length > 0 ? Math.max(...events.map((e) => e.id)) + 1 : 1,
      title: newEvent.title,
      date: eventDate,
      description: newEvent.description,
    }

    setEvents([...events, newEventObj])

    // Reset form
    setNewEvent({
      title: "",
      date: "",
      time: "",
      description: "",
    })
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Event Calendar</h1>
        {canManageEvents && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> New Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="event-title">Event Title</Label>
                  <Input
                    id="event-title"
                    placeholder="Enter event title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="event-date">Event Date</Label>
                  <Input
                    id="event-date"
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="event-time">Event Time</Label>
                  <Input
                    id="event-time"
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="event-description">Description</Label>
                  <Textarea
                    id="event-description"
                    placeholder="Enter event details"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  />
                </div>
                <Button type="button" onClick={createEvent} disabled={!newEvent.title || !newEvent.date}>
                  Create Event
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              modifiers={{
                hasEvent: (day) => hasEvent(day),
              }}
              modifiersStyles={{
                hasEvent: {
                  fontWeight: "bold",
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                  borderBottom: "2px solid rgb(59, 130, 246)",
                },
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {date
                ? date.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "No Date Selected"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateEvents.length > 0 ? (
              <div className="space-y-4">
                {selectedDateEvents.map((event) => (
                  <div key={event.id} className="border-b pb-4 last:border-0 last:pb-0">
                    <h3 className="font-medium">{event.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2">{event.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No events scheduled for this day.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

