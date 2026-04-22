import Link from "next/link";

import { logoutAction } from "@/app/actions";
import { TopbarNav } from "@/components/topbar-nav";
import { DashboardForm } from "@/components/dashboard-form";
import { requireUser } from "@/lib/auth";
import { getProfileByUserId } from "@/lib/db";

import { saveProfileAction } from "./actions";

export const dynamic = "force-dynamic";

type DashboardPageProps = {
  searchParams: Promise<{ saved?: string; slug?: string }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const user = await requireUser();
  const profileData = getProfileByUserId(user.id);
  const query = await searchParams;

  if (!profileData) {
    return null;
  }

  const publicUrl = `/${profileData.profile.slug}`;

  return (
    <main className="dashboard-shell">
      <TopbarNav
        currentNav="dashboard"
        publicHref={publicUrl}
        isLoggedIn
        logoutAction={logoutAction}
        brandLabel="LiveCV Studio"
      />

      <section className="dashboard-layout" style={{ marginTop: "1.5rem" }}>
        <div className="dashboard-main">
          {query.saved === "1" ? (
            <p className="status">
              Curriculum aggiornato con successo. Pagina pubblica disponibile su{" "}
              <a href={`/${query.slug ?? profileData.profile.slug}`}>/{query.slug ?? profileData.profile.slug}</a>.
            </p>
          ) : null}

          <div className="dashboard-stack">
            <DashboardForm
              initialProfile={profileData.profile}
              initialExperiences={profileData.experiences}
              saveAction={saveProfileAction}
            />
          </div>
        </div>

        <aside className="dashboard-side">
          <div className="public-side-card">
            <span className="eyebrow">Pubblicazione</span>
            <h2>URL attuale</h2>
            <p className="muted">
              Ogni salvataggio aggiorna la pagina pubblica con lo slug configurato nel form.
            </p>
            <a className="primary-button" href={publicUrl} target="_blank">
              Apri {publicUrl}
            </a>
          </div>

          <div className="public-side-card" style={{ marginTop: "1rem" }}>
            <span className="eyebrow">Roadmap</span>
            <h2>Pronto per crescere</h2>
            <p className="muted">
              Il modello dati supporta gia&apos; bio, link e timeline. Possiamo aggiungere temi,
              grafici dinamici e metriche senza riscrivere la base.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
