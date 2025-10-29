import { Search, Users, TrendingUp } from "lucide-react"
import { SearchBar } from "@/components/search/search-bar"
import { PlayerSearchResults } from "@/components/search/player-search-results"
import { TopPlayers } from "@/components/search/top-players"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const query = searchParams.q || ""

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20 border border-primary/30">
                <Search className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Player Search</h1>
                <p className="text-sm text-muted-foreground">Find and view player profiles</p>
              </div>
            </div>
            <Link href="/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <SearchBar initialQuery={query} />
        </div>

        {/* Results or Top Players */}
        {query ? (
          <PlayerSearchResults query={query} />
        ) : (
          <div className="space-y-8">
            {/* Top Players Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-foreground">Top Players</h2>
              </div>
              <TopPlayers />
            </div>

            {/* Recent Players Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-foreground">Recently Active</h2>
              </div>
              <PlayerSearchResults query="" limit={12} />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
