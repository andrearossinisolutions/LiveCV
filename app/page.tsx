import Link from "next/link";

import { getRandomPublishedProfile } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const featuredSlug = getRandomPublishedProfile();

  return (
    <main className="hero-shell">
      <div className="shell">
        <header className="topbar">
          <div className="brand">
            <span className="brand-mark">L</span>
            <span>LiveCV</span>
          </div>

          <nav className="nav-links">
            <Link className="ghost-button" href="/login">
              Area privata
            </Link>
            {featuredSlug ? (
              <Link className="secondary-button" href={`/${featuredSlug}`}>
                Esempio pubblico
              </Link>
            ) : null}
          </nav>
        </header>

        <section className="hero-layout">
          <article className="hero-card hero-copy">
            <span className="eyebrow">MVP curriculum pubblico</span>
            <h1 className="display-title">Il CV che si aggiorna come un prodotto.</h1>
            <p>
              Un&apos;app unica FE+BE in cui l&apos;utente autenticato gestisce i propri dati
              professionali e li pubblica su una pagina bella da condividere, pronta per temi,
              grafici, metriche e link avanzati.
            </p>

            <div className="hero-actions">
              <Link className="primary-button" href="/dashboard">
                Apri dashboard
              </Link>
              <Link className="secondary-button" href="/login">
                Login amministratore
              </Link>
            </div>

            <div className="landing-highlights">
              <article>
                <strong>SQLite locale</strong>
                <p>Leggero, semplice da distribuire e ottimo per partire in locale o su VPS.</p>
              </article>
              <article>
                <strong>Pagina pubblica per slug</strong>
                <p>Ogni profilo vive su un URL leggibile come `/nome-cognome`.</p>
              </article>
              <article>
                <strong>Base pronta per crescere</strong>
                <p>Link social, anni di esperienza, temi e moduli aggiuntivi arrivano senza rifare tutto.</p>
              </article>
            </div>
          </article>

          <aside className="hero-card hero-preview">
            <div className="resume-preview">
              <header>
                <div>
                  <small>Anteprima visuale</small>
                  <h2>Mario Rossi</h2>
                  <p>Product Designer & Frontend Engineer</p>
                </div>
                <span className="chip">@mario-rossi</span>
              </header>

              <div className="preview-grid">
                <article className="metric-card">
                  <strong>2+</strong>
                  <p>esperienze iniziali gia&apos; gestibili con timeline pubblica.</p>
                </article>
                <article className="metric-card">
                  <strong>1 URL</strong>
                  <p>chiaro e condivisibile per il tuo profilo professionale.</p>
                </article>
                <article className="timeline-card">
                  <small>Ruolo attuale</small>
                  <h3>Senior Frontend Engineer</h3>
                  <p>Studio Aperto</p>
                </article>
                <article className="timeline-card">
                  <small>Roadmap</small>
                  <h3>Temi, grafici, KPI</h3>
                  <p>e calcolo anni esperienza.</p>
                </article>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
