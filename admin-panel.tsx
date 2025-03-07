"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUserStore } from "@/lib/store"
import { AlertTriangle, Download, RefreshCw, Upload } from 'lucide-react'

export function AdminPanel() {
  const { users, resetAllPoints, exportData, importData } = useUserStore()
  
  const handleExport = () => {
    exportData()
  }
  
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string)
        importData(data)
      } catch (error) {
        console.error("Failed to import data:", error)
        alert("Failed to import data. Invalid format.")
      }
    }
    reader.readAsText(file)
  }
  
  return (
    <Tabs defaultValue="settings">
      <TabsList className="grid w-full grid-cols-2 bg-zinc-800">
        <TabsTrigger value="settings">Settings</TabsTrigger>
        <TabsTrigger value="data">Data Management</TabsTrigger>
      </TabsList>
      
      <TabsContent value="settings" className="mt-4">
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader>
            <CardTitle>Team Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="teamName">Team Name</Label>
              <Input 
                id="teamName" 
                defaultValue="Minecraft Server Team" 
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="serverName">Server Name</Label>
              <Input 
                id="serverName" 
                defaultValue="My Minecraft Server" 
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
            
            <div className="pt-4">
              <Button 
                variant="destructive" 
                className="flex items-center gap-2"
                onClick={resetAllPoints}
              >
                <RefreshCw className="w-4 h-4" />
                Reset All Points (Monthly Reset)
              </Button>
              <p className="text-xs text-zinc-400 mt-2">
                <AlertTriangle className="w-3 h-3 inline mr-1" />
                This will reset points for all team members but keep their current ranks.
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="data" className="mt-4">
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Export Data</h3>
                <p className="text-sm text-zinc-400 mb-4">
                  Export all team data to a JSON file for backup or transfer.
                </p>
                <Button onClick={handleExport} className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export Team Data
                </Button>
              </div>
              
              <div className="border-t border-zinc-700 pt-4">
                <h3 className="text-lg font-medium mb-2">Import Data</h3>
                <p className="text-sm text-zinc-400 mb-4">
                  Import team data from a previously exported JSON file.
                </p>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="bg-zinc-800 border-zinc-700"
                  />
                  <Button className="flex-shrink-0">
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
