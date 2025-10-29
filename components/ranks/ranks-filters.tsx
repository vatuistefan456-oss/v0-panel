"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const statTypes = [
  { value: "kills", label: "Kills" },
  { value: "deaths", label: "Deaths" },
  { value: "headshots", label: "Headshots" },
  { value: "mvp", label: "MVP" },
  { value: "time_played", label: "Hours Played" },
  { value: "wins", label: "Wins" },
  { value: "kd_ratio", label: "K/D Ratio" },
]

const months = [
  { value: "2025-10", label: "October 2025" },
  { value: "2025-09", label: "September 2025" },
  { value: "2025-08", label: "August 2025" },
  { value: "2025-07", label: "July 2025" },
  { value: "all-time", label: "All Time" },
]

export function RanksFilters() {
  const [search, setSearch] = useState("")
  const [statType, setStatType] = useState("kills")
  const [month, setMonth] = useState("2025-10")

  return (
    <div className="mb-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name / steamid"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statType} onValueChange={setStatType}>
          <SelectTrigger>
            <SelectValue placeholder="Select stat type" />
          </SelectTrigger>
          <SelectContent>
            {statTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={month} onValueChange={setMonth}>
          <SelectTrigger>
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
