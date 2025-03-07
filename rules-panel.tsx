"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function RulesPanel() {
  const violations = [
    { violation: "Ban ohne Begründung", points: -5 },
    { violation: "Unfaire oder ungerechtfertigte Strafe gegen Spieler", points: -10 },
    { violation: "Missbrauch der Admin-Rechte (z. B. sich OP geben, ohne Erlaubnis)", points: -20 },
    { violation: "Beleidigung oder schlechtes Verhalten gegenüber Spielern", points: -15 },
    { violation: "Inaktiv ohne Abmeldung (z. B. 2 Wochen)", points: -10 },
    { violation: "Wiederholtes Fehlverhalten trotz Ermahnung", points: -30 },
    { violation: "Spamming von Befehlen oder Nachrichten", points: -5 },
    { violation: "Schwere Regelverstöße (z. B. Server- oder Spieler-Daten manipulieren)", points: -20 },
  ]
  
  const degradations = [
    { from: "Co-Owner", to: "Admin", points: 500 },
    { from: "Admin", to: "Jr. Admin", points: 400 },
    { from: "Jr. Admin", to: "Moderator", points: 300 },
    { from: "Moderator", to: "Jr. Moderator", points: 250 },
    { from: "Jr. Moderator", to: "Supporter", points: 200 },
    { from: "Supporter", to: "Jr. Supporter", points: 150 },
    { from: "Jr. Supporter", to: "Entfernt aus dem Team", points: 0 },
  ]
  
  const importantRules = [
    "Punkte werden am 1. jedes Monats zurückgesetzt, aber runter Stufungen bleiben bestehend",
    "Admins und Co-Owner müssen Regelverstöße im Discord protokollieren (z. B. wenn sie einen Spieler bannen).",
    "Bei 0 Punkten oder weniger wird ein Teammitglied entfernt.",
    "Owner & Co-Owner können Punkte zurücksetzen oder vergeben, falls jemand unfair behandelt wurde."
  ]
  
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="bg-zinc-800 border-zinc-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-red-500">⚠</span> Punktabzüge für Regelverstöße
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-zinc-700/50">
                <TableHead>Verstoß</TableHead>
                <TableHead className="text-right">Punktabzug</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {violations.map((item, index) => (
                <TableRow key={index} className="hover:bg-zinc-700/50">
                  <TableCell>{item.violation}</TableCell>
                  <TableCell className="text-right text-red-400">{item.points} Punkte</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <div className="space-y-6">
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>📉</span> Degradierungssystem
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-zinc-700/50">
                  <TableHead>Rang</TableHead>
                  <TableHead className="text-right">Punkte für Degradierung</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {degradations.map((item, index) => (
                  <TableRow key={index} className="hover:bg-zinc-700/50">
                    <TableCell>{item.from} → {item.to}</TableCell>
                    <TableCell className="text-right">{item.points} Punkte</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <p className="mt-4 text-red-400 text-sm">
              ⚠️ Wenn ein Teammitglied unter 0 Punkte fällt, wird es direkt aus dem Team entfernt!
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>📌</span> Wichtige Regeln
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal pl-5 space-y-2">
              {importantRules.map((rule, index) => (
                <li key={index}>{rule}</li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
