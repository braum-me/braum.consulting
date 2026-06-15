import type { Metadata } from 'next'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import AiStackFit from '@/components/werkzeuge/ai-stack-fit/AiStackFit'
import ToolInfo from '@/components/werkzeuge/ToolInfo'

export const metadata: Metadata = {
  title: 'AI-Stack-Fit · Welcher KI-Stack passt zu dir?',
  description:
    'In 90 Sekunden aus 52 KI- und Business-Systemen die ermitteln, die wirklich zu deinem Setup passen — mit EU-Souveränitäts-Score, Friction-Check, Trade-off-Profil und PDF-Export. Ohne Anmeldung.',
  alternates: { canonical: '/werkzeuge/ai-stack-fit' },
}

export default function AiStackFitPage() {
  return (
    <div className="asf-scope" style={{ background: 'var(--bg-base)' }}>
      <div
        className="mx-auto w-full max-w-[var(--container-wide)] px-6 md:px-12"
        style={{ paddingTop: 'clamp(96px, 12vh, 140px)' }}
      >
        <Breadcrumbs
          withJsonLd
          items={[{ label: 'Werkzeuge', href: '/werkzeuge' }, { label: 'AI-Stack-Fit' }]}
        />
      </div>
      <AiStackFit />
      <div className="mx-auto w-full max-w-[var(--container-wide)] px-6 md:px-12" style={{ paddingBottom: 'clamp(96px, 12vh, 160px)' }}>
        <ToolInfo
          name="AI-Stack-Fit"
          path="/werkzeuge/ai-stack-fit"
          description="Kostenloses Screening: In 90 Sekunden aus 52 KI- und Business-Systemen die ermitteln, die zu deinem Setup passen — mit EU-Souveränitäts-Score, Friction-Check und PDF-Export."
          paragraphs={[
            'AI-Stack-Fit beantwortet die Frage, an der viele Digitalvorhaben hängen: Welche der unzähligen KI- und Business-Systeme passen wirklich zu meinem Betrieb? Der Wizard sammelt in 4–5 Schritten dein Profil (Modus, Größe, Branche, bestehender Stack, Strategie) und bewertet damit 52 katalogisierte Systeme über 12 Kategorien — von Office und Kommunikation über CRM, ERP und Daten bis Automatisierung und Cloud.',
            'Das Ergebnis: ein Top-Match plus Alternativen pro Kategorie, fünf Kennzahlen (Stack-Synergie, AI-Readiness, dominante Familie, EU-Souveränität, Lizenzkosten-Richtwert), automatische Friction-Erkennung im resultierenden Stack und ein PDF-Export. Alles läuft im Browser — dein Profil verlässt den Rechner nicht.',
          ]}
          faq={[
            { q: 'Wie funktioniert das Scoring?', a: 'Jedes der 52 Systeme ist über Kategorien, Familien-Zugehörigkeit, Unternehmensgrößen-Fit, EU-Souveränität und Kosten katalogisiert. Dein Profil gewichtet diese Faktoren — bestehende Stack-Familien erzeugen Synergie-Boni, Brüche werden als Frictions ausgewiesen.' },
            { q: 'Was bedeutet der EU-Souveränitäts-Score?', a: 'Er zeigt, wie stark dein empfohlener Stack auf europäische Anbieter bzw. EU-Datenregionen setzt — relevant für DSGVO-sensible Daten und Betriebe, die Abhängigkeiten von US-Anbietern reduzieren wollen.' },
            { q: 'Sind meine Eingaben anonym?', a: 'Ja. Profil und Ergebnis werden komplett im Browser berechnet und nicht gespeichert. Nur wenn du das PDF anforderst, fragen wir Name, Firma und E-Mail ab — für die Kontaktaufnahme, keine Mailingliste.' },
            { q: 'Wie aktuell ist der System-Katalog?', a: 'Der Katalog wird kuratiert gepflegt; der Daten-Stand ist im Tool und im PDF ausgewiesen. Empfehlungen sind eine Momentaufnahme des Markts, keine Ewigkeitsaussage.' },
          ]}
        />
      </div>
    </div>
  )
}
