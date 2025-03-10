import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Crown, Shield, UserPlus, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function TeamPage() {
  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Team Management</h1>
        <Button asChild>
          <Link href="/team/new">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Team Member
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="members" className="space-y-4">
        <TabsList>
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="roles">Roles & Hierarchy</TabsTrigger>
          <TabsTrigger value="points">Points System</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <TeamMemberCard
              name="MinecraftOwner"
              role="Owner"
              points="∞"
              avatar="/placeholder.svg"
              joinDate="2023-01-15"
              lastActive="Today"
            />

            <TeamMemberCard
              name="CoOwner1"
              role="Co-Owner"
              points="750"
              avatar="/placeholder.svg"
              joinDate="2023-02-10"
              lastActive="Yesterday"
            />

            <TeamMemberCard
              name="CoOwner2"
              role="Co-Owner"
              points="750"
              avatar="/placeholder.svg"
              joinDate="2023-02-15"
              lastActive="2 days ago"
            />

            <TeamMemberCard
              name="AdminUser1"
              role="Admin"
              points="480"
              avatar="/placeholder.svg"
              joinDate="2023-03-05"
              lastActive="Today"
              warning="20 points deducted for inactivity"
            />

            <TeamMemberCard
              name="AdminUser2"
              role="Admin"
              points="500"
              avatar="/placeholder.svg"
              joinDate="2023-03-10"
              lastActive="Today"
            />

            <TeamMemberCard
              name="ModUser1"
              role="Moderator"
              points="290"
              avatar="/placeholder.svg"
              joinDate="2023-04-20"
              lastActive="3 days ago"
              warning="10 points deducted for unfair punishment"
            />
          </div>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Hierarchy</CardTitle>
              <CardDescription>Role structure and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <RoleCard
                  name="Owner"
                  points="∞"
                  description="Server owner with full permissions"
                  permissions={[
                    "Full server control",
                    "Manage all team members",
                    "Reset points",
                    "Promote/demote members",
                  ]}
                  members={1}
                  icon={<Crown className="h-5 w-5 text-yellow-500" />}
                />

                <RoleCard
                  name="Co-Owner"
                  points="750"
                  description="Trusted administrators with high-level permissions"
                  permissions={[
                    "Manage most server settings",
                    "Manage team members",
                    "Assign points",
                    "Promote/demote with Owner approval",
                  ]}
                  members={2}
                  icon={<Shield className="h-5 w-5 text-yellow-400" />}
                />

                <RoleCard
                  name="Admin"
                  points="500"
                  description="Server administrators with moderation powers"
                  permissions={[
                    "Moderate players",
                    "Ban/kick players",
                    "Manage basic server settings",
                    "Approve point deductions",
                  ]}
                  members={2}
                  icon={<Shield className="h-5 w-5 text-red-600" />}
                />

                <RoleCard
                  name="Moderator"
                  points="300"
                  description="Server moderators who enforce rules"
                  permissions={["Moderate chat", "Temporary bans", "Mute players", "Suggest point deductions"]}
                  members={3}
                  icon={<Shield className="h-5 w-5 text-blue-600" />}
                />

                <RoleCard
                  name="Supporter"
                  points="200"
                  description="Entry-level team members who assist players"
                  permissions={["Help players", "Report rule violations", "Basic moderation tools"]}
                  members={4}
                  icon={<Shield className="h-5 w-5 text-gray-400" />}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="points" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Points System Rules</CardTitle>
              <CardDescription>Rules for point deductions and demotions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Point Deductions</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center border-b pb-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span>Ban without reason</span>
                      </div>
                      <span className="font-medium text-red-500">-5 points</span>
                    </div>

                    <div className="flex justify-between items-center border-b pb-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span>Unfair punishment</span>
                      </div>
                      <span className="font-medium text-red-500">-10 points</span>
                    </div>

                    <div className="flex justify-between items-center border-b pb-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span>Admin rights abuse</span>
                      </div>
                      <span className="font-medium text-red-500">-20 points</span>
                    </div>

                    <div className="flex justify-between items-center border-b pb-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span>Inactivity without notice</span>
                      </div>
                      <span className="font-medium text-red-500">-10 points</span>
                    </div>

                    <div className="flex justify-between items-center border-b pb-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span>Repeated violations</span>
                      </div>
                      <span className="font-medium text-red-500">-30 points</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Demotion Thresholds</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center border-b pb-2">
                      <span>Co-Owner → Admin</span>
                      <span className="font-medium">500 points</span>
                    </div>

                    <div className="flex justify-between items-center border-b pb-2">
                      <span>Admin → Jr. Admin</span>
                      <span className="font-medium">400 points</span>
                    </div>

                    <div className="flex justify-between items-center border-b pb-2">
                      <span>Jr. Admin → Moderator</span>
                      <span className="font-medium">300 points</span>
                    </div>

                    <div className="flex justify-between items-center border-b pb-2">
                      <span>Moderator → Jr. Moderator</span>
                      <span className="font-medium">250 points</span>
                    </div>

                    <div className="flex justify-between items-center border-b pb-2">
                      <span>Jr. Moderator → Supporter</span>
                      <span className="font-medium">200 points</span>
                    </div>

                    <div className="flex justify-between items-center border-b pb-2">
                      <span>Supporter → Jr. Supporter</span>
                      <span className="font-medium">150 points</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Any role → Removed</span>
                      <span className="font-medium text-red-500">0 points</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Important Rules</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Points are reset on the 1st of each month, but demotions remain</li>
                    <li>Admins and Co-Owners must document rule violations in Discord</li>
                    <li>Team members with 0 or fewer points are removed</li>
                    <li>Owner & Co-Owner can reset points if someone was unfairly treated</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface TeamMemberCardProps {
  name: string
  role: string
  points: string
  avatar: string
  joinDate: string
  lastActive: string
  warning?: string
}

function TeamMemberCard({ name, role, points, avatar, joinDate, lastActive, warning }: TeamMemberCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center mb-4">
          <Avatar className="h-20 w-20 mb-2">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback>{name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <h3 className="font-medium text-lg">{name}</h3>
          <div className="flex items-center mt-1">
            {role === "Owner" && <Crown className="h-4 w-4 text-yellow-500 mr-1" />}
            {role === "Co-Owner" && <Shield className="h-4 w-4 text-yellow-400 mr-1" />}
            {role === "Admin" && <Shield className="h-4 w-4 text-red-600 mr-1" />}
            {role === "Moderator" && <Shield className="h-4 w-4 text-blue-600 mr-1" />}
            {role === "Supporter" && <Shield className="h-4 w-4 text-gray-400 mr-1" />}
            <Badge variant="outline">{role}</Badge>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Points</span>
              <span className="font-medium">{points}</span>
            </div>
            {role !== "Owner" && (
              <Progress
                value={
                  Number.parseInt(points) /
                  (role === "Co-Owner" ? 7.5 : role === "Admin" ? 5 : role === "Moderator" ? 3 : 2)
                }
                className="h-2"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Joined</span>
              <p>{new Date(joinDate).toLocaleDateString()}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Last Active</span>
              <p>{lastActive}</p>
            </div>
          </div>

          {warning && (
            <div className="bg-red-500/10 text-red-500 p-2 rounded-md text-sm flex items-start">
              <AlertTriangle className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
              <span>{warning}</span>
            </div>
          )}

          <div className="flex justify-center gap-2 mt-4">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/team/${name}`}>View Profile</Link>
            </Button>
            <Button size="sm">Manage</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface RoleCardProps {
  name: string
  points: string
  description: string
  permissions: string[]
  members: number
  icon: React.ReactNode
}

function RoleCard({ name, points, description, permissions, members, icon }: RoleCardProps) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-medium">{name}</h3>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{points} Points</Badge>
          <Badge variant="secondary">
            {members} member{members !== 1 ? "s" : ""}
          </Badge>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4">{description}</p>

      <div>
        <h4 className="text-sm font-medium mb-2">Permissions:</h4>
        <ul className="text-sm space-y-1 list-disc pl-5">
          {permissions.map((permission, index) => (
            <li key={index}>{permission}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

