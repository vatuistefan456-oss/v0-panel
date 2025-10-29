"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Palette, Save } from "lucide-react"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import { updateBannerSettings } from "@/app/actions/settings"

export function BannerSettings() {
  const [isPending, startTransition] = useTransition()
  const [settings, setSettings] = useState({
    text: "DEFAULT VIP - 30% OFF",
    textColor: "#fb923c",
    borderColor: "#fb923c",
    bgColor: "transparent",
    enabled: true,
  })

  const handleSave = () => {
    startTransition(async () => {
      const result = await updateBannerSettings(settings)
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 text-primary">
          <Palette className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">VIP Banner Settings</h2>
          <p className="text-sm text-muted-foreground">Customize the VIP banner displayed in the shop header</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Preview */}
        <div className="p-4 bg-background rounded-lg border border-border">
          <p className="text-xs text-muted-foreground mb-2">Preview:</p>
          {settings.enabled && (
            <div
              className="inline-block px-4 py-2 rounded-lg border text-sm font-medium"
              style={{
                color: settings.textColor,
                borderColor: settings.borderColor,
                backgroundColor: settings.bgColor,
              }}
            >
              {settings.text}
            </div>
          )}
          {!settings.enabled && <p className="text-sm text-muted-foreground">Banner is disabled</p>}
        </div>

        {/* Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Banner Text</Label>
            <Input
              value={settings.text}
              onChange={(e) => setSettings({ ...settings, text: e.target.value })}
              placeholder="DEFAULT VIP - 30% OFF"
            />
          </div>

          <div className="space-y-2">
            <Label>Text Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={settings.textColor}
                onChange={(e) => setSettings({ ...settings, textColor: e.target.value })}
                className="w-20 h-10"
              />
              <Input
                value={settings.textColor}
                onChange={(e) => setSettings({ ...settings, textColor: e.target.value })}
                placeholder="#fb923c"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Border Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={settings.borderColor}
                onChange={(e) => setSettings({ ...settings, borderColor: e.target.value })}
                className="w-20 h-10"
              />
              <Input
                value={settings.borderColor}
                onChange={(e) => setSettings({ ...settings, borderColor: e.target.value })}
                placeholder="#fb923c"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Background Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={settings.bgColor === "transparent" ? "#000000" : settings.bgColor}
                onChange={(e) => setSettings({ ...settings, bgColor: e.target.value })}
                className="w-20 h-10"
              />
              <Input
                value={settings.bgColor}
                onChange={(e) => setSettings({ ...settings, bgColor: e.target.value })}
                placeholder="transparent"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <Switch
              checked={settings.enabled}
              onCheckedChange={(checked) => setSettings({ ...settings, enabled: checked })}
            />
            <Label>Enable Banner</Label>
          </div>

          <Button onClick={handleSave} disabled={isPending}>
            <Save className="w-4 h-4 mr-2" />
            {isPending ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </Card>
  )
}
