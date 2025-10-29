import { redirect } from "next/navigation"
import { SetupForm } from "@/components/setup/setup-form"
import { checkSetupStatus } from "@/app/actions/setup"

export default async function SetupPage() {
  const isConfigured = await checkSetupStatus()

  if (isConfigured) {
    redirect("/admin")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">Initial Setup</h1>
          <p className="text-muted-foreground">Configure your CS2 Admin Panel root administrator</p>
        </div>

        <SetupForm />
      </div>
    </div>
  )
}
