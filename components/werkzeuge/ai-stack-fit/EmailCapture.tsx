'use client'

import { useRef, useState } from "react";
import { leadOrigin, track } from "@/lib/analytics";
import { buildPdf, downloadPdf, type PdfData } from "./pdf";
import { submitStackLead } from "./actions";

type Status = "idle" | "building" | "done" | "error";

interface Props {
  pdfData: PdfData;
}

export default function PdfDownload({ pdfData }: Props) {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const begonnen = useRef(false);
  function onFirstInput() {
    if (begonnen.current) return;
    begonnen.current = true;
    track("contact_started", { form: "pdf", ...leadOrigin("ai-stack-fit", "/werkzeuge/ai-stack-fit") });
  }

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const ready =
    name.trim().length > 1 &&
    company.trim().length > 1 &&
    emailValid &&
    consent;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ready || status === "building") return;
    setStatus("building");
    setErrorMsg(null);
    try {
      const bytes = await buildPdf(pdfData);
      const filename = `AI-Stack-Fit-${new Date().toISOString().slice(0, 10)}.pdf`;
      downloadPdf(bytes, filename);
      // Lead an den Operator (best-effort, blockiert den Download nicht).
      // Anfrage zählt erst, wenn der Server sie angenommen hat; an Umami gehen
      // nur Formular und Herkunft, nie Name, Firma, E-Mail oder Profil.
      const herkunft = leadOrigin("ai-stack-fit", "/werkzeuge/ai-stack-fit");
      void submitStackLead({
        name: name.trim(),
        company: company.trim(),
        email: email.trim(),
        profileSummary: pdfData.profileSummary,
        synergy: pdfData.synergy,
        aiReadiness: pdfData.aiReadiness,
        cost: pdfData.cost,
        dominantFamily: pdfData.dominantFamily,
        topPicks: pdfData.topPicks.map(t => `${t.categoryLabel}: ${t.pick.sys.label}`),
      })
        .then((r) => {
          if (r.ok) track("contact_submitted", { form: "pdf", ...herkunft });
          else track("contact_error", { form: "pdf", ...herkunft, reason: "versand" });
        })
        .catch(() => {});
      setStatus("done");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "unknown";
      setErrorMsg(msg);
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="asf-pdfdl asf-pdfdl-success">
        <div className="asf-pdfdl-success-tag">[OK]</div>
        <div>
          <div className="asf-pdfdl-success-title">PDF heruntergeladen.</div>
          <p className="asf-pdfdl-success-body">
            Die komplette Auswertung liegt jetzt bei dir. Wenn du ein tieferes Audit für{' '}
            <strong>{company.trim()}</strong> möchtest, melde ich mich kurz zurück.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="asf-pdfdl">
      <div className="asf-pdfdl-head">
        <div className="asf-pdfdl-eyebrow">{"// download"}</div>
        <h3 className="asf-pdfdl-title">
          Empfehlung als PDF<span className="mint-dot" />
        </h3>
        <p className="asf-pdfdl-sub">
          Komplette Auswertung mit Empfehlungen, Brüchen im Stack und Roadmap. Drei Felder,
          dann liegt das PDF bei dir — und ich weiß, an wen ich mich für ein tieferes Audit
          wenden darf.
        </p>
      </div>

      <form className="asf-pdfdl-form" onSubmit={handleSubmit} onInputCapture={onFirstInput}>
        <div className="asf-pdfdl-row">
          <label className="asf-pdfdl-field">
            <span className="asf-pdfdl-label">Name *</span>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
              className="asf-pdfdl-input"
              autoComplete="name"
              disabled={status === "building"}
            />
          </label>
          <label className="asf-pdfdl-field">
            <span className="asf-pdfdl-label">Unternehmen *</span>
            <input
              type="text"
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              maxLength={120}
              className="asf-pdfdl-input"
              autoComplete="organization"
              disabled={status === "building"}
            />
          </label>
        </div>
        <label className="asf-pdfdl-field">
          <span className="asf-pdfdl-label">E-Mail *</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="du@firma.de"
            className="asf-pdfdl-input"
            autoComplete="email"
            disabled={status === "building"}
          />
        </label>
        <label className="asf-pdfdl-consent">
          <input
            type="checkbox"
            required
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            disabled={status === "building"}
          />
          <span>
            Ich stimme zu, dass meine Angaben zur Kontaktaufnahme bei
            Braum Consulting verwendet werden dürfen. Keine Mailingliste,
            keine Weitergabe.
          </span>
        </label>

        <button
          type="submit"
          className="asf-pdfdl-btn"
          disabled={!ready || status === "building"}
        >
          <span className="asf-pdfdl-icon" aria-hidden="true">
            {status === "building" ? "…" : "↓"}
          </span>
          <span className="asf-pdfdl-text">
            <span className="asf-pdfdl-btn-title">
              {status === "building" ? "PDF wird gebaut…" : "PDF herunterladen"}
            </span>
            <span className="asf-pdfdl-btn-sub">
              A4, ca. 2 Seiten, ungefähr 80 KB.
            </span>
          </span>
          <span className="asf-pdfdl-arrow" aria-hidden="true">→</span>
        </button>

        {status === "error" && (
          <div className="asf-pdfdl-error">
            <span className="asf-pdfdl-error-tag">[ERROR]</span>
            <span>PDF konnte nicht erstellt werden{errorMsg ? ` (${errorMsg})` : ""}.</span>
          </div>
        )}
      </form>
    </div>
  );
}
