"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Calendar, Clock, History } from "lucide-react"
import { useLanguage } from "../hooks/use-language"
import { translations } from "../data/translations"

export function UserForm({ user, currentUser, onUpdate, isAdmin, isOperator, onPointDeduction }) {
  const [editedUser, setEditedUser] = useState(user)
  const [deductionPoints, setDeductionPoints] = useState(5)
  const [deductionReason, setDeductionReason] = useState("")
  const [activeTab, setActiveTab] = useState("info")
  const { language } = useLanguage()
  const t = translations[language]

  // Check if current user can edit this user
  const canEdit = isOperator || currentUser.id === user.id

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditedUser((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    onUpdate(editedUser)
  }

  const handleDeduction = () => {
    if (deductionPoints > 0 && deductionReason) {
      onPointDeduction(user.id, deductionPoints, deductionReason)
      setDeductionPoints(5)
      setDeductionReason("")
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat(language === "de" ? "de-DE" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <Avatar className="w-16 h-16 border-2 border-zinc-700">
          <AvatarImage src={`https://mc-heads.net/avatar/${editedUser.minecraftUsername}`} />
          <AvatarFallback>{editedUser.username.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold">{editedUser.username}</h3>
            <Badge className="ml-2">{editedUser.rank}</Badge>
            {["Owner", "Co-Owner"].includes(editedUser.rank) && <Badge className="bg-red-600">{t.operator}</Badge>}
          </div>
          <p className="text-zinc-400">
            Minecraft: {editedUser.minecraftUsername} • {t.points}: {editedUser.points}
          </p>
        </div>

        {isAdmin && user.id !== currentUser.id && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm" className="ml-auto">
                <AlertTriangle className="mr-2 h-4 w-4" />
                {isOperator ? t.deductPoints : t.requestDeduction}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{isOperator ? t.deductPoints : t.requestPointDeduction}</DialogTitle>
                <DialogDescription>
                  {isOperator ? t.applyPointDeduction : t.submitRequestForOperators}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="points">{t.pointsToDeduct}</Label>
                  <Select
                    value={deductionPoints.toString()}
                    onValueChange={(value) => setDeductionPoints(Number.parseInt(value))}
                  >
                    <SelectTrigger className="bg-zinc-800 border-zinc-700">
                      <SelectValue placeholder={t.selectPoints} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 {t.points}</SelectItem>
                      <SelectItem value="10">10 {t.points}</SelectItem>
                      <SelectItem value="15">15 {t.points}</SelectItem>
                      <SelectItem value="20">20 {t.points}</SelectItem>
                      <SelectItem value="30">30 {t.points}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="reason">{t.reason}</Label>
                  <Textarea
                    id="reason"
                    value={deductionReason}
                    onChange={(e) => setDeductionReason(e.target.value)}
                    placeholder={t.explainReasonForDeduction}
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setDeductionPoints(5)
                    setDeductionReason("")
                  }}
                >
                  {t.cancel}
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeduction}
                  disabled={deductionPoints <= 0 || !deductionReason}
                >
                  {isOperator ? t.applyDeduction : t.submitRequest}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="info">{t.info}</TabsTrigger>
          <TabsTrigger value="history">{t.history}</TabsTrigger>
          <TabsTrigger value="schedule">{t.schedule}</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">{t.username}</Label>
              <Input
                id="username"
                name="username"
                value={editedUser.username}
                onChange={handleChange}
                disabled={!canEdit}
                className="bg-zinc-800 border-zinc-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minecraftUsername">{t.minecraftUsername}</Label>
              <Input
                id="minecraftUsername"
                name="minecraftUsername"
                value={editedUser.minecraftUsername}
                onChange={handleChange}
                disabled={!canEdit}
                className="bg-zinc-800 border-zinc-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rank">{t.rank}</Label>
              <Select
                disabled={!isOperator}
                value={editedUser.rank}
                onValueChange={(value) => setEditedUser((prev) => ({ ...prev, rank: value }))}
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700">
                  <SelectValue placeholder={t.selectRank} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Owner">Owner</SelectItem>
                  <SelectItem value="Co-Owner">Co-Owner</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Jr. Admin">Jr. Admin</SelectItem>
                  <SelectItem value="Moderator">Moderator</SelectItem>
                  <SelectItem value="Jr. Moderator">Jr. Moderator</SelectItem>
                  <SelectItem value="Supporter">Supporter</SelectItem>
                  <SelectItem value="Jr. Supporter">Jr. Supporter</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="points">{t.points}</Label>
              <Input
                id="points"
                name="points"
                type="number"
                value={editedUser.points}
                onChange={handleChange}
                disabled={!isOperator}
                className="bg-zinc-800 border-zinc-700"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">{t.notes}</Label>
              <Textarea
                id="notes"
                name="notes"
                value={editedUser.notes || ""}
                onChange={handleChange}
                disabled={!canEdit}
                className="min-h-[100px] bg-zinc-800 border-zinc-700"
                placeholder={t.addNotesAboutTeamMember}
              />
            </div>
          </div>

          {canEdit && (
            <div className="flex justify-end">
              <Button onClick={handleSave}>{t.saveChanges}</Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="pt-4">
          <Card className="bg-zinc-800 border-zinc-700">
            <CardContent className="p-4">
              {user.history && user.history.length > 0 ? (
                <div className="space-y-4">
                  {user.history.map((entry, index) => (
                    <div key={index} className="flex gap-3 pb-3 border-b border-zinc-700">
                      <History className="h-5 w-5 text-zinc-400 mt-0.5" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-zinc-400">{formatDate(entry.date)}</span>
                          {entry.pointsChange !== 0 && (
                            <Badge className={entry.pointsChange > 0 ? "bg-green-600" : "bg-red-600"}>
                              {entry.pointsChange > 0 ? "+" : ""}
                              {entry.pointsChange} {t.points}
                            </Badge>
                          )}
                        </div>
                        <p className="mt-1">{entry.action}</p>
                        {entry.performedBy && (
                          <p className="text-xs text-zinc-400 mt-1">
                            {t.by}: {entry.performedBy}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-zinc-500">{t.noHistoryAvailable}</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="pt-4">
          <Card className="bg-zinc-800 border-zinc-700">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{t.upcomingShifts}</h3>
                  {isAdmin && (
                    <Button variant="outline" size="sm">
                      <Calendar className="mr-2 h-4 w-4" />
                      {t.addShift}
                    </Button>
                  )}
                </div>

                {user.shifts && user.shifts.length > 0 ? (
                  <div className="space-y-3">
                    {user.shifts.map((shift, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900">
                        <Calendar className="h-5 w-5 text-zinc-400" />
                        <div className="flex-1">
                          <p className="font-medium">{shift.title}</p>
                          <div className="flex items-center text-sm text-zinc-400">
                            <Clock className="mr-1 h-3 w-3" />
                            {shift.date} • {shift.time}
                          </div>
                        </div>
                        {isAdmin && (
                          <Button variant="ghost" size="sm">
                            {t.edit}
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-zinc-500">{t.noScheduledShifts}</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

