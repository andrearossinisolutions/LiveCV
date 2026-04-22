"use client";

import { useState, useTransition } from "react";

import type { Experience, Profile } from "@/lib/types";

type DashboardFormProps = {
  initialProfile: Profile;
  initialExperiences: Experience[];
  saveAction: (formData: FormData) => Promise<void>;
};

type ExperienceDraft = {
  position: string;
  company: string;
  description: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
};

function toDraft(experience?: Experience): ExperienceDraft {
  return {
    position: experience?.position ?? "",
    company: experience?.company ?? "",
    description: experience?.description ?? "",
    startDate: experience?.startDate ?? "",
    endDate: experience?.endDate ?? "",
    isCurrent: experience?.isCurrent ?? false
  };
}

export function DashboardForm({
  initialProfile,
  initialExperiences,
  saveAction
}: DashboardFormProps) {
  const [experiences, setExperiences] = useState<ExperienceDraft[]>(
    initialExperiences.length > 0 ? initialExperiences.map(toDraft) : [toDraft()]
  );
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="dashboard-form"
      action={(formData) =>
        startTransition(async () => {
          formData.set("experiences", JSON.stringify(experiences));
          await saveAction(formData);
        })
      }
    >
      <section className="panel">
        <div className="panel-heading">
          <span className="eyebrow">Profilo</span>
          <h2>Dati principali</h2>
        </div>

        <div className="form-grid two-cols">
          <label>
            <span>Nome</span>
            <input name="firstName" defaultValue={initialProfile.firstName} required />
          </label>
          <label>
            <span>Cognome</span>
            <input name="lastName" defaultValue={initialProfile.lastName} required />
          </label>
          <label>
            <span>Slug pubblico</span>
            <input name="slug" defaultValue={initialProfile.slug} required />
          </label>
          <label>
            <span>Mansione</span>
            <input name="headline" defaultValue={initialProfile.headline} required />
          </label>
          <label>
            <span>Azienda attuale</span>
            <input name="currentCompany" defaultValue={initialProfile.currentCompany} />
          </label>
          <label>
            <span>Localita&apos;</span>
            <input name="location" defaultValue={initialProfile.location} />
          </label>
          <label className="full-span">
            <span>Bio</span>
            <textarea name="bio" defaultValue={initialProfile.bio} rows={4} />
          </label>
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <span className="eyebrow">Link</span>
          <h2>Contatti e presenza online</h2>
        </div>

        <div className="form-grid two-cols">
          <label>
            <span>Email pubblica</span>
            <input name="publicEmail" type="email" defaultValue={initialProfile.publicEmail} />
          </label>
          <label>
            <span>Sito web</span>
            <input name="website" type="url" defaultValue={initialProfile.website} />
          </label>
          <label>
            <span>LinkedIn</span>
            <input name="linkedin" type="url" defaultValue={initialProfile.linkedin} />
          </label>
          <label>
            <span>GitHub</span>
            <input name="github" type="url" defaultValue={initialProfile.github} />
          </label>
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading row-space">
          <div>
            <span className="eyebrow">Esperienze</span>
            <h2>Storico professionale</h2>
          </div>
          <button
            className="secondary-button"
            type="button"
            onClick={() => setExperiences((current) => [...current, toDraft()])}
          >
            Aggiungi esperienza
          </button>
        </div>

        <div className="experience-stack">
          {experiences.map((experience, index) => (
            <article className="experience-card" key={`${index}-${experience.company}`}>
              <div className="experience-card-head">
                <h3>Esperienza {index + 1}</h3>
                {experiences.length > 1 ? (
                  <button
                    className="ghost-button"
                    type="button"
                    onClick={() =>
                      setExperiences((current) => current.filter((_, itemIndex) => itemIndex !== index))
                    }
                  >
                    Rimuovi
                  </button>
                ) : null}
              </div>

              <div className="form-grid two-cols">
                <label>
                  <span>Mansione</span>
                  <input
                    value={experience.position}
                    onChange={(event) =>
                      setExperiences((current) =>
                        current.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, position: event.target.value } : item
                        )
                      )
                    }
                    required
                  />
                </label>
                <label>
                  <span>Azienda</span>
                  <input
                    value={experience.company}
                    onChange={(event) =>
                      setExperiences((current) =>
                        current.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, company: event.target.value } : item
                        )
                      )
                    }
                    required
                  />
                </label>
                <label>
                  <span>Inizio</span>
                  <input
                    placeholder="2022-01"
                    value={experience.startDate}
                    onChange={(event) =>
                      setExperiences((current) =>
                        current.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, startDate: event.target.value } : item
                        )
                      )
                    }
                    required
                  />
                </label>
                <label>
                  <span>Fine</span>
                  <input
                    placeholder="2024-06"
                    disabled={experience.isCurrent}
                    value={experience.endDate}
                    onChange={(event) =>
                      setExperiences((current) =>
                        current.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, endDate: event.target.value } : item
                        )
                      )
                    }
                  />
                </label>
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={experience.isCurrent}
                    onChange={(event) =>
                      setExperiences((current) =>
                        current.map((item, itemIndex) =>
                          itemIndex === index
                            ? {
                                ...item,
                                isCurrent: event.target.checked,
                                endDate: event.target.checked ? "" : item.endDate
                              }
                            : item
                        )
                      )
                    }
                  />
                  <span>Ruolo attuale</span>
                </label>
                <label className="full-span">
                  <span>Descrizione</span>
                  <textarea
                    rows={4}
                    value={experience.description}
                    onChange={(event) =>
                      setExperiences((current) =>
                        current.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, description: event.target.value } : item
                        )
                      )
                    }
                    required
                  />
                </label>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="form-actions">
        <button className="primary-button" type="submit" disabled={isPending}>
          {isPending ? "Salvataggio..." : "Salva curriculum"}
        </button>
      </div>
    </form>
  );
}
