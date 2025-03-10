import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { checkOwnerExists, createOwnerAccount } from "@/lib/user"
import { SetupComplete } from "@/components/setup-complete"
import { SetupInitial } from "@/components/setup-initial"

export const metadata: Metadata = {
  title: "Setup",
  description: "Initial system setup",
}

export default async function SetupPage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/dashboard")
  }

  const ownerExists = await checkOwnerExists()

  if (!ownerExists) {
    // Create owner account with random password
    const { email, password } = await createOwnerAccount()
    return <SetupInitial email={email} password={password} />
  }

  return <SetupComplete />
}

