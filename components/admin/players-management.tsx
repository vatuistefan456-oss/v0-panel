"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Users, Search, Coins, DollarSign, Plus, Minus } from "lucide-react"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { updatePlayerBalance } from "@/app/actions/admin"

interface Player {
  id: string
  username: string
  steam_name: string | null
  steam_avatar_url: string | null
  credits: number
  real_money_balance: number
  vip_tier: string
  rank: string
}

interface PlayersManagementProps {
  players: Player[]
  isDemo: boolean
}

export function PlayersManagement({ players, isDemo }: PlayersManagementProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [creditsAmount, setCreditsAmount] = useState("")
  const [moneyAmount, setMoneyAmount] = useState("")
  const [isPending, startTransition] = useTransition()

  const filteredPlayers = players.filter(
    (player) =>
      player.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.steam_name?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleUpdateBalance = (type: "credits" | "money", operation: "add" | "subtract") => {
    if (isDemo) {
      toast.error("This feature is disabled in demo mode")
      return
    }

    if (!selectedPlayer) return

    const amount = type === "credits" ? Number.parseInt(creditsAmount) : Number.parseFloat(moneyAmount)
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount")
      return
    }

    startTransition(async () => {
      const result = await updatePlayerBalance(selectedPlayer.id, type, operation, amount)
      if (result.success) {
        toast.success(result.message)
        setCreditsAmount("")
        setMoneyAmount("")
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 text-primary">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Players Management</h1>
            <p className="text-sm text-muted-foreground">Manage player balances and accounts</p>
          </div>
        </div>
        <Badge variant="outline" className="text-sm">
          {filteredPlayers.length} Players
        </Badge>
      </div>

      <Card className="p-4 bg-card border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by username or Steam name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlayers.map((player) => (
          <Dialog key={player.id}>
            <DialogTrigger asChild>
              <Card
                className="p-4 bg-card border-border hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => setSelectedPlayer(player)}
              >
                <div className="flex items-start gap-3 mb-3">
                  {player.steam_avatar_url ? (
                    <img
                      src={player.steam_avatar_url || "/placeholder.svg"}
                      alt={player.username}
                      className="w-12 h-12 rounded-lg border border-border"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                      <Users className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-foreground truncate">{player.username}</h3>
                    {player.steam_name && <p className="text-xs text-muted-foreground truncate">{player.steam_name}</p>}
                    <Badge variant="outline" className="mt-1 text-xs">
                      {player.vip_tier}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Coins className="w-4 h-4 text-chart-3" />
                      <span className="text-xs text-muted-foreground">Credits</span>
                    </div>
                    <span className="text-sm font-bold text-foreground">{player.credits.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-chart-4" />
                      <span className="text-xs text-muted-foreground">Balance</span>
                    </div>
                    <span className="text-sm font-bold text-foreground">${player.real_money_balance.toFixed(2)}</span>
                  </div>
                </div>
              </Card>
            </DialogTrigger>

            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Manage Player Balance</DialogTitle>
                <DialogDescription>
                  Add or subtract credits and real money for {selectedPlayer?.username}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Credits Management */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-chart-3" />
                    Credits
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Amount"
                      value={creditsAmount}
                      onChange={(e) => setCreditsAmount(e.target.value)}
                      disabled={isPending || isDemo}
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleUpdateBalance("credits", "add")}
                      disabled={isPending || isDemo}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleUpdateBalance("credits", "subtract")}
                      disabled={isPending || isDemo}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Current: {selectedPlayer?.credits.toLocaleString()} credits
                  </p>
                </div>

                {/* Real Money Management */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-chart-4" />
                    Real Money
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Amount"
                      value={moneyAmount}
                      onChange={(e) => setMoneyAmount(e.target.value)}
                      disabled={isPending || isDemo}
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleUpdateBalance("money", "add")}
                      disabled={isPending || isDemo}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleUpdateBalance("money", "subtract")}
                      disabled={isPending || isDemo}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Current: ${selectedPlayer?.real_money_balance.toFixed(2)}
                  </p>
                </div>

                {isDemo && (
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <p className="text-xs text-amber-500">Balance updates are disabled in demo mode</p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>

      {filteredPlayers.length === 0 && (
        <Card className="p-12 text-center bg-card border-border">
          <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No players found</h3>
          <p className="text-sm text-muted-foreground">Try adjusting your search query</p>
        </Card>
      )}
    </div>
  )
}
