import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { findUserByEmail, findUserById } from "@/lib/db";
import { readSession, signSession, verifyPassword } from "@/lib/security";

const SESSION_COOKIE = "livecv_session";

export async function createSession(userId: number) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, signSession(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE)?.value;

  if (!session) {
    return null;
  }

  const userId = readSession(session);
  if (!userId) {
    return null;
  }

  return findUserById(userId);
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function authenticate(email: string, password: string) {
  const user = findUserByEmail(email);
  if (!user) {
    return null;
  }

  if (!verifyPassword(password, user.passwordHash)) {
    return null;
  }

  return user;
}
