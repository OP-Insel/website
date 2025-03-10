"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, CalendarDays, User } from 'lucide-react';

// Mock data for stories
const mockStories = [
  {
    id: "story-1",
    title: "The Great War",
    summary: "The epic tale of the server's first major conflict between kingdoms.",
    content: "Long ago, in the lands of our Minecraft server, two great kingdoms arose...",
    author: "Casey Davis",
    status: "published",
    createdAt: "2025-02-15T14:00:00",
    updatedAt: "2025-03-01T10:30:00",
  },
  {
    id: "story-2",
    title: "The Lost City",
    summary: "A mysterious ancient city is discovered beneath the desert.",
    content: "Rumors had circulated for months about strange noises coming from beneath the desert biome...",
    author: "Morgan Patel",
    status: "published",
    createdAt: "2025-02-20T09:15:00",
    updatedAt: "2025-02-28T16:45:00",
  },
  {
    id: "story-3",
    title: "Rise of the Dragon",
    summary: "A powerful dragon awakens and threatens the server.",
    content: "The ground shook as the ancient dragon stirred from its millennia-long slumber...",
    author: "Riley Brown",
    status: "review",
    createdAt: "2025-03-05T11:30:00",
    updatedAt: "2025-03-08T14:20:00",
  },
  {
    id: "story-4",
    title: "The Enchanted Forest",
    summary: "Strange magic transforms the forest biome.",
    content: "It began with subtle changes - flowers that glowed at night, animals that spoke in whispers...",
    author: "Alex Johnson",
    status: "draft",
    createdAt: "2025-03-10T08:45:00",
    updatedAt: "2025-03-10T08:45:00",
  },
  {
    id: "story-5",
    title: "The Pirate's Treasure",
    summary: "A legendary treasure is hidden somewhere in the ocean.",
    content: "Captain Blackbeard's treasure was said to be the greatest ever amassed...",
    author: "Casey Davis",
    status: "archived",
    createdAt: "2025-01-05T15:30:00",
    updatedAt: "2025-01-20T12:10:00",
  },
];

const statusColors = {
  "draft": "bg-slate-500",
  "review": "bg-amber-500",
  "published": "bg-green-500",
  "archived": "bg-red-500",
};

export function StoryList({ archived = false }: { archived?: boolean }) {
  const [stories, setStories] = useState(mockStories);
  
  const filteredStories = archived 
    ? stories.filter(story => story.status === "archived")
    : stories.filter(story => story.status !== "archived");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      {filteredStories.map((story) => (
        <Card key={story.id}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{story.title}</h3>
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 capitalize"
                  >
                    <div className={`h-1.5 w-1.5 rounded-full ${statusColors[story.status as keyof typeof statusColors]}`} />
                    {story.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{story.summary}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>View</DropdownMenuItem>
                  {story.status !== "archived" ? (
                    <DropdownMenuItem>Archive</DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem>Restore</DropdownMenuItem>
                  )}
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
          <CardFooter className="border-t bg-muted/50 px-6 py-3">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
              <div className="flex items-center">
                <User className="mr-1 h-3 w-3" />
                {story.author}
              </div>
              <div className="flex items-center">
                <CalendarDays className="mr-1 h-3 w-3" />
                Created: {formatDate(story.createdAt)}
              </div>
              <div className="flex items-center">
                <CalendarDays className="mr-1 h-3 w-3" />
                Updated: {formatDate(story.updatedAt)}
              </div>
            </div>
          </CardFooter>
        </Card>
      ))}
      {filteredStories.length === 0 && (
        <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
          <p className="text-sm text-muted-foreground">
            {archived ? "No archived stories found" : "No stories found"}
          </p>
        </div>
      )}
    </div>
  );
}
