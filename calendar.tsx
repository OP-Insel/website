"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon, Clock, Plus } from "lucide-react"

export function Calendar({ users, isAdmin }) {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    assignedTo: "",
  })

  // Generate dates for the calendar view
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay()
  }

  const currentYear = selectedDate.getFullYear()
  const currentMonth = selectedDate.getMonth()
  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth)

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  // Sample events data
  const events = [
    { id: 1, title: "Server Maintenance", date: "2023-06-15", time: "18:00", assignedTo: "admin1" },
    { id: 2, title: "New Plugin Testing", date: "2023-06-20", time: "20:00", assignedTo: "mod1" },
    { id: 3, title: "Team Meeting", date: "2023-06-25", time: "19:00", assignedTo: "all" },
  ]

  const handlePrevMonth = () => {
    setSelectedDate(new Date(currentYear, currentMonth - 1, 1))
  }

  const handleNextMonth = () => {
    setSelectedDate(new Date(currentYear, currentMonth + 1, 1))
  }

  const handleNewEventChange = (e) => {
    const { name, value } = e.target
    setNewEvent((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddEvent = () => {
    // Add event logic would go here
    console.log("New event:", newEvent)
    // Reset form
    setNewEvent({
      title: "",
      description: "",
      date: "",
      time: "",
      assignedTo: "",
    })
  }

  return (
    <div className="space-y-6">
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Team Calendar</CardTitle>
            <CardDescription className="text-zinc-400">Schedule and manage team events</CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrevMonth}>
              Previous
            </Button>
            <span className="font-medium">
              {monthNames[currentMonth]} {currentYear}
            </span>
            <Button variant="outline" size="sm" onClick={handleNextMonth}>
              Next
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day) => (
              <div key={day} className="text-center font-medium text-sm py-1">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for days before the first day of month */}
            {Array.from({ length: firstDayOfMonth }).map((_, index) => (
              <div key={`empty-${index}`} className="h-24 p-1 bg-zinc-800/50 rounded-md"></div>
            ))}

            {/* Calendar days */}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1
              const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
              const dayEvents = events.filter((event) => event.date === dateString)

              return (
                <div
                  key={`day-${day}`}
                  className={`h-24 p-1 bg-zinc-800 rounded-md overflow-hidden ${
                    new Date().toDateString() === new Date(currentYear, currentMonth, day).toDateString()
                      ? "ring-2 ring-primary"
                      : ""
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{day}</span>
                    {isAdmin && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add New Event</DialogTitle>
                            <DialogDescription>
                              Create a new event for {monthNames[currentMonth]} {day}, {currentYear}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="title">Event Title</Label>
                              <Input
                                id="title"
                                name="title"
                                value={newEvent.title}
                                onChange={handleNewEventChange}
                                className="bg-zinc-800 border-zinc-700"
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="description">Description</Label>
                              <Textarea
                                id="description"
                                name="description"
                                value={newEvent.description}
                                onChange={handleNewEventChange}
                                className="bg-zinc-800 border-zinc-700"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <Label htmlFor="date">Date</Label>
                                <Input
                                  id="date"
                                  name="date"
                                  type="date"
                                  value={dateString}
                                  onChange={handleNewEventChange}
                                  className="bg-zinc-800 border-zinc-700"
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="time">Time</Label>
                                <Input
                                  id="time"
                                  name="time"
                                  type="time"
                                  value={newEvent.time}
                                  onChange={handleNewEventChange}
                                  className="bg-zinc-800 border-zinc-700"
                                />
                              </div>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="assignedTo">Assign To</Label>
                              <Select
                                value={newEvent.assignedTo}
                                onValueChange={(value) => setNewEvent((prev) => ({ ...prev, assignedTo: value }))}
                              >
                                <SelectTrigger className="bg-zinc-800 border-zinc-700">
                                  <SelectValue placeholder="Select team member" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">All Team Members</SelectItem>
                                  {users
                                    .filter((user) => user.rank !== "Removed")
                                    .map((user) => (
                                      <SelectItem key={user.id} value={user.id}>
                                        {user.username} ({user.rank})
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline">Cancel</Button>
                            <Button onClick={handleAddEvent}>Add Event</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>

                  <div className="space-y-1">
                    {dayEvents.map((event) => (
                      <div key={event.id} className="text-xs p-1 bg-primary/20 rounded truncate flex items-center">
                        <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{event.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription className="text-zinc-400">View all scheduled events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.length > 0 ? (
              events.map((event) => (
                <div key={event.id} className="flex items-start gap-4 p-3 rounded-lg bg-zinc-800">
                  <div className="bg-primary/20 p-2 rounded">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{event.title}</h4>
                    <div className="flex items-center text-sm text-zinc-400 mt-1">
                      <CalendarIcon className="mr-1 h-3 w-3" />
                      {event.date} • {event.time}
                    </div>
                    <div className="text-sm text-zinc-400 mt-1">
                      Assigned to:{" "}
                      {event.assignedTo === "all"
                        ? "All Team Members"
                        : users.find((u) => u.id === event.assignedTo)?.username || "Unknown"}
                    </div>
                  </div>
                  {isAdmin && (
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-zinc-500">No upcoming events</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

