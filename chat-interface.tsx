"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, PaperclipIcon } from 'lucide-react';
import { format } from "date-fns";

// Mock data for chat messages
const initialMessages = [
  {
    id: "msg-1",
    sender: {
      id: "user-1",
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "AJ",
    },
    content: "Hey team, I've updated the server plugins. Please check if everything is working correctly.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: "msg-2",
    sender: {
      id: "user-2",
      name: "Sam Lee",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SL",
    },
    content: "I'll test it out and let you know if I find any issues.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5).toISOString(), // 1.5 hours ago
  },
  {
    id: "msg-3",
    sender: {
      id: "user-4",
      name: "Taylor Smith",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "TS",
    },
    content: "The new spawn area is almost complete. I need some help with the final decorations though.",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
  },
  {
    id: "msg-4",
    sender: {
      id: "user-3",
      name: "Jordan Kim",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "JK",
    },
    content: "I can help with that. I'll be online in about an hour.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
  },
  {
    id: "msg-5",
    sender: {
      id: "user-1",
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "AJ",
    },
    content: "Great! Also, don't forget we have a team meeting tomorrow at 7 PM EST to discuss the upcoming event.",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
  },
];

// Mock current user
const currentUser = {
  id: "user-1",
  name: "Alex Johnson",
  avatar: "/placeholder.svg?height=40&width=40",
  initials: "AJ",
};

export function ChatInterface() {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const message = {
      id: `msg-${Date.now()}`,
      sender: currentUser,
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-2 ${
                message.sender.id === currentUser.id ? "flex-row-reverse" : ""
              }`}
            >
              <Avatar>
                <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
                <AvatarFallback>{message.sender.initials}</AvatarFallback>
              </Avatar>
              <div
                className={`rounded-lg px-3 py-2 ${
                  message.sender.id === currentUser.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <div className="flex items-center gap-2">
                  {message.sender.id !== currentUser.id && (
                    <span className="text-xs font-medium">{message.sender.name}</span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {formatMessageTime(message.timestamp)}
                  </span>
                </div>
                <p className="mt-1">{message.content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="border-t p-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="shrink-0">
            <PaperclipIcon className="h-4 w-4" />
            <span className="sr-only">Attach file</span>
          </Button>
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button size="icon" className="shrink-0" onClick={handleSendMessage}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
