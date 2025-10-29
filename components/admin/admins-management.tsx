"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AlertCircle, Trash2, Plus } from "lucide-react"
import { getAdmins, addAdminWarning, deleteAdminWarning } from "@/app/actions/admin"
import { toast } from "sonner"

interface Warning {
  id: string
  warning_message: string
  issued_by_name: string
  created_at: string
}

interface Admin {
  id: string
  steam_id: string
  steam_name: string
  group_name: string
  warnings: Warning[]
  admin_since: string
  last_connection: string
  weekly_activity: {
    day_1_hours: number
    day_1_actions: string
    day_2_hours: number
    day_2_actions: string
    day_3_hours: number
    day_3_actions: string
    day_4_hours: number
    day_4_actions: string
  }
}

export function AdminsManagement() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null)
  const [warningDialogOpen, setWarningDialogOpen] = useState(false)
  const [warningMessage, setWarningMessage] = useState("")

  useEffect(() => {
    loadAdmins()
  }, [])

  const loadAdmins = async () => {
    try {
      const result = await getAdmins()
      if (result.success) {
        setAdmins(result.data || [])
      }
    } catch (error) {
      toast.error("Failed to load admins")
    } finally {
      setLoading(false)
    }
  }

  const handleAddWarning = async () => {
    if (!selectedAdmin || !warningMessage.trim()) {
      toast.error("Please enter a warning message")
      return
    }

    const result = await addAdminWarning(selectedAdmin.id, warningMessage)
    if (result.success) {
      toast.success("Warning added successfully")
      setWarningDialogOpen(false)
      setWarningMessage("")
      setSelectedAdmin(null)
      loadAdmins()
    } else {
      toast.error(result.error || "Failed to add warning")
    }
  }

  const handleDeleteWarning = async (warningId: string) => {
    const result = await deleteAdminWarning(warningId)
    if (result.success) {
      toast.success("Warning deleted successfully")
      loadAdmins()
    } else {
      toast.error(result.error || "Failed to delete warning")
    }
  }

  const getGroupBadgeColor = (groupName: string) => {
    const name = groupName?.toLowerCase() || ""
    if (name.includes("fondator") || name.includes("founder")) return "bg-orange-600"
    if (name.includes("trusted")) return "bg-orange-500"
    if (name.includes("mod")) return "bg-red-500"
    if (name.includes("admin")) return "bg-orange-600"
    return "bg-gray-500"
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    const diffMonths = Math.floor(diffDays / 30)
    const diffYears = Math.floor(diffDays / 365)

    if (diffMins < 60) return `in ${diffMins} minutes`
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays < 30) return `${diffDays} days ago`
    if (diffMonths < 12) return `${diffMonths} months ago`
    return `${diffYears} years ago`
  }

  if (loading) {
    return <div className="text-center py-8">Loading admins...</div>
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[250px]">Nickname</TableHead>
              <TableHead className="w-[120px]">Group</TableHead>
              <TableHead className="w-[150px]">Warns</TableHead>
              <TableHead className="w-[400px]">Weekly Activity</TableHead>
              <TableHead className="w-[150px]">Admin Since</TableHead>
              <TableHead className="w-[150px]">Last Connection</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${admin.steam_id}`} />
                      <AvatarFallback>{admin.steam_name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{admin.steam_name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getGroupBadgeColor(admin.group_name)}>{admin.group_name}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge
                            variant={admin.warnings.length > 0 ? "destructive" : "secondary"}
                            className={admin.warnings.length > 0 ? "bg-red-600" : "bg-green-600"}
                          >
                            {admin.warnings.length} warn{admin.warnings.length !== 1 ? "s" : ""}
                            {admin.warnings.length > 0 && <AlertCircle className="w-3 h-3 ml-1" />}
                          </Badge>
                        </TooltipTrigger>
                        {admin.warnings.length > 0 && (
                          <TooltipContent className="max-w-md">
                            <div className="space-y-2">
                              {admin.warnings.slice(0, 5).map((warning, index) => (
                                <div key={warning.id} className="flex items-start justify-between gap-2 text-sm">
                                  <span>
                                    {index + 1}. {warning.warning_message} -{" "}
                                    {new Date(warning.created_at).toLocaleDateString()}
                                  </span>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0"
                                    onClick={() => handleDeleteWarning(warning.id)}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() => {
                        setSelectedAdmin(admin)
                        setWarningDialogOpen(true)
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div className="text-center">
                      <div className="text-orange-400 font-medium">{admin.weekly_activity.day_1_hours.toFixed(2)}h</div>
                      <div className="text-muted-foreground">{admin.weekly_activity.day_1_actions}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-purple-400 font-medium">{admin.weekly_activity.day_2_hours.toFixed(2)}h</div>
                      <div className="text-muted-foreground">{admin.weekly_activity.day_2_actions}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-cyan-400 font-medium">{admin.weekly_activity.day_3_hours.toFixed(2)}h</div>
                      <div className="text-muted-foreground">{admin.weekly_activity.day_3_actions}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-pink-400 font-medium">{admin.weekly_activity.day_4_hours.toFixed(2)}h</div>
                      <div className="text-muted-foreground">{admin.weekly_activity.day_4_actions}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-blue-600">
                    {formatTimeAgo(admin.admin_since)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-green-600">
                    {formatTimeAgo(admin.last_connection)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={warningDialogOpen} onOpenChange={setWarningDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Warning</DialogTitle>
            <DialogDescription>
              Add a warning for {selectedAdmin?.steam_name}. Maximum 5 warnings will be displayed.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="warning-message">Warning Message</Label>
              <Textarea
                id="warning-message"
                placeholder="Enter warning reason (e.g., inactivitate, abuse, etc.)"
                value={warningMessage}
                onChange={(e) => setWarningMessage(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWarningDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddWarning}>Add Warning</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
