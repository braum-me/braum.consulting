import type { Metadata } from 'next'
import Section from '@/components/ui/Section'
import AccentGlow from '@/components/ui/AccentGlow'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import PageHero from '@/components/layout/PageHero'
import ItalicAccent from '@/components/ui/ItalicAccent'
import Assessment, { type AssessConfig } from '@/components/werkzeuge/Assessment'
import ToolInfo from '@/components/werkzeuge/ToolInfo'

export const metadata: Metadata = {
  title: 'Website-Check: Bringt deine Website Anfragen?',
  description:
    'Kostenloser Selbst-Check für Handwerk, Praxen und Dienstleister: Sechs Fragen zu Google-Profil, lokaler Auffindbarkeit, Technik und Anfragen — mit ehrlichem Reifegrad.',
  alternates: { canonical: '/werkzeuge/website-check' },
}

const CONFIG: AssessConfig = {
  toolId: 'website',
  trackName: 'werkzeug_website_result',
  badgePrefix: 'Web-Reifegrad',
  flagLabel: 'Wo du Anfragen liegen lässt',
  cta: { href: '/kontakt', event: 'cta_lagebild_werkzeug_website', label: 'Website im Lagebild prüfen' },
  detail: { href: '/leistungen/marke', label: 'Marke, Website & Reichweite' },
  disclaimer: 'Selbsteinschätzung als Startpunkt — die echten Zahlen (Rankings, Ladezeit, Conversion) zeigt ein Blick in die Daten.',
  related: [
    { href: '/lexikon/local-seo', label: 'Local SEO im Lexikon' },
    { href: '/cases/wolfswerk', label: 'Case: Werkstatt auf Spitzenplätze' },
  ],
  bands: [
    { max: 3, name: 'Gut aufgestellt', headline: 'Deine Website arbeitet für dich.', note: 'Die Grundlagen stehen — Auffindbarkeit, Technik, Anfragen. Jetzt geht es um Feinschliff: mehr Bewertungen, gezielter Content, Conversion-Optimierung.' },
    { max: 8, name: 'Luft nach oben', headline: 'Solide Basis, aber Anfragen bleiben liegen.', note: 'Einiges funktioniert, aber an zwei, drei Stellen verlierst du Sichtbarkeit oder Interessenten. Die gute Nachricht: Genau diese Hebel sind meist schnell gestellt.' },
    { max: 99, name: 'Baustelle', headline: 'Deine Website verschenkt ihr Potenzial.', note: 'Wer dich nicht kennt, findet dich kaum — und wer dich findet, hat es schwer anzufragen. Das ist kein Drama, sondern der Normalzustand vieler Betriebe. Mit System aufgeräumt, wird die Website vom Aushängeschild zum Anfragen-Kanal.' },
  ],
  questions: [
    {
      key: 'profil', label: '01 · Ist dein Google-Unternehmensprofil gepflegt?',
      options: [
        { value: 'ja', label: 'Ja, vollständig mit Fotos & Zeiten', weight: 0 },
        { value: 'teil', label: 'Existiert, aber halb gepflegt', weight: 2, flag: 'Google-Profil halb gepflegt — der lokale Karten-Block ist oft der erste Kontaktpunkt.' },
        { value: 'nein', label: 'Nein / weiß nicht', weight: 3, flag: 'Kein gepflegtes Google-Unternehmensprofil — für lokale Suche der wichtigste einzelne Hebel.' },
      ],
    },
    {
      key: 'ranking', label: '02 · Wirst du bei „dein Gewerk + Ort" gefunden?',
      options: [
        { value: 'vorne', label: 'Ja, weit vorne', weight: 0 },
        { value: 'hinten', label: 'Irgendwo, aber nicht vorne', weight: 2, flag: 'Bei „Gewerk + Ort" nicht vorne — genau dort suchen deine Kunden.' },
        { value: 'nein', label: 'Nein / nie geprüft', weight: 3, flag: 'Lokale Auffindbarkeit ungeprüft — ohne Sichtbarkeit keine Anfragen über die Website.' },
      ],
    },
    {
      key: 'bewertungen', label: '03 · Sammelst du aktiv Google-Bewertungen?',
      options: [
        { value: 'ja', label: 'Ja, regelmäßig', weight: 0 },
        { value: 'passiv', label: 'Es kommen welche, aber unsystematisch', weight: 1, flag: 'Bewertungen kommen nur passiv — ein einfacher Nachfass-Prozess verdoppelt die Rate oft.' },
        { value: 'nein', label: 'Kaum / keine', weight: 2, flag: 'Kaum Bewertungen — die stützen Vertrauen und lokales Ranking zugleich.' },
      ],
    },
    {
      key: 'mobil', label: '04 · Lädt die Website auf dem Handy schnell und sauber?',
      options: [
        { value: 'ja', label: 'Ja, schnell und lesbar', weight: 0 },
        { value: 'naja', label: 'Geht so', weight: 2, flag: 'Mobile Darstellung/Ladezeit mittelmäßig — die Mehrheit deiner Besucher kommt mobil.' },
        { value: 'nein', label: 'Eher langsam / veraltet', weight: 3, flag: 'Langsame oder veraltete mobile Website — kostet Ranking und Besucher gleichzeitig.' },
      ],
    },
    {
      key: 'anfragen', label: '05 · Kommen messbar Anfragen über die Website?',
      options: [
        { value: 'ja', label: 'Ja, regelmäßig und nachvollziehbar', weight: 0 },
        { value: 'ab-und-zu', label: 'Ab und zu', weight: 1, flag: 'Anfragen kommen nur sporadisch — oft fehlt ein klarer Anfrage-Weg (Formular, Rückruf, Termin).' },
        { value: 'nein', label: 'Selten / wird nicht gemessen', weight: 3, flag: 'Anfragen werden nicht gemessen — ohne Messung keine gezielte Verbesserung.' },
      ],
    },
    {
      key: 'basics', label: '06 · Sind SSL, Impressum und Datenschutz sauber?',
      options: [
        { value: 'ja', label: 'Ja, alles aktuell', weight: 0 },
        { value: 'unsicher', label: 'Unsicher', weight: 1, flag: 'Rechtliche Basics (SSL, Impressum, Datenschutz) ungeprüft — Abmahn- und Vertrauensrisiko.' },
        { value: 'nein', label: 'Da gibt es Lücken', weight: 2, flag: 'Lücken bei SSL/Impressum/Datenschutz — das gehört vor allem anderen geschlossen.' },
      ],
    },
  ],
}

