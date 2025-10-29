import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Ban, Volume2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function RestrictionsPage() {
  const restrictions = [
    {
      id: 1,
      player: "PlayerOne",
      type: "Ban",
      reason: "Cheating",
      duration: "Permanent",
      date: "2025-10-20",
      status: "Active",
    },
    {
      id: 2,
      player: "PlayerTwo",
      type: "Mute",
      reason: "Toxic behavior",
      duration: "7 days",
      date: "2025-10-25",
      status: "Active",
    },
    {
      id: 3,
      player: "PlayerThree",
      type: "Ban",
      reason: "Exploiting",
      duration: "30 days",
      date: "2025-10-15",
      status: "Expired",
    },
  ]

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-8 h-8 text-destructive" />
            <h1 className="text-3xl font-bold text-foreground">Restrictions</h1>
          </div>
          <p className="text-muted-foreground">Manage player bans, mutes, and restrictions</p>
        </div>
        <Button variant="destructive">
          <Ban className="w-4 h-4 mr-2" />
          Add Restriction
        </Button>
      </div>

      <div className="grid gap-4">
        {restrictions.map((restriction) => (
          <Card key={restriction.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {restriction.type === "Ban" ? (
                    <Ban className="w-5 h-5 text-destructive" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-amber-500" />
                  )}
                  <div>
                    <CardTitle className="text-lg">{restriction.player}</CardTitle>
                    <p className="text-sm text-muted-foreground">{restriction.reason}</p>
                  </div>
                </div>
                <Badge variant={restriction.status === "Active" ? "destructive" : "secondary"}>
                  {restriction.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium">{restriction.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">{restriction.date}</span>
                </div>
                <div className="ml-auto">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}
