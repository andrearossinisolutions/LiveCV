import { notFound } from "next/navigation";

import { logoutAction } from "@/app/actions";
import { TopbarNav } from "@/components/topbar-nav";
import { getCurrentUser } from "@/lib/auth";
import { getProfileBySlug, getProfileByUserId } from "@/lib/db";

export const dynamic = "force-dynamic";

type PublicProfilePageProps = {
  params: Promise<{ slug: string }>;
};

function formatPeriod(startDate: string, endDate: string | null, isCurrent: boolean) {
  const start = startDate || "inizio non specificato";
  if (isCurrent) {
    return `${start} -> oggi`;
  }

  return `${start} -> ${endDate || "fine non specificata"}`;
}

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
  const { slug } = await params;
  const user = await getCurrentUser();
  const userProfile = user ? getProfileByUserId(user.id) : null;
  const data = getProfileBySlug(slug);

  if (!data) {
    notFound();
  }

  const { profile, experiences } = data;
  const links = [
    { label: "Sito web", href: profile.website },
    { label: "LinkedIn", href: profile.linkedin },
    { label: "GitHub", href: profile.github }
  ].filter((item) => item.href);

  return (
    <main className="public-shell">
      <TopbarNav
        currentNav="public"
        publicHref={userProfile ? `/${userProfile.profile.slug}` : "/"}
        isLoggedIn={Boolean(user)}
        logoutAction={logoutAction}
      />

      <section className="public-layout" style={{ marginTop: "1.5rem" }}>
        <article className="public-main">
          <div className="public-hero">
            <div className="public-hero-head">
              <div>
                <span className="eyebrow">Profilo professionale</span>
                <h1 className="public-name">
                  {profile.firstName} {profile.lastName}
                </h1>
              </div>
              <span className="chip">@{profile.slug}</span>
            </div>

            <p className="public-role">
              {profile.headline}
              {profile.currentCompany ? ` presso ${profile.currentCompany}` : ""}
            </p>

            {profile.bio ? <p className="public-bio">{profile.bio}</p> : null}

            <div className="public-meta">
              {profile.location ? <span className="chip">{profile.location}</span> : null}
              {profile.publicEmail ? <span className="chip">{profile.publicEmail}</span> : null}
              <span className="chip">{experiences.length} esperienze</span>
            </div>
          </div>

          <div className="public-stack">
            <section className="public-section">
              <h2>Esperienze lavorative</h2>
              <div className="timeline">
                {experiences.map((experience) => (
                  <article className="timeline-card" key={experience.id}>
                    <div className="timeline-meta">
                      <span>{formatPeriod(experience.startDate, experience.endDate, experience.isCurrent)}</span>
                      <span>{experience.isCurrent ? "Attuale" : "Concluso"}</span>
                    </div>
                    <div className="timeline-body">
                      <h3>{experience.position}</h3>
                      <strong>{experience.company}</strong>
                      <p>{experience.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </article>

        <aside className="public-side">
          <div className="public-side-card">
            <span className="eyebrow">Contatti</span>
            <h2>Link utili</h2>
            <div className="social-links">
              {links.length > 0 ? (
                links.map((link) => (
                  <a className="secondary-button" href={link.href} key={link.label} target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                ))
              ) : (
                <p className="muted">Nessun link ancora configurato.</p>
              )}
            </div>
          </div>

          <div className="public-side-card" style={{ marginTop: "1rem" }}>
            <span className="eyebrow">Prossimi step</span>
            <h2>Evoluzioni previste</h2>
            <p className="muted">
              Temi visuali, grafici, metriche automatiche e sezioni custom possono vivere qui
              senza cambiare l&apos;esperienza base dell&apos;utente.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
