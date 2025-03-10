"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Search } from 'lucide-react';

// Mock data for roles
const mockRoles = [
  {
    id: "role-1",
    name: "Owner",
    color: "bg-purple-500",
    permissions: [
      "manage_server",
      "manage_users",
      "manage_roles",
      "manage_tasks",
      "manage_stories",
      "manage_characters",
      "send_messages",
      "read_messages",
    ],
  },
  {
    id: "role-2",
    name: "Admin",
    color: "bg-red-500",
    permissions: [
      "manage_users",
      "manage_tasks",
      "manage_stories",
      "manage_characters",
      "send_messages",
      "read_messages",
    ],
  },
  {
    id: "role-3",
    name: "Moderator",
    color: "bg-blue-500",
    permissions: [
      "manage_tasks",
      "manage_stories",
      "manage_characters",
      "send_messages",
      "read_messages",
    ],
  },
  {
    id: "role-4",
    name: "Builder",
    color: "bg-green-500",
    permissions: [
      "manage_characters",
      "send_messages",
      "read_messages",
    ],
  },
  {
    id: "role-5",
    name: "Member",
    color: "bg-slate-500",
    permissions: [
      "send_messages",
      "read_messages",
    ],
  },
];

// Mock data for users
const mockUsers = [
  {
    id: "user-1",
    name: "Alex Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "AJ",
    role: "Owner",
  },
  {
    id: "user-2",
    name: "Sam Lee",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "SL",
    role: "Admin",
  },
  {
    id: "user-3",
    name: "Jordan Kim",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "JK",
    role: "Moderator",
  },
  {
    id: "user-4",
    name: "Taylor Smith",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "TS",
    role: "Builder",
  },
  {
    id: "user-5",
    name: "Morgan Patel",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "MP",
    role: "Member",
  },
];

// Mock data for permissions
const mockPermissions = [
  {
    id: "manage_server",
    name: "Manage Server",
    description: "Can change server settings",
    category: "Server",
  },
  {
    id: "manage_users",
    name: "Manage Users",
    description: "Can add, remove, and edit users",
    category: "Users",
  },
  {
    id: "manage_roles",
    name: "Manage Roles",
    description: "Can create, edit, and delete roles",
    category: "Roles",
  },
  {
    id: "manage_tasks",
    name: "Manage Tasks",
    description: "Can create, edit, and delete tasks",
    category: "Tasks",
  },
  {
    id: "manage_stories",
    name: "Manage Stories",
    description: "Can create, edit, and delete stories",
    category: "Content",
  },
  {
    id: "manage_characters",
    name: "Manage Characters",
    description: "Can create, edit, and delete characters",
    category: "Content",
  },
  {
    id: "send_messages",
    name: "Send Messages",
    description: "Can send messages in chat",
    category: "Communication",
  },
  {
    id: "read_messages",
    name: "Read Messages",
    description: "Can read messages in chat",
    category: "Communication",
  },
];

export function PermissionsSettings() {
  const [roles, setRoles] = useState(mockRoles);
  const [users, setUsers] = useState(mockUsers);
  const [permissions] = useState(mockPermissions);
  const [selectedRole, setSelectedRole] = useState(roles[0]);
  const [searchQuery, setSearchQuery] = useState("");

  const filt  = useState(roles[0]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRoleChange = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (role) {
      setSelectedRole(role);
    }
  };

  const handlePermissionToggle = (permissionId: string) => {
    setRoles(roles.map(role => {
      if (role.id === selectedRole.id) {
        const permissions = [...role.permissions];
        if (permissions.includes(permissionId)) {
          return {
            ...role,
            permissions: permissions.filter(p => p !== permissionId)
          };
        } else {
          return {
            ...role,
            permissions: [...permissions, permissionId]
          };
        }
      }
      return role;
    }));
  };

  const handleUserRoleChange = (userId: string, roleId: string) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        const role = roles.find(r => r.id === roleId);
        if (role) {
          return {
            ...user,
            role: role.name
          };
        }
      }
      return user;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Roles</h3>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Role
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {roles.map((role) => (
            <Badge
              key={role.id}
              variant={selectedRole.id === role.id ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handleRoleChange(role.id)}
            >
              <div className={`mr-1.5 h-2 w-2 rounded-full ${role.color}`} />
              {role.name}
            </Badge>
          ))}
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Role Permissions</h3>
        <p className="text-sm text-muted-foreground">
          Configure permissions for the selected role: <span className="font-medium">{selectedRole.name}</span>
        </p>
        <div className="space-y-4">
          {Object.entries(
            permissions.reduce((acc, permission) => {
              acc[permission.category] = [
                ...(acc[permission.category] || []),
                permission,
              ];
              return acc;
            }, {} as Record<string, typeof permissions>)
          ).map(([category, perms]) => (
            <div key={category} className="space-y-2">
              <h4 className="font-medium">{category}</h4>
              <div className="space-y-2">
                {perms.map((permission) => (
                  <div
                    key={permission.id}
                    className="flex items-start space-x-2 rounded-md border p-3"
                  >
                    <Checkbox
                      id={permission.id}
                      checked={selectedRole.permissions.includes(permission.id)}
                      onCheckedChange={() => handlePermissionToggle(permission.id)}
                    />
                    <div className="space-y-1 leading-none">
                      <label
                        htmlFor={permission.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {permission.name}
                      </label>
                      <p className="text-xs text-muted-foreground">
                        {permission.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">User Roles</h3>
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 w-[250px]"
          />
        </div>
        <div className="rounded-md border">
          <div className="grid grid-cols-12 gap-2 p-4 text-sm font-medium text-muted-foreground">
            <div className="col-span-5">User</div>
            <div className="col-span-5">Role</div>
            <div className="col-span-2">Actions</div>
          </div>
          <div className="divide-y">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="grid grid-cols-12 items-center gap-2 p-4 text-sm"
              >
                <div className="col-span-5 flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.initials}</AvatarFallback>
                  </Avatar>
                  <div className="font-medium">{user.name}</div>
                </div>
                <div className="col-span-5">
                  <Select
                    defaultValue={roles.find(role => role.name === user.role)?.id}
                    onValueChange={(value) => handleUserRoleChange(user.id, value)}
                  >
                    <SelectTrigger className="h-8 w-[180px]">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${role.color}`} />
                            {role.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
