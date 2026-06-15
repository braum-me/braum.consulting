/**
 * Posts-Datenmodell für /blog auf braum.consulting.
 *
 * Zwei Typen:
 * - internal: eigener Post mit Body, hat /blog/[slug] Detail-Page
 * - external: nur Card mit Link auf stefanbraum.de (oder andere Domain).
 *   Wird auf /blog gelistet, aber kein Detail-Page.
 *
 * Beide werden in der Werkstatt-Section auf der Homepage gemischt
 * angezeigt (nach Datum sortiert, jüngste zuerst).
 *
 * Single Source of Truth — neue Posts hier ergänzen.
 */

export type PostKind = 'internal' | 'external'

export interface BasePost {
  slug:     string
  title:    string
  /** ISO-Datum (YYYY-MM-DD) */
  date:     string
  /** 1-2 Zeilen, max ~180 Zeichen */
  excerpt:  string
  tags:     string[]
}

export interface InternalPost extends BasePost {
  kind:    'internal'
  /** Lesezeit in Minuten, gerundet */
  reading: number
  /** Volltext als Array of Block-Elements (Pragmatisch ohne MDX-Stack) */
  body:    PostBlock[]
  /** Optionaler OG-Image-Pfad. Erlaubt Vercel-OG-Routen unter /og/[slug]. */
  ogImage?: string
  /** Optional 3–5 Key-Takeaways die als Box am Post-Ende rendern.
   *  Auch als ItemList in Article-JSON-LD für AI/LLM-Discovery. */
  takeaways?: string[]
}

export interface ExternalPost extends BasePost {
  kind:    'external'
  /** Quelle, wird auf Card sichtbar gemacht */
  source:  string
  /** Direkt-URL zum Post */
  url:     string
}

export type Post = InternalPost | ExternalPost

/**
 * Inline-Elemente für Rich-Paragraphs.
 * - String = Plain Text
 * - { kind: 'link' } = Inline-Link, intern (Link) oder extern (a)
 */
export type Inline =
  | string
  | { kind: 'link'; href: string; text: string }

/** Block-Elemente für interne Posts. Pragmatisch, keine MDX-Engine nötig. */
export type PostBlock =
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'paragraph'; text: string | Inline[] }
  | { type: 'list'; items: string[] }
  | { type: 'quote'; text: string }
  | { type: 'code'; language?: string; code: string }
  | { type: 'table'; headers: string[]; rows: string[][] }

