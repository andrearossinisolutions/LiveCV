import Link from "next/link";
import { redirect } from "next/navigation";

import { TopbarNav } from "@/components/topbar-nav";
import { getCurrentUser } from "@/lib/auth";

import { loginAction } from "./actions";

export const dynamic = "force-dynamic";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const user = await getCurrentUser();
  if (user) {
    redirect("/dashboard");
  }

  const { error } = await searchParams;

  return (
    <main className="login-shell">
      <div className="shell" style={{ width: "min(calc(100% - 2rem), 980px)" }}>
        <TopbarNav currentNav="none" publicHref="/" isLoggedIn={false} />
      </div>
      <section className="login-card" style={{ marginTop: "1rem" }}>
        <span className="eyebrow">Accesso amministratore</span>
        <h1>Entra e configura il tuo curriculum pubblico.</h1>
        <p className="muted">
          Login semplice per il primo MVP. Le credenziali iniziali arrivano da variabili ambiente.
        </p>

        <form className="stack" action={loginAction}>
          <label>
            <span>Email</span>
            <input name="email" type="email" placeholder="admin@example.com" required />
          </label>
          <label>
            <span>Password</span>
            <input name="password" type="password" required />
          </label>
          <button className="primary-button" type="submit">
            Accedi
          </button>
        </form>

        {error ? <p className="status">Credenziali non valide. Riprova.</p> : null}

        <p className="muted">
          Torna alla <Link href="/">home</Link>.
        </p>
        <p className="muted">
          Non hai un account? <Link href="/register">registrati qui</Link>.
        </p>
      </section>
    </main>
  );
}
