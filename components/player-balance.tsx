"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { DollarSign, Coins } from "lucide-react"

export function PlayerBalance() {
  const [balance, setBalance] = useState({ realMoney: 0, credits: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBalance()
  }, [])

  const fetchBalance = async () => {
    try {
      const response = await fetch("/api/player/balance")
      if (response.ok) {
        const data = await response.json()
        setBalance(data)
      }
    } catch (error) {
      console.error("[v0] Failed to fetch balance:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 animate-pulse">
          <div className="h-20 bg-muted rounded" />
        </Card>
        <Card className="p-6 animate-pulse">
          <div className="h-20 bg-muted rounded" />
        </Card>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Real Money Balance</p>
            <p className="text-3xl font-bold">${balance.realMoney.toFixed(2)}</p>
          </div>
          <DollarSign className="w-10 h-10 text-green-500" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Credits Balance</p>
            <p className="text-3xl font-bold">{balance.credits.toLocaleString()}</p>
          </div>
          <Coins className="w-10 h-10 text-yellow-500" />
        </div>
      </Card>
    </div>
  )
}