export const POSTS: Post[] = [
  {
    kind: 'internal',
    slug: 'drei-jahre-neuausrichtung',
    title: 'Drei Jahre Braum Consulting. Was hat funktioniert, was nicht, wohin es jetzt geht.',
    date: '2026-05-16',
    excerpt:
      'Braum Consulting wird drei. Ehrliche Bilanz, neue Aufstellung als digitaler Lotse für den Industriemittelstand. Vier Felder, ein Ansprechpartner, kein Berater-Theater.',
    tags: ['neuausrichtung', 'positionierung', 'mittelstand'],
    reading: 5,
    ogImage: '/og/drei-jahre-neuausrichtung.webp',
    body: [
      {
        type: 'paragraph',
        text: 'Braum Consulting ist drei Jahre alt. Statt Sektkorken eine ehrliche Bilanz. Was hat funktioniert, was nicht, und warum die Aufstellung von 2023 nicht mehr zur Aufgabe von 2026 passt.',
      },
      { type: 'heading', level: 2, text: 'Wie es angefangen hat' },
      {
        type: 'paragraph',
        text: 'Vor drei Jahren bin ich mit einer breiten These gestartet. WordPress-Webseiten, IT-Beratung, ein bisschen E-Commerce, ein bisschen Branding. Untertitel: „Ihr Wegweiser im digitalen Dschungel". Das hat damals funktioniert, weil viele KMU genau diese Art Allrounder gesucht haben. Jemand, der die Webseite macht, bei Microsoft 365 hilft und bei einer SEO-Frage nicht aussteigt.',
      },
      {
        type: 'paragraph',
        text: 'Die Phase ist abgeschlossen. Aus zwei Gründen.',
      },
      { type: 'heading', level: 2, text: 'Was sich am Markt verändert hat' },
      { type: 'heading', level: 3, text: 'Der Druck auf Mittelständler hat sich verlagert' },
      {
        type: 'paragraph',
        text: 'Bis 2023 ging es bei KMU-IT noch oft um Modern Work, Cloud-Migration, klassische Digitalisierung. Seit 2024 sind drei Themen dazugekommen, die nicht mehr verhandelbar sind.',
      },
      {
        type: 'paragraph',
        text: 'NIS2 trifft Stand heute zehntausende Mittelständler, die vorher mit Informationssicherheit wenig Berührung hatten. Die Pflichten reichen von ISMS-Aufbau über Meldepflichten bis zu Anforderungen entlang der Lieferkette. Wer als Zulieferer eines NIS2-Betroffenen unterwegs ist, bekommt die Anforderungen über Kundenverträge durchgereicht, egal wie groß man selbst ist. ISO 27001, TISAX und vergleichbare Frameworks sind im B2B inzwischen Vertragsvoraussetzung.',
      },
      { type: 'heading', level: 3, text: 'KI ist von Hype zu Werkzeug geworden' },
      {
        type: 'paragraph',
        text: 'Copilot, ChatGPT, Claude sind im Arbeitsalltag angekommen. Die Konzerne haben strukturierte Rollouts gestartet. Im Mittelstand sehe ich oft zwei Extreme. Entweder eine harte Verbotspolitik, die in Schatten-IT mündet. Oder unkontrollierter Einsatz ohne Datenschutz, Governance oder Strategie. Beides ist riskant, beides ist mit etwas Beratung sauber zu lösen.',
      },
      { type: 'heading', level: 3, text: 'Die Frage nach Verantwortung wird konkret' },
      {
        type: 'paragraph',
        text: 'Wer ist im Mittelstand eigentlich für Informationssicherheit zuständig? Für KI-Governance? Für die Konsolidierung der Tool-Landschaft? Geschäftsführer wollen darauf eine Antwort, ohne sich einen Vollzeit-CIO leisten zu können oder zu wollen.',
      },
      { type: 'heading', level: 2, text: 'Was sich an meiner Position verändert hat' },
      {
        type: 'paragraph',
        text: 'In den drei Jahren seit Gründung hat sich auch meine eigene Position weiterentwickelt. Hauptberuflich verantworte ich die IT in einem mittelständischen Automotive-Zulieferer mit mehreren tausend Mitarbeitenden und internationalen Standorten. Dort liegen Themen wie SAP S/4HANA, M365 E5, Cloud-Security, HR-System-Rollouts und KI-Governance täglich auf dem Tisch. Zertifizierungen wie TISAX in der höchsten Stufe sind direkte Kundenanforderung, kein Selbstläufer.',
      },
      {
        type: 'paragraph',
        text: 'Aus dieser Position sehe ich den Mittelstands-Wandel täglich aus erster Hand. Was die Geschäftsführung umtreibt, wo Mittelständler scheitern, welche Hebel wirklich Wirkung haben. Das prägt die Beratung mehr als jedes Zertifikat.',
      },
      { type: 'heading', level: 2, text: 'Was Braum Consulting ab jetzt ist' },
      {
        type: 'paragraph',
        text: 'Nicht Berater. Operator. Digitaler Lotse.',
      },
      {
        type: 'paragraph',
        text: 'Das ist der Kern der Neuausrichtung. Wenn ein Schiff einen unbekannten Hafen anläuft, kommt ein Lotse an Bord. Er führt das Schiff durch die kritische Passage, übergibt das Steuer wieder an die Crew und steigt aus. Genau diese Rolle übernehme ich für deine digitale Lage.',
      },
      {
        type: 'paragraph',
        text: 'Vier Felder, eine Hand. Vier Bereiche, die in der Praxis miteinander verflochten sind, in klassischer Beratung aber meist getrennt bearbeitet werden.',
      },
      {
        type: 'table',
        headers: ['#', 'Feld', 'Was steckt drin', 'Ergebnis'],
        rows: [
          ['01', 'Marke, Website und Reichweite', 'Digitales Marketing, SEO, Brand und Positionierung', 'Nutzbarer Funnel'],
          ['02', 'State-of-the-Art IT und Cloud', 'M365, Azure, Entra ID, Cloud-Architektur, Identity und Zugriff', 'Belastbare Cloud-Grundlage'],
          ['03', 'KI und Automatisierung', 'KI-Readiness, Tool-Auswahl, n8n-Workflows, AVV und DSGVO', 'Produktiver Workflow'],
          ['04', 'Digitale Transformation, Change und Security', 'Adoption, Change Management, ISO 27001, TISAX, Governance', 'Tragfähige Strukturen'],
        ],
      },
      {
        type: 'paragraph',
        text: 'Bei Feld 04 gilt: Keine große Transformationsfolie. Erst Lagebild, dann Prioritäten, dann Umsetzung. Immer nah am höchsten Gut, dem Menschen.',
      },
      { type: 'heading', level: 2, text: 'Das Lotsenprinzip' },
      {
        type: 'paragraph',
        text: 'Engagements laufen nach einem festen Muster. Lagebild, Kurs setzen, Manövrieren, Übergabe. Ziel ist nicht, mich dauerhaft zu brauchen. Ziel ist, dass dein Team danach sicher weiterarbeitet.',
      },
      { type: 'heading', level: 2, text: 'Was du hier nicht bekommst' },
      {
        type: 'paragraph',
        text: 'Keine 80-Folien-Beratung. Keine klassische Werbeagentur. Keinen reinen Freelancer für einzelne Tickets. Keinen KI-Hype ohne Prozess. Keinen Enterprise-Overkill für kleine Unternehmen.',
      },
      {
        type: 'paragraph',
        text: 'Stattdessen ein klares Lagebild, pragmatische Umsetzung und eine Lösung, die nach der Übergabe im Alltag funktioniert.',
      },
      { type: 'heading', level: 2, text: 'Was geht und was bleibt' },
      {
        type: 'paragraph',
        text: 'Reine E-Commerce-Projekte übernehme ich nicht mehr. Shop-Aufbau, Payment, Logistik-Anbindung sind ein eigenes Handwerk, das ein Spezialist besser kann. Wer mit so einem Vorhaben anklopft, bekommt eine Empfehlung an einen Partner aus meinem Netzwerk.',
      },
      {
        type: 'paragraph',
        text: 'Branding mache ich weiter, aber anders. Kein „mal eben ein Logo". Wenn Branding, dann mit Strategie, Markenkern, Positionierung und einem Konzept, das die anderen drei Felder mitträgt. Für Standard-Logo-Designs gibt es bessere Adressen, die ich gern vermittle.',
      },
      {
        type: 'paragraph',
        text: 'Was bleibt, ist die Grundhaltung. Direkt, pragmatisch, ROI-orientiert. Konkrete Empfehlungen, klare Risiko-Bewertungen, umsetzbare nächste Schritte. Wer mich kennt, weiß: Ich rede nicht lange um Optionen herum, wenn die Lage eindeutig ist.',
      },
      { type: 'heading', level: 2, text: 'Was als Nächstes kommt' },
      {
        type: 'paragraph',
        text: 'Hier im Blog vertiefe ich die vier Felder mit konkretem Praxisinhalt — ISO 27001 und NIS2 für Mittelständler ohne eigenes ISMS, sinnvolle Copilot-Rollouts jenseits der Demo-Folien, und wie KI die Sichtbarkeit in Suche und Sprachmodellen verändert. Weitere Beiträge kommen dazu, wenn es etwas Belastbares zu sagen gibt — kein Redaktionsplan um des Plans willen.',
      },
      {
        type: 'paragraph',
        text: [
          'Wenn du ein konkretes Thema hast, das in diese vier Felder passt, ',
          { kind: 'link', href: '/kontakt', text: 'fordere ein digitales Lagebild an' },
          '. 30 Minuten, kein Pitch, kein Tool-Verkauf. Nur Orientierung und nächste Schritte.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Häufige Fragen zur Zusammenarbeit beantworte ich im ',
          { kind: 'link', href: '/#faq', text: 'FAQ-Bereich' },
          '.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Stefan Braum · Braum Consulting',
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────── */
  {
    kind: 'internal',
    slug: 'ki-seo-geo-llmo',
    title: 'Sichtbar in KI-Antworten. Warum klassisches SEO nicht mehr reicht.',
    date: '2026-04-22',
    excerpt:
      'AI Overviews, ChatGPT, Perplexity — wer auf Position 1 rankt, ist nicht automatisch in der Antwort. Was GEO und LLMO konkret bedeuten, und was du als erstes drehen solltest.',
    tags: ['seo', 'geo', 'llmo', 'sichtbarkeit', 'marke'],
    reading: 6,
    ogImage: '/og/ki-seo-geo-llmo.webp',
    body: [
      {
        type: 'paragraph',
        text: 'SEO funktioniert noch — aber nicht mehr als alleiniger Hebel. AI Overviews, ChatGPT, Perplexity und Gemini sind zur ersten Auskunft geworden. Wer in den klassischen Suchergebnissen auf Position 1 steht, ist nicht zwangsläufig in der KI-Antwort drin. Das verändert, wie Sichtbarkeit funktioniert.',
      },
      { type: 'heading', level: 2, text: 'Von Rankings zu KI-Erwähnungen' },
      {
        type: 'paragraph',
        text: 'Klassisches SEO denkt in Positionen. Position 1 bis 10 in den blauen Links. Diese Mechanik wird gerade verschoben. AI Overviews erscheinen oberhalb der Trefferliste und beantworten die Frage direkt. Der Nutzer klickt nicht mehr — und damit verliert die Position an Wert, die früher den Traffic getragen hat.',
      },
      {
        type: 'paragraph',
        text: 'Die Zahlen: AI Overviews tauchen bei knapp der Hälfte aller Suchanfragen in den USA auf. In Deutschland ist der Rollout gerade voll am Anlaufen. Wer in diesen Antworten nicht zitiert wird, fällt aus dem Sichtfeld.',
      },
      { type: 'heading', level: 2, text: 'Was GEO und LLMO konkret heißt' },
      {
        type: 'paragraph',
        text: 'Generative Engine Optimization (GEO) und Large Language Model Optimization (LLMO) sind die beiden Begriffe, die sich gerade durchsetzen. Die Idee ist die gleiche: nicht mehr nur in Suchmaschinen ranken, sondern in KI-Antworten landen.',
      },
      {
        type: 'paragraph',
        text: 'Entscheidend sind dabei zwei Faktoren. Erstens: maschinell les- und parsbare Inhalte mit klarer Struktur, sauberer Semantik und expliziter Themen-Tiefe. Zweitens: Erwähnungen in autoritativen Quellen, die KI-Systeme als Vertrauenssignal werten — oft wichtiger als klassische Backlinks.',
      },
      { type: 'heading', level: 2, text: 'Wo der Hebel im E-Commerce sitzt' },
      {
        type: 'paragraph',
        text: 'ChatGPT Shopping und vergleichbare Formate erlauben Produkt-Anfragen direkt im Chat. Antwort sind strukturierte Empfehlungen mit Bild, Preis und Kauflink. Wer hier mit sauberen Produkt-Feeds präsent ist, kommt ins Suchergebnis der KI. Wer nicht, taucht gar nicht erst auf.',
      },
      {
        type: 'paragraph',
        text: 'Statt einzelne Keywords zu treffen, geht es um Themen-Kontext. KI versteht den Sinn der Anfrage und sucht den Inhalt, der die Intention am vollständigsten beantwortet — nicht den, der das richtige Wort am häufigsten enthält.',
      },
      { type: 'heading', level: 2, text: 'Digitale PR als Gamechanger' },
      {
        type: 'paragraph',
        text: 'Was lange als „Nice-to-have" galt, wird zum harten Faktor: Erwähnungen in Fach-Publikationen, Branchenpresse und thematischen Autoritäten. Für KI-Systeme zählt das oft mehr als ein klassischer Backlink. Wer in der Antwort genannt werden will, muss sich in den Quellen zeigen, die das Modell für glaubwürdig hält.',
      },
      {
        type: 'paragraph',
        text: 'Voice Search, Social Search und Video-SEO gewinnen parallel an Gewicht — gerade bei B2C. Im B2B-Mittelstand ist der entscheidende Hebel meist die strukturierte Themen-Architektur auf der eigenen Site plus zwei, drei gut platzierte Fach-Mentions.',
      },
      { type: 'heading', level: 2, text: 'Technik bleibt — Inhalt führt' },
      {
        type: 'paragraph',
        text: 'Schnelle Ladezeiten, strukturierte Daten, mobile Optimierung, klare Informationsarchitektur. Das ist Pflicht. Es bringt aber nichts ohne Inhalte, die ein KI-System tatsächlich zitierbar findet — eindeutig, mit klarem Standpunkt, mit nachvollziehbarer Faktenlage.',
      },
      { type: 'heading', level: 2, text: 'Was du als erstes drehen solltest' },
      {
        type: 'list',
        items: [
          'Inhalts-Inventur: Welche Seiten beantworten echte Fragen? Welche sind nur SEO-Füllstoff?',
          'Strukturierte Daten und Schema.org sauber ausspielen — KI-Crawler nutzen das aktiv.',
          'llms.txt prüfen und veröffentlichen — Gegenstück zu robots.txt, sagt LLMs explizit was sie nutzen dürfen.',
          'Mentions-Strategie: 2-3 Fach-Publikationen pro Jahr, in denen du namentlich auftauchst.',
          'Tracking erweitern: nicht nur Klicks, sondern Erwähnungen in KI-Antworten messen (Tools wie Profound, AthenaHQ).',
        ],
      },
      { type: 'heading', level: 2, text: 'Hybrid, nicht Ersatz' },
      {
        type: 'paragraph',
        text: 'Klassisches SEO verschwindet nicht. Es wird Teil eines hybriden Bilds — Suchergebnis-Sichtbarkeit plus KI-Erwähnungen. Beides hängt zusammen, beides muss bedient werden. Wer früh anfängt, sich in der KI-Schicht zu positionieren, hat in 12 Monaten einen Vorsprung, den klassische SEO-Maßnahmen dann nicht mehr aufholen.',
      },
      {
        type: 'paragraph',
        text: [
          'Wenn du das für deine Site einmal sauber durchgesprochen haben willst, ',
          { kind: 'link', href: '/kontakt', text: 'frag ein Lagebild an' },
          '. 30 Minuten, ehrliche Einschätzung wo du stehst, klare nächste Schritte.',
        ],
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────── */
  {
    kind: 'internal',
    slug: 'copilot-fuer-kmu',
    title: 'Copilot im Mittelstand. Was funktioniert, was nicht, was du vorher klären musst.',
    date: '2026-03-18',
    excerpt:
      'Copilot einschalten ist einfach. Sinnvoll einsetzen ist es nicht. Was im KMU-Alltag wirklich Arbeit abnimmt — und warum die Berechtigungen wichtiger sind als die Lizenz.',
    tags: ['copilot', 'ai', 'mittelstand', 'tool-praxis'],
    reading: 5,
    ogImage: '/og/copilot-fuer-kmu.webp',
    body: [
      {
        type: 'paragraph',
        text: 'Microsoft Copilot, ChatGPT, Claude. Drei Tools, die im KMU-Alltag mittlerweile öfter aufschlagen als jede Schatten-IT der letzten zehn Jahre. Die Frage ist nicht mehr „brauchen wir das?" — sondern „wie kriegen wir das in den Alltag, ohne uns ein Datenschutz- oder Sicherheits-Problem zu bauen?".',
      },
      { type: 'heading', level: 2, text: 'Wo Copilot wirklich Arbeit abnimmt' },
      {
        type: 'paragraph',
        text: 'Im typischen KMU sehe ich vier Bereiche, in denen Copilot oder ein vergleichbarer Assistent sofort spürbar wirkt:',
      },
      {
        type: 'list',
        items: [
          'E-Mail-Triage und Antwort-Entwürfe — der Posteingang wird vom Stress-Faktor zur Routine.',
          'Meeting-Zusammenfassungen mit Action-Items direkt aus Teams oder Outlook.',
          'Erste Entwürfe für Angebote, Verträge, Konzepte — Text steht in Minuten statt Stunden.',
          'Daten-Auswertung in Excel oder Power BI ohne Pivot-Kunststücke — Frage stellen, Antwort kriegen.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Das sind Use-Cases, die in jeder Branche, jedem Bereich und jeder Mitarbeiter-Größe funktionieren. Wenn du dich fragst „lohnt sich das?" — der Test ist einfach: Wenn deine Leute mehr als zwei Stunden pro Tag in E-Mail, Word oder Excel verbringen, lohnt es sich.',
      },
      { type: 'heading', level: 2, text: 'Was nicht klappt — und warum' },
      {
        type: 'paragraph',
        text: 'Was im Demo-Video gut aussieht, scheitert im Alltag meistens an drei Stellen.',
      },
      { type: 'heading', level: 3, text: 'Berechtigungen sind chaotisch' },
      {
        type: 'paragraph',
        text: 'Copilot zeigt jedem User alles, worauf der User Zugriff hat. Wenn dein SharePoint-Berechtigungsmodell aus zehn Jahren Wildwuchs besteht — und das ist die Regel, nicht die Ausnahme — leakt Copilot fröhlich Gehaltslisten, Kündigungen und Vertragsdetails. Vor dem Roll-out gehört das Berechtigungsmodell saubergezogen, sonst ist der erste Compliance-Vorfall garantiert.',
      },
      { type: 'heading', level: 3, text: 'Daten-Klassifizierung fehlt' },
      {
        type: 'paragraph',
        text: 'Sensible Dokumente werden nicht als sensible markiert. Copilot kann dann nicht erkennen, was er nicht in die Antwort schreiben darf. Microsoft Purview und Sensitivity-Labels sind die Voraussetzung dafür, dass Copilot in regulierten Branchen überhaupt einsetzbar ist.',
      },
      { type: 'heading', level: 3, text: 'Adoption wird unterschätzt' },
      {
        type: 'paragraph',
        text: 'Lizenz aktivieren, fertig — das ist die häufigste Annahme und der häufigste Grund, warum Copilot nach drei Monaten ungenutzt im Tenant liegt. Erfolgreiche Roll-outs haben ein Champions-Programm, klare Use-Case-Schulungen, eine Sprechstunde für Fragen und einen Champion pro Abteilung. Ohne das verstaubt die Lizenz.',
      },
      { type: 'heading', level: 2, text: 'Microsoft, OpenAI, Claude — was wann?' },
      {
        type: 'paragraph',
        text: 'Im M365-Stack ist Copilot meist die richtige Wahl, weil es nativ in Outlook, Teams, Word, Excel und SharePoint integriert. Daten bleiben im Tenant, EU Data Boundary ist aktiv. Für Fach-Anwendungen, die mehr Kontext oder andere Modelle brauchen, kommen ChatGPT Enterprise oder Claude for Work hinzu — mit eigener Datenverarbeitung, eigenen Compliance-Verträgen.',
      },
      {
        type: 'paragraph',
        text: 'Mein Standard-Setup im Mittelstand: Copilot für den Alltag, ein Enterprise-Modell-Account (ChatGPT oder Claude) für fortgeschrittene Use-Cases, n8n oder Power Automate für Workflow-Automatisierung. Drei Lizenz-Linien, klare Anwendungsfälle, keine Überschneidung.',
      },
      { type: 'heading', level: 2, text: 'Vorher klären — Checklist' },
      {
        type: 'list',
        items: [
          'Identity-Modell sauber: ein Login pro Person, MFA als Pflicht, keine geteilten Accounts.',
          'SharePoint-Berechtigungen auditiert und aufgeräumt — Sensitivity-Labels verteilt.',
          'AVV-Vertrag mit dem Anbieter unterschrieben, im Compliance-Ordner abgelegt.',
          'Use-Case-Liste mit den 3-5 wichtigsten Anwendungen pro Abteilung.',
          'Champions-Programm geplant: ein Multiplikator pro Abteilung.',
          'Sprechstunde im Kalender — eine Stunde pro Woche für die ersten 8 Wochen.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Wenn diese sechs Punkte stehen, läuft ein Copilot-Roll-out in 4-6 Wochen. Wenn nicht, kostet es das Dreifache — und das Ergebnis ist meist Schatten-IT.',
      },
      {
        type: 'paragraph',
        text: [
          'Für ein konkretes Setup-Lagebild für deinen Tenant — ',
          { kind: 'link', href: '/kontakt', text: 'frag eine 30-Minuten-Einschätzung an' },
          '. Ehrlich, ohne Lizenz-Verkauf.',
        ],
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────── */
  {
    kind: 'internal',
    slug: 'iso-27001-2022-status',
    title: 'ISO 27001:2022. Stand 2026, was jetzt im ISMS gelten muss.',
    date: '2026-02-10',
    excerpt:
      'Die Übergangsfrist auf die 2022er-Version ist abgelaufen. Was sich konkret geändert hat, was die meisten KMU jetzt im ISMS nachholen — und wie das Verhältnis zu NIS-2 und TISAX aussieht.',
    tags: ['iso-27001', 'isms', 'compliance', 'strategie'],
    reading: 6,
    ogImage: '/og/iso-27001-2022-status.webp',
    body: [
      {
        type: 'paragraph',
        text: 'Seit Ende Oktober 2025 ist die Übergangsfrist auf die ISO 27001:2022 abgelaufen. Wer ein gültiges Zertifikat halten will, muss auf die neue Version umgestellt sein. Das ist mittlerweile bei den meisten Großbetrieben passiert — bei vielen Mittelständlern aber nur halbherzig. Hier eine Bestandsaufnahme, was 2022 wirklich geändert hat und wo die meisten KMU jetzt nachziehen.',
      },
      { type: 'heading', level: 2, text: 'Was die neue Version anders macht' },
      {
        type: 'paragraph',
        text: 'Die ISO 27001 ist die internationale Norm für Informationssicherheits-Managementsysteme. Sie definiert, wie ein Unternehmen die Vertraulichkeit, Integrität und Verfügbarkeit seiner Informationen systematisch schützt. Die Aktualisierung 2022 ist keine kosmetische — sie verändert Struktur und Inhalt deutlich.',
      },
      { type: 'heading', level: 3, text: 'Neuer Titel, breiterer Anwendungsbereich' },
      {
        type: 'paragraph',
        text: 'Der Norm-Titel hat sich von „Informationstechnologie — Sicherheitsverfahren" auf „Informationssicherheit, Cybersicherheit und Datenschutz" verschoben. Das ist mehr als kosmetisch. Die Norm umfasst jetzt explizit Cybersicherheit und Datenschutz als eigenständige Themen — nicht mehr nur als Sub-Themen von IT.',
      },
      { type: 'heading', level: 3, text: 'Annex A neu strukturiert' },
      {
        type: 'paragraph',
        text: 'Statt 14 Kategorien mit 114 Maßnahmen gibt es jetzt 4 Themen-Cluster mit 93 Controls. 11 davon sind komplett neu, 24 wurden gemerged, der Rest umformuliert. Die vier Cluster sind: organisatorische Controls (37), Personal-Controls (8), physische Controls (14) und technologische Controls (34). Diese Struktur ist klarer und macht Mapping zu anderen Frameworks (NIST, TISAX) deutlich einfacher.',
      },
      { type: 'heading', level: 3, text: '11 neue Controls' },
      {
        type: 'paragraph',
        text: 'Die wichtigsten Neuerungen treffen jeden, der Cloud nutzt oder mit aktuellen Bedrohungsbildern arbeitet:',
      },
      {
        type: 'list',
        items: [
          'A.5.7 Threat Intelligence — strukturierte Auswertung von Bedrohungsinformationen.',
          'A.5.23 Information Security for Use of Cloud Services — explizite Cloud-Governance.',
          'A.5.30 ICT Readiness for Business Continuity — IT-spezifische Aspekte der Notfallplanung.',
          'A.7.4 Physical Security Monitoring — Überwachung physischer Zugangsbereiche.',
          'A.8.9 Configuration Management — sauberer Umgang mit System-Konfigurationen.',
          'A.8.10 Information Deletion — gezieltes Löschen sensibler Daten.',
          'A.8.11 Data Masking — Maskierung in Test- und Entwicklungsumgebungen.',
          'A.8.12 Data Leakage Prevention — DLP-Mechanismen im ISMS verankert.',
          'A.8.16 Monitoring Activities — kontinuierliches Sicherheits-Monitoring.',
          'A.8.23 Web Filtering — Schutz vor schädlichen Webinhalten.',
          'A.8.28 Secure Coding — explizite Anforderungen an sichere Software-Entwicklung.',
        ],
      },
      { type: 'heading', level: 2, text: 'Was die meisten KMU jetzt nachholen' },
      {
        type: 'paragraph',
        text: 'In den Audits, die ich aktuell sehe, fehlen meistens die gleichen drei Punkte. Threat Intelligence wird oft auf eine RSS-Liste reduziert — das reicht nicht. Cloud-Governance ist da, aber nicht dokumentiert. Und Secure Coding existiert als Buzzword, nicht als nachweisbarer Prozess.',
      },
      {
        type: 'paragraph',
        text: 'Wer 2025 die Umstellung gemacht hat und jetzt das erste Überwachungsaudit hinter sich hat, kennt die Stellen. Wer noch in der Umstellung steht, sollte hier zuerst nachschärfen.',
      },
      { type: 'heading', level: 2, text: 'Verhältnis zu NIS-2 und TISAX' },
      {
        type: 'paragraph',
        text: 'NIS-2 ist seit 2024 in Kraft, betrifft tausende deutsche Mittelständler und Zulieferer. Eine bestehende ISO-27001-Zertifizierung deckt rund 70-80 Prozent der NIS-2-Anforderungen ab — die restlichen 20-30 sind meldepflicht-spezifische Themen (Vorfall-Meldung in 24 Stunden, Lieferketten-Anforderungen).',
      },
      {
        type: 'paragraph',
        text: 'TISAX Level 3 (Höchste Schutzstufe im Automotive-Umfeld) liegt etwa 10-15 Prozent über ISO 27001:2022 — vor allem in Prototypenschutz und Vertragsgestaltung mit Sub-Auftragnehmern. Wer ISO 27001:2022 sauber stehen hat, ist auf TISAX-Audits gut vorbereitet.',
      },
      { type: 'heading', level: 2, text: 'Pragmatischer Fahrplan' },
      {
        type: 'list',
        items: [
          'Gap-Analyse gegen die 11 neuen Controls — was fehlt nachweisbar im aktuellen ISMS?',
          'Cloud-Governance dokumentieren: welche Dienste, welche Daten, welche Verträge.',
          'Threat Intelligence operationalisieren — Quellen, Bewertungs-Prozess, Reaktions-Wege.',
          'Secure-Coding-Standard schriftlich verankern (auch wenn ihr nicht entwickelt — gilt für Konfigurations- und Skript-Arbeit auch).',
          'NIS-2-Delta dokumentieren und Lücken schließen — meist sind das Meldewege und Lieferanten-Anforderungen.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Eine saubere Gap-Analyse braucht 1-2 Wochen Aufwand und liefert eine Roadmap für 3-6 Monate. Das ist überschaubar, vor allem im Vergleich zu dem, was ein verlorenes Zertifikat oder ein Audit-Befund kosten.',
      },
      {
        type: 'paragraph',
        text: [
          'Wenn du auf dem ISMS-Stand 2022 noch unsicher bist oder die NIS-2-Lücke nicht eindeutig benannt hast, ',
          { kind: 'link', href: '/kontakt', text: 'fragen wir das im Lagebild zusammen ab' },
          '. NDA vor dem zweiten Termin.',
        ],
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────── */
  {
    kind: 'internal',
    slug: 'nis2-bin-ich-betroffen',
    title: 'NIS2: Bin ich betroffen? Die ehrliche Kurzprüfung für den Mittelstand.',
    date: '2026-06-10',
    excerpt:
      'NIS2 verunsichert tausende Mittelständler. Drei nüchterne Fragen klären, ob du direkt, mittelbar oder gar nicht betroffen bist — und was die ersten Schritte sind.',
    tags: ['nis2', 'compliance', 'security', 'strategie', 'mittelstand'],
    reading: 6,
    ogImage: '/og/nis2-bin-ich-betroffen.webp',
    body: [
      {
        type: 'paragraph',
        text: 'NIS2 sorgt seit zwei Jahren für Verunsicherung, und die meisten Anrufe zum Thema starten mit derselben Frage: „Betrifft mich das überhaupt?" Die ehrliche Antwort ist kein Beratungs-Workshop, sondern eine nüchterne Prüfung in drei Fragen. Keine Panik, kein Frameworks-Bingo — nur die Punkte, an denen sich deine Betroffenheit wirklich entscheidet.',
      },
      {
        type: 'paragraph',
        text: [
          'Lieber direkt ausprobieren? Der ',
          { kind: 'link', href: '/werkzeuge/nis2-betroffenheit', text: 'NIS2-Betroffenheits-Check' },
          ' führt dich in drei Fragen durch genau diese Prüfung — ohne Anmeldung, in zwei Minuten.',
        ],
      },
      { type: 'heading', level: 2, text: 'Worum es bei NIS2 geht — in zwei Sätzen' },
      {
        type: 'paragraph',
        text: [
          'NIS2 ist die EU-Richtlinie zur Cybersicherheit, die den Kreis der pflichtigen Unternehmen massiv ausweitet — von wenigen Betreibern kritischer Infrastruktur auf 18 ganze Sektoren. Wer betroffen ist, muss Risikomanagement, Meldewege, Lieferketten-Sicherheit und Notfallvorsorge nachweisen, und die Geschäftsführung haftet dafür persönlich. Die Details stehen kompakt im ',
          { kind: 'link', href: '/lexikon/nis2', text: 'Lexikon-Eintrag zu NIS2' },
          '.',
        ],
      },
      { type: 'heading', level: 2, text: 'Die drei Fragen, die deine Betroffenheit klären' },
      { type: 'heading', level: 3, text: '1. Bist du groß genug?' },
      {
        type: 'paragraph',
        text: 'Die Faustregel: mindestens 50 Mitarbeitende oder mehr als 10 Mio. € Jahresumsatz. Darunter fällst du in der Regel nicht unter die direkten Pflichten — es sei denn, du bist ein besonders kritischer Anbieter (etwa im TK- oder Vertrauensdienst-Bereich). Wichtig: Es geht um das Gesamtunternehmen, nicht um die IT-Abteilung. Konzern-Verflechtungen können die Zahlen nach oben ziehen.',
      },
      { type: 'heading', level: 3, text: '2. Bist du im falschen Sektor?' },
      {
        type: 'paragraph',
        text: 'NIS2 listet 18 Sektoren — von Energie, Transport und Wasser über das verarbeitende Gewerbe (inklusive Maschinen- und Fahrzeugbau) bis zu Lebensmitteln, Chemie, Gesundheit und digitalen Diensten. Die Spanne ist breiter, als die meisten denken. Wer Maschinen baut, Teile zuliefert oder Software betreibt, sollte hier zweimal hinschauen, statt reflexhaft „sind wir nicht" zu sagen.',
      },
      { type: 'heading', level: 3, text: '3. Hängst du an einer betroffenen Lieferkette?' },
      {
        type: 'paragraph',
        text: 'Das ist der Punkt, den fast alle übersehen. Selbst wenn du zu klein bist oder im „falschen" Sektor sitzt: Sobald du Zulieferer oder Dienstleister eines NIS2-pflichtigen Unternehmens bist, werden dir die Anforderungen über Verträge durchgereicht. Lieferketten-Sicherheit ist eine Kernpflicht der Betroffenen — und die geben sie an dich weiter. Faktisch betrifft NIS2 dann auch dich, nur über den Umweg Vertrag statt Gesetz.',
      },
      { type: 'heading', level: 2, text: 'Direkt, mittelbar oder gar nicht' },
      {
        type: 'table',
        headers: ['Konstellation', 'Was das für dich heißt'],
        rows: [
          ['Direkt betroffen', 'Über dem Schwellwert und in einem gelisteten Sektor. Volle gesetzliche Pflichten, Geschäftsführung haftet persönlich.'],
          ['Mittelbar betroffen', 'Zu klein oder anderer Sektor — aber Zulieferer eines Betroffenen. Die Anforderungen kommen über Kundenverträge.'],
          ['Nicht betroffen', 'Weder Schwellwert noch Lieferketten-Bezug. Trotzdem gilt: Die Maßnahmen sind schlicht gute Sicherheits-Hygiene.'],
        ],
      },
      { type: 'heading', level: 2, text: 'Du bist betroffen. Was jetzt?' },
      {
        type: 'paragraph',
        text: 'Der häufigste Fehler ist, in einen Zertifizierungs-Marathon zu rennen. NIS2 verlangt kein Zertifikat, sondern belegbare Maßnahmen. Die ersten Schritte sind überschaubar:',
      },
      {
        type: 'list',
        items: [
          'Betroffenheit sauber dokumentieren — die drei Fragen oben schriftlich, mit Begründung.',
          'Risikomanagement aufsetzen: Was sind die kritischen Systeme, was die realistischen Bedrohungen?',
          'Meldewege klären — erhebliche Vorfälle müssen kurzfristig gemeldet werden, das braucht einen geübten Prozess.',
          'Notfallvorsorge: ein realistischer Wiederanlaufplan für die wenigen wirklich kritischen Prozesse.',
          'Lieferanten-Anforderungen weitergeben und die eigenen Verträge prüfen.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Vieles davon erschlägt eine bestehende ',
          { kind: 'link', href: '/lexikon/iso-27001', text: 'ISO-27001' },
          '-Struktur fast nebenbei — sie deckt rund 70 bis 80 Prozent der NIS2-Anforderungen ab. Wo die Lücken liegen und was die 2022er-Fassung geändert hat, habe ich ',
          { kind: 'link', href: '/blog/iso-27001-2022-status', text: 'im Detail auseinandergenommen' },
          '. Für die Notfallseite lohnt der Blick auf ',
          { kind: 'link', href: '/lexikon/bcm', text: 'Business Continuity Management' },
          '.',
        ],
      },
      { type: 'heading', level: 2, text: 'Die häufigsten Irrtümer' },
      {
        type: 'list',
        items: [
          '„Wir sind zu klein." — Stimmt oft beim Gesetz, selten bei der Lieferkette.',
          '„Wir warten, bis das deutsche Gesetz final ist." — Die Pflichten kommen, und Kunden fragen die Nachweise schon heute ab.',
          '„Das macht unsere IT nebenbei." — Risikomanagement und Geschäftsführungs-Haftung sind keine IT-Tickets.',
          '„Wir brauchen erst ein Zertifikat." — Nein. Erst ein belegbares Mindestniveau, der Rest folgt.',
        ],
      },
      { type: 'heading', level: 2, text: 'Der pragmatische Einstieg' },
      {
        type: 'paragraph',
        text: [
          'Wenn du nach den drei Fragen unsicher bist, ob und wie hart dich NIS2 trifft, klären wir genau das im Lagebild — Betroffenheit, Lücken zur eigenen Lage, priorisierte erste Schritte. ',
          { kind: 'link', href: '/kontakt', text: 'Frag eine 30-Minuten-Einschätzung an' },
          '. Ohne Panikmache, ohne Tool-Verkauf.',
        ],
      },
    ],
    takeaways: [
      'Betroffenheit hängt an drei Dingen: Größe (ab ~50 MA oder 10 Mio. € Umsatz), Sektor (18 gelistete) und Lieferkette.',
      'Der meistübersehene Fall: mittelbar betroffen als Zulieferer — die Anforderungen kommen per Vertrag, nicht per Gesetz.',
      'NIS2 verlangt belegbare Maßnahmen, kein Zertifikat. Eine bestehende ISO 27001 deckt 70–80 % ab.',
      'Nicht warten: Kunden fragen Nachweise schon vor dem finalen deutschen Gesetz ab.',
    ],
  },
  /* ────────────────────────────────────────────────────────────── */
  {
    kind: 'internal',
    slug: 'm365-migration-kosten',
    title: 'Was eine M365-Migration wirklich kostet — und woran der Preis hängt.',
    date: '2026-06-04',
    excerpt:
      'Eine Pauschale wäre gelogen. Was eine Microsoft-365-Migration im Mittelstand wirklich treibt — die fünf Kostenfaktoren, und woran du sparen kannst und woran nicht.',
    tags: ['m365', 'cloud-migration', 'kosten', 'mittelstand'],
    reading: 6,
    ogImage: '/og/m365-migration-kosten.webp',
    body: [
      {
        type: 'paragraph',
        text: 'Die erste Frage bei jeder Cloud-Migration ist die nach dem Preis. Und die ehrliche Antwort lautet: Kommt darauf an. Das ist keine Ausrede, sondern die Realität — der Unterschied zwischen einer sauberen und einer chaotischen Ausgangslage kann den Aufwand verdreifachen. Was den Preis wirklich treibt, lässt sich aber klar benennen.',
      },
      {
        type: 'paragraph',
        text: [
          'Lieber gleich loslegen? Der ',
          { kind: 'link', href: '/werkzeuge/m365-migration-kosten', text: 'M365-Aufwand-Rechner' },
          ' ordnet deine Lage in fünf Fragen ein — Komplexität, Dauer und die Treiber, ohne erfundene Zahl.',
        ],
      },
      { type: 'heading', level: 2, text: 'Warum dir niemand seriös eine Pauschale nennt' },
      {
        type: 'paragraph',
        text: 'Wer dir ohne Blick auf deine Umgebung einen Festpreis für eine M365-Migration nennt, hat entweder einen großzügigen Risikoaufschlag eingerechnet oder kennt die Stolperstellen nicht. Zwei Betriebe mit gleicher Mitarbeiterzahl können um den Faktor drei auseinanderliegen — je nachdem, was über die Jahre an Altlast gewachsen ist. Deshalb steht bei mir am Anfang ein Lagebild und am Ende ein Festpreis, nicht umgekehrt.',
      },
      { type: 'heading', level: 2, text: 'Die fünf Treiber, an denen der Preis hängt' },
      { type: 'heading', level: 3, text: '1. Deine Ausgangslage' },
      {
        type: 'paragraph',
        text: [
          'Ein sauberer Exchange-Server und ein Fileshare migrieren sich anders als zehn Jahre gewachsener Wildwuchs mit drei Fileshares, zwei Mail-Domains und einem Berg an ',
          { kind: 'link', href: '/lexikon/schatten-it', text: 'Schatten-IT' },
          '. Je mehr undokumentierte Altlast, desto mehr Zeit geht in die Bestandsaufnahme — den eigentlichen ',
          { kind: 'link', href: '/lexikon/cloud-migration', text: 'Umzug' },
          ' bremst selten das Kopieren, sondern das Aufräumen davor.',
        ],
      },
      { type: 'heading', level: 3, text: '2. Datenmenge und Postfächer' },
      {
        type: 'paragraph',
        text: 'Die Zahl der Postfächer, ihre Größe, archivierte Altdaten, geteilte Postfächer und öffentliche Ordner — all das bestimmt die Migrationsdauer und damit den Aufwand. Eine Co-Existence-Phase, in der altes und neues System parallel laufen, hält den Betrieb störungsfrei, kostet aber zusätzliche Koordination.',
      },
      { type: 'heading', level: 3, text: '3. Identität und Berechtigungen' },
      {
        type: 'paragraph',
        text: [
          'Hier steckt der am meisten unterschätzte Aufwand. Wer mehrere lokale Verzeichnisse auf eine zentrale Identität in ',
          { kind: 'link', href: '/lexikon/entra-id', text: 'Entra ID' },
          ' konsolidiert und dabei ein sauberes ',
          { kind: 'link', href: '/lexikon/iam', text: 'Berechtigungskonzept' },
          ' aufsetzt, investiert mehr — bekommt aber das Fundament, ohne das später weder Copilot noch Zero Trust sauber funktionieren.',
        ],
      },
      { type: 'heading', level: 3, text: '4. Compliance-Anforderungen' },
      {
        type: 'paragraph',
        text: [
          'Ob Daten in der EU liegen müssen, ob Aufbewahrungs- und Löschregeln greifen, ob ',
          { kind: 'link', href: '/lexikon/nis2', text: 'NIS2' },
          ' oder Branchenstandards mitreden — Compliance ist kein Add-on, sondern bestimmt die Architektur. Wer das von Anfang an mitdenkt, spart das teure Nachrüsten.',
        ],
      },
      { type: 'heading', level: 3, text: '5. Adoption und Change' },
      {
        type: 'paragraph',
        text: 'Die Technik ist die halbe Miete. Wenn die Leute danach weiter arbeiten wie vorher, war die Migration teuer und wirkungslos. Schulung, Champions, eine Sprechstunde in den ersten Wochen — dieser Posten wird gern gestrichen und rächt sich zuverlässig.',
      },
      { type: 'heading', level: 2, text: 'Lift-and-Shift oder gleich modernisieren?' },
      {
        type: 'paragraph',
        text: 'Möglichst unverändert verlagern (Lift-and-Shift) ist schnell und günstig im Projekt — nimmt aber die Altlasten mit in die Cloud. Auf dem Weg modernisieren kostet im Projekt mehr, spart aber danach. Die richtige Antwort hängt davon ab, wie tragfähig deine heutige Struktur ist. Pauschal ist keiner der beiden Wege der bessere.',
      },
      { type: 'heading', level: 2, text: 'Woran du sparen kannst — und woran nicht' },
      {
        type: 'list',
        items: [
          'Sparen: an Altdaten, die niemand mehr braucht. Vor der Migration ausmisten ist billiger als alles mitzunehmen.',
          'Sparen: an Parallel-Tools. Eine Migration ist der Moment, Lizenz-Doppelungen abzustellen.',
          'Nicht sparen: am Berechtigungskonzept. Was hier schludrig ist, wird später zum Sicherheits- und Copilot-Problem.',
          'Nicht sparen: an Adoption. Eine ungenutzte Cloud ist der teuerste Ausgang.',
        ],
      },
      { type: 'heading', level: 2, text: 'Wie ich den Preis festmache' },
      {
        type: 'paragraph',
        text: [
          'Statt einer Hausnummer am Telefon steht am Anfang ein Lagebild: Bestandsaufnahme, Risiken, Aufwand pro Phase. Daraus wird ein ',
          { kind: 'link', href: '/lexikon/festpreis', text: 'Festpreis' },
          ' — du weißt vorher, was es kostet, und trägst nicht mein Schätzrisiko. Wie der Umzug konkret abläuft, steht bei der ',
          { kind: 'link', href: '/leistungen/m365', text: 'Leistung Moderne IT & Cloud' },
          '.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Wenn du wissen willst, wo dein Haus auf der Skala zwischen „sauber" und „gewachsen" steht, ',
          { kind: 'link', href: '/kontakt', text: 'frag ein Lagebild an' },
          '. 30 Minuten, ehrliche Einschätzung, klare nächste Schritte.',
        ],
      },
    ],
    takeaways: [
      'Eine seriöse Pauschale gibt es nicht — gleiche Mitarbeiterzahl, Faktor drei Unterschied je nach Altlast.',
      'Fünf Treiber: Ausgangslage, Datenmenge, Identität & Berechtigungen, Compliance, Adoption.',
      'Der größte unterschätzte Posten ist das Berechtigungskonzept — Fundament für Sicherheit und Copilot.',
      'Spar an Altdaten und Parallel-Tools, niemals an Berechtigungen und Adoption.',
    ],
  },
  // Externe Posts kommen jetzt live aus stefanbraum.de/rss.xml,
  // siehe lib/external-feed.ts. Hier nur noch eigene Long-Form.
]

/** Nur eigene Posts (sync, immer verfügbar). */
export function getInternalPosts(): InternalPost[] {
  return [...POSTS]
    .filter((p): p is InternalPost => p.kind === 'internal')
    .sort((a, b) => b.date.localeCompare(a.date))
}

/**
 * Externe Posts werden live aus stefanbraum.de/rss.xml geholt.
 * 1h-Cache, leere Liste bei Fehler.
 */
export async function getExternalPosts(): Promise<ExternalPost[]> {
  const { fetchStefanBraumPosts } = await import('./external-feed')
  return fetchStefanBraumPosts()
}

/** Alle Posts (intern + extern via RSS), sortiert desc nach Datum. */
export async function getAllPosts(): Promise<Post[]> {
  const [internal, external] = await Promise.all([
    Promise.resolve(getInternalPosts()),
    getExternalPosts(),
  ])
  return [...internal, ...external].sort((a, b) =>
    b.date.localeCompare(a.date),
  )
}

/** Die N jüngsten Posts aus dem kombinierten Feed. */
export async function getRecentPosts(limit = 3): Promise<Post[]> {
  return (await getAllPosts()).slice(0, limit)
}

/** Findet einen internen Post per Slug (externe haben keine Detail-Page). */
export function getInternalPost(slug: string): InternalPost | undefined {
  return POSTS.find(
    (p): p is InternalPost => p.kind === 'internal' && p.slug === slug,
  )
}

/** Posts gefiltert nach Tag. */
export function getPostsByTag(tag: string): InternalPost[] {
  const lower = tag.toLowerCase()
  return getInternalPosts().filter(p =>
    p.tags.some(t => t.toLowerCase() === lower),
  )
}

/** Alle eindeutigen Tag-Slugs aus allen Posts, sortiert nach Häufigkeit. */
export function getAllTags(): Array<{ tag: string; count: number }> {
  const counts = new Map<string, number>()
  for (const p of getInternalPosts()) {
    for (const t of p.tags) {
      counts.set(t, (counts.get(t) ?? 0) + 1)
    }
  }
  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
}

/**
 * Liefert N verwandte interne Posts basierend auf Tag-Overlap mit dem
 * angegebenen Post. Score = Anzahl gemeinsamer Tags. Bei Gleichstand
 * gewinnt der jüngere Post. Fallback: aktuellste Posts wenn kein
 * Tag-Match.
 */
export function getRelatedPosts(slug: string, limit = 3): InternalPost[] {
  const post = getInternalPost(slug)
  if (!post) return []

  const candidates = getInternalPosts().filter(p => p.slug !== slug)
  const scored = candidates.map(p => {
    const overlap = p.tags.filter(t => post.tags.includes(t)).length
    return { post: p, overlap }
  })

  const matched = scored
    .filter(s => s.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap || b.post.date.localeCompare(a.post.date))
    .slice(0, limit)
    .map(s => s.post)

  if (matched.length < limit) {
    // Fill mit aktuellen Posts (ohne Duplikate)
    const fill = candidates
      .filter(p => !matched.some(m => m.slug === p.slug))
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, limit - matched.length)
    return [...matched, ...fill]
  }

  return matched
}

/** Liefert nur interne Slugs für generateStaticParams. */
export function getInternalSlugs(): string[] {
  return POSTS.filter((p): p is InternalPost => p.kind === 'internal').map(
    p => p.slug,
  )
}
