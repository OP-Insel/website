"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { User, PointDeductionRequest } from "@/lib/types"
import { getRankColor, getMoodEmoji } from "@/lib/utils"
import { Calendar, Clock, MinusCircle } from "lucide-react"
import { getCurrentUser, getDeductionRequests, saveDeductionRequests } from "@/lib/storage"
import { getUserPermissions } from "@/lib/permissions"
import { toast } from "sonner"

interface UserCardProps {
  user: User
  onClick: () => void
  onPointDeduction?: (userId: string, points: number, reason: string) => void
}

export default function UserCard({ user, onClick, onPointDeduction }: UserCardProps) {
  const [isDeductionModalOpen, setIsDeductionModalOpen] = useState(false)
  const [deductionPoints, setDeductionPoints] = useState(5)
  const [deductionReason, setDeductionReason] = useState("")

  const currentUser = getCurrentUser()
  const userPermissions = currentUser ? getUserPermissions(currentUser.rank) : null
  const canDirectlyDeduct = userPermissions?.canDeductPoints || false
  const canSuggestDeduction = userPermissions?.canSuggestDeduction || false

  const handleDeductPoints = () => {
    if (!currentUser) return

    if (canDirectlyDeduct) {
      // Direct deduction for Owner and Co-Owner
      if (onPointDeduction) {
        onPointDeduction(user.id, deductionPoints, deductionReason)
      }
    } else {
      // Create a deduction request for other ranks
      const requests = getDeductionRequests()

      const newRequest: PointDeductionRequest = {
        id: Date.now().toString(),
        userId: user.id,
        requestedBy: currentUser.id,
        requestedByUsername: currentUser.name,
        points: deductionPoints,
        reason: deductionReason,
        status: "pending",
        createdAt: new Date().toISOString(),
      }

      requests.push(newRequest)
      saveDeductionRequests(requests)

      toast.success("Point deduction request submitted for approval")
    }

    setIsDeductionModalOpen(false)
    setDeductionPoints(5)
    setDeductionReason("")
  }

  const rankColor = getRankColor(user.rank)
  const moodEmoji = getMoodEmoji(user)

  return (
    <>
      <Card
        className="overflow-hidden border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:border-gray-300 dark:hover:border-gray-700 transition-all cursor-pointer shadow-md hover:shadow-lg transform hover:-translate-y-1 animate-fade-in"
        onClick={onClick}
      >
        <CardHeader className={`p-4 ${rankColor}`}>
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">{user.name}</h3>
            <span className="text-2xl" title="Mood based on points">
              {moodEmoji}
            </span>
          </div>
          <div className="text-sm opacity-90">{user.rank}</div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-md overflow-hidden border-2 border-gray-200 dark:border-gray-800 transition-transform hover:scale-105">
              <Image
                src={`https://mc-heads.net/avatar/${user.minecraftUsername}/100`}
                alt={user.minecraftUsername}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="font-medium">{user.minecraftUsername}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Joined: {new Date(user.joinedAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Points</div>
              <div className="font-bold text-xl">{user.points}</div>
            </div>

            {(canDirectlyDeduct || canSuggestDeduction) && currentUser?.id !== user.id && (
              <Button
                variant="destructive"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsDeductionModalOpen(true)
                }}
                className="transition-colors hover:bg-red-700"
              >
                <MinusCircle className="w-4 h-4 mr-1" />
                {canDirectlyDeduct ? "Deduct" : "Request"}
              </Button>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 transition-colors">
          <div className="w-full flex justify-between items-center text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {user.nextDeadline ? new Date(user.nextDeadline).toLocaleDateString() : "No deadline"}
            </div>
            <div>
              {user.history.length > 0 && (
                <span className="text-gray-500 dark:text-gray-400">{user.history.length} actions</span>
              )}
            </div>
          </div>
        </CardFooter>
      </Card>

      <Dialog open={isDeductionModalOpen} onOpenChange={setIsDeductionModalOpen}>
        <DialogContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-xl animate-scale">
          <DialogHeader>
            <DialogTitle>
              {canDirectlyDeduct ? `Deduct Points from ${user.name}` : `Request Point Deduction for ${user.name}`}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2 animate-slide-up" style={{ animationDelay: "100ms" }}>
              <Label htmlFor="points">Points to Deduct</Label>
              <Input
                id="points"
                type="number"
                min="1"
                max="30"
                value={deductionPoints}
                onChange={(e) => setDeductionPoints(Number.parseInt(e.target.value))}
                className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 transition-colors"
              />
            </div>
            <div className="grid gap-2 animate-slide-up" style={{ animationDelay: "200ms" }}>
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                placeholder="Explain why points are being deducted..."
                value={deductionReason}
                onChange={(e) => setDeductionReason(e.target.value)}
                className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 transition-colors focus:border-gray-400 dark:focus:border-gray-600"
              />
            </div>

            {!canDirectlyDeduct && (
              <div
                className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-md text-sm border border-blue-200 dark:border-blue-800/50 animate-slide-up"
                style={{ animationDelay: "300ms" }}
              >
                Your request will be sent to an Owner or Co-Owner for approval.
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeductionModalOpen(false)} className="transition-colors">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeductPoints}
              disabled={deductionPoints <= 0 || !deductionReason}
              className="transition-colors hover:bg-red-700"
            >
              {canDirectlyDeduct ? "Deduct Points" : "Submit Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

