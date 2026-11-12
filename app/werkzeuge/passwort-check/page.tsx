import type { Metadata } from 'next'
import Section from '@/components/ui/Section'
import AccentGlow from '@/components/ui/AccentGlow'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import PageHero from '@/components/layout/PageHero'
import ItalicAccent from '@/components/ui/ItalicAccent'
import PasswortCheck from '@/components/werkzeuge/PasswortCheck'
import ToolInfo from '@/components/werkzeuge/ToolInfo'
import NextTools from '@/components/werkzeuge/NextTools'

export const metadata: Metadata = {
  title: 'Wie sicher ist dein Passwort?',
  description:
    'Wie leicht ist ein Passwort zu erraten? Live-Bewertung mit Erkennung von Wörtern, Jahreszahlen und Mustern – komplett im Browser, nichts wird gesendet.',
  alternates: { canonical: '/werkzeuge/passwort-check' },
}

export default function PasswortCheckPage() {
  return (
    <>
      <PageHero
        eyebrowNum="12"
        eyebrow="Werkzeug · Security"
        title={<>Wie schnell ist dein Passwort <ItalicAccent>geknackt</ItalicAccent>?</>}
        lede="Tippe ein Passwort nach deinem üblichen Muster und sieh live, wie lange ein Angreifer dafür bräuchte. Alles läuft in deinem Browser — nichts wird gesendet, nichts gespeichert. Ein kleiner Augenöffner fürs Team."
        compact
      />
      <Section className="pb-32 pt-4 md:pb-44" background={<AccentGlow position="top-left" intensity="low" />}>
        <Breadcrumbs withJsonLd className="mb-12" items={[{ label: 'Werkzeuge', href: '/werkzeuge' }, { label: 'Passwort-Check' }]} />
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <PasswortCheck />
        </div>
        <ToolInfo
          name="Passwort-Stärke-Check"
          path="/werkzeuge/passwort-check"
          description="Kostenloser Selbst-Check: Zeigt in Echtzeit, wie leicht ein Passwort zu erraten ist — mit Erkennung von Wörtern, Namen, Jahreszahlen und Tastaturmustern. Läuft rein im Browser, ohne Datenübertragung."
          paragraphs={[
            'Wie sicher ist ein Passwort wirklich? Angreifer probieren nicht stur alle Zeichenkombinationen durch, sondern zuerst häufige Passwörter, Wörter, Namen, Jahreszahlen und Tastaturmuster. Genau so bewertet dieser Check: Er nutzt die etablierte Bibliothek zxcvbn-ts und schätzt, wie viele Versuche nötig wären. „Sommer2024!" sieht kompliziert aus, ist aber schnell erraten. Eine Passphrase aus vier zufälligen Wörtern ist stärker und leichter zu merken als ein kurzes „P@ssw0rt!".',
            'Wichtig: Die Eingabe verlässt deinen Browser nicht — es gibt keine Übertragung an einen Server und nichts wird gespeichert. Trotzdem die Empfehlung, hier nicht das echte Passwort einzugeben, sondern eines nach demselben Muster. Für Unternehmen zählt am Ende weniger das einzelne Passwort als die Architektur dahinter: ein Passwort-Manager, durchgesetzte Mindestlängen und vor allem MFA oder Passkeys, damit ein geknacktes Passwort allein nie ausreicht.',
          ]}
          faq={[
            { q: 'Wird mein Passwort gespeichert oder übertragen?', a: 'Nein. Die Berechnung läuft vollständig lokal in deinem Browser (JavaScript), es gibt keine Server-Übertragung und keine Speicherung. Getrackt wird höchstens anonym, in welche Stärke-Kategorie eine Eingabe fiel — niemals die Eingabe selbst.' },
            { q: 'Was macht ein Passwort stark?', a: 'Länge und Zufall. Bekannte Wörter, Namen, Jahreszahlen und Tastaturfolgen helfen kaum, auch nicht mit Sonderzeichen am Ende. Vier bis fünf zufällige Wörter (eine Passphrase) schlagen kurze, kryptische Passwörter deutlich — und sind besser merkbar.' },
            { q: 'Reicht ein starkes Passwort aus?', a: 'Nein. Ein starkes, pro Dienst einzigartiges Passwort ist die Basis, aber erst MFA oder Passkeys machen den Zugang wirklich robust — dann ist das Passwort nicht mehr der einzige Schlüssel.' },
            { q: 'Wie realistisch ist die geschätzte Knackzeit?', a: 'Sie ist eine Größenordnung, kein exakter Wert. Angenommen wird der günstige Fall: Ein Angreifer hat die Passwort-Daten eines Dienstes erbeutet, der sie sorgfältig gespeichert hat (rund 10.000 Versuche pro Sekunde). Bei schlecht gesicherten Diensten geht es um ein Vielfaches schneller. Wenn ein Passwort schon hier schwach aussieht, ist es schwach.' },
          ]}
        />
        <NextTools current="/werkzeuge/passwort-check" />
      </Section>
    </>
  )
}
