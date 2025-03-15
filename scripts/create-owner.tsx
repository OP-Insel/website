"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function CreateOwnerAccount() {
  const { toast } = useToast()
  const [created, setCreated] = useState(false)

  const createOwnerAccount = () => {
    try {
      // Get existing users or create empty array
      const users = JSON.parse(localStorage.getItem("users") || "[]")

      // Check if user already exists
      const userExists = users.some((user: any) => user.username === "edgargamer1781")

      if (userExists) {
        toast({
          title: "Benutzer existiert bereits",
          description: "Ein Benutzer mit diesem Namen existiert bereits.",
          variant: "destructive",
        })
        return
      }

      // Create owner account
      const ownerAccount = {
        id: Date.now().toString(),
        username: "edgargamer1781",
        password: "1L7E8O1", // In a real app, this should be hashed
        role: "owner",
        points: Number.POSITIVE_INFINITY, // Owner has unlimited points
        pointsHistory: [],
        permissions: [
          "manage_users",
          "manage_roles",
          "manage_points",
          "create_content",
          "delete_content",
          "ban_users",
          "view_admin",
          "assign_roles",
        ],
        createdAt: new Date().toISOString(),
        lastPointReset: new Date().toISOString(),
        banned: false,
      }

      // Add owner to users array
      users.push(ownerAccount)

      // Save to localStorage
      localStorage.setItem("users", JSON.stringify(users))

      // Add to activity log
      const activityLog = JSON.parse(localStorage.getItem("activityLog") || "[]")
      activityLog.unshift({
        id: Date.now().toString(),
        type: "user_created",
        userId: ownerAccount.id,
        username: "System",
        target: ownerAccount.username,
        timestamp: new Date().toISOString(),
        details: "Owner account created",
      })
      localStorage.setItem("activityLog", JSON.stringify(activityLog))

      toast({
        title: "Erfolg",
        description: "Owner-Konto wurde erfolgreich erstellt.",
      })

      setCreated(true)
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Beim Erstellen des Owner-Kontos ist ein Fehler aufgetreten.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Owner-Konto erstellen</CardTitle>
          <CardDescription>Erstelle ein Owner-Konto mit vollen Berechtigungen</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Benutzername:</p>
                <p className="text-sm">edgargamer1781</p>
              </div>
              <div>
                <p className="text-sm font-medium">Passwort:</p>
                <p className="text-sm">1L7E8O1</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">Rolle:</p>
              <p className="text-sm">Owner (mit allen Berechtigungen)</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={createOwnerAccount} className="w-full" disabled={created}>
            {created ? "Owner-Konto erstellt" : "Owner-Konto erstellen"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

