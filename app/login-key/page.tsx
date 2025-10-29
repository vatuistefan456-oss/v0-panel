"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export default function LoginKeyPage() {
  const router = useRouter()
  const [uniqueKey, setUniqueKey] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uniqueKey, username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      if (data.success) {
        router.push("/admin/dashboard")
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message || "A apărut o eroare la autentificare")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Autentificare cu Cheie</CardTitle>
          <CardDescription className="text-center">
            Introdu cheia ta unică generată în joc cu comanda !key
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="uniqueKey">Cheie Unică</Label>
              <Input
                id="uniqueKey"
                type="text"
                placeholder="Ex: A1B2C3D4E5F6G7H8..."
                value={uniqueKey}
                onChange={(e) => setUniqueKey(e.target.value.toUpperCase())}
                required
                className="font-mono"
                maxLength={64}
              />
              <p className="text-xs text-muted-foreground">Scrie !key în joc pentru a obține cheia ta</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Nume Utilizator</Label>
              <Input
                id="username"
                type="text"
                placeholder="Alege un nume de utilizator"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Parolă</Label>
              <Input
                id="password"
                type="password"
                placeholder="Alege o parolă"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <p className="text-xs text-muted-foreground">Minim 6 caractere</p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Se autentifică...
                </>
              ) : (
                "Autentificare"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Nu ai o cheie?</p>
            <p className="mt-1">
              Conectează-te pe server și scrie <code className="bg-muted px-2 py-1 rounded">!key</code> în chat
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
