'use client'

import { useState } from "react";
import { track } from "./track";
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
      track("tool.pdf.downloaded", {
        tool: "ai-stack-fit",
        // Lead identity (self-hosted umami)
        name: name.trim(),
        company: company.trim(),
        email: email.trim(),
        // Profile context
        synergy: pdfData.synergy,
        aiReadiness: pdfData.aiReadiness,
        monthlyCost: pdfData.cost,
        dominantFamily: pdfData.dominantFamily,
        size: pdfData.profile.size ?? null,
        industry: pdfData.profile.industry ?? null,
        revenue: pdfData.profile.revenue ?? null,
        strategy: pdfData.profile.strategy ?? null,
        mode: pdfData.profile.mode ?? null,
      });
      // Lead an den Operator (best-effort, blockiert den Download nicht).
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
      }).catch(() => {});
      setStatus("done");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "unknown";
      setErrorMsg(msg);
      setStatus("error");
      track("tool.pdf.error", { reason: msg });
    }
  }

  if (status === "done") {
    return (
      <div className="asf-pdfdl asf-pdfdl-success">
        <div className="asf-pdfdl-success-tag">[OK]</div>
        <div>
          <div className="asf-pdfdl-success-title">PDF heruntergeladen.</div>
          <p className="asf-pdfdl-success-body">
            Die komplette Auswertung liegt jetzt lokal bei Ihnen. Wenn Sie ein tieferes
            Audit möchten, melden wir uns kurz auf <strong>{company.trim()}</strong> zurück.
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
          Komplette Auswertung mit Picks, Frictions und Roadmap. Drei Felder, dann liegt
          das PDF lokal bei Ihnen — und wir wissen, an wen wir uns für ein tieferes Audit
          melden dürfen.
        </p>
      </div>

      <form className="asf-pdfdl-form" onSubmit={handleSubmit}>
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
            placeholder="ihre@firma.de"
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