export default function WebsiteCheckPage() {
  return (
    <>
      <PageHero
        eyebrowNum="07"
        eyebrow="Werkzeug · Website"
        title={<>Bringt deine Website <ItalicAccent>Anfragen</ItalicAccent>?</>}
        lede="Sechs Fragen zu Auffindbarkeit, Google-Profil, Technik und Anfrage-Wegen — zugeschnitten auf Handwerk, Praxen und Dienstleister mit regionalem Einzugsgebiet. Am Ende steht ein ehrlicher Reifegrad."
        compact
      />
      <Section className="pb-32 pt-4 md:pb-44" background={<AccentGlow position="top-left" intensity="low" />}>
        <Breadcrumbs withJsonLd className="mb-12" items={[{ label: 'Werkzeuge', href: '/werkzeuge' }, { label: 'Website-Check' }]} />
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <Assessment config={CONFIG} />
        </div>
        <ToolInfo
          name="Website-Check für Handwerk und Dienstleister"
          path="/werkzeuge/website-check"
          description="Kostenloser Selbst-Check: Sechs Fragen zu Google-Profil, lokaler Auffindbarkeit, Technik und Anfrage-Wegen zeigen, ob deine Website Anfragen bringt."
          paragraphs={[
            'Für Betriebe mit festem Einzugsgebiet entscheidet sich der Website-Erfolg an wenigen Stellen: Wirst du bei „Gewerk + Ort" gefunden, ist dein Google-Unternehmensprofil gepflegt, stützen Bewertungen dein Vertrauen, lädt die Seite mobil schnell — und gibt es einen klaren Weg zur Anfrage? Dieser Check fragt genau diese Hebel ab, dazu die rechtlichen Basics.',
            'Das Ergebnis ist ein Reifegrad in drei Stufen plus die konkreten Stellen, an denen du Anfragen liegen lässt. Die Erfahrung aus echten Mandaten — von der Kfz-Werkstatt bis zur Steuerkanzlei — zeigt: Die meisten dieser Hebel sind keine Großprojekte, sondern Wochen-Arbeit mit messbarem Effekt.',
          ]}
          faq={[
            { q: 'Warum ist das Google-Unternehmensprofil so wichtig?', a: 'Bei lokalen Suchen zeigt Google den Karten-Block oft über den normalen Ergebnissen. Ein vollständiges Profil mit Fotos, Zeiten und Bewertungen ist dort der wichtigste Ranking- und Vertrauensfaktor — und kostet nichts außer Pflege.' },
            { q: 'Wie viele Google-Bewertungen brauche ich?', a: 'Mehr als der lokale Wettbewerb, mit erkennbarer Aktualität. Wichtiger als die absolute Zahl ist ein stetiger Fluss — ein einfacher Nachfass-Prozess nach jedem Auftrag wirkt mehr als jede Einmal-Aktion.' },
            { q: 'Meine Website ist alt — neu bauen oder optimieren?', a: 'Kommt auf die Substanz an. Oft reicht ein gezielter Refit (Performance, mobile Darstellung, Anfrage-Wege, Local SEO). Ein Neubau lohnt, wenn Technik oder Positionierung grundsätzlich nicht mehr passen — das klärt ein Lagebild ehrlicher als ein Bauchgefühl.' },
          ]}
        />
      </Section>
    </>
  )
}
