"use client"

import type React from "react"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Ban } from "lucide-react"
import { banUser } from "@/app/actions/moderation"
import { toast } from "sonner"

export function BanUserDialog() {
  const [open, setOpen] = useState(false)
  const [username, setUsername] = useState("")
  const [reason, setReason] = useState("")
  const [duration, setDuration] = useState("permanent")
  const [customDuration, setCustomDuration] = useState("")
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const durationMinutes = duration === "permanent" ? null : Number.parseInt(customDuration || duration)

    startTransition(async () => {
      const result = await banUser(username, reason, durationMinutes)
      if (result.success) {
        toast.success(result.message)
        setOpen(false)
        setUsername("")
        setReason("")
        setDuration("permanent")
        setCustomDuration("")
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="destructive">
          <Ban className="w-4 h-4 mr-2" />
          Ban User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ban User</DialogTitle>
          <DialogDescription>Restrict a user from accessing the server</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              placeholder="Enter ban reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger id="duration">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="60">1 Hour</SelectItem>
                <SelectItem value="1440">1 Day</SelectItem>
                <SelectItem value="10080">1 Week</SelectItem>
                <SelectItem value="43200">1 Month</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
                <SelectItem value="permanent">Permanent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {duration === "custom" && (
            <div className="space-y-2">
              <Label htmlFor="customDuration">Custom Duration (minutes)</Label>
              <Input
                id="customDuration"
                type="number"
                placeholder="Enter duration in minutes"
                value={customDuration}
                onChange={(e) => setCustomDuration(e.target.value)}
                min="1"
                required
              />
            </div>
          )}

          <Button type="submit" className="w-full" variant="destructive" disabled={isPending}>
            Ban User
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
