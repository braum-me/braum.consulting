import Section from '@/components/ui/Section'
import Eyebrow from '@/components/ui/Eyebrow'
import AccentGlow from '@/components/ui/AccentGlow'
import FaqItem from '@/components/ui/FaqItem'

const FAQS: Array<{ q: string; a: React.ReactNode }> = [
  {
    q: 'Wie schnell startest du?',
    a: (
      <>
        Erstgespräch meist innerhalb einer Woche. Danach zwei bis drei Wochen
        Lagebild, dann der Festpreis-Brief. Wenn es brennt, sag es im
        Erstgespräch — dann finden wir einen Weg.
      </>
    ),
  },
  {
    q: 'Was kostet das?',
    a: (
      <>
        Festpreis, kein Tagessatz mal X. Die Zahl entsteht im Lagebild, nicht
        am Telefon. Schreib mir kurz, was bei dir gerade ansteht — dann kommt
        die Range zum Brief.
      </>
    ),
  },
  {
    q: 'Arbeitest du allein oder mit Partnern?',
    a: (
      <>
        Im Engagement bekommst du mich. Direkt, ohne Projektleiter dazwischen.
        Wenn Skills fehlen, die ich nicht selbst liefere — SAP, hardware-nahe
        OT, Spezial-Compliance — hole ich kuratierte Partner dazu. Transparent,
        nur wenn es nötig ist.
      </>
    ),
  },
  {
    q: 'Wie läuft die Zusammenarbeit konkret?',
    a: (
      <>
        Vier Etappen: Erstgespräch, Lagebild mit Festpreis-Brief, Lieferung in
        Iterationen mit Demos alle zwei Wochen, Übergabe mit Doku und Schulung.
        Slack-Kanal zur Geschäftsführung, monatliche Status-Mail. Du siehst,
        was passiert, während es passiert.
      </>
    ),
  },
  {
    q: 'Was passiert nach dem Projekt?',
    a: (
      <>
        Doku liegt, Team ist geschult, Service-Level ist klar. Wer mich später
        wieder braucht, ruft an. Wer nicht, läuft autark. Der Lotse steigt am
        Hafen aus — das Schiff fährt von dort allein.
      </>
    ),
  },
  {
    q: 'Bin ich groß genug für dich?',
    a: (
      <>
        Inhabergeführter Mittelstand zwischen 50 und 2.000 Mitarbeitenden ist
        mein Schwerpunkt. Kleiner mit klarem Vorhaben? Fragen kostet nichts.
        Konzern mit Pyramidenbedarf? Gibt bessere Anbieter, ich empfehle gern.
      </>
    ),
  },
  {
    q: 'Bist du verfügbar?',
    a: (
      <>
        Maximal vier Engagements parallel. Der aktuelle Stand und der nächste
        freie Slot stehen oben im Hero. Erstgespräche gehen immer, auch wenn
        die Slots gerade voll sind.
      </>
    ),
  },
  {
    q: 'Wofür bist du nicht zuständig?',
    a: (
      <>
        Dauer-Outsourcing der IT, kompletter Konzernumbau, Marketing ohne
        IT-Bezug. Dafür gibt es bessere Anbieter — ich empfehle gern. Mein
        Fokus ist der erste Kurs und die ersten Manöver, nicht die
        Dauerbegleitung.
      </>
    ),
  },
]

export default function Faq() {
  const half = Math.ceil(FAQS.length / 2)
  const left = FAQS.slice(0, half)
  const right = FAQS.slice(half)

  return (
    <Section
      id="faq"
      className="relative py-28 md:py-36"
      background={<AccentGlow position="top-left" intensity="medium" />}
    >
      <div className="max-w-[920px]">
        <Eyebrow num="09">Was du wahrscheinlich fragst</Eyebrow>
        <h2
          className="mt-6 max-w-[720px] font-display font-bold"
          style={{
            fontSize: 'clamp(36px, 4.4vw, 60px)',
            lineHeight: 'var(--lh-display)',
            letterSpacing: 'var(--tr-display)',
            color: 'var(--fg-default)',
          }}
        >
          Was du wahrscheinlich fragst.
        </h2>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-2 md:mt-20 md:grid-cols-2 md:gap-x-16">
        <ol
          className="faq-counter"
          style={{ listStyle: 'none', counterReset: 'faq', padding: 0, margin: 0 }}
        >
          {left.map((f, i) => (
            <FaqItem key={`l-${i}`} q={f.q} a={f.a} defaultOpen={i === 0} />
          ))}
        </ol>
        <ol
          className="faq-counter"
          style={{ listStyle: 'none', counterReset: 'faq ' + half, padding: 0, margin: 0 }}
        >
          {right.map((f, i) => (
            <FaqItem key={`r-${i}`} q={f.q} a={f.a} />
          ))}
        </ol>
      </div>

      <style>{`
        .faq-counter > li {
          counter-increment: faq;
          position: relative;
        }
        .faq-counter > li::before {
          content: counter(faq, decimal-leading-zero);
          position: absolute;
          top: 32px;
          left: 0;
          font-family: var(--font-mono), ui-monospace, monospace;
          font-size: var(--t-micro);
          letter-spacing: var(--tr-eyebrow);
          color: var(--brand);
          text-transform: uppercase;
          display: none;
        }
        @media (min-width: 768px) {
          .faq-counter > li::before { display: block; }
          .faq-counter > li > button { padding-left: 40px; }
          .faq-counter > li > div > div { padding-left: 40px; }
        }
      `}</style>
    </Section>
  )
}
