"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Shield } from "lucide-react"

const DEMO_PERMISSIONS = [
  { id: "1", flag_name: "Root Access", flag_code: "z", description: "Full root access to all features" },
  { id: "2", flag_name: "Ban Players", flag_code: "b", description: "Can ban players from the server" },
  { id: "3", flag_name: "Kick Players", flag_code: "k", description: "Can kick players from the server" },
  { id: "4", flag_name: "Mute Players", flag_code: "m", description: "Can mute players" },
  { id: "5", flag_name: "Change Map", flag_code: "c", description: "Can change server map" },
  { id: "6", flag_name: "Manage Admins", flag_code: "a", description: "Can add/remove admins" },
  { id: "7", flag_name: "View Logs", flag_code: "l", description: "Can view admin action logs" },
  { id: "8", flag_name: "Manage Shop", flag_code: "s", description: "Can manage shop items" },
  { id: "9", flag_name: "Manage Players", flag_code: "p", description: "Can manage player accounts and balances" },
  { id: "10", flag_name: "Server Config", flag_code: "g", description: "Can configure server settings" },
  { id: "11", flag_name: "RCON Access", flag_code: "r", description: "Can execute RCON commands" },
  { id: "12", flag_name: "Immunity", flag_code: "i", description: "Cannot be targeted by lower immunity admins" },
]

const DEMO_GROUPS = [
  {
    id: "1",
    group_name: "Super Admin",
    description: "Full access to all features",
    immunity_level: 90,
    permissions: ["z", "b", "k", "m", "c", "a", "l", "s", "p", "g", "r", "i"],
  },
  {
    id: "2",
    group_name: "Moderator",
    description: "Can moderate players and change maps",
    immunity_level: 50,
    permissions: ["b", "k", "m", "c", "l", "i"],
  },
  {
    id: "3",
    group_name: "Helper",
    description: "Basic moderation permissions",
    immunity_level: 10,
    permissions: ["k", "m", "l"],
  },
]

export function AdminGroupsManagement() {
  const [groups, setGroups] = useState(DEMO_GROUPS)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [groupName, setGroupName] = useState("")
  const [description, setDescription] = useState("")
  const [immunityLevel, setImmunityLevel] = useState("0")
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])

  function handleCreateGroup() {
    const newGroup = {
      id: Date.now().toString(),
      group_name: groupName,
      description,
      immunity_level: Number.parseInt(immunityLevel),
      permissions: selectedPermissions,
    }
    setGroups([...groups, newGroup])
    setIsCreateOpen(false)
    resetForm()
  }

  function resetForm() {
    setGroupName("")
    setDescription("")
    setImmunityLevel("0")
    setSelectedPermissions([])
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
          <h2 className="text-xl font-semibold">Admin Groups ({groups.length})</h2>
          <p className="text-sm text-muted-foreground">Manage permission groups for admins</p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Group
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Admin Group</DialogTitle>
              <DialogDescription>Create a new admin group with specific permissions</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="groupName">Group Name</Label>
                <Input
                  id="groupName"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="e.g., Moderator"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the role of this admin group"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="immunity">Immunity Level (0-99)</Label>
                <Input
                  id="immunity"
                  type="number"
                  min="0"
                  max="99"
                  value={immunityLevel}
                  onChange={(e) => setImmunityLevel(e.target.value)}
                  placeholder="0"
                />
                <p className="text-xs text-muted-foreground">
                  Higher immunity prevents actions from lower immunity admins
                </p>
              </div>

              <div className="space-y-3">
                <Label>Permissions</Label>
                <div className="grid gap-3">
                  {DEMO_PERMISSIONS.map((permission) => (
                    <div
                      key={permission.id}
                      className="flex items-start space-x-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <Checkbox
                        id={permission.id}
                        checked={selectedPermissions.includes(permission.flag_code)}
                        onCheckedChange={() => togglePermission(permission.flag_code)}
                      />
                      <div className="flex-1">
                        <label
                          htmlFor={permission.id}
                          className="text-sm font-medium leading-none cursor-pointer flex items-center gap-2"
                        >
                          {permission.flag_name}
                          <Badge variant="secondary" className="font-mono text-xs">
                            {permission.flag_code}
                          </Badge>
                        </label>
                        <p className="text-xs text-muted-foreground mt-1">{permission.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleCreateGroup} className="flex-1">
                  Create Group
                </Button>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {groups.map((group) => (
          <Card key={group.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{group.group_name}</h3>
                  <p className="text-sm text-muted-foreground">{group.description}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Immunity Level:</span>
                <Badge variant="secondary">{group.immunity_level}</Badge>
              </div>

              <div>
                <span className="text-sm font-medium mb-2 block">Permissions:</span>
                <div className="flex flex-wrap gap-2">
                  {group.permissions.map((flagCode) => {
                    const permission = DEMO_PERMISSIONS.find((p) => p.flag_code === flagCode)
                    return (
                      <Badge key={flagCode} variant="outline" className="font-mono">
                        {flagCode} - {permission?.flag_name}
                      </Badge>
                    )
                  })}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
