import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

import { hashPassword } from "@/lib/security";
import type { Experience, ExperienceInput, Profile, ProfileWithExperience } from "@/lib/types";

type UserRow = {
  id: number;
  email: string;
  password_hash: string;
};

type ProfileRow = {
  id: number;
  user_id: number;
  slug: string;
  first_name: string;
  last_name: string;
  headline: string;
  current_company: string;
  bio: string;
  location: string;
  public_email: string;
  website: string;
  linkedin: string;
  github: string;
  updated_at: string;
};

type ExperienceRow = {
  id: number;
  profile_id: number;
  position: string;
  company: string;
  description: string;
  start_date: string;
  end_date: string | null;
  is_current: number;
  sort_order: number;
};

const EXPERIENCE_ORDER_BY = `
  ORDER BY
    is_current DESC,
    CASE
      WHEN is_current = 1 THEN COALESCE(start_date, '')
      ELSE COALESCE(end_date, start_date, '')
    END DESC,
    COALESCE(start_date, '') DESC,
    id DESC
`;

const dataDirectory = path.join(process.cwd(), "data");
const databasePath = path.join(dataDirectory, "livecv.sqlite");

if (!fs.existsSync(dataDirectory)) {
  fs.mkdirSync(dataDirectory, { recursive: true });
}

const db = new Database(databasePath);

db.pragma("journal_mode = WAL");
db.pragma("busy_timeout = 5000");

