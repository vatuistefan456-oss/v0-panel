import { Suspense } from "react"
import { BannerSettings } from "@/components/settings/banner-settings"
import { NavigationOrderSettings } from "@/components/settings/navigation-order-settings"
import { Settings } from "lucide-react"

export default function SettingsPage() {
  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 text-primary">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Site Settings</h1>
          <p className="text-muted-foreground">Customize your panel appearance and navigation</p>
        </div>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <BannerSettings />
        <NavigationOrderSettings />
      </Suspense>
    </main>
  )
}
