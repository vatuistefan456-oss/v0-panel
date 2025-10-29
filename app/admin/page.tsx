import { ServerStats } from "@/components/server-stats"
import { PlayerList } from "@/components/player-list"
import { ServerControls } from "@/components/server-controls"
import { ActivityFeed } from "@/components/activity-feed"
import { PerformanceCharts } from "@/components/performance-charts"
import { Target, Server, Users, Activity } from "lucide-react"

export default async function AdminPage() {
  return (
    <main className="container mx-auto px-4 py-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <ServerStats
          icon={<Server className="w-5 h-5" />}
          label="Server Status"
          value="Active"
          subtext="de_dust2"
          trend="+2.5%"
        />
        <ServerStats
          icon={<Users className="w-5 h-5" />}
          label="Players Online"
          value="24/32"
          subtext="75% capacity"
          trend="+8"
        />
        <ServerStats
          icon={<Activity className="w-5 h-5" />}
          label="Avg. Tick Rate"
          value="128"
          subtext="Optimal"
          trend="0%"
        />
        <ServerStats
          icon={<Target className="w-5 h-5" />}
          label="Matches Today"
          value="47"
          subtext="12 active"
          trend="+15%"
        />
      </div>

      {/* Performance Charts */}
      <div className="mb-6">
        <PerformanceCharts />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Player List & Controls */}
        <div className="lg:col-span-2 space-y-6">
          <PlayerList />
          <ServerControls />
        </div>

        {/* Right Column - Activity Feed */}
        <div className="lg:col-span-1">
          <ActivityFeed />
        </div>
      </div>
    </main>
  )
}
