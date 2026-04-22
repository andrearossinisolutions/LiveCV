"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { updateProfile } from "@/lib/db";
import type { ExperienceInput } from "@/lib/types";

function parseExperiences(rawValue: string): ExperienceInput[] {
  const parsed = JSON.parse(rawValue) as ExperienceInput[];

  return parsed
    .map((item) => ({
      position: item.position ?? "",
      company: item.company ?? "",
      description: item.description ?? "",
      startDate: item.startDate ?? "",
      endDate: item.endDate ?? "",
      isCurrent: Boolean(item.isCurrent)
    }))
    .filter((item) => item.position || item.company || item.description);
}

export async function saveProfileAction(formData: FormData) {
  const user = await requireUser();

  const experiences = parseExperiences(String(formData.get("experiences") ?? "[]"));

  const slug = updateProfile(user.id, {
    slug: String(formData.get("slug") ?? ""),
    firstName: String(formData.get("firstName") ?? ""),
    lastName: String(formData.get("lastName") ?? ""),
    headline: String(formData.get("headline") ?? ""),
    currentCompany: String(formData.get("currentCompany") ?? ""),
    bio: String(formData.get("bio") ?? ""),
    location: String(formData.get("location") ?? ""),
    publicEmail: String(formData.get("publicEmail") ?? ""),
    website: String(formData.get("website") ?? ""),
    linkedin: String(formData.get("linkedin") ?? ""),
    github: String(formData.get("github") ?? ""),
    experiences
  });

  revalidatePath("/dashboard");
  revalidatePath(`/${slug}`);
  redirect(`/dashboard?saved=1&slug=${slug}`);
}
