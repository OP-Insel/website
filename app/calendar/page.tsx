"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Plus, Users, Clock } from "lucide-react"
import Link from "next/link"

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  // Mock events data
  const events = [
    {
      id: "1",
      title: "Server Maintenance",
      description: "Scheduled downtime for server updates",
      date: new Date(2023, 11, 15), // December 15, 2023
      time: "20:00",
      duration: "2 hours",
      organizer: "Owner",
      participants: ["Owner", "Co-Owner", "Admin"],
      type: "maintenance",
    },
    {
      id: "2",
      title: "PvP Tournament",
      description: "Monthly PvP tournament with prizes",
      date: new Date(2023, 11, 20), // December 20, 2023
      time: "18:00",
      duration: "3 hours",
      organizer: "Admin",
      participants: ["Admin", "Moderator"],
      type: "event",
    },
    {
      id: "3",
      title: "Team Meeting",
      description: "Monthly team meeting to discuss server progress",
      date: new Date(2023, 11, 10), // December 10, 2023
      time: "19:00",
      duration: "1 hour",
      organizer: "Owner",
      participants: ["Owner", "Co-Owner", "Admin", "Moderator"],
      type: "meeting",
    },
  ]

  // Get events for the selected date
  const selectedDateEvents = events.filter((event) => date && event.date.toDateString() === date.toDateString())

  // Function to highlight dates with events
  const isDayWithEvent = (day: Date) => {
    return events.some((event) => event.date.toDateString() === day.toDateString())
  }

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Calendar</h1>
        <Button asChild>
          <Link href="/calendar/new">
            <Plus className="mr-2 h-4 w-4" />
            New Event
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
              <CardDescription>Select a date to view events</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                modifiers={{
                  hasEvent: (date) => isDayWithEvent(date),
                }}
                modifiersStyles={{
                  hasEvent: {
                    fontWeight: "bold",
                    backgroundColor: "hsl(var(--primary) / 0.1)",
                    color: "hsl(var(--primary))",
                  },
                }}
              />
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                Events for{" "}
                {date?.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </CardTitle>
              <CardDescription>
                {selectedDateEvents.length === 0
                  ? "No events scheduled for this date"
                  : `${selectedDateEvents.length} event${selectedDateEvents.length > 1 ? "s" : ""} scheduled`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedDateEvents.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No events for this date</p>
                    <Button className="mt-4" asChild>
                      <Link href="/calendar/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Schedule Event
                      </Link>
                    </Button>
                  </div>
                ) : (
                  selectedDateEvents.map((event) => (
                    <Card key={event.id} className="overflow-hidden">
                      <div className="flex">
                        <div
                          className={`w-2 ${
                            event.type === "maintenance"
                              ? "bg-yellow-500"
                              : event.type === "event"
                                ? "bg-blue-500"
                                : "bg-green-500"
                          }`}
                        />
                        <div className="flex-1 p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{event.title}</h3>
                              <p className="text-sm text-muted-foreground">{event.description}</p>
                            </div>
                            <Badge
                              variant="outline"
                              className={`
                                ${
                                  event.type === "maintenance"
                                    ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                    : event.type === "event"
                                      ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                      : "bg-green-500/10 text-green-500 border-green-500/20"
                                }
                              `}
                            >
                              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                            </Badge>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center">
                              <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                              <span>
                                {event.time} ({event.duration})
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                              <span>{event.participants.length} participants</span>
                            </div>
                          </div>

                          <div className="mt-4 flex justify-end">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/calendar/${event.id}`}>View Details</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

