import { AdminsManagement } from "@/components/admin/admins-management"

export default function AdminsPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Server Admins</h1>
        <p className="text-muted-foreground">Manage server administrators and their warnings</p>
      </div>
      <AdminsManagement />
    </div>
  )
}
