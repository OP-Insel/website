import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock } from "lucide-react"

export function UpcomingEvents() {
  const events = [
    {
      id: 1,
      title: "Server Maintenance",
      date: "2023-11-15",
      time: "18:00",
      description: "Scheduled downtime for plugin updates",
    },
    {
      id: 2,
      title: "Community Event",
      date: "2023-11-18",
      time: "20:00",
      description: "Building competition with prizes",
    },
    {
      id: 3,
      title: "Staff Meeting",
      date: "2023-11-20",
      time: "19:00",
      description: "Discuss upcoming server changes",
    },
  ]

  return (
    <Card className="col-span-1 row-span-2">
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="border-b pb-4 last:border-0 last:pb-0">
              <h3 className="font-medium">{event.title}</h3>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <Clock className="h-4 w-4 mr-1" />
                <span>{event.time}</span>
              </div>
              <p className="text-sm mt-2">{event.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

