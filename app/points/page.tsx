import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { TrendingDown, History, Shield } from "lucide-react"

export default function PointsPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Points Management</h1>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="deductions">Deductions</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="request">Request Deduction</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Points Overview</CardTitle>
              <CardDescription>Current point status for all team members</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Current Points</TableHead>
                    <TableHead>Max Points</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">MinecraftOwner</TableCell>
                    <TableCell>Owner</TableCell>
                    <TableCell>∞</TableCell>
                    <TableCell>∞</TableCell>
                    <TableCell>
                      <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Good Standing</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">CoOwner1</TableCell>
                    <TableCell>Co-Owner</TableCell>
                    <TableCell>750</TableCell>
                    <TableCell>750</TableCell>
                    <TableCell>
                      <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Good Standing</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">AdminUser1</TableCell>
                    <TableCell>Admin</TableCell>
                    <TableCell>480</TableCell>
                    <TableCell>500</TableCell>
                    <TableCell>
                      <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Warning</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">ModUser1</TableCell>
                    <TableCell>Moderator</TableCell>
                    <TableCell>290</TableCell>
                    <TableCell>300</TableCell>
                    <TableCell>
                      <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Warning</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">SupportUser1</TableCell>
                    <TableCell>Supporter</TableCell>
                    <TableCell>180</TableCell>
                    <TableCell>200</TableCell>
                    <TableCell>
                      <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Warning</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Demotion Thresholds</CardTitle>
              <CardDescription>Point thresholds for role demotions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Demotion</TableHead>
                    <TableHead>Point Threshold</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Co-Owner → Admin</TableCell>
                    <TableCell>500 Points</TableCell>
                    <TableCell>Automatic demotion when points fall below threshold</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">Admin → Jr. Admin</TableCell>
                    <TableCell>400 Points</TableCell>
                    <TableCell>Automatic demotion when points fall below threshold</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">Jr. Admin → Moderator</TableCell>
                    <TableCell>300 Points</TableCell>
                    <TableCell>Automatic demotion when points fall below threshold</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">Moderator → Jr. Moderator</TableCell>
                    <TableCell>250 Points</TableCell>
                    <TableCell>Automatic demotion when points fall below threshold</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">Any role → Removed</TableCell>
                    <TableCell>0 Points</TableCell>
                    <TableCell>Automatic removal from team when points reach zero</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deductions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Point Deduction Rules</CardTitle>
              <CardDescription>Rules for point deductions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Violation</TableHead>
                    <TableHead>Point Deduction</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Ban without reason</TableCell>
                    <TableCell className="text-red-500">-5 Points</TableCell>
                    <TableCell>Banning a player without providing a valid reason</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">Unfair punishment</TableCell>
                    <TableCell className="text-red-500">-10 Points</TableCell>
                    <TableCell>Issuing an unfair or unjustified punishment to a player</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">Admin rights abuse</TableCell>
                    <TableCell className="text-red-500">-20 Points</TableCell>
                    <TableCell>Misusing admin permissions or privileges</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">Player harassment</TableCell>
                    <TableCell className="text-red-500">-15 Points</TableCell>
                    <TableCell>Harassing or being disrespectful to players</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">Inactivity without notice</TableCell>
                    <TableCell className="text-red-500">-10 Points</TableCell>
                    <TableCell>Being inactive for 2+ weeks without prior notice</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">Repeated violations</TableCell>
                    <TableCell className="text-red-500">-30 Points</TableCell>
                    <TableCell>Continuing to violate rules after warnings</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Apply Point Deduction</CardTitle>
              <CardDescription>Apply a point deduction to a team member</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="member">Team Member</Label>
                  <Select>
                    <SelectTrigger id="member">
                      <SelectValue placeholder="Select member" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin1">AdminUser1</SelectItem>
                      <SelectItem value="mod1">ModUser1</SelectItem>
                      <SelectItem value="support1">SupportUser1</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="violation">Violation Type</Label>
                  <Select>
                    <SelectTrigger id="violation">
                      <SelectValue placeholder="Select violation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ban">Ban without reason</SelectItem>
                      <SelectItem value="unfair">Unfair punishment</SelectItem>
                      <SelectItem value="abuse">Admin rights abuse</SelectItem>
                      <SelectItem value="harassment">Player harassment</SelectItem>
                      <SelectItem value="inactive">Inactivity without notice</SelectItem>
                      <SelectItem value="repeated">Repeated violations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Detailed Reason</Label>
                <Textarea id="reason" placeholder="Provide details about the violation" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="evidence">Evidence (optional)</Label>
                <Input id="evidence" placeholder="Link to screenshots or other evidence" />
              </div>

              <div className="flex justify-end">
                <Button>
                  <Shield className="mr-2 h-4 w-4" />
                  Apply Deduction
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Point Deduction History</CardTitle>
              <CardDescription>Recent point deductions and changes</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Member</TableHead>
                    <TableHead>Change</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Applied By</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>2023-12-01</TableCell>
                    <TableCell className="font-medium">All Members</TableCell>
                    <TableCell className="text-green-500">Reset</TableCell>
                    <TableCell>Monthly point reset</TableCell>
                    <TableCell>System</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>2023-11-28</TableCell>
                    <TableCell className="font-medium">AdminUser1</TableCell>
                    <TableCell className="text-red-500">-20 Points</TableCell>
                    <TableCell>Inactivity without notice</TableCell>
                    <TableCell>Owner</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>2023-11-25</TableCell>
                    <TableCell className="font-medium">ModUser1</TableCell>
                    <TableCell className="text-red-500">-10 Points</TableCell>
                    <TableCell>Unfair punishment to player</TableCell>
                    <TableCell>Co-Owner1</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>2023-11-20</TableCell>
                    <TableCell className="font-medium">SupportUser1</TableCell>
                    <TableCell className="text-red-500">-5 Points</TableCell>
                    <TableCell>Spamming commands</TableCell>
                    <TableCell>AdminUser2</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>2023-11-15</TableCell>
                    <TableCell className="font-medium">AdminUser2</TableCell>
                    <TableCell className="text-green-500">+10 Points</TableCell>
                    <TableCell>Exceptional server management</TableCell>
                    <TableCell>Owner</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="request" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Request Point Deduction</CardTitle>
              <CardDescription>
                Submit a request for point deduction (for roles without direct deduction permissions)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="request-member">Team Member</Label>
                  <Select>
                    <SelectTrigger id="request-member">
                      <SelectValue placeholder="Select member" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin1">AdminUser1</SelectItem>
                      <SelectItem value="mod1">ModUser1</SelectItem>
                      <SelectItem value="support1">SupportUser1</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="request-violation">Violation Type</Label>
                  <Select>
                    <SelectTrigger id="request-violation">
                      <SelectValue placeholder="Select violation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ban">Ban without reason</SelectItem>
                      <SelectItem value="unfair">Unfair punishment</SelectItem>
                      <SelectItem value="abuse">Admin rights abuse</SelectItem>
                      <SelectItem value="harassment">Player harassment</SelectItem>
                      <SelectItem value="inactive">Inactivity without notice</SelectItem>
                      <SelectItem value="repeated">Repeated violations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="request-reason">Detailed Reason</Label>
                <Textarea id="request-reason" placeholder="Provide details about the violation" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="request-evidence">Evidence (required)</Label>
                <Input id="request-evidence" placeholder="Link to screenshots or other evidence" />
                <p className="text-sm text-muted-foreground mt-1">Evidence is required for all deduction requests</p>
              </div>

              <div className="flex justify-end">
                <Button>
                  <TrendingDown className="mr-2 h-4 w-4" />
                  Submit Request
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Pending Requests</CardTitle>
              <CardDescription>Deduction requests you've submitted that are awaiting approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <History className="mx-auto h-8 w-8 mb-2" />
                <p>No pending requests</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

