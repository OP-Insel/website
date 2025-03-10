"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarDays, MapPin, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock data for events
const mockEvents = [
  {
    id: "event-1",
    title: "Server Maintenance",
    description: "Scheduled downtime for server updates and maintenance",
    date: "2025-03-15T14:00:00",
    location: "Main Server",
    attendees: 8,
    type: "maintenance",
  },
  {
    id: "event-2",
    title: "PvP Tournament",
    description: "Monthly PvP tournament with prizes",
    date: "2025-03-18T18:00:00",
    location: "Arena",
    attendees: 24,
    type: "tournament",
  },
  {
    id: "event-3",
    title: "New Storyline Launch",
    description: "Launching the new server storyline with special quests",
    date: "2025-03-20T19:00:00",
    location: "Spawn Area",
    attendees: 35,
    type: "story",
  },
  {
    id: "event-4",
    title: "Build Competition",
    description: "Weekly building competition with theme: Medieval Castles",
    date: "2025-03-16T15:00:00",
    location: "Creative World",
    attendees: 18,
    type: "competition",
  },
  {
    id: "event-5",
    title: "Staff Meeting",
    description: "Monthly staff meeting to discuss server progress",
    date: "2025-03-14T20:00:00",
    location: "Discord",
    attendees: 10,
    type: "meeting",
  },
];

const eventTypeColors = {
  "maintenance": "bg-amber-500",
  "tournament": "bg-blue-500",
  "story": "bg-purple-500",
  "competition": "bg-green-500",
  "meeting": "bg-slate-500",
};

export function UpcomingEvents({ showAll = false }: { showAll?: boolean }) {
  const [events] = useState(mockEvents);
  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const displayEvents = showAll ? sortedEvents : sortedEvents.slice(0, 3);

  return (
    <div className="space-y-4">
      {displayEvents.map((event) => (
        <Card key={event.id}>
          <CardContent className="p-4">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{event.title}</h3>
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 capitalize"
                >
                  <div className={`h-1.5 w-1.5 rounded-full ${eventTypeColors[event.type as keyof typeof eventTypeColors]}`} />
                  {event.type}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{event.description}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-2 pt-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <CalendarDays className="mr-1 h-4 w-4" />
                  {format(new Date(event.date), "MMM d, yyyy 'at' h:mm a")}
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-1 h-4 w-4" />
                  {event.location}
                </div>
                <div className="flex items-center">
                  <Users className="mr-1 h-4 w-4" />
                  {event.attendees} attendees
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      {!showAll && events.length > 3 && (
        <Button variant="outline" className="w-full">
          View All Events
        </Button>
      )}
    </div>
  );
}
