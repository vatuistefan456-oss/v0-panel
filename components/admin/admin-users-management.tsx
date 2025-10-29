"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Shield, Trash2, Crown } from "lucide-react"

const DEMO_GROUPS = [
  { id: "1", group_name: "Super Admin", immunity_level: 90 },
  { id: "2", group_name: "Moderator", immunity_level: 50 },
  { id: "3", group_name: "Helper", immunity_level: 10 },
]

const DEMO_PERMISSIONS = [
  { id: "2", flag_name: "Ban Players", flag_code: "b" },
  { id: "3", flag_name: "Kick Players", flag_code: "k" },
  { id: "4", flag_name: "Mute Players", flag_code: "m" },
  { id: "5", flag_name: "Change Map", flag_code: "c" },
  { id: "7", flag_name: "View Logs", flag_code: "l" },
]

const DEMO_ADMINS = [
  {
    id: "1",
    steam_id: "76561199830951976",
    steam_name: "RootAdmin",
    is_root: true,
    group_name: null,
    immunity_level: 99,
    permissions: [],
  },
  {
    id: "2",
    steam_id: "76561198012345678",
    steam_name: "ShoKarON",
    is_root: false,
    group_name: "Super Admin",
    immunity_level: 90,
    permissions: [],
  },
  {
    id: "3",
    steam_id: "76561198087654321",
    steam_name: "ModeratorUser",
    is_root: false,
    group_name: "Moderator",
    immunity_level: 50,
    permissions: ["c"],
  },
]

export function AdminUsersManagement() {
  const [admins, setAdmins] = useState(DEMO_ADMINS)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [steamId, setSteamId] = useState("")
  const [selectedGroup, setSelectedGroup] = useState("")
  const [useIndividualPerms, setUseIndividualPerms] = useState(false)
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [customImmunity, setCustomImmunity] = useState("0")

  function handleAddAdmin() {
    const group = DEMO_GROUPS.find((g) => g.id === selectedGroup)
    const newAdmin = {
      id: Date.now().toString(),
      steam_id: steamId,
      steam_name: "New Admin",
      is_root: false,
      group_name: useIndividualPerms ? null : group?.group_name || null,
      immunity_level: useIndividualPerms ? Number.parseInt(customImmunity) : group?.immunity_level || 0,
      permissions: useIndividualPerms ? selectedPermissions : [],
    }
    setAdmins([...admins, newAdmin])
    setIsAddOpen(false)
    resetForm()
  }

  function resetForm() {
    setSteamId("")
    setSelectedGroup("")
    setUseIndividualPerms(false)
    setSelectedPermissions([])
    setCustomImmunity("0")
  }

  function togglePermission(flagCode: string) {
    setSelectedPermissions((prev) =>
      prev.includes(flagCode) ? prev.filter((p) => p !== flagCode) : [...prev, flagCode],
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Admin Users ({admins.length})</h2>
          <p className="text-sm text-muted-foreground">Manage admin access and permissions</p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Admin
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Admin User</DialogTitle>
              <DialogDescription>Add a new admin by Steam64 ID and assign permissions</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="steamId">Steam64 ID</Label>
                <Input
                  id="steamId"
                  value={steamId}
                  onChange={(e) => setSteamId(e.target.value)}
                  placeholder="76561199830951976"
                />
              </div>

              <div className="flex items-center space-x-2 p-4 rounded-lg border bg-card">
                <Checkbox
                  id="useIndividual"
                  checked={useIndividualPerms}
                  onCheckedChange={(checked) => setUseIndividualPerms(checked as boolean)}
                />
                <label htmlFor="useIndividual" className="text-sm font-medium cursor-pointer">
                  Use individual permissions instead of group
                </label>
              </div>

              {!useIndividualPerms ? (
                <div className="space-y-2">
                  <Label htmlFor="group">Admin Group</Label>
                  <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a group" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEMO_GROUPS.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.group_name} (Immunity: {group.immunity_level})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="immunity">Custom Immunity Level (0-99)</Label>
                    <Input
                      id="immunity"
                      type="number"
                      min="0"
                      max="99"
                      value={customImmunity}
                      onChange={(e) => setCustomImmunity(e.target.value)}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Individual Permissions</Label>
                    <div className="grid gap-2">
                      {DEMO_PERMISSIONS.map((permission) => (
                        <div key={permission.id} className="flex items-center space-x-3 p-3 rounded-lg border bg-card">
                          <Checkbox
                            id={`perm-${permission.id}`}
                            checked={selectedPermissions.includes(permission.flag_code)}
                            onCheckedChange={() => togglePermission(permission.flag_code)}
                          />
                          <label
                            htmlFor={`perm-${permission.id}`}
                            className="text-sm font-medium cursor-pointer flex items-center gap-2"
                          >
                            {permission.flag_name}
                            <Badge variant="secondary" className="font-mono text-xs">
                              {permission.flag_code}
                            </Badge>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-2 pt-4">
                <Button onClick={handleAddAdmin} className="flex-1">
                  Add Admin
                </Button>
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {admins.map((admin) => (
          <Card key={admin.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${admin.is_root ? "bg-yellow-500/10" : "bg-primary/10"}`}>
                  {admin.is_root ? (
                    <Crown className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <Shield className="w-5 h-5 text-primary" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold">{admin.steam_name}</h3>
                    {admin.is_root && (
                      <Badge variant="default" className="bg-yellow-500">
                        ROOT
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground font-mono">{admin.steam_id}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {admin.group_name && <Badge variant="secondary">{admin.group_name}</Badge>}
                    <Badge variant="outline">Immunity: {admin.immunity_level}</Badge>
                    {admin.permissions.length > 0 && (
                      <Badge variant="outline">+{admin.permissions.length} custom perms</Badge>
                    )}
                  </div>
                </div>
              </div>
              {!admin.is_root && (
                <Button variant="ghost" size="sm">
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
