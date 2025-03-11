"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  const [serverSettings, setServerSettings] = useState({
    serverName: "Awesome Minecraft Server",
    serverDescription: "The best Minecraft server for building and survival!",
    maxPlayers: 50,
    difficulty: "normal",
    gamemode: "survival",
    pvp: true,
    whitelist: false,
    motd: "Welcome to our awesome Minecraft server!",
  })

  const [websiteSettings, setWebsiteSettings] = useState({
    darkMode: true,
    notificationsEnabled: true,
    emailNotifications: false,
    activityWarningDays: 7,
    showOfflineUsers: true,
  })

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Settings</h1>

      <Tabs defaultValue="website" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="website">Website Settings</TabsTrigger>
          <TabsTrigger value="server">Server Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="website" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Website Settings</CardTitle>
              <CardDescription>Configure how the management website works.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Appearance</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Enable dark mode for the website.</p>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={websiteSettings.darkMode}
                    onCheckedChange={(checked) => setWebsiteSettings({ ...websiteSettings, darkMode: checked })}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Notifications</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">Enable Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications for important events.</p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={websiteSettings.notificationsEnabled}
                    onCheckedChange={(checked) =>
                      setWebsiteSettings({ ...websiteSettings, notificationsEnabled: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive email notifications for important events.</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={websiteSettings.emailNotifications}
                    onCheckedChange={(checked) =>
                      setWebsiteSettings({ ...websiteSettings, emailNotifications: checked })
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Activity Tracking</h3>
                <div className="grid gap-2">
                  <Label htmlFor="activity-warning">Activity Warning (days)</Label>
                  <Input
                    id="activity-warning"
                    type="number"
                    value={websiteSettings.activityWarningDays}
                    onChange={(e) =>
                      setWebsiteSettings({
                        ...websiteSettings,
                        activityWarningDays: Number.parseInt(e.target.value),
                      })
                    }
                  />
                  <p className="text-sm text-muted-foreground">
                    Number of days after which users are marked as inactive.
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="show-offline">Show Offline Users</Label>
                    <p className="text-sm text-muted-foreground">Show users who are currently offline.</p>
                  </div>
                  <Switch
                    id="show-offline"
                    checked={websiteSettings.showOfflineUsers}
                    onCheckedChange={(checked) => setWebsiteSettings({ ...websiteSettings, showOfflineUsers: checked })}
                  />
                </div>
              </div>

              <Button>Save Website Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="server" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Server Settings</CardTitle>
              <CardDescription>Configure your Minecraft server settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Basic Settings</h3>
                <div className="grid gap-2">
                  <Label htmlFor="server-name">Server Name</Label>
                  <Input
                    id="server-name"
                    value={serverSettings.serverName}
                    onChange={(e) => setServerSettings({ ...serverSettings, serverName: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="server-description">Server Description</Label>
                  <Input
                    id="server-description"
                    value={serverSettings.serverDescription}
                    onChange={(e) => setServerSettings({ ...serverSettings, serverDescription: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="motd">Message of the Day (MOTD)</Label>
                  <Input
                    id="motd"
                    value={serverSettings.motd}
                    onChange={(e) => setServerSettings({ ...serverSettings, motd: e.target.value })}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Game Settings</h3>
                <div className="grid gap-2">
                  <Label htmlFor="max-players">Max Players</Label>
                  <Input
                    id="max-players"
                    type="number"
                    value={serverSettings.maxPlayers}
                    onChange={(e) =>
                      setServerSettings({
                        ...serverSettings,
                        maxPlayers: Number.parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select
                    value={serverSettings.difficulty}
                    onValueChange={(value) => setServerSettings({ ...serverSettings, difficulty: value })}
                  >
                    <SelectTrigger id="difficulty">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="peaceful">Peaceful</SelectItem>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="gamemode">Default Gamemode</Label>
                  <Select
                    value={serverSettings.gamemode}
                    onValueChange={(value) => setServerSettings({ ...serverSettings, gamemode: value })}
                  >
                    <SelectTrigger id="gamemode">
                      <SelectValue placeholder="Select gamemode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="survival">Survival</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                      <SelectItem value="adventure">Adventure</SelectItem>
                      <SelectItem value="spectator">Spectator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Server Rules</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="pvp">PvP Enabled</Label>
                    <p className="text-sm text-muted-foreground">Allow players to fight each other.</p>
                  </div>
                  <Switch
                    id="pvp"
                    checked={serverSettings.pvp}
                    onCheckedChange={(checked) => setServerSettings({ ...serverSettings, pvp: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="whitelist">Whitelist Enabled</Label>
                    <p className="text-sm text-muted-foreground">Only allow whitelisted players to join.</p>
                  </div>
                  <Switch
                    id="whitelist"
                    checked={serverSettings.whitelist}
                    onCheckedChange={(checked) => setServerSettings({ ...serverSettings, whitelist: checked })}
                  />
                </div>
              </div>

              <Button>Save Server Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

