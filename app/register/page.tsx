import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";

import { registerAction } from "./actions";

export const dynamic = "force-dynamic";

type RegisterPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const user = await getCurrentUser();
  if (user) {
    redirect("/dashboard");
  }

  const { error } = await searchParams;

  const messageMap: Record<string, string> = {
    "campi-mancanti": "Compila tutti i campi richiesti.",
    "password-breve": "La password deve avere almeno 8 caratteri.",
    "email-gia-registrata": "Questa email esiste gia'.",
    "registrazione-fallita": "Registrazione non riuscita. Riprova."
  };

  return (
    <main className="login-shell">
      <section className="login-card">
        <span className="eyebrow">Crea account</span>
        <h1>Apri il tuo spazio e prova subito il login.</h1>
        <p className="muted">
          La registrazione crea utente e profilo base, poi ti porta direttamente alla dashboard.
        </p>

        <form className="stack" action={registerAction}>
          <div className="form-grid two-cols">
            <label>
              <span>Nome</span>
              <input name="firstName" type="text" required />
            </label>
            <label>
              <span>Cognome</span>
              <input name="lastName" type="text" required />
            </label>
          </div>
          <label>
            <span>Email</span>
            <input name="email" type="email" placeholder="nome@dominio.it" required />
          </label>
          <label>
            <span>Password</span>
            <input name="password" type="password" minLength={8} required />
          </label>
          <button className="primary-button" type="submit">
            Crea account
          </button>
        </form>

        {error ? <p className="status">{messageMap[error] ?? "Registrazione non riuscita."}</p> : null}

        <p className="muted">
          Hai gia&apos; un account? <Link href="/login">vai al login</Link>.
        </p>
      </section>
    </main>
  );
}
