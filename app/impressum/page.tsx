import type { Metadata } from 'next'
import Link from 'next/link'
import AccentGlow from '@/components/ui/AccentGlow'
import ObfuscatedEmail from '@/components/ui/ObfuscatedEmail'

export const metadata: Metadata = {
  alternates:  { canonical: '/impressum' },
  title:       'Impressum',
  description: 'Impressum von Braum Consulting · Stefan Braum, Sinntal.',
  robots:      { index: true, follow: true },
}

export default function ImpressumPage() {
  return (
    <>
      <section
        className="relative w-screen overflow-hidden"
        style={{
          marginLeft: 'calc(-50vw + 50%)',
          background: 'var(--bg-base)',
          padding: 'clamp(120px, 14vw, 200px) 0 clamp(48px, 6vw, 72px)',
        }}
      >
        <AccentGlow position="top-right" intensity="low" />
        <div className="relative z-[3] mx-auto w-full max-w-[var(--container-wide)] px-6 md:px-12">
          <p
            className="font-mono uppercase"
            style={{ fontSize: '11px', letterSpacing: '0.20em', color: 'var(--brand)', marginBottom: '24px' }}
          >
            Rechtliches
          </p>
          <h1
            className="font-display font-bold"
            style={{
              fontSize: 'clamp(40px, 5.6vw, 80px)',
              lineHeight: 1,
              letterSpacing: 'var(--tr-display)',
              color: 'var(--fg-default)',
            }}
          >
            Impressum
          </h1>
        </div>
      </section>

      <article
        style={{
          maxWidth: '720px',
          margin: '0 auto',
          padding: '0 24px clamp(96px, 12vw, 160px)',
          fontSize: '16px',
          lineHeight: 1.75,
          color: 'var(--fg-default)',
        }}
      >
        <h2 style={h2}>Diensteanbieter</h2>
        <p>
          Stefan Braum &mdash; Braum Consulting<br />
          Schlüchterner Straße 31<br />
          36391 Sinntal<br />
          Deutschland
        </p>
        <p>Steuer-ID: 019 807 60940</p>
        <p>Umsatzsteuerbefreit als Kleinunternehmer nach § 19 UStG.</p>

        <h2 style={h2}>Kontakt</h2>
        <p>
          E-Mail:{' '}
          <ObfuscatedEmail showAddress style={linkStyle} />
          <br />
          Kontaktformular:{' '}
          <Link href="/kontakt" style={linkStyle}>
            braum.consulting/kontakt
          </Link>
        </p>

        <h2 style={h2}>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
        <p>
          Stefan Braum (Anschrift wie oben). Verantwortlich für sämtliche
          journalistisch-redaktionellen Inhalte auf dieser Website, insbesondere
          unter <Link href="/blog" style={linkStyle}>/blog</Link>.
        </p>

        <h2 style={h2}>Online-Streitbeilegung (Art. 14 ODR-VO)</h2>
        <p>
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung
          (OS) bereit, die unter{' '}
          <a
            href="https://ec.europa.eu/consumers/odr/"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            https://ec.europa.eu/consumers/odr/
          </a>{' '}
          erreichbar ist.
        </p>

        <h2 style={h2}>Verbraucherstreitbeilegung (§ 36 VSBG)</h2>
        <p>
          Wir sind weder bereit noch verpflichtet, an Streitbeilegungsverfahren vor
          einer Verbraucherschlichtungsstelle teilzunehmen.
        </p>

        <h2 style={h2}>Social Media und andere Onlinepräsenzen</h2>
        <p>Dieses Impressum gilt auch für die folgenden Social-Media-Präsenzen und Onlineprofile:</p>
        <ul style={ulStyle}>
          <li>
            <a href="https://www.linkedin.com/in/stefanbraum/" target="_blank" rel="noopener noreferrer" style={linkStyle}>
              linkedin.com/in/stefanbraum
            </a>
          </li>
          <li>
            <a href="https://www.xing.com/profile/Stefan_Braum" target="_blank" rel="noopener noreferrer" style={linkStyle}>
              xing.com/profile/Stefan_Braum
            </a>
          </li>
          <li>
            <a href="https://www.stefanbraum.de" target="_blank" rel="noopener noreferrer" style={linkStyle}>
              stefanbraum.de
            </a>
          </li>
          <li>
            <a href="https://cv.stefanbraum.de" target="_blank" rel="noopener noreferrer" style={linkStyle}>
              cv.stefanbraum.de
            </a>
          </li>
        </ul>

        <h2 style={h2}>Haftungs- und Schutzrechtshinweise</h2>
        <p>
          <strong style={strongStyle}>Urheber- und Markenrechte:</strong> Alle auf dieser
          Website dargestellten Inhalte (Texte, Fotografien, Grafiken, Marken und
          Warenzeichen) sind durch die jeweiligen Schutzrechte (Urheberrechte,
          Markenrechte) geschützt. Die Verwendung, Vervielfältigung etc. unterliegen
          unseren Rechten oder den Rechten der jeweiligen Urheber bzw. Rechteinhaber.
        </p>
      </article>
    </>
  )
}

const h2: React.CSSProperties = {
  fontFamily:    'var(--font-display)',
  fontWeight:    600,
  fontSize:      'clamp(22px, 2.4vw, 28px)',
  letterSpacing: 'var(--tr-heading)',
  color:         'var(--fg-default)',
  marginTop:     '48px',
  marginBottom:  '16px',
  lineHeight:    1.2,
}

const linkStyle: React.CSSProperties = {
  color:               'var(--brand)',
  textDecoration:      'underline',
  textUnderlineOffset: '3px',
}

const ulStyle: React.CSSProperties = {
  listStyle:    'disc',
  paddingLeft:  '20px',
  marginTop:    '12px',
  marginBottom: '12px',
}

const strongStyle: React.CSSProperties = {
  color: 'var(--fg-default)',
  fontWeight: 600,
}
