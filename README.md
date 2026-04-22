# LiveCV

MVP FE+BE con Next.js e SQLite per creare un curriculum pubblico condivisibile su URL tipo `/nome-cognome`.

## Stack

- Next.js App Router
- React
- SQLite con `better-sqlite3`
- Sessione admin via cookie firmato

## Funzionalita'

- Login amministratore
- Dashboard privata per aggiornare dati profilo e esperienze
- Pagina pubblica dinamica tramite slug
- Seed iniziale automatico con utente admin e profilo demo

## Avvio

1. Copia `.env.example` in `.env`.
2. Imposta almeno `ADMIN_EMAIL`, `ADMIN_PASSWORD` e `SESSION_SECRET`.
3. Installa le dipendenze con `npm install`.
4. Avvia con `npm run dev`.

## Credenziali iniziali

Se il database `data/livecv.sqlite` non esiste, al primo avvio viene creato un utente usando le variabili ambiente.

## Roadmap

- Temi multipli del curriculum
- Grafici dinamici e metriche esperienza
- Link social aggiuntivi
- Upload avatar, portfolio e allegati
- Multiutenza e ruoli
