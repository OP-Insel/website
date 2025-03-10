"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

// Mock data for messages
const mockMessages = [
  {
    id: "dm-1",
    sender: {
      id: "user-2",
      name: "Sam Lee",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SL",
    },
    content: "Hey, can you help me with the server permissions when you have time?",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    unread: true,
    isAnnouncement: false,
  },
  {
    id: "dm-2",
    sender: {
      id: "user-3",
      name: "Jordan Kim",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "JK",
    },
    content: "I've updated the world border settings as discussed in the meeting.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    unread: false,
    isAnnouncement: false,
  },
  {
    id: "dm-3",
    sender: {
      id: "user-4",
      name: "Taylor Smith",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "TS",
    },
    content: "The new build is ready for review. Let me know what you think!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    unread: true,
    isAnnouncement: false,
  },
  {
    id: "ann-1",
    sender: {
      id: "user-1",
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "AJ",
    },
    content: "Server maintenance scheduled for tomorrow at 3 PM EST. The server will be down for approximately 2 hours.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(), // 1 hour ago
    unread: false,
    isAnnouncement: true,
  },
  {
    id: "ann-2",
    sender: {
      id: "user-1",
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "AJ",
    },
    content: "New event: PvP Tournament this weekend! Sign up in the Discord channel.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    unread: false,
    isAnnouncement: true,
  },
];

export function MessageList({ isAnnouncement = false }: { isAnnouncement?: boolean }) {
  const [messages, setMessages] = useState(mockMessages);
  
  const filteredMessages = messages.filter(
    (message) => message.isAnnouncement === isAnnouncement
  );

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return format(date, "h:mm a");
    } else {
      return format(date, "MMM d, h:mm a");
    }
  };

  return (
    <div className="space-y-4">
      {filteredMessages.map((message) => (
        <Card key={message.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <Avatar>
                <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
                <AvatarFallback>{message.sender.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{message.sender.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatMessageTime(message.timestamp)}
                    </span>
                  </div>
                  {message.unread && (
                    <Badge variant="default" className="rounded-full px-2 py-0 text-xs">
                      New
                    </Badge>
                  )}
                </div>
                <p className="mt-1 text-sm">{message.content}</p>
                <div className="mt-2 flex justify-end gap-2">
                  {isAnnouncement ? (
                    <Button variant="outline" size="sm">
                      Mark as Read
                    </Button>
                  ) : (
                    <>
                      <Button variant="outline" size="sm">
                        Reply
                      </Button>
                      <Button size="sm">
                        View Conversation
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      {filteredMessages.length === 0 && (
        <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
          <p className="text-sm text-muted-foreground">
            {isAnnouncement ? "No announcements found" : "No messages found"}
          </p>
        </div>
      )}
    </div>
  );
}
