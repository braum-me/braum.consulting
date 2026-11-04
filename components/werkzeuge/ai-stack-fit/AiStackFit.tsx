'use client'

import { useEffect, useMemo, useRef, useState } from "react";
import { FUNNEL } from "./track";
import PdfDownload from "./EmailCapture";
import "./theme.css";
import "./styles.css";
import {
  CATEGORIES,
  computeAIReadiness,
  computeMonthlyCost,
  computeSovereignty,
  computeSynergy,
  computeSystemRisk,
  computeTradeoffs,
  DATA_REFRESH_DATE,
  DATA_REFRESH_LABEL,
  DEFAULT_PROFILE,
  ECOSYSTEMS,
  FAMILY_LABEL,
  FAMILY_SHORT,
  findFrictions,
  INDUSTRIES,
  INDUSTRY_INSIGHTS,
  INDUSTRY_PEER_NOTE,
  listFlaggedSystems,
  NEXT_STEPS,
  rankCategory,
  REVENUES,
  SIZES,
  STRATEGIES,
  SYSTEM_PRICE_HINTS,
  type CategoryId,
  type EcoId,
  type FamilyId,
  type Mode,
  type Profile,
  type RevenueId,
  type RiskLevel,
  type Scored,
  type SizeId,
  type StrategyId,
  type System,
} from "./data";

type Stage = "landing" | "wizard" | "result";
type StepKey = "Größe" | "Branche" | "Umsatz" | "Bestands-Stack" | "Strategie";

const STEP_TITLES: Record<Mode, StepKey[]> = {
  greenfield: ["Größe", "Branche", "Umsatz", "Strategie"],
  audit: ["Größe", "Branche", "Umsatz", "Bestands-Stack", "Strategie"],
};

function pick<T>(xs: readonly T[]): T {
  return xs[Math.floor(Math.random() * xs.length)] as T;
}

function randomProfile(): Profile {
  const mode = pick<Mode>(["greenfield", "audit"]);
  const size = pick(SIZES).id;
  const industry = pick(INDUSTRIES).id;
  const revenue = pick(REVENUES).id;
  const strategy = pick(STRATEGIES).id;
  // ecosystems only for audit mode (otherwise the wizard skips that step)
  let ecosystems: EcoId[] = [];
  if (mode === "audit") {
    const all = ECOSYSTEMS.map((e) => e.id);
    const count = 1 + Math.floor(Math.random() * 3); // 1-3 ecosystems
    ecosystems = [...all].sort(() => Math.random() - 0.5).slice(0, count);
  }
  return { mode, size, industry, revenue, ecosystems, strategy };
}

function cls(...xs: Array<string | false | null | undefined>): string {
  return xs.filter(Boolean).join(" ");
}

function Dot() {
  return <span className="mint-dot" />;
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="eyebrow">{children}</div>;
}

const reducedMotion = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

