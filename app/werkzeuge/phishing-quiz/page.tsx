import type { Metadata } from 'next'
import Section from '@/components/ui/Section'
import AccentGlow from '@/components/ui/AccentGlow'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import PageHero from '@/components/layout/PageHero'
import ItalicAccent from '@/components/ui/ItalicAccent'
import PhishingQuiz from '@/components/werkzeuge/PhishingQuiz'
import ToolInfo from '@/components/werkzeuge/ToolInfo'

export const metadata: Metadata = {
  title: 'Phishing-Quiz: Erkennst du die Fälschung?',
  description:
    'Kostenloses Quiz: Sieben realistische E-Mails — welche ist Phishing, welche seriös? Mit Erklärung der Erkennungszeichen nach jeder Antwort. Ideal fürs Team.',
  alternates: { canonical: '/werkzeuge/phishing-quiz' },
}

export default function PhishingQuizPage() {
  return (
    <>
      <PageHero
        eyebrowNum="10"
        eyebrow="Werkzeug · Security"
        title={<>Erkennst du die <ItalicAccent>Fälschung</ItalicAccent>?</>}
        lede="Sieben E-Mails, wie sie täglich in Postfächern landen — vom falschen Microsoft-Alarm bis zur Chef-Masche. Du entscheidest: Phishing oder seriös? Nach jeder Antwort gibt's die Erkennungszeichen dazu."
        compact
      />
      <Section className="pb-32 pt-4 md:pb-44" background={<AccentGlow position="top-right" intensity="low" />}>
        <Breadcrumbs withJsonLd className="mb-12" items={[{ label: 'Werkzeuge', href: '/werkzeuge' }, { label: 'Phishing-Quiz' }]} />
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <PhishingQuiz />
        </div>
        <ToolInfo
          name="Phishing-Quiz"
          path="/werkzeuge/phishing-quiz"
          description="Kostenloses Awareness-Quiz: Sieben realistische E-Mail-Beispiele als Phishing oder seriös einordnen — mit Erklärung der Erkennungszeichen nach jeder Antwort."
          paragraphs={[
            'Phishing ist der häufigste Einstiegspunkt für schwere Sicherheitsvorfälle — und seit generative KI die Mails sprachlich fehlerfrei macht, greifen die alten Erkennungsregeln („holpriges Deutsch") nicht mehr. Was bleibt, sind die strukturellen Signale: Absender-Domain, Link-Ziel, künstliche Dringlichkeit, ungewöhnlicher Kanal, fehlender Kontext. Genau diese Signale trainiert dieses Quiz an sieben fiktiven, aber realistisch gebauten Beispielen.',
            'Das Quiz eignet sich auch als Gesprächsöffner im Team: fünf Minuten gemeinsam spielen, über die übersehenen Beispiele reden — das ist wirksamer als manche Pflichtschulung. Für systematische Awareness (regelmäßige, realistische Simulationen ohne Bloßstellung) ist es der Einstieg, nicht der Ersatz.',
          ]}
          faq={[
            { q: 'Woran erkenne ich Phishing, wenn die Sprache perfekt ist?', a: 'An der Struktur statt am Stil: Passt die Absender-Domain wirklich zum Unternehmen? Wohin führt der Link tatsächlich? Wird Druck aufgebaut oder Vertraulichkeit verlangt? Und vor allem — passt die Mail zu etwas, das wirklich passiert ist? Fehlender Kontext ist das stärkste Warnsignal.' },
            { q: 'Was mache ich, wenn ich auf eine Phishing-Mail hereingefallen bin?', a: 'Sofort melden — IT oder Vorgesetzte — und betroffene Passwörter ändern. Schnelligkeit schlägt Scham: Je früher die IT Bescheid weiß, desto kleiner der Schaden. Eine gute Sicherheitskultur bestraft das Melden nie.' },
            { q: 'Wie schult man ein Team wirksam gegen Phishing?', a: 'Regelmäßig statt einmalig, realistisch statt theoretisch, lernorientiert statt bloßstellend. Simulierte Kampagnen mit kurzen Erklärungen wirken — kombiniert mit technischen Schutzschichten wie MFA und Passkeys, die gestohlene Passwörter entwerten.' },
          ]}
        />
      </Section>
    </>
  )
}