let initialized = false;

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function initializeDatabase() {
  if (initialized) {
    return;
  }

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE,
      first_name TEXT NOT NULL DEFAULT '',
      last_name TEXT NOT NULL DEFAULT '',
      headline TEXT NOT NULL DEFAULT '',
      current_company TEXT NOT NULL DEFAULT '',
      bio TEXT NOT NULL DEFAULT '',
      location TEXT NOT NULL DEFAULT '',
      public_email TEXT NOT NULL DEFAULT '',
      website TEXT NOT NULL DEFAULT '',
      linkedin TEXT NOT NULL DEFAULT '',
      github TEXT NOT NULL DEFAULT '',
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS experiences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      profile_id INTEGER NOT NULL,
      position TEXT NOT NULL DEFAULT '',
      company TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      start_date TEXT NOT NULL DEFAULT '',
      end_date TEXT,
      is_current INTEGER NOT NULL DEFAULT 0,
      sort_order INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY(profile_id) REFERENCES profiles(id) ON DELETE CASCADE
    );
  `);

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";

  const transaction = db.transaction(() => {
    db.prepare("INSERT OR IGNORE INTO users (email, password_hash) VALUES (?, ?)")
      .run(adminEmail, hashPassword(adminPassword));

    const userId = Number(
      (db.prepare("SELECT id FROM users WHERE email = ?").get(adminEmail) as { id: number }).id
    );

    db.prepare(
      `INSERT OR IGNORE INTO profiles (
        user_id, slug, first_name, last_name, headline, current_company, bio, location, public_email, website, linkedin, github
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      userId,
      "mario-rossi",
      "Mario",
      "Rossi",
      "Product Designer & Frontend Engineer",
      "Studio Aperto",
      "Creo esperienze digitali con attenzione a interfacce, contenuti e narrazione professionale.",
      "Milano, Italia",
      adminEmail,
      "https://example.com",
      "https://linkedin.com/in/mariorossi",
      "https://github.com/mariorossi"
    );

    const profileId = Number(
      (db.prepare("SELECT id FROM profiles WHERE user_id = ?").get(userId) as { id: number }).id
    );

    const count = db
      .prepare("SELECT COUNT(*) as total FROM experiences WHERE profile_id = ?")
      .get(profileId) as { total: number };

    if (count.total === 0) {
      const seedExperiences = [
        {
          position: "Senior Frontend Engineer",
          company: "Studio Aperto",
          description:
            "Guida della UI platform e collaborazione stretta con design e prodotto su dashboard ad alto traffico.",
          startDate: "2022-01",
          endDate: null,
          isCurrent: true,
          sortOrder: 0
        },
        {
          position: "Frontend Developer",
          company: "Northwind",
          description:
            "Sviluppo di applicazioni React, design system e ottimizzazioni su performance e accessibilita'.",
          startDate: "2019-03",
          endDate: "2021-12",
          isCurrent: false,
          sortOrder: 1
        }
      ];

      const insertExperience = db.prepare(
        `INSERT INTO experiences (
          profile_id, position, company, description, start_date, end_date, is_current, sort_order
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      );

      for (const experience of seedExperiences) {
        insertExperience.run(
          profileId,
          experience.position,
          experience.company,
          experience.description,
          experience.startDate,
          experience.endDate,
          experience.isCurrent ? 1 : 0,
          experience.sortOrder
        );
      }
    }
  });

  transaction();
  initialized = true;
}

function mapProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    userId: row.user_id,
    slug: row.slug,
    firstName: row.first_name,
    lastName: row.last_name,
    headline: row.headline,
    currentCompany: row.current_company,
    bio: row.bio,
    location: row.location,
    publicEmail: row.public_email,
    website: row.website,
    linkedin: row.linkedin,
    github: row.github,
    updatedAt: row.updated_at
  };
}

function mapExperience(row: ExperienceRow): Experience {
  return {
    id: row.id,
    position: row.position,
    company: row.company,
    description: row.description,
    startDate: row.start_date,
    endDate: row.end_date,
    isCurrent: Boolean(row.is_current),
    sortOrder: row.sort_order
  };
}

export function findUserByEmail(email: string) {
  initializeDatabase();
  const row = db
    .prepare("SELECT id, email, password_hash FROM users WHERE email = ?")
    .get(email) as UserRow | undefined;

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    email: row.email,
    passwordHash: row.password_hash
  };
}

export function findUserById(userId: number) {
  initializeDatabase();
  const row = db
    .prepare("SELECT id, email, password_hash FROM users WHERE id = ?")
    .get(userId) as UserRow | undefined;

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    email: row.email,
    passwordHash: row.password_hash
  };
}

export function getProfileByUserId(userId: number): ProfileWithExperience | null {
  initializeDatabase();
  const profileRow = db
    .prepare("SELECT * FROM profiles WHERE user_id = ?")
    .get(userId) as ProfileRow | undefined;

  if (!profileRow) {
    return null;
  }

  const experienceRows = db
    .prepare(`SELECT * FROM experiences WHERE profile_id = ? ${EXPERIENCE_ORDER_BY}`)
    .all(profileRow.id) as ExperienceRow[];

  return {
    profile: mapProfile(profileRow),
    experiences: experienceRows.map(mapExperience)
  };
}

export function getProfileBySlug(slug: string): ProfileWithExperience | null {
  initializeDatabase();
  const profileRow = db
    .prepare("SELECT * FROM profiles WHERE slug = ?")
    .get(slug) as ProfileRow | undefined;

  if (!profileRow) {
    return null;
  }

  const experienceRows = db
    .prepare(`SELECT * FROM experiences WHERE profile_id = ? ${EXPERIENCE_ORDER_BY}`)
    .all(profileRow.id) as ExperienceRow[];

  return {
    profile: mapProfile(profileRow),
    experiences: experienceRows.map(mapExperience)
  };
}

export function getFirstPublishedProfile() {
  initializeDatabase();
  const row = db
    .prepare("SELECT slug FROM profiles ORDER BY updated_at DESC LIMIT 1")
    .get() as { slug: string } | undefined;

  return row?.slug ?? null;
}

export function updateProfile(
  userId: number,
  payload: {
    slug: string;
    firstName: string;
    lastName: string;
    headline: string;
    currentCompany: string;
    bio: string;
    location: string;
    publicEmail: string;
    website: string;
    linkedin: string;
    github: string;
    experiences: ExperienceInput[];
  }
) {
  initializeDatabase();
  const current = getProfileByUserId(userId);
  if (!current) {
    throw new Error("Profilo non trovato.");
  }

  const normalizedSlug = slugify(payload.slug || `${payload.firstName}-${payload.lastName}`) || current.profile.slug;

  const duplicate = db
    .prepare("SELECT id FROM profiles WHERE slug = ? AND user_id != ?")
    .get(normalizedSlug, userId) as { id: number } | undefined;

  if (duplicate) {
    throw new Error("Lo slug scelto e' gia' in uso.");
  }

  const transaction = db.transaction(() => {
    db.prepare(
      `UPDATE profiles
       SET slug = ?, first_name = ?, last_name = ?, headline = ?, current_company = ?,
           bio = ?, location = ?, public_email = ?, website = ?, linkedin = ?, github = ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = ?`
    ).run(
      normalizedSlug,
      payload.firstName.trim(),
      payload.lastName.trim(),
      payload.headline.trim(),
      payload.currentCompany.trim(),
      payload.bio.trim(),
      payload.location.trim(),
      payload.publicEmail.trim(),
      payload.website.trim(),
      payload.linkedin.trim(),
      payload.github.trim(),
      userId
    );

    const profileId = current.profile.id;
    db.prepare("DELETE FROM experiences WHERE profile_id = ?").run(profileId);

    const insertExperience = db.prepare(
      `INSERT INTO experiences (
        profile_id, position, company, description, start_date, end_date, is_current, sort_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    );

    payload.experiences.forEach((experience, index) => {
      insertExperience.run(
        profileId,
        experience.position.trim(),
        experience.company.trim(),
        experience.description.trim(),
        experience.startDate.trim(),
        experience.isCurrent ? null : experience.endDate.trim() || null,
        experience.isCurrent ? 1 : 0,
        index
      );
    });
  });

  transaction();

  return normalizedSlug;
}

export function createUserProfileAccount(payload: {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
}) {
  initializeDatabase();

  const existingUser = db
    .prepare("SELECT id FROM users WHERE email = ?")
    .get(payload.email) as { id: number } | undefined;

  if (existingUser) {
    throw new Error("Email gia' registrata.");
  }

  const baseSlug = slugify(`${payload.firstName}-${payload.lastName}`) || "nuovo-cv";

  const transaction = db.transaction(() => {
    const userResult = db
      .prepare("INSERT INTO users (email, password_hash) VALUES (?, ?)")
      .run(payload.email, payload.passwordHash);

    const userId = Number(userResult.lastInsertRowid);
    let slugCandidate = baseSlug;
    let suffix = 2;

    while (
      db.prepare("SELECT id FROM profiles WHERE slug = ?").get(slugCandidate) as
        | { id: number }
        | undefined
    ) {
      slugCandidate = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    db.prepare(
      `INSERT INTO profiles (
        user_id, slug, first_name, last_name, headline, current_company, bio, location, public_email, website, linkedin, github
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      userId,
      slugCandidate,
      payload.firstName.trim(),
      payload.lastName.trim(),
      "",
      "",
      "",
      "",
      payload.email.trim(),
      "",
      "",
      ""
    );

    return { userId, slug: slugCandidate };
  });

  return transaction();
}
