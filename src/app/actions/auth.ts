"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(
  prevState: { error?: string } | null,
  formData: FormData,
) {
  const email = formData.get("email") as string;

  if (!email || !email.includes("@")) {
    return { error: "Valid email is required" };
  }

  const cookieStore = await cookies();
  cookieStore.set("job_tracker_session", email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  redirect("/");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("job_tracker_session");
  redirect("/login");
}
