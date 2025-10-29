"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Save, Trophy } from "lucide-react"

export function LeaderboardSettings() {
  const [topPlayersCount, setTopPlayersCount] = useState(10)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    // In a real app, this would save to the database
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            <CardTitle>Leaderboard Display Settings</CardTitle>
          </div>
          <CardDescription>Configure how many top players to display on the leaderboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="top-players">Number of Top Players to Display</Label>
            <div className="flex items-center gap-4">
              <Input
                id="top-players"
                type="number"
                min="5"
                max="50"
                value={topPlayersCount}
                onChange={(e) => setTopPlayersCount(Number.parseInt(e.target.value) || 10)}
                className="max-w-[200px]"
              />
              <Badge variant="outline">Currently showing Top {topPlayersCount}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Set how many top players appear on the leaderboard (5-50 players)
            </p>
          </div>

          <div className="pt-4 border-t border-border">
            <Button onClick={handleSave} className="gap-2">
              <Save className="w-4 h-4" />
              {saved ? "Saved!" : "Save Settings"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Presets</CardTitle>
          <CardDescription>Common leaderboard configurations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[5, 10, 15, 20].map((count) => (
              <Button
                key={count}
                variant={topPlayersCount === count ? "default" : "outline"}
                onClick={() => setTopPlayersCount(count)}
              >
                Top {count}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
