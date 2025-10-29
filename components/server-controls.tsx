"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, Play, Pause, RotateCcw, MapPin } from "lucide-react"

export function ServerControls() {
  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 text-primary">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Server Controls</h2>
          <p className="text-sm text-muted-foreground">Manage server settings</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Button className="flex flex-col items-center gap-2 h-auto py-4 bg-primary/10 hover:bg-primary/20 text-primary border-primary/30">
          <Play className="w-5 h-5" />
          <span className="text-sm font-medium">Start Match</span>
        </Button>
        <Button className="flex flex-col items-center gap-2 h-auto py-4 bg-secondary hover:bg-secondary/80 text-foreground">
          <Pause className="w-5 h-5" />
          <span className="text-sm font-medium">Pause</span>
        </Button>
        <Button className="flex flex-col items-center gap-2 h-auto py-4 bg-secondary hover:bg-secondary/80 text-foreground">
          <RotateCcw className="w-5 h-5" />
          <span className="text-sm font-medium">Restart</span>
        </Button>
        <Button className="flex flex-col items-center gap-2 h-auto py-4 bg-secondary hover:bg-secondary/80 text-foreground">
          <MapPin className="w-5 h-5" />
          <span className="text-sm font-medium">Change Map</span>
        </Button>
      </div>

      <div className="mt-6 p-4 rounded-lg bg-secondary/50 border border-border">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Current Map</p>
            <p className="text-sm font-medium text-foreground">de_dust2</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Game Mode</p>
            <p className="text-sm font-medium text-foreground">Competitive</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Round Time</p>
            <p className="text-sm font-medium text-foreground">1:55</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Max Rounds</p>
            <p className="text-sm font-medium text-foreground">30</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
