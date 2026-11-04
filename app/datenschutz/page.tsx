import type { Metadata } from 'next'
import Link from 'next/link'
import AccentGlow from '@/components/ui/AccentGlow'
import ObfuscatedEmail from '@/components/ui/ObfuscatedEmail'
import AnalyticsOptOut from '@/components/layout/AnalyticsOptOut'

export const metadata: Metadata = {
  alternates:  { canonical: '/datenschutz' },
  title:       'Datenschutzerklärung',
  description: 'Datenschutzerklärung von Braum Consulting nach DSGVO.',
  robots:      { index: true, follow: true },
}

export default function DatenschutzPage() {
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
            Rechtliches · Stand: 17. Mai 2026
          </p>
          <h1
            className="font-display font-bold"
            style={{
              fontSize: 'clamp(40px, 5.6vw, 80px)',
              lineHeight: 1.02,
              letterSpacing: 'var(--tr-display)',
              color: 'var(--fg-default)',
            }}
          >
            Datenschutzerklärung
          </h1>
        </div>
      </section>

      <article
        style={{
          maxWidth: '720px',
          margin: '0 auto',
          padding: '0 24px clamp(96px, 12vw, 160px)',
          fontSize: '15px',
          lineHeight: 1.75,
          color: 'var(--fg-default)',
        }}
      >

        <h2 style={h2}>Präambel</h2>
        <p>
          Mit der folgenden Datenschutzerklärung möchten wir Sie darüber aufklären,
          welche Arten Ihrer personenbezogenen Daten (nachfolgend auch kurz als „Daten"
          bezeichnet) wir zu welchen Zwecken und in welchem Umfang verarbeiten. Die
          Datenschutzerklärung gilt für alle von uns durchgeführten Verarbeitungen
          personenbezogener Daten, sowohl im Rahmen der Erbringung unserer Leistungen
          als auch insbesondere auf unseren Webseiten, in mobilen Applikationen sowie
          innerhalb externer Onlinepräsenzen, wie z.B. unserer Social-Media-Profile.
        </p>
        <p>Die verwendeten Begriffe sind nicht geschlechtsspezifisch.</p>

        <h2 style={h2}>Verantwortlicher</h2>
        <p>
          Stefan Braum &mdash; Braum Consulting<br />
          Schlüchterner Straße 31<br />
          36391 Sinntal<br />
          Deutschland
        </p>
        <p>
          E-Mail:{' '}
          <ObfuscatedEmail showAddress style={linkStyle} />
          <br />
          Impressum:{' '}
          <Link href="/impressum" style={linkStyle}>
            braum.consulting/impressum
          </Link>
        </p>

        <h2 style={h2}>Übersicht der Verarbeitungen</h2>
        <h3 style={h3}>Arten der verarbeiteten Daten</h3>
        <ul style={ulStyle}>
          <li>Bestandsdaten (z.B. Namen, Adressen)</li>
          <li>Kontaktdaten (z.B. E-Mail, Telefonnummern)</li>
          <li>Inhaltsdaten (z.B. Eingaben in Onlineformularen)</li>
          <li>Vertragsdaten (z.B. Vertragsgegenstand, Laufzeit, Kundenkategorie)</li>
          <li>Nutzungsdaten (z.B. besuchte Webseiten, Interesse an Inhalten, Zugriffszeiten)</li>
          <li>Meta-, Kommunikations- und Verfahrensdaten (z.B. IP-Adressen, Zeitangaben, Identifikationsnummern)</li>
        </ul>

        <h3 style={h3}>Kategorien betroffener Personen</h3>
        <ul style={ulStyle}>
          <li>Kunden, Interessenten, Kommunikationspartner, Nutzer, Geschäfts- und Vertragspartner</li>
        </ul>

        <h3 style={h3}>Zwecke der Verarbeitung</h3>
        <ul style={ulStyle}>
          <li>Erbringung vertraglicher Leistungen und Erfüllung vertraglicher Pflichten</li>
          <li>Kontaktanfragen und Kommunikation</li>
          <li>Bereitstellung des Onlineangebotes und Nutzerfreundlichkeit</li>
          <li>Reichweitenmessung (cookieless, IP-anonymisiert)</li>
          <li>Sicherheitsmaßnahmen</li>
        </ul>

        <h2 style={h2}>Maßgebliche Rechtsgrundlagen (DSGVO)</h2>
        <ul style={ulStyle}>
          <li>
            <strong style={strongStyle}>Einwilligung (Art. 6 Abs. 1 lit. a):</strong>{' '}
            Die betroffene Person hat ihre Einwilligung für einen oder mehrere
            spezifische Zwecke gegeben.
          </li>
          <li>
            <strong style={strongStyle}>Vertragserfüllung (Art. 6 Abs. 1 lit. b):</strong>{' '}
            Die Verarbeitung ist zur Erfüllung eines Vertrags oder zur Durchführung
            vorvertraglicher Maßnahmen erforderlich.
          </li>
          <li>
            <strong style={strongStyle}>Rechtliche Verpflichtung (Art. 6 Abs. 1 lit. c):</strong>{' '}
            Die Verarbeitung ist zur Erfüllung einer rechtlichen Verpflichtung
            erforderlich.
          </li>
          <li>
            <strong style={strongStyle}>Berechtigte Interessen (Art. 6 Abs. 1 lit. f):</strong>{' '}
            Die Verarbeitung ist zur Wahrung berechtigter Interessen erforderlich,
            sofern nicht die Interessen oder Grundrechte der betroffenen Person
            überwiegen.
          </li>
        </ul>
        <p>
          Zusätzlich gelten nationale Regelungen in Deutschland, insbesondere das
          Bundesdatenschutzgesetz (BDSG).
        </p>

        <h2 style={h2}>Sicherheitsmaßnahmen</h2>
        <p>
          Wir treffen geeignete technische und organisatorische Maßnahmen, um ein dem
          Risiko angemessenes Schutzniveau zu gewährleisten. Dazu gehören Maßnahmen
          zur Sicherung der Vertraulichkeit, Integrität und Verfügbarkeit von Daten,
          Verfahren zur Wahrnehmung von Betroffenenrechten, zur Datenlöschung und zur
          Reaktion auf Datenschutzvorfälle.
        </p>
        <p>
          <strong style={strongStyle}>TLS-Verschlüsselung:</strong> Daten werden via
          HTTPS übertragen (TLS), erkennbar am Präfix{' '}
          <code style={codeStyle}>https://</code> in der Adresszeile.
        </p>

        <h2 style={h2}>Rechte der betroffenen Personen</h2>
        <p>
          Nach DSGVO stehen Ihnen verschiedene Rechte zu, insbesondere:
        </p>
        <ul style={ulStyle}>
          <li>
            <strong style={strongStyle}>Widerspruchsrecht:</strong> Sie können der
            Verarbeitung Ihrer Daten auf Grundlage von Art. 6 Abs. 1 lit. e oder f
            DSGVO jederzeit widersprechen.
          </li>
          <li>
            <strong style={strongStyle}>Widerrufsrecht:</strong> Erteilte Einwilligungen
            können jederzeit widerrufen werden.
          </li>
          <li>
            <strong style={strongStyle}>Auskunfts-, Berichtigungs-, Lösch- und
            Einschränkungsrecht</strong> nach Art. 15-18 DSGVO.
          </li>
          <li>
            <strong style={strongStyle}>Datenübertragbarkeit</strong> nach Art. 20 DSGVO.
          </li>
          <li>
            <strong style={strongStyle}>Beschwerderecht</strong> bei einer Aufsichts-
            behörde (für uns zuständig: HBDI Hessen, siehe unten).
          </li>
        </ul>

        <h2 style={h2}>Cookies und lokale Speicherung</h2>
        <p>
          Diese Website ist <strong style={strongStyle}>cookieless im Sinne von
          Tracking-Cookies</strong>. Es werden ausschließlich technisch notwendige
          Cookies und Browser-Storage-Einträge gesetzt, für die nach § 25 Abs. 2 Nr. 2
          TDDDG keine Einwilligung erforderlich ist:
        </p>
        <ul style={ulStyle}>
          <li>
            <strong style={strongStyle}>Cloudflare-Cookies</strong> (z.B.{' '}
            <code style={codeStyle}>__cf_bm</code> · max. 30 Minuten,{' '}
            <code style={codeStyle}>cf_clearance</code> · bis 1 Jahr): werden zur
            Abwehr automatisierter Angriffe und zur Bot-Erkennung gesetzt. Strictly
            necessary, keine Profilbildung.
          </li>
          <li>
            <strong style={strongStyle}>Local Storage</strong>{' '}
            <code style={codeStyle}>braum.privacy-notice.v1</code>: speichert, ob du
            den Datenschutz-Hinweis bereits weggeklickt hast — damit er nicht jedes
            Mal wieder erscheint.
          </li>
          <li>
            <strong style={strongStyle}>Local Storage</strong>{' '}
            <code style={codeStyle}>braum.analytics-opt-out</code> (optional,
            nur wenn du widersprichst): unterdrückt das Laden des Umami-Scripts.
          </li>
          <li>
            <strong style={strongStyle}>Session Storage</strong>: kurzlebige
            UX-Marker (z.B. ob ein einmaliges UI-Element in dieser Browser-Session
            bereits angezeigt wurde). Wird beim Schließen des Tabs verworfen.
          </li>
        </ul>
        <p>
          Keine Marketing-Cookies, keine Werbe-Pixel, keine Cross-Site-Tracker.
        </p>

        <h2 style={h2}>Bereitstellung des Onlineangebotes und Webhosting</h2>
        <p>
          Wir verarbeiten die Daten der Nutzer, um ihnen unsere Online-Dienste zur
          Verfügung stellen zu können. Dabei verarbeiten wir die IP-Adresse, die
          notwendig ist, um die Inhalte an den Browser zu übermitteln.
        </p>
        <p>
          <strong style={strongStyle}>Hosting:</strong> Diese Website wird auf einem
          Server in Deutschland gehostet. Es werden Server-Logfiles (IP-Adresse,
          User-Agent, Referrer, Datum/Uhrzeit) für maximal 30 Tage zu
          Sicherheitszwecken gespeichert und danach gelöscht oder anonymisiert.
        </p>
        <p>
          <strong style={strongStyle}>Content-Delivery-Network (Cloudflare):</strong>{' '}
          Wir setzen Cloudflare (Cloudflare, Inc., 101 Townsend Street, San Francisco,
          CA 94107, USA) als CDN für statische Assets, TLS-Terminierung und
          DDoS-Schutz ein. Dabei werden IP-Adressen sowie technische Request-Metadaten
          (User-Agent, Referrer, angefragte URL) von Cloudflare verarbeitet sowie
          Cookies zur Bot-Abwehr gesetzt (siehe Abschnitt „Cookies und lokale
          Speicherung"). Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes
          Interesse an Sicherheit, Performance und Verfügbarkeit). Mit Cloudflare
          besteht ein Auftragsverarbeitungsvertrag nach Art. 28 DSGVO. Der
          Datentransfer in die USA erfolgt auf Basis der EU-Standardvertragsklauseln
          sowie der Zertifizierung von Cloudflare unter dem EU-US Data Privacy
          Framework (DPF).
        </p>

        <h2 style={h2}>Kontakt- und Anfragenverwaltung</h2>
        <p>
          Bei Kontaktaufnahme (E-Mail, Kontaktformular) werden die mitgeteilten Daten
          zur Bearbeitung der Anfrage verarbeitet. Rechtsgrundlage: Art. 6 Abs. 1 lit. b
          DSGVO (vorvertraglich) sowie Art. 6 Abs. 1 lit. f DSGVO (berechtigtes
          Interesse). Löschung nach Abschluss der Konversation, sofern keine
          gesetzlichen Aufbewahrungspflichten entgegenstehen.
        </p>
        <p>
          <strong style={strongStyle}>Spam-/Bot-Schutz (Cloudflare Turnstile):</strong>{' '}
          Das Kontaktformular ist durch Cloudflare Turnstile gegen automatisierte
          Einsendungen geschützt. Dabei werden zur Bot-Erkennung technische Signale
          (u.a. IP-Adresse und Browser-Merkmale) an Cloudflare übermittelt und ein
          Verifizierungs-Token serverseitig geprüft. Turnstile arbeitet ohne
          Tracking-Cookies und ohne Nutzerprofile. Rechtsgrundlage: Art. 6 Abs. 1
          lit. f DSGVO (berechtigtes Interesse an der Abwehr von Spam und Missbrauch).
          Mit Cloudflare besteht ein Auftragsverarbeitungsvertrag nach Art. 28 DSGVO
          (siehe Abschnitt „Bereitstellung des Onlineangebotes und Webhosting").
        </p>
        <p>
          <strong style={strongStyle}>E-Mail-Versand (Resend):</strong> Für den
          zuverlässigen Versand von E-Mails (Eingangsbestätigungen, Antworten auf
          Anfragen, Briefing-Permalinks) setzen wir den Dienstleister Resend
          (Resend, Inc., USA) ein. Verarbeitet werden die angegebene
          E-Mail-Adresse sowie der Nachrichteninhalt. Rechtsgrundlage: Art. 6
          Abs. 1 lit. b und lit. f DSGVO. Mit Resend besteht ein
          Auftragsverarbeitungsvertrag nach Art. 28 DSGVO; der Datentransfer in die
          USA erfolgt auf Basis der EU-Standardvertragsklauseln.
        </p>

        <h2 style={h2}>Digitales Lagebild (Selbst-Check & Terminbuchung)</h2>
        <p>
          Das „Digitale Lagebild" (strukturierter Selbst-Check und
          Online-Terminbuchung) wird derzeit vorbereitet und ist noch nicht aktiv.
          Sobald es live geht, kommen dabei folgende Dienste zum Einsatz:
        </p>
        <p>
          <strong style={strongStyle}>Terminbuchung (Cal.com, self-hosted):</strong>{' '}
          Für die Online-Terminvereinbarung betreiben wir eine selbst gehostete
          Instanz von Cal.com auf einem Server in Deutschland. Verarbeitet werden
          Name, E-Mail-Adresse und der gewählte Termin; ein Transfer an einen
          externen SaaS-Anbieter findet nicht statt. Rechtsgrundlage: Art. 6 Abs. 1
          lit. b DSGVO.
        </p>
        <p>
          <strong style={strongStyle}>Lead-Verwaltung (Notion):</strong> Die
          Angaben aus dem Selbst-Check werden zur Bearbeitung und Nachverfolgung in
          Notion (Notion Labs, Inc., USA) gespeichert. Rechtsgrundlage: Art. 6 Abs. 1
          lit. b und lit. f DSGVO. Mit Notion besteht ein Auftragsverarbeitungsvertrag
          nach Art. 28 DSGVO; der Datentransfer in die USA erfolgt auf Basis der
          EU-Standardvertragsklauseln.
        </p>
        <p>
          <strong style={strongStyle}>Briefing-Erstellung (KI):</strong> Zur
          Aufbereitung eines persönlichen Briefings werden die fachlichen Antworten
          aus dem Selbst-Check (ohne E-Mail-Adresse und Telefonnummer — diese werden
          nicht an die KI übermittelt) an den Routing-Dienstleister OpenRouter
          (OpenRouter, Inc., USA) übergeben. OpenRouter leitet die Anfrage an den
          jeweils ausgewählten Modellanbieter als Subprozessor weiter (u.a. Anthropic
          und DeepSeek). Die Daten werden ausschließlich zur einmaligen
          Text-Generierung verarbeitet und nicht zum Training der Modelle verwendet.
          Rechtsgrundlage: Art. 6 Abs. 1 lit. b und lit. f DSGVO; der Datentransfer
          in Drittländer erfolgt auf Basis der EU-Standardvertragsklauseln.
        </p>
        <p>
          <strong style={strongStyle}>Lokaler Entwurf (Local Storage):</strong>{' '}
          Damit du den Selbst-Check unterbrechen und später fortsetzen kannst, werden
          deine Zwischenantworten ausschließlich lokal in deinem Browser unter dem
          Schlüssel <code style={codeStyle}>lagebild-wizard-draft-v1</code> gespeichert
          (kein Versand an einen Server). Der Entwurf bleibt bis zu 30 Tage erhalten
          und wird danach automatisch gelöscht; beim Absenden oder über das Leeren des
          Browser-Speichers entfernst du ihn jederzeit selbst. Rechtsgrundlage:
          § 25 Abs. 2 Nr. 2 TDDDG (für die Funktion unbedingt erforderliche
          Speicherung).
        </p>

        <h2 style={h2}>Webanalyse · Umami (self-hosted)</h2>
        <p>
          Diese Website nutzt{' '}
          <a href="https://umami.is" target="_blank" rel="noopener noreferrer" style={linkStyle}>
            Umami
          </a>{' '}
          für eine datensparsame, cookielose Reichweitenmessung. Die Umami-Instanz
          läuft auf einer von uns selbst betriebenen Subdomain (
          <code style={codeStyle}>analytics.jetzt.group</code>) auf einem Server in
          Deutschland — es findet kein Datentransfer an externe Analytics-Dienstleister
          statt.
        </p>
        <p>
          Erfasst werden ausschließlich aggregierte Werte (Seitenaufrufe,
          Referrer-Domain, Browser-Familie, Land auf Länderebene, Bildschirmauflösung).
          Zur Wiedererkennung eines wiederkehrenden Browsers innerhalb eines Tages
          erzeugt Umami einen Hash aus IP-Adresse, User-Agent und Domain mit einem{' '}
          <strong style={strongStyle}>täglich rotierenden Salt</strong> — die rohe
          IP-Adresse selbst wird nicht gespeichert. Nach Ablauf des Tages ist der
          Hash nicht mehr auf die ursprüngliche IP zurückführbar; ab diesem
          Zeitpunkt sind die Daten im Sinne des Erwägungsgrund 26 DSGVO anonym.
        </p>
        <p>
          <strong style={strongStyle}>Speicherdauer:</strong> Da die Daten nach
          der täglichen Hash-Rotation keinen Personenbezug mehr aufweisen, werden
          sie unbegrenzt aufbewahrt. Es gibt keine Möglichkeit, daraus später
          wieder Rückschlüsse auf Einzelpersonen zu ziehen.
        </p>
        <p>
          Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an
          datensparsamer Reichweitenmessung). Eine Einwilligung ist nach
          herrschender Auffassung nicht erforderlich, da keine personenbezogenen
          Daten gespeichert werden und keine geräteübergreifende Wiedererkennung
          stattfindet.
        </p>
        <p id="opt-out">
          <strong style={strongStyle}>Widerspruchsrecht (Art. 21 DSGVO):</strong>{' '}
          Du kannst der Reichweitenmessung jederzeit widersprechen. Setze dafür im
          Browser den lokalen Schlüssel{' '}
          <code style={codeStyle}>braum.analytics-opt-out</code> auf{' '}
          <code style={codeStyle}>1</code> (über die Entwicklertools im Reiter
          „Storage" / „Application") — oder nutze den Schalter direkt hier bzw. im
          Datenschutz-Hinweis am unteren Bildschirmrand. Nach dem Reload der Seite
          wird das Umami-Script dann nicht mehr geladen.
        </p>
        <AnalyticsOptOut />

        <h2 style={h2}>Blogs und Publikationsmedien</h2>
        <p>
          Wir betreiben einen Blog (<Link href="/blog" style={linkStyle}>/blog</Link>),
          auf dem eigene Long-Form-Posts erscheinen sowie Cross-Links zu externen
          Quellen (z.B. stefanbraum.de). Es gibt keine Kommentarfunktion.
        </p>

        <h2 style={h2}>Geschäftliche Leistungen</h2>
        <p>
          Wir verarbeiten Daten unserer Vertrags- und Geschäftspartner (Kunden,
          Interessenten) im Rahmen vertraglicher Beziehungen und vorvertraglicher
          Kommunikation. Verarbeitet werden Bestandsdaten, Kontaktdaten,
          Vertragsdaten und Zahlungsdaten. Rechtsgrundlagen: Art. 6 Abs. 1 lit. b und
          lit. c DSGVO sowie ggf. lit. f DSGVO.
        </p>
        <p>
          Löschung nach Ablauf gesetzlicher Aufbewahrungsfristen (steuerrechtlich
          relevante Unterlagen 10 Jahre, Handelsbriefe 6 Jahre nach § 257 HGB / § 147 AO).
        </p>

        <h2 style={h2}>Präsenzen in sozialen Netzwerken</h2>
        <p>
          Wir unterhalten Onlinepräsenzen auf LinkedIn und Xing zur Kommunikation
          mit dort aktiven Nutzern und zur Selbstpräsentation. Daten der Nutzer
          werden im Rahmen der jeweiligen Plattform verarbeitet — wir empfehlen
          die Datenschutzhinweise der jeweiligen Plattformbetreiber zu prüfen:
        </p>
        <ul style={ulStyle}>
          <li>
            LinkedIn:{' '}
            <a href="https://www.linkedin.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" style={linkStyle}>
              Datenschutz
            </a>
          </li>
          <li>
            Xing:{' '}
            <a href="https://privacy.xing.com/de/datenschutzerklaerung" target="_blank" rel="noopener noreferrer" style={linkStyle}>
              Datenschutz
            </a>
          </li>
        </ul>

        <h2 style={h2}>Schriftarten</h2>
        <p>
          Alle Schriftarten (Akmorn Grotesque, Instrument Serif, Geist Sans, Geist
          Mono) werden{' '}
          <strong style={strongStyle}>self-hosted</strong> ausgeliefert — keine
          Verbindung zu Google Fonts oder Adobe Fonts. Es findet kein Datentransfer
          an Dritte statt.
        </p>

        <h2 style={h2}>Eingebettete Inhalte</h2>
        <p>
          Diese Website bindet keine Drittanbieter-Iframes ein (kein Google Maps,
          kein YouTube, kein reCAPTCHA, keine Social-Media-Plugins). Externe Links
          öffnen in neuem Tab mit <code style={codeStyle}>rel="noopener noreferrer"</code>.
        </p>

        <h2 style={h2}>Änderung und Aktualisierung dieser Datenschutzerklärung</h2>
        <p>
          Wir passen die Datenschutzerklärung an, sobald Änderungen der von uns
          durchgeführten Datenverarbeitungen dies erforderlich machen. Wir
          informieren Sie, sobald durch die Änderungen eine Mitwirkungshandlung
          (z.B. Einwilligung) erforderlich wird.
        </p>

        <h2 style={h2}>Zuständige Aufsichtsbehörde</h2>
        <p>
          Der Hessische Beauftragte für Datenschutz und Informationsfreiheit (HBDI)<br />
          Postfach 31 63<br />
          65021 Wiesbaden<br />
          Gustav-Stresemann-Ring 1, 65189 Wiesbaden<br />
          Telefon: 0611 / 1408-0<br />
          E-Mail:{' '}
          <a href="mailto:poststelle@datenschutz.hessen.de" style={linkStyle}>
            poststelle@datenschutz.hessen.de
          </a>
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

const h3: React.CSSProperties = {
  fontFamily:    'var(--font-display)',
  fontWeight:    600,
  fontSize:      'clamp(17px, 1.8vw, 20px)',
  letterSpacing: 'var(--tr-heading)',
  color:         'var(--fg-default)',
  marginTop:     '28px',
  marginBottom:  '10px',
  lineHeight:    1.25,
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

const codeStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.85em',
  padding: '2px 5px',
  background: 'var(--bg-elevated)',
  borderRadius: '3px',
}
