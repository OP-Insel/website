"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookText, CheckSquare, Home, MessageSquare, Moon, Settings, Sun, Users } from 'lucide-react';

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarTrigger, 
  useSidebar 
} from "@/components/sidebar-provider";
import { useTheme } from "next-themes";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Tasks",
    href: "/tasks",
    icon: CheckSquare,
  },
  {
    title: "Story System",
    href: "/story",
    icon: BookText,
  },
  {
    title: "Characters",
    href: "/characters",
    icon: Users,
  },
  {
    title: "Messages",
    href: "/messages",
    icon: MessageSquare,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();
  const { isMobile } = useSidebar();

  return (
    <Sidebar>
      <SidebarHeader className="border-b pb-2">
        <div className="flex items-center gap-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <span className="text-lg font-bold text-primary-foreground">MC</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <h3 className="truncate text-lg font-semibold">MC Server</h3>
            <p className="truncate text-xs text-muted-foreground">Admin Dashboard</p>
          </div>
          {!isMobile && (
            <SidebarTrigger className="ml-auto h-8 w-8" />
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <nav className="grid gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === item.href ? "bg-accent text-accent-foreground" : "transparent"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-4">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <>
                <Sun className="mr-2 h-4 w-4" />
                Light Mode
              </>
            ) : (
              <>
                <Moon className="mr-2 h-4 w-4" />
                Dark Mode
              </>
            )}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
