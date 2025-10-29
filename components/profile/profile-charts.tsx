"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
} from "recharts"
import { useState } from "react"
import { Calendar } from "lucide-react"

interface ProfileChartsProps {
  user: {
    kills: number
    deaths: number
  }
}

// Mock data for demonstration
const performanceData = [
  { date: "Mon", kills: 12, deaths: 8 },
  { date: "Tue", kills: 15, deaths: 10 },
  { date: "Wed", kills: 18, deaths: 12 },
  { date: "Thu", kills: 14, deaths: 9 },
  { date: "Fri", kills: 20, deaths: 11 },
  { date: "Sat", kills: 22, deaths: 13 },
  { date: "Sun", kills: 19, deaths: 10 },
]

const weaponData = [
  { weapon: "AK-47", kills: 145 },
  { weapon: "M4A4", kills: 132 },
  { weapon: "AWP", kills: 98 },
  { weapon: "Desert Eagle", kills: 76 },
  { weapon: "Glock-18", kills: 54 },
]

const killsDeathsData = Array.from({ length: 31 }, (_, i) => ({
  day: i + 1,
  kills: Math.floor(Math.random() * 4),
  deaths: Math.floor(Math.random() * 2),
  assists: Math.floor(Math.random() * 2),
}))

const hoursData = Array.from({ length: 31 }, (_, i) => ({
  day: i + 1,
  team: Math.random() * 0.2,
  spec: Math.random() * 0.1,
}))

const hitLocationData = Array.from({ length: 31 }, (_, i) => ({
  day: i + 1,
  head: Math.random() * 4,
  chest: Math.random() * 4,
  arms: Math.random() * 9,
  legs: Math.random() * 3,
}))

const damageData = Array.from({ length: 31 }, (_, i) => ({
  day: i + 1,
  damage: Math.floor(Math.random() * 100),
}))

export function ProfileCharts({ user }: ProfileChartsProps) {
  const [selectedMonth, setSelectedMonth] = useState("October 2025")

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-bold text-foreground mb-4">Weekly Performance</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Line type="monotone" dataKey="kills" stroke="hsl(var(--primary))" strokeWidth={2} />
            <Line type="monotone" dataKey="deaths" stroke="hsl(var(--destructive))" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-bold text-foreground mb-4">Top Weapons</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={weaponData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis dataKey="weapon" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={100} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="kills" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6 bg-card border-border">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-foreground">Statistics</h3>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Calendar className="w-4 h-4" />
            {selectedMonth}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Kills, Deaths, Assists Chart */}
          <div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={killsDeathsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="kills" stroke="#3b82f6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="deaths" stroke="#f97316" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="assists" stroke="#06b6d4" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Hours Team/Spec Chart */}
          <div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={hoursData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="team" stroke="#3b82f6" strokeWidth={2} dot={false} name="Hours team" />
                <Line type="monotone" dataKey="spec" stroke="#f97316" strokeWidth={2} dot={false} name="Hours spec" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Hit Location Chart */}
          <div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={hitLocationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="head" stroke="#3b82f6" strokeWidth={2} dot={false} name="Hit head" />
                <Line type="monotone" dataKey="chest" stroke="#f97316" strokeWidth={2} dot={false} name="Hit chest" />
                <Line type="monotone" dataKey="arms" stroke="#06b6d4" strokeWidth={2} dot={false} name="Hit arms" />
                <Line type="monotone" dataKey="legs" stroke="#ef4444" strokeWidth={2} dot={false} name="Hit legs" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Damage Chart */}
          <div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={damageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="damage" stroke="#3b82f6" strokeWidth={2} dot={false} name="Damage" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>
    </div>
  )
}