function CountUp({
  value,
  duration = 800,
  format,
}: {
  value: number;
  duration?: number;
  format?: (n: number) => string;
}) {
  const [n, setN] = useState(reducedMotion() ? value : 0);
  useEffect(() => {
    if (reducedMotion()) {
      setN(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - (1 - p) ** 3;
      setN(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return <>{format ? format(n) : n}</>;
}

function AnimatedBar({ value, delay = 0 }: { value: number; delay?: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (reducedMotion()) {
      setWidth(value);
      return;
    }
    const id = setTimeout(() => setWidth(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return (
    <div className="asf-kpi-bar">
      <div
        className="asf-kpi-fill"
        style={{ width: `${width}%`, transition: "width 800ms cubic-bezier(0.16, 1, 0.3, 1)" }}
      />
    </div>
  );
}

export default function AiStackFit() {
  const [stage, setStage] = useState<Stage>("landing");
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);

  // Tool open event (only once per session)
  useEffect(() => {
    FUNNEL.toolOpened();
  }, []);

  const startMode = (mode: Mode, source: "card" | "demo" = "card") => {
    FUNNEL.toolModeSelected(mode, source);
    setProfile({ ...DEFAULT_PROFILE, mode });
    setStage("wizard");
  };

  const reset = () => {
    FUNNEL.toolRestart();
    setProfile(DEFAULT_PROFILE);
    setStage("landing");
  };

  return (
    <div className="asf-app">
      {stage === "landing" && (
        <Landing
          onMode={startMode}
          onRandomize={() => {
            FUNNEL.toolRandomized("landing");
            setProfile(randomProfile());
            setStage("result");
          }}
        />
      )}
      {stage === "wizard" && profile.mode && (
        <Wizard
          mode={profile.mode}
          profile={profile}
          setProfile={setProfile}
          onDone={() => setStage("result")}
          onBack={() => setStage("landing")}
        />
      )}
      {stage === "result" && (
        <Result
          profile={profile}
          onRestart={reset}
          onEditProfile={() => {
            FUNNEL.toolEditProfile();
            setStage("wizard");
          }}
          onRandomize={() => {
            FUNNEL.toolRandomized("result");
            setProfile(randomProfile());
          }}
        />
      )}
    </div>
  );
}

/* ── Landing ─────────────────────────────────────────────────── */
function Landing({
  onMode,
  onRandomize,
}: {
  onMode: (m: Mode) => void;
  onRandomize: () => void;
}) {
  return (
    <div className="asf-screen asf-landing">
      <div className="asf-landing-grid">
        <div className="asf-landing-left">
          <Eyebrow>BRAUM CONSULTING · AI-FIRST TECHSTACK</Eyebrow>
          <h1 className="asf-hero-title">
            Welcher AI-Stack
            <br />
            ist wirklich Ihrer?
            <Dot />
          </h1>
          <p className="asf-hero-sub">
            Größe, Branche, Strategie - und wir zeigen welche 12 Tools aus 52 wirklich zu Ihrem
            Unternehmen passen. Mit Brüchen im Stack, EU-Score und Roadmap.
          </p>
          <div className="asf-mode-cards">
            <button type="button" className="asf-mode-card" onClick={() => onMode("greenfield")}>
              <div className="asf-mode-num">01 · GREENFIELD</div>
              <div className="asf-mode-title">
                Wir fangen frisch an
                <Dot />
              </div>
              <div className="asf-mode-desc">
                Kein Legacy. Sie sind in der Tool-Auswahl komplett flexibel und wollen das beste AI-First-Setup.
              </div>
              <div className="asf-mode-meta">5 Fragen · 90 Sekunden</div>
            </button>
            <button type="button" className="asf-mode-card" onClick={() => onMode("audit")}>
              <div className="asf-mode-num">02 · BESTANDS-AUDIT</div>
              <div className="asf-mode-title">
                Wir haben bereits einen Stack
                <Dot />
              </div>
              <div className="asf-mode-desc">
                Sie sind tief in M365, Google oder SAP - und wollen wissen, ob Ihre AI-Tools dazu passen oder Synergien
                zerstören.
              </div>
              <div className="asf-mode-meta">7 Fragen · 2 Minuten</div>
            </button>
          </div>
        </div>

        <aside className="asf-landing-right">
          <div className="asf-ar-block">
            <div className="asf-ar-label">PRINZIP</div>
            <div className="asf-ar-text">
              Ein AI-Stack ist nur so stark wie sein Office-Backbone. Wer im Microsoft-Universum sitzt und ChatGPT
              ausrollt, baut zwei Welten parallel. Wer Copilot wählt, bekommt seine SharePoint-Inhalte indexiert.
            </div>
          </div>
          <div className="asf-ar-block">
            <div className="asf-ar-label">WIE WIR BEWERTEN</div>
            <ul className="asf-ar-list">
              <li>Strategie-Fit (Microsoft / Google / Best-of-Breed / EU)</li>
              <li>Größe und Umsatz</li>
              <li>Branche und Compliance</li>
              <li>Synergie zum bestehenden Stack</li>
              <li>AI-Reife der Plattform</li>
            </ul>
          </div>
          <div className="asf-ar-block muted">
            <div className="asf-ar-label">HINWEIS</div>
            <div className="asf-ar-text small">
              Dieses Tool ist ein Schnell-Screening, kein Beratungsersatz. Für eine fundierte Make-or-Buy-Analyse
              brauchen wir 30 Minuten.
            </div>
          </div>
        </aside>
      </div>

      <footer className="asf-landing-footer">
        <div className="asf-footer-brand">
          Braum Consulting<span className="asf-footer-brand-dot">.</span>
        </div>
        <div className="asf-footer-meta">
          <span className="asf-footer-pill">AI-STACK-FIT</span>
          <span className="asf-footer-pill">DATA · {DATA_REFRESH_LABEL}</span>
          <span className="asf-footer-pill mint">v0.1 · BETA</span>
        </div>
      </footer>

      <div className="asf-randomize-row">
        <button type="button" className="asf-randomize-btn" onClick={onRandomize}>
          <span className="asf-randomize-die" aria-hidden="true">⚂</span>
          <span className="asf-randomize-text">
            <span className="asf-randomize-title">Profil würfeln</span>
            <span className="asf-randomize-sub">
              Zufalls-Größe, -Branche, -Strategie. Ergebnis sofort sehen.
            </span>
          </span>
          <span className="asf-randomize-arrow" aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}

/* ── Wizard ──────────────────────────────────────────────────── */
function Wizard({
  mode,
  profile,
  setProfile,
  onDone,
  onBack,
}: {
  mode: Mode;
  profile: Profile;
  setProfile: (p: Profile) => void;
  onDone: () => void;
  onBack: () => void;
}) {
  const steps = STEP_TITLES[mode];
  const [step, setStep] = useState(0);
  const total = steps.length;

  const cur = steps[step];

  const canNext = useMemo(() => {
    if (cur === "Größe") return !!profile.size;
    if (cur === "Branche") return !!profile.industry;
    if (cur === "Umsatz") return !!profile.revenue;
    if (cur === "Bestands-Stack") return true;
    if (cur === "Strategie") return !!profile.strategy;
    return false;
  }, [cur, profile]);

  const next = () => {
    const stepName = steps[step];
    if (stepName) FUNNEL.toolStepCompleted(stepName);
    if (step < total - 1) setStep(step + 1);
    else onDone();
  };
  const prev = () => {
    if (step > 0) setStep(step - 1);
    else onBack();
  };

  return (
    <div className="asf-screen asf-wizard">
      <header className="asf-wizard-head">
        <button type="button" className="asf-back-btn" onClick={prev}>
          ← {step === 0 ? "zurück" : steps[step - 1]}
        </button>
        <div className="asf-wizard-progress">
          {steps.map((s, i) => (
            <div
              key={s}
              className={cls("asf-prog-dot", i <= step && "done", i === step && "active")}
              aria-current={i === step ? "step" : undefined}
            >
              <span className="asf-prog-num">0{i + 1}</span>
              <span className="asf-prog-label">{s}</span>
            </div>
          ))}
        </div>
        <div className="asf-mode-pill">{mode === "greenfield" ? "GREENFIELD" : "BESTANDS-AUDIT"}</div>
      </header>

      <main className="asf-wizard-body">
        <div key={step} className="asf-wizard-stage">
          {cur === "Größe" && <SizeStep profile={profile} setProfile={setProfile} />}
          {cur === "Branche" && <IndustryStep profile={profile} setProfile={setProfile} />}
          {cur === "Umsatz" && <RevenueStep profile={profile} setProfile={setProfile} />}
          {cur === "Bestands-Stack" && <StackStep profile={profile} setProfile={setProfile} />}
          {cur === "Strategie" && <StrategyStep profile={profile} setProfile={setProfile} mode={mode} />}
        </div>
      </main>

      <footer className="asf-wizard-foot">
        <div className="asf-wizard-foot-meta">
          SCHRITT 0{step + 1} / 0{total}
        </div>
        <button type="button" className="btn primary" disabled={!canNext} onClick={next}>
          {step === total - 1 ? "Empfehlung berechnen →" : "Weiter →"}
        </button>
      </footer>
    </div>
  );
}

function StepHeader({ kicker, title, sub }: { kicker: string; title: string; sub: string }) {
  return (
    <div className="asf-step-head">
      <Eyebrow>{kicker}</Eyebrow>
      <h2 className="asf-step-title">
        {title}
        <Dot />
      </h2>
      <p className="asf-step-sub">{sub}</p>
    </div>
  );
}

function SizeStep({ profile, setProfile }: { profile: Profile; setProfile: (p: Profile) => void }) {
  return (
    <div>
      <StepHeader
        kicker="SCHRITT 01 · UNTERNEHMENSGRÖSSE"
        title="Wie viele Mitarbeiter haben Sie"
        sub="Größe steuert, welche Tools überhaupt sinnvoll sind. SAP unter 250 MA ist Overkill, Notion über 1.000 MA wird brüchig."
      />
      <div className="asf-cards-grid five">
        {SIZES.map((s) => (
          <button
            type="button"
            key={s.id}
            className={cls("asf-opt-card", profile.size === s.id && "selected")}
            onClick={() => setProfile({ ...profile, size: s.id as SizeId })}
            aria-pressed={profile.size === s.id}
          >
            <div className="asf-opt-tag">{s.short}</div>
            <div className="asf-opt-title">{s.label}</div>
            <div className="asf-opt-desc">{s.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function IndustryStep({
  profile,
  setProfile,
}: {
  profile: Profile;
  setProfile: (p: Profile) => void;
}) {
  return (
    <div>
      <StepHeader
        kicker="SCHRITT 02 · BRANCHE"
        title="In welchem Sektor sind Sie unterwegs"
        sub="Branche bestimmt die Compliance-Last und die Kandidaten. Finanz und öffentlicher Sektor brauchen EU-Hosting; Software und Industrie eher nicht."
      />
      <div className="asf-cards-grid three">
        {INDUSTRIES.map((s) => (
          <button
            type="button"
            key={s.id}
            className={cls("asf-opt-card industry", profile.industry === s.id && "selected")}
            onClick={() => setProfile({ ...profile, industry: s.id })}
            aria-pressed={profile.industry === s.id}
          >
            <div className="asf-opt-tag">{s.code}</div>
            <div className="asf-opt-title">{s.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function RevenueStep({
  profile,
  setProfile,
}: {
  profile: Profile;
  setProfile: (p: Profile) => void;
}) {
  return (
    <div>
      <StepHeader
        kicker="SCHRITT 03 · UMSATZ"
        title="Welcher Jahresumsatz"
        sub="Umsatz bestimmt das Tooling-Budget und ob Enterprise-Lizenzen tragfähig sind."
      />
      <div className="asf-cards-grid five small">
        {REVENUES.map((s) => (
          <button
            type="button"
            key={s.id}
            className={cls("asf-opt-card", profile.revenue === s.id && "selected")}
            onClick={() => setProfile({ ...profile, revenue: s.id as RevenueId })}
            aria-pressed={profile.revenue === s.id}
          >
            <div className="asf-opt-tag">{s.id.toUpperCase()}</div>
            <div className="asf-opt-title">{s.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function StackStep({
  profile,
  setProfile,
}: {
  profile: Profile;
  setProfile: (p: Profile) => void;
}) {
  const eco = profile.ecosystems;
  const toggle = (id: EcoId) => {
    setProfile({
      ...profile,
      ecosystems: eco.includes(id) ? eco.filter((x) => x !== id) : [...eco, id],
    });
  };
  return (
    <div>
      <StepHeader
        kicker="SCHRITT 04 · BESTANDS-STACK"
        title="Wo sind Sie heute schon zu Hause"
        sub="Mehrfachauswahl. Das ist der wichtigste Hebel - Ihr bestehender Stack zieht alle AI-Empfehlungen in seine Richtung."
      />
      <div className="asf-cards-grid four">
        {ECOSYSTEMS.map((s) => (
          <button
            type="button"
            key={s.id}
            className={cls("asf-opt-card eco", eco.includes(s.id) && "selected")}
            onClick={() => toggle(s.id)}
            aria-pressed={eco.includes(s.id)}
          >
            <div className="asf-opt-check">{eco.includes(s.id) ? "✓" : "+"}</div>
            <div className="asf-opt-title">{s.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function StrategyStep({
  profile,
  setProfile,
  mode,
}: {
  profile: Profile;
  setProfile: (p: Profile) => void;
  mode: Mode;
}) {
  return (
    <div>
      <StepHeader
        kicker={`SCHRITT 0${mode === "audit" ? 5 : 4} · STRATEGIE`}
        title="Welcher Leitstern"
        sub="Eine Wahl. Sie steuert, welche Trade-offs wir bevorzugen - Konsolidierung, Kosten, Souveränität oder beste-Tool-pro-Job."
      />
      <div className="asf-cards-grid five">
        {STRATEGIES.map((s) => (
          <button
            type="button"
            key={s.id}
            className={cls("asf-opt-card strategy", profile.strategy === s.id && "selected")}
            onClick={() => setProfile({ ...profile, strategy: s.id as StrategyId })}
            aria-pressed={profile.strategy === s.id}
          >
            <div className="asf-opt-tag">{s.id.toUpperCase()}</div>
            <div className="asf-opt-title">{s.label}</div>
            <div className="asf-opt-desc">{s.hint}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Result ──────────────────────────────────────────────────── */
function Result({
  profile,
  onRestart,
  onEditProfile,
  onRandomize,
}: {
  profile: Profile;
  onRestart: () => void;
  onEditProfile: () => void;
  onRandomize: () => void;
}) {
  const synergyData = useMemo(() => computeSynergy(profile), [profile]);
  const aiReadiness = useMemo(() => computeAIReadiness(profile), [profile]);
  const cost = useMemo(() => computeMonthlyCost(profile), [profile]);
  const frictions = useMemo(() => findFrictions(profile), [profile]);
  const sovereignty = useMemo(() => computeSovereignty(profile), [profile]);
  const tradeoffs = useMemo(() => computeTradeoffs(profile), [profile]);
  const allTopPicks = useMemo<System[]>(
    () => CATEGORIES.map((c) => rankCategory(c.id, profile)[0]?.sys).filter(Boolean) as System[],
    [profile],
  );
  const peerNote = profile.industry ? INDUSTRY_PEER_NOTE[profile.industry] : undefined;
  const flaggedSystems = useMemo(() => listFlaggedSystems(), []);

  // Funnel: result reached
  useEffect(() => {
    FUNNEL.toolResultShown({
      mode: profile.mode ?? null,
      size: profile.size ?? null,
      industry: profile.industry ?? null,
      revenue: profile.revenue ?? null,
      strategy: profile.strategy ?? null,
      ecosystems: (profile.ecosystems ?? []).join(",") || null,
      synergy: synergyData.synergy,
      aiReadiness,
      dominantFamily: synergyData.dominant,
      monthlyCost: cost,
      frictionsWarn: frictions.filter((f) => f.severity === "warn").length,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ranks = useMemo(() => {
    const out: Partial<Record<CategoryId, Scored[]>> = {};
    for (const c of CATEGORIES) {
      out[c.id] = rankCategory(c.id, profile);
    }
    return out;
  }, [profile]);

  const familyLabel: string = FAMILY_LABEL[synergyData.dominant] ?? "Mixed";
  const dominantShare = Math.round(((synergyData.distribution[synergyData.dominant] ?? 0) / CATEGORIES.length) * 100);

  const profileSummary = [
    SIZES.find((x) => x.id === profile.size)?.label,
    INDUSTRIES.find((x) => x.id === profile.industry)?.label,
    REVENUES.find((x) => x.id === profile.revenue)?.label,
    STRATEGIES.find((x) => x.id === profile.strategy)?.label,
  ]
    .filter(Boolean)
    .join(" · ");

  const industryInsight = profile.industry ? INDUSTRY_INSIGHTS[profile.industry] : undefined;

  const titleRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  return (
    <div className="asf-screen asf-result" role="status" aria-live="polite">
      <header className="asf-result-head asf-result-stage" style={{ "--anim-d": "80ms" } as React.CSSProperties}>
        <div>
          <Eyebrow>BRAUM CONSULTING · IHRE EMPFEHLUNG</Eyebrow>
          <h1 className="asf-result-title" ref={titleRef} tabIndex={-1}>
            Ihr AI-First Stack
            <Dot />
          </h1>
          <div className="asf-result-profile">{profileSummary}</div>
          <div className="asf-result-freshness" title={`Daten-Stand: ${DATA_REFRESH_DATE}`}>
            <span className="asf-result-freshness-key">{"// data freshness"}</span>
            <span className="asf-result-freshness-val">stand {DATA_REFRESH_LABEL}</span>
          </div>
        </div>
        <div className="asf-result-head-r">
          <button type="button" className="btn ghost" onClick={onEditProfile}>
            ← Profil ändern
          </button>
          <button type="button" className="btn secondary" onClick={onRestart}>
            Neu beginnen
          </button>
        </div>
      </header>

      <div
        className="asf-randomize-row inline asf-result-stage"
        style={{ "--anim-d": "180ms" } as React.CSSProperties}
      >
        <button
          type="button"
          className="asf-randomize-btn compact"
          onClick={onRandomize}
        >
          <span className="asf-randomize-die" aria-hidden="true">⚂</span>
          <span className="asf-randomize-text">
            <span className="asf-randomize-title">Neues Profil würfeln</span>
            <span className="asf-randomize-sub">Zufällige Konstellation, sofortiges Re-Ranking.</span>
          </span>
          <span className="asf-randomize-arrow" aria-hidden="true">→</span>
        </button>
      </div>

      {industryInsight && (
        <section className="asf-industry-banner asf-result-stage" style={{ "--anim-d": "240ms" } as React.CSSProperties}>
          <div className="asf-industry-banner-tag">
            {"// industry · "}{industryInsight.banner.toUpperCase()}
          </div>
          <div className="asf-industry-banner-text">{industryInsight.bannerNote}</div>
          {peerNote && (
            <div className="asf-peer-note">
              <span className="asf-peer-note-tag">PEER-NOTE</span>
              <span className="asf-peer-note-text">{peerNote}</span>
            </div>
          )}
        </section>
      )}

      <section className="asf-kpi-strip asf-result-stage" style={{ "--anim-d": "380ms" } as React.CSSProperties}>
        <div className="asf-kpi">
          <div className="asf-kpi-label">STACK-SYNERGIE</div>
          <div className="asf-kpi-value">
            <span className="asf-kpi-num">
              <CountUp value={synergyData.synergy} />
            </span>
            <span className="asf-kpi-unit">/100</span>
          </div>
          <AnimatedBar value={synergyData.synergy} delay={400} />
          <div className="asf-kpi-foot">
            {synergyData.synergy > 85 ? (
              <span className="asf-stamp-mint" aria-label="Stark konsolidierter Stack">
                <span className="asf-stamp-dot" aria-hidden="true" />
                KONSOLIDIERT
              </span>
            ) : synergyData.synergy > 60 ? (
              "Ausgeglichen"
            ) : (
              "Heterogen"
            )}
          </div>
        </div>
        <div className="asf-kpi">
          <div className="asf-kpi-label">AI-READINESS</div>
          <div className="asf-kpi-value">
            <span className="asf-kpi-num"><CountUp value={aiReadiness} /></span>
            <span className="asf-kpi-unit">/100</span>
          </div>
          <AnimatedBar value={aiReadiness} delay={500} />
          <div className="asf-kpi-foot">Ø der Top-Picks</div>
        </div>
        <div className="asf-kpi">
          <div className="asf-kpi-label">DOMINANTE FAMILIE</div>
          <div className="asf-kpi-value">
            <span className="asf-kpi-num small">{familyLabel}</span>
          </div>
          <div className="asf-kpi-foot">{dominantShare}% der Kategorien</div>
        </div>
        <div className={cls("asf-kpi", profile.strategy === "eu" && "asf-kpi-highlight")}>
          <div className="asf-kpi-label">EU-SOUVERÄNITÄT</div>
          <div className="asf-kpi-value">
            <span className="asf-kpi-num">
              <CountUp value={sovereignty.score} />
            </span>
            <span className="asf-kpi-unit">/100</span>
          </div>
          <AnimatedBar value={sovereignty.score} delay={550} />
          <div className="asf-kpi-foot">
            {sovereignty.euCount}/{sovereignty.total} Picks EU-fähig
            {sovereignty.weakest.length > 0 && (
              <span className="asf-kpi-foot-warn">
                {" · "}schwach: {sovereignty.weakest.slice(0, 2).map((s) => s.label).join(", ")}
              </span>
            )}
          </div>
        </div>
        <div className="asf-kpi">
          <div className="asf-kpi-label">RICHTGRÖSSE LIZENZEN</div>
          <div className="asf-kpi-value">
            <span className="asf-kpi-num">
              <CountUp value={cost} format={(n) => n.toLocaleString("de-DE")} />
            </span>
            <span className="asf-kpi-unit">€ / Mo</span>
          </div>
          <div className="asf-kpi-foot">indikativ, ohne Einführung</div>
        </div>
      </section>

      <section
        className="asf-tradeoffs asf-result-stage"
        style={{ "--anim-d": "520ms" } as React.CSSProperties}
      >
        <div className="asf-section-eyebrow">
          <Eyebrow>TRADE-OFF-PROFIL · WO IHR STACK STARK IST</Eyebrow>
        </div>
        <TradeoffBars tradeoffs={tradeoffs} />
      </section>

      <section
        className="asf-watching asf-result-stage"
        style={{ "--anim-d": "560ms" } as React.CSSProperties}
      >
        <div className="asf-section-eyebrow">
          <Eyebrow>WORTH WATCHING · UNDERDOGS UND RISING STARS</Eyebrow>
        </div>
        <p className="asf-watching-intro">
          Tools, die nicht in jedem Mainstream-Stack stehen, aber in der jeweiligen Kategorie
          gerade an Bedeutung gewinnen oder als unterschätzt gelten. Unabhängig von Ihrem Profil-Score.
        </p>
        <div className="asf-watching-grid">
          {flaggedSystems.map((f) => (
            <article key={f.sys.id} className={cls("asf-watching-card", `is-${f.sys.flag}`)}>
              <div className="asf-watching-tag">
                <span className="asf-watching-cat">{f.catLabel}</span>
                <span className={cls("asf-watching-badge", `is-${f.sys.flag}`)}>
                  {f.sys.flag === "rising" ? "RISING STAR" : "UNDERDOG"}
                </span>
              </div>
              <div className="asf-watching-name">{f.sys.label}</div>
              <div className="asf-watching-note">{f.sys.note}</div>
              <div className="asf-watching-meta">
                <span>{FAMILY_SHORT[f.sys.family]}</span>
                <span>EU {f.sys.eu}</span>
                <span>AI {f.sys.ai}</span>
                <span>{"€".repeat(f.sys.cost)}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        className="asf-frictions asf-result-stage"
        style={{ "--anim-d": "600ms" } as React.CSSProperties}
      >
        <div className="asf-section-eyebrow">
          <Eyebrow>SYNERGIE-PRÜFUNG · BRÜCHE IM STACK</Eyebrow>
        </div>
        <FrictionList frictions={frictions} />
      </section>

      <section
        className="asf-matrix asf-result-stage"
        style={{ "--anim-d": "760ms" } as React.CSSProperties}
      >
        <div className="asf-section-eyebrow">
          <Eyebrow>EMPFEHLUNG PRO KATEGORIE</Eyebrow>
        </div>
        <div className="asf-matrix-grid">
          {CATEGORIES.map((cat) => {
            const ranking = ranks[cat.id];
            if (!ranking || ranking.length === 0) return null;
            return (
              <CategoryRow
                key={cat.id}
                cat={cat}
                ranking={ranking}
                allTopPicks={allTopPicks}
              />
            );
          })}
        </div>
      </section>

      <div
        className="asf-result-stage"
        style={{ "--anim-d": "920ms" } as React.CSSProperties}
      >
        <PdfDownload
          pdfData={{
            profile,
            profileSummary,
            synergy: synergyData.synergy,
            aiReadiness,
            cost,
            dominantFamily: familyLabel,
            frictions,
            topPicks: CATEGORIES.map((cat) => {
              const ranking = ranks[cat.id];
              const pick = ranking?.[0];
              return pick ? { categoryLabel: cat.label, pick } : null;
            }).filter((x): x is { categoryLabel: string; pick: NonNullable<typeof x>["pick"] } => x !== null),
            refreshLabel: DATA_REFRESH_LABEL,
          }}
        />
      </div>

      <footer
        className="asf-result-footer asf-result-stage"
        style={{ "--anim-d": "1080ms" } as React.CSSProperties}
      >
        <div>
          <div className="asf-rf-title">
            Tieferes Audit
            <Dot />
          </div>
          <div className="asf-rf-sub">
            Ein Erstgespräch ist 30 Minuten und kostenlos. Wir prüfen die Empfehlung gegen Ihre tatsächliche
            Architektur, Lizenzlage und Roadmap.
          </div>
        </div>
        <a
          className="asf-cta-big"
          href="https://braum.consulting"
          target="_blank"
          rel="noreferrer noopener"
          onClick={() => FUNNEL.toolCtaConsult()}
        >
          <span className="asf-cta-num">AUDIT_PRO</span>
          <span className="asf-cta-label">Gespräch anfragen</span>
          <span className="asf-cta-glyph" aria-hidden="true">↗</span>
        </a>
      </footer>
    </div>
  );
}

function FrictionList({ frictions }: { frictions: ReturnType<typeof findFrictions> }) {
  const [expanded, setExpanded] = useState(false);
  const VISIBLE_DEFAULT = 3;
  const collapsible = frictions.length > VISIBLE_DEFAULT;
  const visible = expanded || !collapsible ? frictions : frictions.slice(0, VISIBLE_DEFAULT);
  const hiddenCount = frictions.length - VISIBLE_DEFAULT;

  return (
    <div className="asf-friction-list">
      {visible.map((f, i) => (
        <div key={`${f.severity}-${i}`} className={cls("asf-friction", f.severity)}>
          <div className="asf-friction-tag">
            {f.severity === "warn" ? "WARNUNG" : f.severity === "info" ? "HINWEIS" : "OK"}
          </div>
          <div>
            <div className="asf-friction-title">{f.title}</div>
            <div className="asf-friction-text">{f.body}</div>
          </div>
        </div>
      ))}
      {collapsible && (
        <button
          type="button"
          className="asf-friction-toggle"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "weniger anzeigen" : `+${hiddenCount} weitere anzeigen`}
          <span aria-hidden="true">{expanded ? "↑" : "↓"}</span>
        </button>
      )}
    </div>
  );
}

function CategoryRow({
  cat,
  ranking,
  allTopPicks,
}: {
  cat: { id: CategoryId; n: string; label: string };
  ranking: Scored[];
  allTopPicks: System[];
}) {
  const [open, setOpen] = useState(false);
  const top = ranking[0];
  const alts = ranking.slice(1, 4);
  if (!top) return null;
  const risk = computeSystemRisk(top.sys, allTopPicks);
  const toggleOpen = () => {
    if (!open) FUNNEL.toolCategoryExpanded(cat.id);
    setOpen(!open);
  };
  return (
    <div className={cls("asf-cat-row", open && "open")}>
      <button type="button" className="asf-cat-head" onClick={toggleOpen}>
        <div className="asf-cat-num">{cat.n}</div>
        <div>
          <div className="asf-cat-name">{cat.label}</div>
          <div className="asf-cat-pick">
            {top.sys.label}
            <RiskBadges risk={risk} />
          </div>
        </div>
        <div className="asf-cat-score-wrap">
          <ScoreRing value={top.score} />
          <div className="asf-cat-fam">{FAMILY_SHORT[top.sys.family]}</div>
        </div>
        <div className="asf-cat-toggle">{open ? "−" : "+"}</div>
      </button>
      {open && (
        <div className="asf-cat-detail">
          <div>
            <div className="asf-pp-label">PRIMÄR-EMPFEHLUNG</div>
            <div className="asf-pp-name">
              {top.sys.label}
              <Dot />
            </div>
            <div className="asf-pp-note">{top.sys.note}</div>
            <div className="asf-pp-tags">
              <Tag>{FAMILY_SHORT[top.sys.family]}</Tag>
              <Tag>AI {top.sys.ai}/100</Tag>
              <Tag>EU {top.sys.eu}/100</Tag>
              <Tag>Kosten {"€".repeat(top.sys.cost)}</Tag>
              {top.reasons.map((r, i) => (
                <Tag key={`${r}-${i}`} mint>
                  {r}
                </Tag>
              ))}
            </div>

            <ScoreBreakdown breakdown={top.breakdown} totalScore={top.score} />

            {SYSTEM_PRICE_HINTS[top.sys.id] && (
              <div className="asf-pp-price">
                <div className="asf-pp-price-label">Richtpreis (DACH)</div>
                <div className="asf-pp-price-val">{SYSTEM_PRICE_HINTS[top.sys.id]}</div>
              </div>
            )}

            {NEXT_STEPS[top.sys.id] && (
              <NextSteps steps={NEXT_STEPS[top.sys.id]!} />
            )}
          </div>
          <div>
            <div className="asf-alts-label">ALTERNATIVEN</div>
            <div className="asf-alts-list">
              {alts.map((a) => (
                <div key={a.sys.id} className="asf-alt">
                  <div>
                    <div className="asf-alt-name">{a.sys.label}</div>
                    <div className="asf-alt-note">{a.sys.note}</div>
                  </div>
                  <div className="asf-alt-r">
                    <div className="asf-alt-score">{a.score}</div>
                    <div className="asf-alt-fam">{FAMILY_SHORT[a.sys.family]}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ScoreBreakdown({
  breakdown,
  totalScore,
}: {
  breakdown: Array<{ label: string; delta: number; reason?: string }>;
  totalScore: number;
}) {
  return (
    <div className="asf-pp-breakdown">
      <div className="asf-pp-breakdown-label">SCORE-AUFSCHLÜSSELUNG</div>
      <ul className="asf-pp-breakdown-list">
        {breakdown.map((f, i) => (
          <li key={`${f.label}-${i}`} className="asf-pp-breakdown-row">
            <span className="asf-pp-breakdown-cell asf-pp-breakdown-name">{f.label}</span>
            <span
              className={cls(
                "asf-pp-breakdown-cell asf-pp-breakdown-delta",
                f.delta > 0 && "pos",
                f.delta < 0 && "neg",
              )}
            >
              {f.delta > 0 ? "+" : ""}
              {f.delta}
            </span>
            <span className="asf-pp-breakdown-cell asf-pp-breakdown-reason">{f.reason ?? "—"}</span>
          </li>
        ))}
        <li className="asf-pp-breakdown-row total">
          <span className="asf-pp-breakdown-cell asf-pp-breakdown-name">SCORE</span>
          <span className="asf-pp-breakdown-cell asf-pp-breakdown-delta total">{totalScore}</span>
          <span className="asf-pp-breakdown-cell asf-pp-breakdown-reason">/ 100</span>
        </li>
      </ul>
    </div>
  );
}

function NextSteps({ steps }: { steps: [string, string, string] }) {
  return (
    <div className="asf-pp-next">
      <div className="asf-pp-next-label">NÄCHSTE 3 SCHRITTE</div>
      <ol className="asf-pp-next-list">
        {steps.map((s, i) => (
          <li key={`step-${i}`}>
            <span className="asf-pp-next-num">{String(i + 1).padStart(2, "0")}</span>
            <span className="asf-pp-next-text">{s}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Tag({ children, mint }: { children: React.ReactNode; mint?: boolean }) {
  return <span className={cls("asf-tag", mint && "mint")}>{children}</span>;
}

/* Risk-Badges: Vendor-Lock-in / Hyperscaler / EU — 3 Dots mit Title-Tooltip */
function RiskBadges({ risk }: { risk: { vendorLock: RiskLevel; hyperscaler: RiskLevel; euRisk: RiskLevel } }) {
  const items: Array<{ key: keyof typeof risk; label: string; tip: (l: RiskLevel) => string }> = [
    {
      key: "vendorLock",
      label: "L",
      tip: (l) =>
        l === "high"
          ? "Vendor-Lock-in: hoch — Wechsel würde mehrere Systeme gleichzeitig treffen."
          : l === "med"
            ? "Vendor-Lock-in: mittel — System ist tief integriert, Migration planbar."
            : "Vendor-Lock-in: niedrig — Wechsel mit moderatem Aufwand möglich.",
    },
    {
      key: "hyperscaler",
      label: "H",
      tip: (l) =>
        l === "high"
          ? "Hyperscaler-Abhängigkeit: hoch — Stack hängt überwiegend an einem US-Cloud-Anbieter."
          : l === "med"
            ? "Hyperscaler-Abhängigkeit: mittel — Teile des Stacks bei US-Hyperscalern."
            : "Hyperscaler-Abhängigkeit: niedrig — kaum oder keine Hyperscaler-Beteiligung.",
    },
    {
      key: "euRisk",
      label: "EU",
      tip: (l) =>
        l === "high"
          ? "EU-Souveränität: kritisch — System hat keine ausreichende EU-Hosting-Option."
          : l === "med"
            ? "EU-Souveränität: eingeschränkt — EU-Region verfügbar, aber mit Vorbehalten."
            : "EU-Souveränität: in Ordnung — EU-Hosting ist nativ oder vertraglich abgesichert.",
    },
  ];
  return (
    <div className="asf-risk" aria-label="Risiko-Indikatoren">
      {items.map((it) => {
        const lvl = risk[it.key];
        return (
          <span
            key={it.key}
            className={cls("asf-risk-dot", `asf-risk-${lvl}`)}
            title={it.tip(lvl)}
            aria-label={it.tip(lvl)}
          >
            {it.label}
          </span>
        );
      })}
    </div>
  );
}

function TradeoffBars({ tradeoffs }: { tradeoffs: { speed: number; costEff: number; sovereignty: number; lockRisk: number } }) {
  const items: Array<{ key: keyof typeof tradeoffs; label: string; sub: string }> = [
    { key: "speed", label: "Time-to-Value", sub: "Stack-Reife × Konsolidierung" },
    { key: "costEff", label: "Kosten-Effizienz", sub: "niedriger Lizenz-Index" },
    { key: "sovereignty", label: "EU-Souveränität", sub: "EU-Hosting + DSGVO-Last" },
    { key: "lockRisk", label: "Lock-in-Risiko", sub: "dominante Familie + Bias" },
  ];
  return (
    <div className="asf-tradeoff-bars">
      {items.map((it) => {
        const v = tradeoffs[it.key];
        return (
          <div key={it.key} className="asf-tradeoff">
            <div className="asf-tradeoff-head">
              <span className="asf-tradeoff-label">{it.label}</span>
              <span className="asf-tradeoff-val">{v}</span>
            </div>
            <div className="asf-tradeoff-bar">
              <span className="asf-tradeoff-fill" style={{ "--w": `${v}%` } as React.CSSProperties} />
            </div>
            <div className="asf-tradeoff-sub">{it.sub}</div>
          </div>
        );
      })}
    </div>
  );
}

function ScoreRing({ value }: { value: number }) {
  const r = 22;
  const c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  return (
    <div className="asf-score-ring" role="img" aria-label={`Score ${value} von 100`}>
      <svg viewBox="0 0 50 50" width="56" height="56" aria-hidden="true">
        <circle cx="25" cy="25" r={r} stroke="rgba(242,239,228,0.10)" strokeWidth="3" fill="none" />
        <circle
          cx="25"
          cy="25"
          r={r}
          stroke="var(--mint)"
          strokeWidth="3"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={off}
          strokeLinecap="round"
          transform="rotate(-90 25 25)"
        />
      </svg>
      <div className="asf-score-num">{value}</div>
    </div>
  );
}

// Re-export FamilyId so tooling that imports the module surface gets the type
export type { FamilyId };
