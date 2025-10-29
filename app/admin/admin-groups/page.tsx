import { AdminGroupsManagement } from "@/components/admin/admin-groups-management"

export default function AdminGroupsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Groups</h1>
        <p className="text-muted-foreground">Create and manage admin groups with different permission levels</p>
      </div>

      <AdminGroupsManagement />
    </div>
  )
}
