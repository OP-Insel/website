"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from 'lucide-react';

// Mock data for team members
const mockTeamMembers = [
  {
    id: "user-1",
    name: "Alex Johnson",
    email: "alex@mcserver.com",
    role: "Owner",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "AJ",
    status: "online",
    lastActive: "Now",
  },
  {
    id: "user-2",
    name: "Sam Lee",
    email: "sam@mcserver.com",
    role: "Admin",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "SL",
    status: "online",
    lastActive: "Now",
  },
  {
    id: "user-3",
    name: "Jordan Kim",
    email: "jordan@mcserver.com",
    role: "Moderator",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "JK",
    status: "offline",
    lastActive: "3 hours ago",
  },
  {
    id: "user-4",
    name: "Taylor Smith",
    email: "taylor@mcserver.com",
    role: "Builder",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "TS",
    status: "online",
    lastActive: "Now",
  },
  {
    id: "user-5",
    name: "Morgan Patel",
    email: "morgan@mcserver.com",
    role: "Developer",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "MP",
    status: "offline",
    lastActive: "1 day ago",
  },
  {
    id: "user-6",
    name: "Riley Brown",
    email: "riley@mcserver.com",
    role: "Event Manager",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "RB",
    status: "offline",
    lastActive: "2 hours ago",
  },
  {
    id: "user-7",
    name: "Casey Davis",
    email: "casey@mcserver.com",
    role: "Story Writer",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "CD",
    status: "offline",
    lastActive: "5 hours ago",
  },
  {
    id: "user-8",
    name: "Jamie Wilson",
    email: "jamie@mcserver.com",
    role: "Support",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "JW",
    status: "offline",
    lastActive: "1 hour ago",
  },
];

const roleColors = {
  "Owner": "bg-purple-500",
  "Admin": "bg-red-500",
  "Moderator": "bg-blue-500",
  "Builder": "bg-green-500",
  "Developer": "bg-amber-500",
  "Event Manager": "bg-indigo-500",
  "Story Writer": "bg-pink-500",
  "Support": "bg-slate-500",
};

export function TeamMembers() {
  const [members] = useState(mockTeamMembers);

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <div className="grid grid-cols-12 gap-2 p-4 text-sm font-medium text-muted-foreground">
          <div className="col-span-4 md:col-span-3">Name</div>
          <div className="col-span-4 hidden md:block">Email</div>
          <div className="col-span-3 md:col-span-2">Role</div>
          <div className="col-span-4 md:col-span-2">Status</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>
        <div className="divide-y">
          {members.map((member) => (
            <div
              key={member.id}
              className="grid grid-cols-12 items-center gap-2 p-4 text-sm"
            >
              <div className="col-span-4 flex items-center gap-2 md:col-span-3">
                <Avatar>
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{member.name}</div>
                </div>
              </div>
              <div className="col-span-4 hidden md:block">
                <div className="text-muted-foreground">{member.email}</div>
              </div>
              <div className="col-span-3 md:col-span-2">
                <Badge
                  variant="outline"
                  className="flex w-fit items-center gap-1"
                >
                  <div className={`h-1.5 w-1.5 rounded-full ${roleColors[member.role as keyof typeof roleColors]}`} />
                  {member.role}
                </Badge>
              </div>
              <div className="col-span-4 md:col-span-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      member.status === "online" ? "bg-green-500" : "bg-slate-300"
                    }`}
                  />
                  <span className="capitalize text-muted-foreground">
                    {member.status === "online" ? "Online" : member.lastActive}
                  </span>
                </div>
              </div>
              <div className="col-span-1 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuItem>Edit Permissions</DropdownMenuItem>
                    <DropdownMenuItem>Message</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
