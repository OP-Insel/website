import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServerSettings } from "@/components/server-settings";
import { UserSettings } from "@/components/user-settings";
import { PermissionsSettings } from "@/components/permissions-settings";

export default function SettingsPage() {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your server and user settings
          </p>
        </div>
        <Button>Save Changes</Button>
      </div>
      <div className="container py-6">
        <Tabs defaultValue="server" className="space-y-4">
          <TabsList>
            <TabsTrigger value="server">Server Settings</TabsTrigger>
            <TabsTrigger value="user">User Settings</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
          </TabsList>
          <TabsContent value="server" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Server Configuration</CardTitle>
                <CardDescription>
                  Configure your Minecraft server settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ServerSettings />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="user" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>User Preferences</CardTitle>
                <CardDescription>
                  Manage your personal settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserSettings />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="permissions" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Role Permissions</CardTitle>
                <CardDescription>
                  Manage user roles and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PermissionsSettings />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
