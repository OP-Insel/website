"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useScheduleStore } from "@/lib/store"
import { CalendarPlus, Clock, Plus } from 'lucide-react'
import { format } from "date-fns"

export function SchedulePanel() {
  const { events, addEvent } = useScheduleStore()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [showAddEventDialog, setShowAddEventDialog] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    time: "12:00",
    type: "meeting"
  })
  
  const todaysEvents = events.filter(event => {
    if (!date) return false
    const eventDate = new Date(event.date)
    return (
      eventDate.getDate() === date.getDate() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getFullYear() === date.getFullYear()
    )
  })
  
  const handleAddEvent = () => {
    if (!date) return
    
    addEvent({
      id: Date.now().toString(),
      title: newEvent.title,
      description: newEvent.description,
      date: date.toISOString(),
      time: newEvent.time,
      type: newEvent.type as "meeting" | "deadline"
    })
    
    setNewEvent({
      title: "",
      description: "",
      time: "12:00",
      type: "meeting"
    })
    
    setShowAddEventDialog(false)
  }
  
  return (
    <div className="grid gap-6 md:grid-cols-[300px_1fr]">
      <div className="space-y-4">
        <Card className="bg-zinc-800 border-zinc-700">
          <CardContent className="pt-6">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="border-zinc-700 rounded-md"
            />
          </CardContent>
        </Card>
        
        <Button onClick={() => setShowAddEventDialog(true)} className="w-full">
          <CalendarPlus className="w-4 h-4 mr-2" />
          Add Event
        </Button>
      </div>
      
      <Card className="bg-zinc-800 border-zinc-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {date ? format(date, "MMMM d, yyyy") : "Select a date"}
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => setShowAddEventDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </CardHeader>
        <CardContent>
          {todaysEvents.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-zinc-700/50">
                  <TableHead>Time</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {todaysEvents.map((event) => (
                  <TableRow key={event.id} className="hover:bg-zinc-700/50">
                    <TableCell className="font-medium">{event.time}</TableCell>
                    <TableCell>
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-zinc-400">{event.description}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={event.type === "deadline" ? "destructive" : "secondary"}>
                        {event.type === "deadline" ? "Deadline" : "Meeting"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
              <Clock className="w-12 h-12 mb-4" />
              <p>No events scheduled for this day</p>
              <Button variant="outline" className="mt-4" onClick={() => setShowAddEventDialog(true)}>
                Add Event
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={showAddEventDialog} onOpenChange={setShowAddEventDialog}>
        <DialogContent className="bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Event Title</Label>
              <Input 
                id="title" 
                value={newEvent.title} 
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})} 
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={newEvent.description} 
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})} 
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="time">Time</Label>
              <Input 
                id="time" 
                type="time" 
                value={newEvent.time} 
                onChange={(e) => setNewEvent({...newEvent, time: e.target.value})} 
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="type">Event Type</Label>
              <div className="flex gap-4">
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="meeting" 
                    name="type" 
                    value="meeting" 
                    checked={newEvent.type === "meeting"} 
                    onChange={() => setNewEvent({...newEvent, type: "meeting"})} 
                    className="mr-2"
                  />
                  <Label htmlFor="meeting">Meeting</Label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="deadline" 
                    name="type" 
                    value="deadline" 
                    checked={newEvent.type === "deadline"} 
                    onChange={() => setNewEvent({...newEvent, type: "deadline"})} 
                    className="mr-2"
                  />
                  <Label htmlFor="deadline">Deadline</Label>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddEventDialog(false)}>Cancel</Button>
            <Button onClick={handleAddEvent}>Add Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
