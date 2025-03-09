"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Icons } from "@/components/icons"

export default function RestrictedView({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <Card className="w-full max-w-md p-8 bg-black/40 backdrop-blur-xl border-gray-800">
        <div className="text-center space-y-6">
          <Icons.lock className="w-16 h-16 mx-auto text-destructive/80" />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-destructive">Access Restricted</h2>
            <p className="text-muted-foreground">You don't have permission to access this system.</p>
            <p className="text-muted-foreground">Please contact the server owner to request access.</p>
          </div>

          <Button variant="destructive" onClick={onLogout} className="w-full">
            <Icons.logOut className="mr-2 h-5 w-5" />
            Logout
          </Button>
        </div>
      </Card>
    </div>
  )
}

