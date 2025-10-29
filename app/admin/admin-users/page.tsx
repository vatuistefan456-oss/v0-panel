import { AdminUsersManagement } from "@/components/admin/admin-users-management"

export default function AdminUsersPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Users</h1>
        <p className="text-muted-foreground">Add and manage admin users with group or individual permissions</p>
      </div>

      <AdminUsersManagement />
    </div>
  )
}
