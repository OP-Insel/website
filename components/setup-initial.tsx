"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CheckCircle, Copy, Info } from "lucide-react"
import Link from "next/link"

interface SetupInitialProps {
  email: string
  password: string
}

export function SetupInitial({ email, password }: SetupInitialProps) {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Initial Setup Complete</CardTitle>
          <CardDescription>An owner account has been created with the following credentials</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Important</AlertTitle>
            <AlertDescription>
              Please save these credentials securely. This is the only time they will be displayed.
            </AlertDescription>
          </Alert>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Email:</span>
              <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">{email}</code>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => navigator.clipboard.writeText(email)}
              >
                <span className="sr-only">Copy email</span>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Password:</span>
              <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">{password}</code>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => navigator.clipboard.writeText(password)}
              >
                <span className="sr-only">Copy password</span>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Alert className="border-green-500 text-green-500">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              You can change your password after logging in from the dashboard settings.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Link href="/login" className="w-full">
            <Button className="w-full">Proceed to Login</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

