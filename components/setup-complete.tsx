import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

export function SetupComplete() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Setup Already Complete</CardTitle>
          <CardDescription>The system has already been initialized with an owner account</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="border-green-500 text-green-500">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>The owner account is already set up. You can proceed to login.</AlertDescription>
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

