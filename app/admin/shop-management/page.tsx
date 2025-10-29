import { AdminShopManagement } from "@/components/admin-shop-management"

export default function ShopManagementPage() {
  return (
    <main className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Shop Management</h1>
        <p className="text-muted-foreground">Add balance and items to player accounts</p>
      </div>

      <AdminShopManagement />
    </main>
  )
}
