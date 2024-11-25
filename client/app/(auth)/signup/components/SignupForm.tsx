import Link from "next/link"
import { Button } from "@/components/ui/button"
import {Card,CardContent, CardDescription, CardHeader,CardTitle,} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signup } from "@/lib/auth-actions"

export const description = "A sign up form with first name, last name, email and password inside a card. There's an option to sign up with GitHub and a link to login if you already have an account"

export function SignupForm() {
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form action="">
            <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="first-name">First name</Label>
                    <Input id="first-name" name="first-name" placeholder="Max" required />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="last-name">Last name</Label>
                    <Input id="last-name" name="last-name" placeholder="Robinson" required />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" name="username" placeholder="RandomUsername123" required/>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="example@example.com" required/>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone-number">Phone Number</Label>
                  <Input id="phone-number" name="phone-number" placeholder="(xxx)-xxx-xxxx" required/>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" />
                </div>

                <Button formAction={signup} type="submit" className="w-full">
                    Create an account
                </Button>
            </div>
        </form>

        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}

          <Link href="/login" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
