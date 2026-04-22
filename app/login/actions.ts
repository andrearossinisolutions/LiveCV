"use server";

import { redirect } from "next/navigation";

import { authenticate, createSession } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const user = await authenticate(email, password);
  if (!user) {
    redirect("/login?error=Credenziali-non-valide");
  }

  await createSession(user.id);
  redirect("/dashboard");
}
