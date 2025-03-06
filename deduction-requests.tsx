"use client"

import { useState, useEffect } from "react"
import MainLayout from "./layout/main-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Check, X, AlertTriangle, Clock, User } from "lucide-react"
import type { PointDeductionRequest, User as UserType } from "@/lib/types"
import { getDeductionRequests, saveDeductionRequests, getUsers, saveUsers, getCurrentUser } from "@/lib/storage"
import { getUserPermissions } from "@/lib/permissions"
import { toast } from "sonner"
import { ranks } from "@/lib/data"

export default function DeductionRequests() {
  const [requests, setRequests] = useState<PointDeductionRequest[]>([])
  const [users, setUsers] = useState<UserType[]>([])
  const [selectedRequest, setSelectedRequest] = useState<PointDeductionRequest | null>(null)
  const [reviewNote, setReviewNote] = useState("")
  const [currentUser, setCurrentUser] = useState<UserType | null>(null)

  useEffect(() => {
    // Load data from storage
    const storedRequests = getDeductionRequests()
    const storedUsers = getUsers()
    const user = getCurrentUser()

    setRequests(storedRequests)
    setUsers(storedUsers)
    setCurrentUser(user)

    // Check if user has permission to view this page
    if (user) {
      const permissions = getUserPermissions(user.rank)
      if (!permissions.canApproveDeduction) {
        // Redirect to dashboard if no permission
        window.location.href = "/dashboard"
      }
    }
  }, [])

  const handleApproveRequest = () => {
    if (!selectedRequest || !currentUser) return

    // Update the request status
    const updatedRequests = requests.map((req) => {
      if (req.id === selectedRequest.id) {
        return {
          ...req,
          status: "approved",
          reviewedBy: currentUser.id,
          reviewedAt: new Date().toISOString(),
          reviewNote: reviewNote,
        }
      }
      return req
    })

    // Apply the point deduction to the user
    const updatedUsers = users.map((user) => {
      if (user.id === selectedRequest.userId) {
        const newPoints = Math.max(0, user.points - selectedRequest.points)

        // Check if user should be demoted
        let newRank = user.rank
        for (const rank of ranks) {
          if (rank.minPoints > newPoints && rank.name === user.rank) {
            // Find the next lower rank
            const rankIndex = ranks.findIndex((r) => r.name === user.rank)
            if (rankIndex > 0) {
              newRank = ranks[rankIndex - 1].name
            }
            break
          }
        }

        return {
          ...user,
          points: newPoints,
          rank: newRank,
          history: [
            {
              date: new Date().toISOString(),
              action: `Point deduction: -${selectedRequest.points}`,
              reason: selectedRequest.reason,
            },
            ...user.history,
          ],
        }
      }
      return user
    })

    // Save changes
    saveDeductionRequests(updatedRequests)
    saveUsers(updatedUsers)

    // Update state
    setRequests(updatedRequests)
    setUsers(updatedUsers)
    setSelectedRequest(null)
    setReviewNote("")

    // Show success message
    const targetUser = users.find((u) => u.id === selectedRequest.userId)
    toast.success(`Approved point deduction for ${targetUser?.name}`)
  }

  const handleRejectRequest = () => {
    if (!selectedRequest || !currentUser) return

    // Update the request status
    const updatedRequests = requests.map((req) => {
      if (req.id === selectedRequest.id) {
        return {
          ...req,
          status: "rejected",
          reviewedBy: currentUser.id,
          reviewedAt: new Date().toISOString(),
          reviewNote: reviewNote,
        }
      }
      return req
    })

    // Save changes
    saveDeductionRequests(updatedRequests)

    // Update state
    setRequests(updatedRequests)
    setSelectedRequest(null)
    setReviewNote("")

    // Show success message
    const targetUser = users.find((u) => u.id === selectedRequest.userId)
    toast.success(`Rejected point deduction for ${targetUser?.name}`)
  }

  // Filter requests by status
  const pendingRequests = requests.filter((req) => req.status === "pending")
  const approvedRequests = requests.filter((req) => req.status === "approved")
  const rejectedRequests = requests.filter((req) => req.status === "rejected")

  // Helper function to get user by ID
  const getUserById = (userId: string) => {
    return users.find((user) => user.id === userId)
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <header className="mb-8 animate-slide-down">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Point Deduction Requests</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Review and manage point deduction requests from team members
          </p>
        </header>

        <Tabs defaultValue="pending" className="w-full animate-fade-in">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-900 transition-colors">
            <TabsTrigger value="pending" className="transition-colors">
              Pending
              {pendingRequests.length > 0 && (
                <Badge variant="destructive" className="ml-2 animate-pulse-subtle">
                  {pendingRequests.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved" className="transition-colors">
              Approved
            </TabsTrigger>
            <TabsTrigger value="rejected" className="transition-colors">
              Rejected
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">
            {pendingRequests.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <AlertTriangle className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p className="text-lg">No pending requests</p>
                <p className="text-sm">All point deduction requests have been processed</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pendingRequests.map((request, index) => {
                  const targetUser = getUserById(request.userId)
                  const requestedBy = getUserById(request.requestedBy)

                  return (
                    <Card
                      key={request.id}
                      className="border-amber-200 dark:border-amber-800/50 bg-white dark:bg-black transition-colors hover:shadow-md animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CardHeader className="bg-amber-50 dark:bg-amber-950/20 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>Point Deduction Request</CardTitle>
                            <CardDescription>
                              Requested on {new Date(request.createdAt).toLocaleDateString()}
                            </CardDescription>
                          </div>
                          <Badge
                            variant="outline"
                            className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/50 transition-colors"
                          >
                            Pending
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-10 w-10 border-2 border-gray-200 dark:border-gray-800 transition-colors">
                              <AvatarImage
                                src={
                                  targetUser?.avatar ||
                                  `https://mc-heads.net/avatar/${targetUser?.minecraftUsername}/100`
                                }
                                alt={targetUser?.name || "User"}
                              />
                              <AvatarFallback>
                                <User className="h-5 w-5" />
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{targetUser?.name || "Unknown User"}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Current Points: {targetUser?.points || 0}
                              </p>
                            </div>
                          </div>

                          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md border border-gray-200 dark:border-gray-800 transition-colors">
                            <div className="flex justify-between mb-2">
                              <span className="text-sm font-medium">Requested Deduction:</span>
                              <span className="text-red-500 dark:text-red-400 font-bold">-{request.points} points</span>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{request.reason}</p>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <Clock className="h-4 w-4" />
                            <span>
                              Requested by {requestedBy?.name || request.requestedByUsername} •{" "}
                              {new Date(request.createdAt).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between gap-2 border-t border-gray-200 dark:border-gray-800 pt-4 transition-colors">
                        <Button
                          variant="outline"
                          className="w-full border-red-200 hover:border-red-300 dark:border-red-800/50 dark:hover:border-red-700 text-red-600 dark:text-red-400 transition-colors"
                          onClick={() => setSelectedRequest(request)}
                        >
                          <X className="mr-2 h-4 w-4" /> Reject
                        </Button>
                        <Button
                          className="w-full bg-black hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-200 dark:text-black transition-colors"
                          onClick={() => setSelectedRequest(request)}
                        >
                          <Check className="mr-2 h-4 w-4" /> Review
                        </Button>
                      </CardFooter>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="approved" className="mt-6">
            {approvedRequests.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <p className="text-lg">No approved requests</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {approvedRequests.map((request, index) => {
                  const targetUser = getUserById(request.userId)
                  const requestedBy = getUserById(request.requestedBy)
                  const reviewedBy = getUserById(request.reviewedBy || "")

                  return (
                    <Card
                      key={request.id}
                      className="border-green-200 dark:border-green-800/50 bg-white dark:bg-black transition-colors animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CardHeader className="bg-green-50 dark:bg-green-950/20 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>Point Deduction Request</CardTitle>
                            <CardDescription>
                              Approved on{" "}
                              {request.reviewedAt ? new Date(request.reviewedAt).toLocaleDateString() : "Unknown"}
                            </CardDescription>
                          </div>
                          <Badge
                            variant="outline"
                            className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800/50 transition-colors"
                          >
                            Approved
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-10 w-10 border-2 border-gray-200 dark:border-gray-800 transition-colors">
                              <AvatarImage
                                src={
                                  targetUser?.avatar ||
                                  `https://mc-heads.net/avatar/${targetUser?.minecraftUsername}/100`
                                }
                                alt={targetUser?.name || "User"}
                              />
                              <AvatarFallback>
                                <User className="h-5 w-5" />
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{targetUser?.name || "Unknown User"}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Points Deducted: {request.points}
                              </p>
                            </div>
                          </div>

                          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md border border-gray-200 dark:border-gray-800 transition-colors">
                            <div className="text-sm font-medium mb-2">Reason for deduction:</div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{request.reason}</p>
                          </div>

                          {request.reviewNote && (
                            <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-md border border-green-200 dark:border-green-800/50 transition-colors">
                              <div className="text-sm font-medium mb-2">Review note:</div>
                              <p className="text-sm text-gray-700 dark:text-gray-300">{request.reviewNote}</p>
                            </div>
                          )}

                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <Clock className="h-4 w-4" />
                            <span>Approved by {reviewedBy?.name || "Admin"}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="rejected" className="mt-6">
            {rejectedRequests.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <p className="text-lg">No rejected requests</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {rejectedRequests.map((request, index) => {
                  const targetUser = getUserById(request.userId)
                  const requestedBy = getUserById(request.requestedBy)
                  const reviewedBy = getUserById(request.reviewedBy || "")

                  return (
                    <Card
                      key={request.id}
                      className="border-red-200 dark:border-red-800/50 bg-white dark:bg-black transition-colors animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CardHeader className="bg-red-50 dark:bg-red-950/20 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>Point Deduction Request</CardTitle>
                            <CardDescription>
                              Rejected on{" "}
                              {request.reviewedAt ? new Date(request.reviewedAt).toLocaleDateString() : "Unknown"}
                            </CardDescription>
                          </div>
                          <Badge
                            variant="outline"
                            className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800/50 transition-colors"
                          >
                            Rejected
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-10 w-10 border-2 border-gray-200 dark:border-gray-800 transition-colors">
                              <AvatarImage
                                src={
                                  targetUser?.avatar ||
                                  `https://mc-heads.net/avatar/${targetUser?.minecraftUsername}/100`
                                }
                                alt={targetUser?.name || "User"}
                              />
                              <AvatarFallback>
                                <User className="h-5 w-5" />
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{targetUser?.name || "Unknown User"}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Requested Deduction: {request.points} points
                              </p>
                            </div>
                          </div>

                          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md border border-gray-200 dark:border-gray-800 transition-colors">
                            <div className="text-sm font-medium mb-2">Reason for request:</div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{request.reason}</p>
                          </div>

                          {request.reviewNote && (
                            <div className="bg-red-50 dark:bg-red-950/20 p-3 rounded-md border border-red-200 dark:border-red-800/50 transition-colors">
                              <div className="text-sm font-medium mb-2">Rejection reason:</div>
                              <p className="text-sm text-gray-700 dark:text-gray-300">{request.reviewNote}</p>
                            </div>
                          )}

                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <Clock className="h-4 w-4" />
                            <span>Rejected by {reviewedBy?.name || "Admin"}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Review Dialog */}
        {selectedRequest && (
          <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
            <DialogContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 transition-colors animate-scale">
              <DialogHeader>
                <DialogTitle>Review Point Deduction Request</DialogTitle>
                <DialogDescription>
                  Review the request to deduct {selectedRequest.points} points from{" "}
                  {getUserById(selectedRequest.userId)?.name}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md border border-gray-200 dark:border-gray-800 transition-colors">
                  <div className="text-sm font-medium mb-2">Reason for deduction:</div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{selectedRequest.reason}</p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="review-note" className="text-sm font-medium">
                    Add a note (optional):
                  </label>
                  <Textarea
                    id="review-note"
                    placeholder="Add your review comments here..."
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 transition-colors"
                  />
                </div>
              </div>

              <DialogFooter className="flex gap-2">
                <Button
                  variant="outline"
                  className="border-red-200 hover:border-red-300 dark:border-red-800/50 dark:hover:border-red-700 text-red-600 dark:text-red-400 transition-colors"
                  onClick={handleRejectRequest}
                >
                  <X className="mr-2 h-4 w-4" /> Reject Request
                </Button>
                <Button
                  className="bg-black hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-200 dark:text-black transition-colors"
                  onClick={handleApproveRequest}
                >
                  <Check className="mr-2 h-4 w-4" /> Approve Deduction
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </MainLayout>
  )
}

