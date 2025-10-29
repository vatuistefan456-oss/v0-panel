import { Target, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ListItemDialog } from "@/components/market/list-item-dialog"

interface MarketHeaderProps {
  user: {
    username: string
    credits: number
  }
}

export function MarketHeader({ user }: MarketHeaderProps) {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20 border border-primary/30">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Community Market</h1>
              <p className="text-sm text-muted-foreground">Buy and sell items with other players</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Your Credits</p>
              <p className="text-lg font-bold text-foreground">{user.credits.toLocaleString()}</p>
            </div>
            <ListItemDialog />
          </div>
        </div>
      </div>
    </header>
  )
}
