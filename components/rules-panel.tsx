"use client"

import { useStore } from "@/lib/store"

export default function RulesPanel() {
  const { rules } = useStore()

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Serverregeln</h2>

      <div className="space-y-4">
        {rules.length === 0 ? (
          <p className="text-muted-foreground italic">Keine Regeln vorhanden</p>
        ) : (
          <ul className="space-y-2">
            {rules.map((rule, index) => (
              <li key={rule.id} className="border rounded-lg p-4">
                <div className="flex gap-3">
                  <span className="font-bold">{index + 1}.</span>
                  <span>{rule.text}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

