import type { Metadata } from 'next'
import Section from '@/components/ui/Section'
import AccentGlow from '@/components/ui/AccentGlow'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import PageHero from '@/components/layout/PageHero'
import ItalicAccent from '@/components/ui/ItalicAccent'
import Nis2Check from '@/components/werkzeuge/Nis2Check'
import ToolInfo from '@/components/werkzeuge/ToolInfo'

export const metadata: Metadata = {
  title: 'NIS2-Betroffenheit prüfen',
  description:
    'Bin ich von NIS2 betroffen? Vier Fragen nach § 28 BSIG zu Größe, Tätigkeit und Lieferkette – direkt, mittelbar oder nicht, plus nächste Schritte.',
  alternates: { canonical: '/werkzeuge/nis2-betroffenheit' },
}

export default function Nis2BetroffenheitPage() {
  return (
    <>
      <PageHero
        eyebrowNum="01"
        eyebrow="Werkzeug · NIS2"
        title={<>Bin ich von NIS2 <ItalicAccent>betroffen</ItalicAccent>?</>}
        lede="Vier Fragen zu Mitarbeitenden, Umsatz und Bilanz, Tätigkeit und Lieferkette. Am Ende steht eine erste, ehrliche Einordnung — direkt betroffen, mittelbar über die Lieferkette, oder aktuell außen vor. Keine Anmeldung, nichts wird gespeichert."
        compact
      />

      <Section
        className="pb-32 pt-4 md:pb-44"
        background={<AccentGlow position="top-right" intensity="low" />}
      >
        <Breadcrumbs
          withJsonLd
          className="mb-12"
          items={[{ label: 'Werkzeuge', href: '/werkzeuge' }, { label: 'NIS2-Betroffenheit' }]}
        />
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <Nis2Check />
        </div>
        <ToolInfo
          name="NIS2-Betroffenheits-Check"
          path="/werkzeuge/nis2-betroffenheit"
          description="Kostenloser Selbst-Check: In vier Fragen nach § 28 BSIG prüfen, ob dein Unternehmen von NIS2 betroffen ist – als unverbindliche Ersteinschätzung."
          paragraphs={[
            'NIS2 weitet die EU-Cybersicherheitspflichten auf 18 Sektoren aus — vom verarbeitenden Gewerbe über Lebensmittel bis zu digitalen Diensten. Dieser Check prüft die drei Kriterien, an denen die Betroffenheit wirklich hängt: Unternehmensgröße (ab 50 Mitarbeitenden oder je über 10 Mio. € Umsatz und Bilanzsumme), die Einrichtungsart nach § 28 BSIG und seinen Anlagen 1 und 2 und die meistübersehene Frage — ob du als Zulieferer eines betroffenen Unternehmens die Anforderungen über Kundenverträge durchgereicht bekommst.',
            'Das Ergebnis ist eine erste Einordnung in vier Stufen: direkt betroffen als wesentliche oder wichtige Einrichtung, mittelbar über die Lieferkette, Graubereich, oder aktuell außen vor. Dazu bekommst du die jeweils sinnvollen nächsten Schritte. Alles läuft im Browser — keine Anmeldung, nichts wird gespeichert.',
          ]}
          faq={[
            { q: 'Ab wann ist ein Unternehmen von NIS2 betroffen?', a: 'Die Faustregel nach § 28 BSIG: mindestens 50 Mitarbeitende oder Umsatz und Bilanzsumme von je über 10 Mio. €, in einem Sektor aus Anlage 1 oder 2 des BSIG. Betreiber kritischer Anlagen, DNS-Dienste, TLD-Registries und Vertrauensdienste sind unabhängig von der Größe erfasst. Partner- und verbundene Unternehmen zählen nicht mit, wenn ihr bei IT-Systemen und Prozessen unabhängig seid.' },
            { q: 'Gilt NIS2 in Deutschland schon?', a: 'Ja. Das NIS-2-Umsetzungsgesetz ist seit dem 6. Dezember 2025 in Kraft. Direkt betroffene Unternehmen müssen sich beim BSI registrieren, die Frist dafür beträgt drei Monate ab dem Zeitpunkt, ab dem sie als betroffen gelten.' },
            { q: 'Bin ich als Zulieferer auch betroffen?', a: 'Sehr oft ja — mittelbar. Lieferketten-Sicherheit ist eine Kernpflicht der direkt Betroffenen, und die reichen ihre Anforderungen über Verträge und Lieferanten-Fragebögen an dich weiter, unabhängig von deiner Größe.' },
            { q: 'Brauche ich für NIS2 ein Zertifikat?', a: 'Nein. NIS2 verlangt belegbare Maßnahmen (Risikomanagement, Meldewege, Notfallvorsorge), kein Zertifikat. Eine bestehende ISO-27001-Struktur deckt allerdings einen großen Teil der Risikomanagement-Maßnahmen ab. Registrierung, Meldepflichten und die Pflichten der Geschäftsleitung kommen dazu.' },
            { q: 'Ist dieses Ergebnis rechtsverbindlich?', a: 'Nein — es ist eine fundierte Orientierung, keine Rechtsberatung. Die finale Einstufung hängt am Einzelfall, etwa an der konkreten Sektor-Definition und Konzernstrukturen.' },
          ]}
        />
      </Section>
    </>
  )
}
