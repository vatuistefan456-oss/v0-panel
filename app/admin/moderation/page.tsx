import { getSupabaseServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BansList } from "@/components/moderation/bans-list"
import { MutesList } from "@/components/moderation/mutes-list"
import { AdminActionsList } from "@/components/moderation/admin-actions-list"

async function getUser() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("session")

  if (!sessionCookie) {
    return null
  }

  const supabase = await getSupabaseServerClient()
  const { data: user } = await supabase.from("users").select("*").eq("id", sessionCookie.value).single()

  return user
}

async function getBans() {
  const supabase = await getSupabaseServerClient()
  const { data: bans } = await supabase
    .from("bans")
    .select(
      `
      *,
      user:users!bans_user_id_fkey(id, username, steam_name),
      admin:users!bans_admin_id_fkey(id, username)
    `,
    )
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  return bans || []
}

async function getMutes() {
  const supabase = await getSupabaseServerClient()
  const { data: mutes } = await supabase
    .from("mutes")
    .select(
      `
      *,
      user:users!mutes_user_id_fkey(id, username, steam_name),
      admin:users!mutes_admin_id_fkey(id, username)
    `,
    )
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  return mutes || []
}

async function getAdminActions() {
  const supabase = await getSupabaseServerClient()
  const { data: actions } = await supabase
    .from("admin_actions")
    .select(
      `
      *,
      admin:users!admin_actions_admin_id_fkey(id, username),
      target_user:users!admin_actions_target_user_id_fkey(id, username, steam_name)
    `,
    )
    .order("created_at", { ascending: false })
    .limit(50)

  return actions || []
}

export default async function ModerationPage() {
  const user = await getUser()

  const { DEMO_USER } = await import("@/lib/demo-data")
  const displayUser = user || DEMO_USER

  const bans = await getBans()
  const mutes = await getMutes()
  const adminActions = await getAdminActions()

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 py-6">
        {!user && (
          <div className="mb-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <p className="text-sm text-amber-500">
              You are viewing in demo mode.{" "}
              <a href="/login" className="underline font-medium">
                Login
              </a>{" "}
              to access moderation tools.
            </p>
          </div>
        )}
        <Tabs defaultValue="bans" className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-3">
            <TabsTrigger value="bans">Bans ({bans.length})</TabsTrigger>
            <TabsTrigger value="mutes">Mutes ({mutes.length})</TabsTrigger>
            <TabsTrigger value="actions">Admin Actions ({adminActions.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="bans" className="mt-6">
            <BansList bans={bans} currentAdminId={displayUser.id} />
          </TabsContent>
          <TabsContent value="mutes" className="mt-6">
            <MutesList mutes={mutes} currentAdminId={displayUser.id} />
          </TabsContent>
          <TabsContent value="actions" className="mt-6">
            <AdminActionsList actions={adminActions} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
