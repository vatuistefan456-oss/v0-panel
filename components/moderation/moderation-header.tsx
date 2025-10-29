import { Target, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BanUserDialog } from "@/components/moderation/ban-user-dialog"
import { MuteUserDialog } from "@/components/moderation/mute-user-dialog"

interface ModerationHeaderProps {
  user: {
    username: string
  }
}

export function ModerationHeader({ user }: ModerationHeaderProps) {
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
              <h1 className="text-xl font-bold text-foreground">Moderation Panel</h1>
              <p className="text-sm text-muted-foreground">Manage bans, mutes, and admin actions</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <BanUserDialog />
            <MuteUserDialog />
          </div>
        </div>
      </div>
    </header>
  )
}
