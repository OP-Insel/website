"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { useStore } from "@/lib/store"
import type { ScheduleEvent } from "@/lib/types"

export default function SchedulePanel() {
  const { schedule, addEvent, deleteEvent, currentUser } = useStore()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const isAdmin = currentUser?.rank === "Owner" || currentUser?.rank === "Co-Owner"

  const handleAddEvent = () => {
    if (!date || !title.trim()) return

    const newEvent: ScheduleEvent = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      date: date.toISOString(),
      createdBy: currentUser!.id,
    }

    addEvent(newEvent)
    setTitle("")
    setDescription("")
  }

  const handleDeleteEvent = (id: string) => {
    deleteEvent(id)
  }

  // Group events by date
  const eventsByDate = schedule.reduce(
    (acc, event) => {
      const dateStr = format(new Date(event.date), "yyyy-MM-dd")
      if (!acc[dateStr]) {
        acc[dateStr] = []
      }
      acc[dateStr].push(event)
      return acc
    },
    {} as Record<string, ScheduleEvent[]>,
  )

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Terminplanung</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Kalender</h3>
          <Calendar mode="single" selected={date} onSelect={setDate} locale={de} className="rounded-md border" />

          {isAdmin && (
            <div className="space-y-4 p-4 border rounded-md">
              <h4 className="font-medium">Neuen Termin hinzufügen</h4>

              <div className="space-y-2">
                <Label htmlFor="event-title">Titel</Label>
                <Input
                  id="event-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Titel des Termins"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="event-description">Beschreibung (optional)</Label>
                <Input
                  id="event-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Beschreibung des Termins"
                />
              </div>

              <Button onClick={handleAddEvent} disabled={!date || !title.trim()}>
                Termin hinzufügen
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Anstehende Termine</h3>

          {Object.keys(eventsByDate).length === 0 ? (
            <p className="text-muted-foreground italic">Keine Termine vorhanden</p>
          ) : (
            <div className="space-y-6">
              {Object.entries(eventsByDate)
                .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
                .map(([dateStr, events]) => (
                  <div key={dateStr} className="space-y-2">
                    <h4 className="font-semibold">{format(new Date(dateStr), "EEEE, d. MMMM yyyy", { locale: de })}</h4>

                    <div className="space-y-2">
                      {events.map((event) => (
                        <div key={event.id} className="border rounded-lg p-4 space-y-2">
                          <div className="flex justify-between items-start">
                            <h5 className="font-medium">{event.title}</h5>
                            {isAdmin && (
                              <Button size="icon" variant="ghost" onClick={() => handleDeleteEvent(event.id)}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="lucide lucide-trash-2"
                                >
                                  <path d="M3 6h18" />
                                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                  <line x1="10" x2="10" y1="11" y2="17" />
                                  <line x1="14" x2="14" y1="11" y2="17" />
                                </svg>
                              </Button>
                            )}
                          </div>
                          {event.description && <p>{event.description}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

