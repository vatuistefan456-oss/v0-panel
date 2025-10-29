import { Target, Coins, Wallet, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { UserMenu } from "@/components/user-menu"
import Link from "next/link"

interface ShopHeaderProps {
  user: {
    id: string
    username: string
    steam_name: string | null
    steam_avatar_url: string | null
    steam_id: string
    credits: number
    real_money_balance: number
    vip_tier: string
  }
  bannerSettings?: {
    text: string
    textColor: string
    borderColor: string
    bgColor: string
    enabled: boolean
  }
}

export function ShopHeader({ user, bannerSettings }: ShopHeaderProps) {
  const discountPercentage = user.vip_tier === "LEGEND" ? 20 : user.vip_tier === "DEFAULT" ? 30 : 0
  const isDemo = user.id === "demo-user-id"

  const banner = bannerSettings || {
    text: "DEFAULT VIP - 30% OFF",
    textColor: "#fb923c",
    borderColor: "#fb923c",
    bgColor: "transparent",
    enabled: true,
  }

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
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
              <h1 className="text-xl font-bold text-foreground">CS2 Shop</h1>
              <p className="text-sm text-muted-foreground">Purchase credits, cases, and VIP packages</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {banner.enabled && user.vip_tier !== "NONE" && (
              <div
                className="px-4 py-2 rounded-lg border text-sm font-medium"
                style={{
                  color: banner.textColor,
                  borderColor: banner.borderColor,
                  backgroundColor: banner.bgColor,
                }}
              >
                {banner.text}
              </div>
            )}
            {!isDemo && <UserMenu user={user} />}
            {isDemo && (
              <Link href="/login">
                <Button size="sm">Login</Button>
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4 bg-card border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-chart-3/10 border border-chart-3/20 text-chart-3">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Credits Balance</p>
                  <p className="text-2xl font-bold text-foreground">{user.credits.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-card border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-chart-4/10 border border-chart-4/20 text-chart-4">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Real Money Balance</p>
                  <p className="text-2xl font-bold text-foreground">${user.real_money_balance.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </header>
  )
}
