import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="login-shell">
      <section className="login-card">
        <span className="eyebrow">Profilo non trovato</span>
        <h1>Questa pagina curriculum non esiste ancora.</h1>
        <p className="muted">
          Controlla lo slug oppure torna alla home per aprire un profilo esistente.
        </p>
        <Link className="primary-button" href="/">
          Torna alla home
        </Link>
      </section>
    </main>
  );
}
