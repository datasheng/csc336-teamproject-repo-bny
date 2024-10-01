import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login } from "@/lib/auth-actions"
import SignInWithGoogleButton from "./SignInWithGoogleButton"

export const description = "A login form with email and password. There's an option to login with Google and a link to sign up if you don't have an account."

export function LoginForm() {
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>

        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form action="">
            <div className="grid gap-4">
              <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="m@example.com" required/>
              </div>

              <div className="grid gap-2">
                  <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>

                  <Link href="#" className="ml-auto inline-block text-sm underline">
                      Forgot your password?
                  </Link>
                  </div>
                  <Input id="password" name="password" type="password" required />
              </div>

              <Button type="submit" formAction={login} className="w-full">
                  Login
              </Button>

              <SignInWithGoogleButton/>
            </div>
        </form>

        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}

          <Link href="/signup" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
