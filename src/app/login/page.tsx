"use client";

import { useActionState } from "react";

import { login } from "@/app/actions/auth";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, {
    error: "",
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 via-white to-zinc-100 p-4">
      <Card className="w-full max-w-md rounded-3xl border-0 shadow-2xl bg-white/90 backdrop-blur">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white text-xl font-bold">
            JT
          </div>

          <CardTitle className="text-3xl font-bold tracking-tight">
            Job Tracker
          </CardTitle>

          <CardDescription className="text-sm text-muted-foreground">
            Enter your email to sign in and manage your job applications.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form action={formAction} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>

              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="h-12 rounded-xl"
              />
            </div>

            {state?.error && (
              <p className="text-sm text-red-500">{state.error}</p>
            )}

            <Button
              type="submit"
              disabled={isPending}
              className="h-12 w-full rounded-xl bg-black hover:bg-zinc-800"
            >
              {isPending ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
