"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Crown, Plus, Search, Trash2, Calendar } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Demo VIP packages
const vipPackages = [
  {
    id: "1",
    name: "VIP Bronze",
    duration: 30,
    features: ["Reserved Slot", "Chat Tag", "Join Full Server"],
  },
  {
    id: "2",
    name: "VIP Silver",
    duration: 30,
    features: ["Reserved Slot", "Chat Tag", "Join Full Server", "Custom Models", "No Ads"],
  },
  {
    id: "3",
    name: "VIP Gold",
    duration: 30,
    features: [
      "Reserved Slot",
      "Chat Tag",
      "Join Full Server",
      "Custom Models",
      "No Ads",
      "Priority Support",
      "Exclusive Skins",
    ],
  },
  {
    id: "4",
    name: "VIP Platinum",
    duration: 90,
    features: [
      "Reserved Slot",
      "Chat Tag",
      "Join Full Server",
      "Custom Models",
      "No Ads",
      "Priority Support",
      "Exclusive Skins",
      "Custom Commands",
      "VIP Lounge Access",
    ],
  },
]

// Demo active VIPs
const activeVips = [
  {
    id: "1",
    steamId: "76561199830951976",
    steamName: "ShoKarON",
    package: "VIP Gold",
    grantedBy: "Root Admin",
    grantedAt: "2025-01-15",
    expiresAt: "2025-02-15",
    isActive: true,
  },
  {
    id: "2",
    steamId: "76561198012345678",
    steamName: "PlayerTwo",
    package: "VIP Silver",
    grantedBy: "Admin",
    grantedAt: "2025-01-20",
    expiresAt: "2025-02-20",
    isActive: true,
  },
]

export function VipManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState("")
  const [steamId, setSteamId] = useState("")
  const [customDuration, setCustomDuration] = useState("")

  const handleGrantVip = () => {
    console.log("[v0] Granting VIP:", { steamId, selectedPackage, customDuration })
    // TODO: Implement VIP granting logic
    setIsAddDialogOpen(false)
    setSteamId("")
    setSelectedPackage("")
    setCustomDuration("")
  }

  const handleRevokeVip = (vipId: string) => {
    console.log("[v0] Revoking VIP:", vipId)
    // TODO: Implement VIP revocation logic
  }

  const filteredVips = activeVips.filter(
    (vip) => vip.steamName.toLowerCase().includes(searchTerm.toLowerCase()) || vip.steamId.includes(searchTerm),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Crown className="w-8 h-8 text-yellow-500" />
            VIP Management
          </h1>
          <p className="text-muted-foreground mt-1">Grant and manage VIP access for players</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Grant VIP Access
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Grant VIP Access</DialogTitle>
              <DialogDescription>Add VIP access to a player by their Steam64 ID</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="steamId">Steam64 ID</Label>
                <Input
                  id="steamId"
                  placeholder="76561199830951976"
                  value={steamId}
                  onChange={(e) => setSteamId(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="package">VIP Package</Label>
                <Select value={selectedPackage} onValueChange={setSelectedPackage}>
                  <SelectTrigger id="package">
                    <SelectValue placeholder="Select VIP package" />
                  </SelectTrigger>
                  <SelectContent>
                    {vipPackages.map((pkg) => (
                      <SelectItem key={pkg.id} value={pkg.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{pkg.name}</span>
                          <span className="text-xs text-muted-foreground ml-4">{pkg.duration} days</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedPackage && (
                <Card className="bg-accent/50">
                  <CardHeader>
                    <CardTitle className="text-sm">Package Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {vipPackages
                        .find((pkg) => pkg.id === selectedPackage)
                        ?.features.map((feature) => (
                          <Badge key={feature} variant="secondary">
                            {feature}
                          </Badge>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-2">
                <Label htmlFor="duration">Custom Duration (days) - Optional</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="Leave empty to use package default"
                  value={customDuration}
                  onChange={(e) => setCustomDuration(e.target.value)}
                />
              </div>

              <Button onClick={handleGrantVip} className="w-full" disabled={!steamId || !selectedPackage}>
                Grant VIP Access
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* VIP Packages Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {vipPackages.map((pkg) => (
          <Card key={pkg.id}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                {pkg.name}
              </CardTitle>
              <CardDescription>{pkg.duration} days duration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {pkg.features.slice(0, 3).map((feature) => (
                  <div key={feature} className="text-sm text-muted-foreground">
                    • {feature}
                  </div>
                ))}
                {pkg.features.length > 3 && (
                  <div className="text-sm text-muted-foreground">+{pkg.features.length - 3} more features</div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active VIPs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Active VIP Players</CardTitle>
              <CardDescription>Manage current VIP access</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or Steam ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Steam ID</TableHead>
                <TableHead>Player Name</TableHead>
                <TableHead>VIP Package</TableHead>
                <TableHead>Granted By</TableHead>
                <TableHead>Granted Date</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVips.map((vip) => (
                <TableRow key={vip.id}>
                  <TableCell className="font-mono text-sm">{vip.steamId}</TableCell>
                  <TableCell className="font-medium">{vip.steamName}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="gap-1">
                      <Crown className="w-3 h-3" />
                      {vip.package}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{vip.grantedBy}</TableCell>
                  <TableCell className="text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      {vip.grantedAt}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      {vip.expiresAt}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={vip.isActive ? "default" : "secondary"}>
                      {vip.isActive ? "Active" : "Expired"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleRevokeVip(vip.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
