"use server";

import { redirect } from "next/navigation";

import { createSession } from "@/lib/auth";
import { createUserProfileAccount } from "@/lib/db";
import { hashPassword } from "@/lib/security";

export async function registerAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();

  if (!email || !password || !firstName || !lastName) {
    redirect("/register?error=campi-mancanti");
  }

  if (password.length < 8) {
    redirect("/register?error=password-breve");
  }

  try {
    const account = createUserProfileAccount({
      email,
      passwordHash: hashPassword(password),
      firstName,
      lastName
    });

    await createSession(account.userId);
    redirect("/dashboard");
  } catch (error) {
    const message = error instanceof Error ? error.message : "registrazione-fallita";
    if (message.includes("Email gia' registrata")) {
      redirect("/register?error=email-gia-registrata");
    }

    redirect("/register?error=registrazione-fallita");
  }
}
