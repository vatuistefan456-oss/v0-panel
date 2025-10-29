"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { setupRootAdmin } from "@/app/actions/setup"
import { Loader2, CheckCircle2 } from "lucide-react"

export function SetupForm() {
  const router = useRouter()
  const [steamId, setSteamId] = useState("76561199830951976")
  const [siteName, setSiteName] = useState("CS2 Admin Panel")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await setupRootAdmin(steamId, siteName)

      if (result.success) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/admin")
        }, 2000)
      } else {
        setError(result.error || "Setup failed")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Setup Complete!</h2>
          <p className="text-muted-foreground mb-4">Root admin has been configured successfully.</p>
          <p className="text-sm text-muted-foreground">Redirecting to admin panel...</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="siteName">Site Name</Label>
          <Input
            id="siteName"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            placeholder="CS2 Admin Panel"
            required
          />
          <p className="text-xs text-muted-foreground">The name of your CS2 server administration panel</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="steamId">Root Admin Steam64 ID</Label>
          <Input
            id="steamId"
            value={steamId}
            onChange={(e) => setSteamId(e.target.value)}
            placeholder="76561199830951976"
            required
          />
          <p className="text-xs text-muted-foreground">This Steam ID will have full root access to all features</p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Setting up...
            </>
          ) : (
            "Complete Setup"
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          You can add more admins and configure permissions after setup
        </p>
      </form>
    </Card>
  )
}
