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
  /** Optional: Datum der letzten inhaltlichen Aktualisierung (YYYY-MM-DD).
   *  Fließt in dateModified (JSON-LD), OG modifiedTime und die Sitemap. */
  updated?: string
  /** 1-2 Zeilen, max ~180 Zeichen */
  excerpt:  string
  /** Optional: kürzerer Seitentitel für Suchmaschinen (mit Suffix ≤ 65 Zeichen). */
  seoTitle?: string
  /** Optional: Meta-Description (70–160 Zeichen), wenn der Excerpt zu lang ist. */
  seoDescription?: string
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
    slug: 'wordpress-oder-astro',
    title: 'WordPress oder Astro? Wann sich eine statische Website für den Mittelstand wirklich lohnt.',
    date: '2026-11-12',
    excerpt:
      'Acht Fragen, eine Tabelle, Beispiele aus der Praxis: wann WordPress mit Elementor die richtige Wahl bleibt und wann sich eine statische Website mit Astro lohnt.',
    seoTitle: 'WordPress oder Astro? Die Website-Entscheidung',
    seoDescription: 'WordPress oder Astro? Acht Fragen, an denen sich entscheidet, ob sich eine statische Website für deinen Betrieb lohnt. Mit Checkliste und Praxisbeispielen.',
    tags: ['marke', 'sichtbarkeit', 'seo', 'security', 'mittelstand'],
    reading: 8,
    body: [
      {
        type: 'paragraph',
        text: 'Wer eine neue Website plant, landet schnell bei der Frage: WordPress oder etwas Modernes? Meist steckt dahinter keine Technikfrage, sondern ein Gefühl. Die alte Seite ist langsam, jedes Plugin-Update macht nervös, und irgendwer hat erzählt, statische Seiten seien schneller und sicherer. Das stimmt oft. Aber nicht immer und nicht für jeden Betrieb.',
      },
      {
        type: 'paragraph',
        text: [
          'Ich baue beides. Die meisten Websites in meinem Portfolio laufen auf ',
          { kind: 'link', href: '/lexikon/wordpress', text: 'WordPress' },
          ' mit Elementor, die jüngste auf Astro. Dieser Artikel ist keine Glaubensfrage, sondern die Liste der Fragen, an denen ich die Entscheidung festmache. Astro steht hier stellvertretend für statische Website-Generatoren. Die Abwägung gilt für andere ähnlich.',
        ],
      },
      { type: 'heading', level: 2, text: 'Erst der Betrieb, dann die Technik' },
      {
        type: 'paragraph',
        text: [
          'WordPress ist ein Redaktionssystem. Seiten, Bilder und Texte liegen in einer Datenbank, PHP baut die Seite bei jedem Aufruf zusammen, und es gibt ein Backend, in dem jeder mit Login Inhalte ändern kann. Laut ',
          { kind: 'link', href: 'https://w3techs.com/technologies/details/cm-wordpress', text: 'W3Techs' },
          ' laufen im November 2026 fast vier von zehn Websites weltweit auf WordPress — 39,2 Prozent aller Websites, knapp 58 Prozent derer mit erkennbarem CMS. Entsprechend groß ist das Angebot an Themes, Plugins und Leuten, die sich damit auskennen.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Astro ist ein Werkzeug, mit dem man Websites baut. Laut ',
          { kind: 'link', href: 'https://docs.astro.build/en/concepts/why-astro/', text: 'eigener Dokumentation' },
          ' ist es für inhaltsgetriebene Seiten gedacht, rendert so viel wie möglich auf dem Server statt im Browser und schickt standardmäßig kein JavaScript mit. Das Ergebnis sind fertige HTML-Dateien, die ein Hoster oder ein CDN einfach ausliefert. Kein PHP, keine Datenbank, kein Login auf der öffentlichen Seite.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Beides kann eine gute Website ergeben. Welches besser passt, hängt an acht Fragen.',
      },
      { type: 'heading', level: 2, text: 'Acht Fragen, die die Entscheidung tragen' },
      { type: 'heading', level: 3, text: 'Wer pflegt die Inhalte — und wie oft?' },
      {
        type: 'paragraph',
        text: 'Das ist die wichtigste Frage. Wenn deine Assistenz jede Woche Stellenanzeigen, Termine oder News einstellt, braucht sie ein Backend, das sie ohne Hilfe bedienen kann. WordPress mit Elementor ist dafür gemacht: Text anklicken, ändern, speichern.',
      },
      {
        type: 'paragraph',
        text: 'Bei einer klassischen Astro-Seite liegen die Inhalte als Dateien im Code. Eine Änderung heißt: Datei bearbeiten, neu bauen, veröffentlichen. Für Entwickler ist das ein Handgriff. Für dein Team ist es ein Ticket. Wer selten ändert, merkt das kaum. Wer oft ändert, merkt es jede Woche.',
      },
      { type: 'heading', level: 3, text: 'Was muss die Seite können?' },
      {
        type: 'paragraph',
        text: 'Kontaktformular, Bewerbungsformular, Terminbuchung, Shop, mehrere Sprachen, eine Anbindung ans CRM. Für WordPress gibt es für fast alles ein Plugin. Das ist bequem, und es ist die Stelle, an der Seiten über die Jahre schwer werden.',
      },
      {
        type: 'paragraph',
        text: 'Eine statische Seite kann das meiste auch, aber anders: Formulare laufen über einen kleinen Dienst, der die Anfrage weiterleitet, Buchungen über ein eingebundenes Kalender-Tool. Das ist sauber, muss aber einmal gebaut werden. Ein echter Shop mit Warenwirtschaft ist auf beiden Seiten ein eigenes Projekt.',
      },
      { type: 'heading', level: 3, text: 'Wer kümmert sich um Updates?' },
      {
        type: 'paragraph',
        text: [
          'WordPress braucht Pflege: Core, Theme, Plugins und die PHP-Version auf dem Server. WordPress selbst ',
          { kind: 'link', href: 'https://wordpress.org/about/requirements/', text: 'empfiehlt' },
          ' aktuell PHP 8.3 oder neuer, dazu MySQL oder MariaDB. Das heißt: Jemand muss regelmäßig aktualisieren, prüfen, ob danach noch alles läuft, und Backups im Blick haben. Das ist kein Drama, aber es ist eine Daueraufgabe.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Eine statische Seite hat auf dem Server nichts, was veraltet. Gepflegt werden die Abhängigkeiten im Projekt — beim nächsten Umbau, nicht jeden Monat unter Zeitdruck.',
      },
      { type: 'heading', level: 3, text: 'Wie groß ist die Angriffsfläche?' },
      {
        type: 'paragraph',
        text: [
          'Hier sind die Zahlen deutlich. Patchstack, ein Anbieter von WordPress-Sicherheitslösungen, hat für 2025 ',
          { kind: 'link', href: 'https://patchstack.com/whitepaper/state-of-wordpress-security-in-2026/', text: '11.334 neue Schwachstellen' },
          ' im WordPress-Ökosystem gezählt, 42 Prozent mehr als im Vorjahr. 91 Prozent davon steckten in Plugins, 9 Prozent in Themes, nur sechs im WordPress-Kern. Und 46 Prozent hatten zum Zeitpunkt der Veröffentlichung noch keinen Fix vom Hersteller.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Das Problem ist also selten WordPress selbst, sondern die Summe der Erweiterungen. Jedes Plugin ist fremder Code mit eigenem Update-Rhythmus. Dazu kommt das Login: Ein Backend im Netz braucht starke Passwörter und ',
          { kind: 'link', href: '/lexikon/mfa', text: 'MFA' },
          '. Eine statische Seite hat kein Login und keine Datenbank, die man angreifen kann. Ganz ohne Risiko ist sie nicht — Formulare, eingebundene Dienste und der Hosting-Zugang bleiben Angriffspunkte. Aber die Fläche ist deutlich kleiner.',
        ],
      },
      { type: 'heading', level: 3, text: 'Wie schnell muss sie sein?' },
      {
        type: 'paragraph',
        text: [
          'Google misst die Qualität einer Seite mit den ',
          { kind: 'link', href: '/lexikon/core-web-vitals', text: 'Core Web Vitals' },
          '. Gut ist laut ',
          { kind: 'link', href: 'https://web.dev/articles/vitals', text: 'web.dev' },
          ': größtes Element nach höchstens 2,5 Sekunden sichtbar, Reaktion auf Eingaben in höchstens 200 Millisekunden, Layout-Verschiebung höchstens 0,1 — gemessen an 75 Prozent der Seitenaufrufe.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Eine gut gebaute WordPress-Seite schafft das. Ein überladenes Theme mit zwanzig Plugins schafft es oft nicht. Bei einer statischen Seite ist Schnelligkeit der Normalfall, nicht das Ergebnis von Nacharbeit. Langsam wird sie nur, wenn man sie langsam baut.',
      },
      { type: 'heading', level: 3, text: 'Was kostet sie über fünf Jahre?' },
      {
        type: 'paragraph',
        text: 'Der Bau ist der kleinere Teil. Rechne die laufenden Posten mit: Hosting, Lizenzen für Theme und Premium-Plugins, Updates und Wartung, Sicherheits-Checks, Backups und die Stunden, die bei jeder Änderung anfallen. Bei WordPress sind die Änderungen günstig, wenn dein Team sie selbst macht, und die Wartung ist ein fester Posten. Bei einer statischen Seite ist Hosting oft unkompliziert und die Wartung gering, dafür kostet jede inhaltliche Änderung Entwicklerzeit, solange kein Redaktionssystem dranhängt. Welche Seite günstiger ist, entscheidet also vor allem, wie oft sich etwas ändert.',
      },
      { type: 'heading', level: 3, text: 'Wie abhängig machst du dich?' },
      {
        type: 'paragraph',
        text: 'Lock-in gibt es auf beiden Seiten. Bei WordPress ist es selten das System, sondern der Page-Builder: Eine Elementor-Seite zieht man nicht ohne Weiteres auf ein anderes Theme um. Bei Astro bist du von jemandem abhängig, der den Code versteht. Dafür liegt alles als Code in einem Repository, das dir gehört.',
      },
      {
        type: 'paragraph',
        text: [
          'Zur Einordnung: Das Team hinter Astro ist im Januar 2026 ',
          { kind: 'link', href: 'https://astro.build/blog/joining-cloudflare/', text: 'zu Cloudflare gewechselt' },
          '. Astro bleibt nach eigener Aussage quelloffen, MIT-lizenziert und auf allen Hostern lauffähig. Die eigentliche Frage ist ohnehin eine andere: Bekommst du die Zugänge, den Code und die Dokumentation — oder nur eine Website, die nur deine Agentur anfassen kann?',
        ],
      },
      { type: 'heading', level: 3, text: 'Ist sie für alle bedienbar?' },
      {
        type: 'paragraph',
        text: [
          'Barrierefreiheit hängt nicht am System, sondern an der Umsetzung: Kontraste, Überschriften-Struktur, Alternativtexte, Bedienung per Tastatur. Beides geht mit beiden Systemen, und beides lässt sich mit beiden verfehlen. Wichtig wird das Thema für alle, die online an Endkunden verkaufen: Seit dem 28. Juni 2025 gilt das ',
          { kind: 'link', href: 'https://www.bundesfachstelle-barrierefreiheit.de/DE/Fachwissen/Produkte-und-Dienstleistungen/Barrierefreiheitsstaerkungsgesetz/barrierefreiheitsstaerkungsgesetz_node.html', text: 'Barrierefreiheitsstärkungsgesetz' },
          ', unter anderem für den elektronischen Geschäftsverkehr. Kleinstunternehmen, die Dienstleistungen anbieten, sind ausgenommen. Ob es dich betrifft, gehört im Einzelfall geprüft.',
        ],
      },
      { type: 'heading', level: 2, text: 'Wann WordPress mit Elementor die bessere Wahl bleibt' },
      {
        type: 'paragraph',
        text: 'WordPress ist kein Auslaufmodell. Für viele kleine und mittlere Betriebe ist es weiterhin die richtige Wahl:',
      },
      {
        type: 'list',
        items: [
          'Dein Team ändert Inhalte oft und selbst, ohne Technik-Kenntnisse.',
          'Du brauchst viele Funktionen, für die es erprobte Plugins gibt.',
          'Im Haus kennt sich schon jemand mit WordPress aus.',
          'Du willst schnell neue Landingpages bauen, etwa für Kampagnen oder Stellen.',
          'Es gibt eine solide Bestandsseite, die nur Pflege braucht, keinen Neubau.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Zwei Beispiele für den letzten Punkt. Bei ',
          { kind: 'link', href: '/cases/jonathan-gruen', text: 'Jonathan Grün' },
          ' war die Elementor-Seite eine gute Grundlage. Statt neu zu bauen, haben wir sie gezielt aufgearbeitet: Performance, DSGVO, SEO und mobile Nutzung. Und bei ',
          { kind: 'link', href: '/cases/wolfswerk', text: 'WolfsWerk' },
          ', meiner ersten Kunden-Website, habe ich die erste Fassung mit einfachsten WordPress-Mitteln und vielen Plugins gebaut. Später haben wir sie neu aufgesetzt — wieder mit WordPress und Elementor, diesmal sauber aufgebaut. Am System lag es nicht, sondern am Wildwuchs.',
        ],
      },
      { type: 'heading', level: 2, text: 'Wann Astro oder eine statische Seite sinnvoll ist' },
      {
        type: 'paragraph',
        text: 'Statisch lohnt sich, wenn sich Inhalte selten ändern oder die Änderungen über ein Redaktionssystem oder Git laufen. Wenn Geschwindigkeit und Sicherheit Vorrang haben. Wenn das Budget für laufende Wartung klein ist. Und bei Seiten, die vor allem zeigen sollen: Portfolio, Praxis, Kanzlei, Unternehmensprofil.',
      },
      {
        type: 'paragraph',
        text: [
          'Ein Beispiel ist ',
          { kind: 'link', href: '/cases/licht-und-liebe-photography', text: 'Licht & Liebe Photography' },
          '. Die Portfolio-Website läuft auf Astro und wird über Cloudflare Pages ausgeliefert. Das Kontaktformular ist mit Cloudflare Turnstile gegen Bots geschützt und schickt Anfragen über Resend direkt ins Geschäftspostfach in Google Workspace. Die Webanalyse läuft über eine selbst betriebene Umami-Instanz mit Einwilligungssteuerung. Lighthouse zeigt für die mobile Performance 100, bestätigt am 4. November 2026. Und weil die Seite statisch ist, fällt keine laufende Plugin-Wartung an.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Ein Lighthouse-Wert ist eine Labormessung und keine Garantie für jeden Besucher. Aber er zeigt, wo eine Architektur anfängt.',
      },
      { type: 'heading', level: 2, text: 'Der Mittelweg' },
      {
        type: 'paragraph',
        text: 'Die Entscheidung ist selten schwarz oder weiß. Drei Varianten liegen dazwischen:',
      },
      {
        type: 'list',
        items: [
          'Headless-CMS mit Astro: Dein Team pflegt Inhalte in einem Redaktionssystem, die Seite wird daraus statisch gebaut. Bequemes Backend, schnelle und schlanke öffentliche Seite. Dafür mehr Aufbau am Anfang und ein Dienst mehr.',
          'Managed WordPress: Ein spezialisierter Hoster übernimmt, je nach Paket, Updates, Backups und Caching. Das senkt den Wartungsaufwand, nicht aber die Plugin-Frage.',
          'Statischer Export: WordPress bleibt das Redaktionssystem, öffentlich ausgeliefert wird eine statische Kopie. Das funktioniert gut für Seiten ohne dynamische Funktionen, braucht aber einen sauberen Veröffentlichungsablauf.',
        ],
      },
      { type: 'heading', level: 2, text: 'Die Entscheidung in fünf Minuten' },
      {
        type: 'paragraph',
        text: 'Geh die Tabelle durch und zähl, auf welcher Seite du öfter landest.',
      },
      {
        type: 'table',
        headers: ['Frage', 'Eher WordPress', 'Eher Astro / statisch'],
        rows: [
          ['Wie oft ändert ihr Inhalte?', 'Wöchentlich, durch das eigene Team', 'Selten oder über Git / CMS'],
          ['Wer ändert?', 'Mitarbeitende ohne Technik-Kenntnisse', 'Du mit Dienstleister oder Redaktionssystem'],
          ['Wie viele Funktionen?', 'Viele, die es als Plugin gibt', 'Wenige: Formular, Galerie, Buchung'],
          ['Wer macht Updates?', 'Fester Wartungsvertrag oder eigene IT', 'Niemand soll laufend ran müssen'],
          ['Was hat Vorrang?', 'Schnelle Eigenständigkeit', 'Geschwindigkeit und kleine Angriffsfläche'],
          ['Was ist schon da?', 'Gute WordPress-Seite, WordPress-Wissen im Team', 'Neustart oder Seite mit Wildwuchs'],
        ],
      },
      {
        type: 'paragraph',
        text: 'Bevor du entscheidest, kläre noch drei Dinge: Wem gehören Domain, Hosting und Code? Wer ist in zwei Jahren für Updates zuständig? Und was kostet eine Textänderung — in Zeit und in Euro?',
      },
      {
        type: 'paragraph',
        text: 'Wenn die Antworten eindeutig sind, ist es die Entscheidung auch. Wenn nicht, liegt die Antwort oft im Mittelweg.',
      },
      { type: 'heading', level: 2, text: 'Wo du anfangen kannst' },
      {
        type: 'paragraph',
        text: [
          'Ob deine heutige Seite schnell genug ist, gefunden wird und Anfragen bringt, prüfst du in zwei Minuten mit dem ',
          { kind: 'link', href: '/werkzeuge/website-check', text: 'Website-Check' },
          '. Wie Ladezeit und lokale Sichtbarkeit zusammenhängen, steht im Artikel zu ',
          { kind: 'link', href: '/blog/local-seo-handwerk', text: 'Local SEO fürs Handwerk' },
          '.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Wie ich Websites baue — mit WordPress oder mit Astro, je nachdem, was zu deinem Betrieb passt — steht bei der Leistung ',
          { kind: 'link', href: '/leistungen/marke', text: 'Marke, Website & Reichweite' },
          '. Und wenn du die Frage für deinen Betrieb einmal sauber durchgehen willst, ',
          { kind: 'link', href: '/kontakt', text: 'schreib mir für ein Erstgespräch' },
          '. 30 Minuten, ehrliche Einschätzung, klare Empfehlung — auch wenn sie lautet, die bestehende Seite einfach zu pflegen.',
        ],
      },
    ],
    takeaways: [
      'Die wichtigste Frage ist nicht die Technik, sondern wer Inhalte wie oft ändert.',
      'WordPress braucht laufende Pflege. Das Risiko steckt vor allem in Plugins: Laut Patchstack lagen 2025 91 Prozent der neuen Schwachstellen dort.',
      'Statische Seiten mit Astro sind schnell und bieten wenig Angriffsfläche — kosten aber bei jeder Inhaltsänderung Entwicklerzeit, solange kein Redaktionssystem dranhängt.',
      'Lock-in entsteht eher durch Page-Builder und fehlende Zugänge als durch das System selbst.',
      'Dazwischen liegen Headless-CMS mit Astro, Managed WordPress und statischer Export.',
    ],
  },
  {
    kind: 'internal',
    slug: 'local-seo-handwerk',
    title: 'Local SEO fürs Handwerk: Wie du bei „Gewerk + Ort" vorne stehst.',
    date: '2026-06-12',
    excerpt:
      'Keine SEO-Magie, sondern ehrliche Hebel: Google-Profil, NAP-Konsistenz, Bewertungen, lokale Seiten, Ladezeit. Was bei „Heizungsbauer Hanau" wirklich nach vorne bringt.',
    seoTitle: 'Local SEO: So steht dein Betrieb lokal vorne',
    seoDescription: 'Keine SEO-Magie, sondern ehrliche Hebel: Google-Profil, NAP-Konsistenz, Bewertungen, lokale Seiten und Ladezeit – was bei „Gewerk + Ort“ nach vorne bringt.',
    tags: ['local-seo', 'marke', 'handwerk', 'sichtbarkeit'],
    reading: 5,
    body: [
      {
        type: 'paragraph',
        text: 'Wer ein Handwerk betreibt, lebt vom lokalen Einzugsgebiet. Da bringt eine Top-Platzierung bei „Elektriker Gelnhausen" mehr als tausend Besucher von weit weg. Die gute Nachricht: Local SEO ist kein Hexenwerk und keine Agentur-Magie. Es sind eine Handvoll handfester Hebel, die jeder Betrieb selbst in der Hand hat. Die schlechte: Die meisten ziehen genau an diesen Hebeln nicht — und wundern sich, warum der Wettbewerber zwei Orte weiter oben im Karten-Block steht.',
      },
      {
        type: 'paragraph',
        text: [
          'Ich sehe das aus echten Mandaten — eine Kfz-Werkstatt, eine Steuerkanzlei, eine Praxis. Immer das gleiche Muster: Das Handwerk stimmt, die Sichtbarkeit nicht. Was wirklich zählt, steht kompakt im ',
          { kind: 'link', href: '/lexikon/local-seo', text: 'Lexikon-Eintrag zu Local SEO' },
          '. Hier nehme ich die Hebel der Reihe nach auseinander.',
        ],
      },
      { type: 'heading', level: 2, text: 'Das Google-Unternehmensprofil ist die halbe Miete' },
      {
        type: 'paragraph',
        text: 'Wenn jemand „Sanitär in der Nähe" sucht, entscheidet sich das Spiel oben im Karten-Block — den drei Einträgen mit Pins, noch vor den klassischen blauen Links. Da reinzukommen hängt fast vollständig an einem sauber gepflegten Google-Unternehmensprofil (früher Google My Business). Und „gepflegt" heißt mehr als nur angelegt.',
      },
      {
        type: 'list',
        items: [
          'Richtige Kategorie wählen — „Heizungsbauer", nicht vage „Bauunternehmen". Google rankt nach der Hauptkategorie.',
          'Leistungen einzeln eintragen, mit den Worten, die deine Kunden tatsächlich tippen.',
          'Öffnungszeiten aktuell halten, Feiertage gepflegt — veraltete Zeiten kosten Vertrauen und Ranking.',
          'Echte Fotos vom Betrieb, vom Team, von der Arbeit. Keine Stockbilder.',
          'Auf Bewertungen antworten — auf alle, auch die schlechten, ruhig und sachlich.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Das Profil ist kostenlos und braucht keinen Entwickler. Eine halbe Stunde im Monat reicht, um es lebendig zu halten. Das ist der billigste Sichtbarkeits-Hebel, den es gibt — und der am häufigsten brachliegt.',
      },
      { type: 'heading', level: 2, text: 'NAP-Konsistenz: langweilig, aber entscheidend' },
      {
        type: 'paragraph',
        text: 'NAP steht für Name, Adresse, Telefon. Klingt trivial, ist aber der Punkt, an dem viele unbemerkt Ranking verschenken. Google gleicht deine Daten über alle Verzeichnisse hinweg ab — Profil, Website, Branchenbücher, Bewertungsportale. Wo die Angaben auseinanderlaufen, entsteht Unsicherheit, und Unsicherheit kostet Position.',
      },
      {
        type: 'paragraph',
        text: 'Die Klassiker im Mittelstand: einmal „Straße", einmal „Str.", eine alte Handynummer aus der Gründungszeit, der Firmenname mal mit, mal ohne „GmbH". Jede dieser Abweichungen ist für sich harmlos. In Summe sagen sie Google: Hier sind die Daten nicht zuverlässig. Bei einer Kanzlei im Mandat war es eine zweite, längst tote Adresse aus einem alten Brancheneintrag, die das Profil ausgebremst hat.',
      },
      {
        type: 'paragraph',
        text: 'Der Fix ist stumpfe Fleißarbeit: eine verbindliche Schreibweise festlegen, sie überall durchziehen, alte Einträge aufräumen. Kein Tool ersetzt das, aber es ist in ein, zwei Tagen erledigt — und wirkt dann monatelang.',
      },
      { type: 'heading', level: 2, text: 'Bewertungen sind Ranking und Vertrauen zugleich' },
      {
        type: 'paragraph',
        text: 'Bewertungen wirken doppelt. Sie sind ein direktes Ranking-Signal, und sie entscheiden, ob jemand bei dir oder beim Nächsten anruft. Anzahl, Aktualität und dass du antwortest — das zählt mehr als die reine Sterne-Zahl. Zehn frische, beantwortete Bewertungen schlagen fünfzig alte, auf die nie jemand reagiert hat.',
      },
      {
        type: 'paragraph',
        text: 'Der ehrliche Weg dahin ist unspektakulär: nach einem guten Auftrag aktiv fragen. Ein kurzer Link per SMS oder am Ende der Rechnung, freundlich, ohne Druck. Kauf keine Bewertungen und lass dir keine erfinden — Google erkennt Muster, und ein Schwung Fake-Sterne über Nacht schadet mehr, als er nützt. Echte Zufriedenheit hast du ohnehin; sie muss nur sichtbar werden.',
      },
      { type: 'heading', level: 2, text: 'Lokale Landingpages statt einer Bauchladen-Seite' },
      {
        type: 'paragraph',
        text: 'Wer in mehreren Orten arbeitet, braucht für die wichtigsten je eine eigene Seite — „Badsanierung in Hanau", „Badsanierung in Gelnhausen" — mit echtem, unterschiedlichem Inhalt. Nicht zehnmal derselbe Text mit getauschtem Ortsnamen; das durchschaut Google und wertet es ab. Echte Referenzen aus dem Ort, die konkrete Anfahrt, Besonderheiten vor Ort. Das ist Arbeit, aber es ist die Arbeit, die rankt.',
      },
      {
        type: 'paragraph',
        text: 'Gleiches gilt pro Gewerk: eine klare Seite je Leistung, die genau die Frage beantwortet, die jemand bei der Suche im Kopf hat. Eine einzige „Wir machen alles"-Seite verliert gegen den Wettbewerber mit fünf fokussierten Seiten — fast immer.',
      },
      { type: 'heading', level: 2, text: 'Ladezeit: die Anfrage, die du nie siehst' },
      {
        type: 'paragraph',
        text: [
          'Local SEO endet nicht bei Google-Einträgen. Wenn die Seite drei Sekunden zum Aufbauen braucht, ist der Interessent auf dem Handy schon weg — und du erfährst nie, dass er da war. Googles ',
          { kind: 'link', href: '/lexikon/core-web-vitals', text: 'Core Web Vitals' },
          ' messen genau das: wie schnell sich die Seite aufbaut, wie schnell sie reagiert, wie ruhig das Layout bleibt. Sie fließen ins Ranking ein und sind ein guter Proxy dafür, ob sich die Seite gut anfühlt.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Im Handwerk reicht oft das Naheliegende: unkomprimierte Fotos verkleinern, das überladene Theme entrümpeln, mobil testen statt nur am Desktop. Ob deine Seite hier liefert, prüfst du in zwei Minuten mit dem ',
          { kind: 'link', href: '/werkzeuge/website-check', text: 'Website-Check' },
          ' — ohne Anmeldung, mit einer ehrlichen Einschätzung statt einer Verkaufsfolie.',
        ],
      },
      { type: 'heading', level: 2, text: 'Was Local SEO so dankbar macht' },
      {
        type: 'paragraph',
        text: 'Der Charme gegenüber überregionalem SEO: Der Wettbewerb ist lokal überschaubar. Im Kreis ranken nicht hundert Betriebe um „Dachdecker", sondern eine Handvoll. Wer die Hebel oben konsequent zieht, steht oft monatelang vorne, ohne ständig nachlegen zu müssen. Es ist weniger ein Wettlauf als ein einmaliges Saubermachen, das danach hält.',
      },
      {
        type: 'paragraph',
        text: [
          'Wie das in eine Marke und einen funktionierenden Funnel passt, steht bei der Leistung ',
          { kind: 'link', href: '/leistungen/marke', text: 'Marke, Website und Reichweite' },
          '. Und wenn du wissen willst, wo dein Betrieb lokal wirklich steht und welche zwei, drei Hebel zuerst dran sind, ',
          { kind: 'link', href: '/lagebild', text: 'fordere ein digitales Lagebild an' },
          '. 30 Minuten, ehrliche Einschätzung, klare nächste Schritte — kein Tool-Verkauf.',
        ],
      },
    ],
    takeaways: [
      'Der Karten-Block oben entscheidet — und hängt fast nur am sauber gepflegten Google-Unternehmensprofil. Billigster Hebel, am häufigsten brach.',
      'NAP-Konsistenz (Name, Adresse, Telefon) über alle Verzeichnisse: stumpfe Fleißarbeit, die monatelang wirkt.',
      'Echte, beantwortete Bewertungen sind Ranking und Vertrauen zugleich. Aktiv fragen, niemals kaufen.',
      'Pro Ort und pro Gewerk eine eigene Seite mit echtem Inhalt — nicht zehnmal derselbe Text mit getauschtem Ortsnamen.',
      'Ladezeit ist Teil von Local SEO: Eine langsame Seite verliert die Anfrage, die du nie zu sehen bekommst.',
    ],
  },
  {
    kind: 'internal',
    slug: 'automatisierung-statt-ki-hype',
    title: 'KI im Betrieb: Wo Automatisierung ohne Sprachmodell den schnelleren ROI bringt.',
    date: '2026-06-13',
    excerpt:
      'Nicht jedes Problem braucht ein Sprachmodell. Oft schlägt simple, regelbasierte Automatisierung das große LLM — schneller im ROI, kleiner im Risiko. Wann was.',
    seoTitle: 'Automatisierung statt KI-Hype im Betrieb',
    tags: ['ki', 'automatisierung', 'power-platform', 'roi', 'mittelstand'],
    reading: 6,
    body: [
      {
        type: 'paragraph',
        text: 'Auf LinkedIn löst gerade jeder Prozess mit einem Sprachmodell. Im Betrieb sieht die Sache nüchterner aus. Die meisten Aufgaben, die wirklich Zeit fressen, sind nicht unscharf — sie sind nur lästig. Und für lästige, klar definierte Aufgaben ist ein großes Sprachmodell oft das teuerste und unzuverlässigste Werkzeug im Schrank. Diese Lücke zwischen KI-Demo und Betriebsalltag will ich hier ehrlich aufmachen.',
      },
      { type: 'heading', level: 2, text: 'Die Lücke zwischen LinkedIn-KI und Betriebsalltag' },
      {
        type: 'paragraph',
        text: 'In der Praxis sehe ich denselben Reflex immer wieder. Es gibt einen manuellen Prozess, jemand hat von KI gehört, und plötzlich soll ein Chatbot oder ein Agent das übernehmen. Dann schaut man genauer hin und stellt fest: Der Prozess ist eine Kette aus „wenn das, dann jenes". Eingang prüfen, Feld auslesen, Datensatz anlegen, Mail rausschicken, Haken setzen. Da ist nichts unscharf. Da ist nichts zu „verstehen". Da ist nur Fleißarbeit, die niemand mehr machen will.',
      },
      {
        type: 'paragraph',
        text: [
          'Für genau diese Fälle ist ',
          { kind: 'link', href: '/lexikon/workflow-automatisierung', text: 'Workflow-Automatisierung' },
          ' gebaut. Ein Trigger, ein paar Bedingungen, definierte Aktionen — fertig. Das läuft jede Nacht durch, kostet fast nichts und liefert jedes Mal exakt dasselbe Ergebnis. Ein Sprachmodell auf dieselbe Aufgabe loszulassen heißt: mehr Latenz, laufende Kosten pro Aufruf und ein Rest-Risiko, dass es sich diesmal etwas anderes „überlegt".',
        ],
      },
      { type: 'heading', level: 2, text: 'Warum Regeln oft gewinnen' },
      {
        type: 'paragraph',
        text: 'Regelbasierte Automatisierung hat drei Eigenschaften, die im Betrieb mehr wert sind als jede Demo-Magie: Sie ist deterministisch, sie ist nachvollziehbar, und sie ist billig. Determinismus heißt, dasselbe rein ergibt dasselbe raus — das kannst du testen, abnehmen und einem Auditor zeigen. Nachvollziehbar heißt, wenn etwas schiefgeht, siehst du im Log genau welche Bedingung gegriffen hat. Und billig heißt, ein Skript oder ein Flow kostet pro Lauf praktisch nichts, während jeder Modell-Aufruf auf der Rechnung steht.',
      },
      {
        type: 'paragraph',
        text: [
          'Werkzeuge gibt es genug. Im Microsoft-Umfeld ist es meist die ',
          { kind: 'link', href: '/lexikon/power-platform', text: 'Power Platform' },
          ' mit Power Automate, in offeneren Stacks ',
          { kind: 'link', href: '/lexikon/n8n', text: 'n8n' },
          ', und für vieles reicht ein sauberes Skript, das per Zeitplan läuft. Das ist keine Raketentechnik. Das ist Klempnerarbeit — unspektakulär, und genau deshalb verlässlich.',
        ],
      },
      { type: 'heading', level: 2, text: 'Wann ein Sprachmodell der richtige Griff ist' },
      {
        type: 'paragraph',
        text: 'Das ist keine Absage an KI. Es gibt Aufgaben, an denen Regeln scheitern und ein Modell glänzt. Immer dann, wenn der Input unstrukturiert ist und Sprache verstanden oder erzeugt werden muss, ist das Sprachmodell überlegen — und keine Regel der Welt holt das auf.',
      },
      {
        type: 'list',
        items: [
          'Freitext zusammenfassen oder umformulieren — Protokolle, lange Mail-Verläufe, Berichtsentwürfe.',
          'Unstrukturiertes klassifizieren — Tickets nach Thema sortieren, Stimmung in Rückmeldungen erkennen.',
          'Inhalte aus Dokumenten ziehen, deren Layout nie gleich aussieht — Rechnungen und Lieferscheine in zwanzig Varianten.',
          'Fragen auf eigenen Dokumenten beantworten, ohne dass jemand die ganze Ablage liest.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Der letzte Punkt ist der interessanteste, weil er beide Welten verbindet. ',
          { kind: 'link', href: '/lexikon/rag', text: 'RAG' },
          ' holt die passenden Stellen aus deinen Dokumenten und lässt das Modell nur auf dieser Grundlage antworten — strukturierte Suche plus sprachliche Ausgabe. Und wenn ein Prozess wirklich eigenständig Schritte planen und ausführen soll, reden wir über ',
          { kind: 'link', href: '/lexikon/ki-agenten', text: 'KI-Agenten' },
          '. Beides ist mächtig. Beides ist auch aufwendiger zu bauen, zu testen und abzusichern als ein Flow mit fünf Bedingungen.',
        ],
      },
      { type: 'heading', level: 2, text: 'Der ehrliche Vergleich' },
      {
        type: 'paragraph',
        text: 'Die Frage ist nie „KI oder nicht", sondern „was ist das einfachste Werkzeug, das die Aufgabe sicher erledigt". Diese Tabelle ist die Faustregel, mit der ich in Lagebildern sortiere:',
      },
      {
        type: 'table',
        headers: ['Aufgabe', 'Reicht Regelautomatisierung', 'Sprachmodell sinnvoll'],
        rows: [
          ['Daten zwischen Systemen umkopieren', 'Ja — Trigger und Mapping genügen', 'Nein, reine Verschwendung'],
          ['Formular auslesen, immer gleiches Layout', 'Ja — feste Felder, klare Regeln', 'Nein'],
          ['Genehmigung nach festen Schwellen routen', 'Ja — Bedingungen bilden die Logik ab', 'Nein'],
          ['Rechnungen in vielen Layouts auslesen', 'Nein, zu viele Varianten', 'Ja — Extraktion aus Unstrukturiertem'],
          ['Lange Mail-Verläufe zusammenfassen', 'Nein', 'Ja — Sprache verstehen und verdichten'],
          ['Tickets nach Thema klassifizieren', 'Nur grob über Stichwörter', 'Ja, sauberer und robuster'],
        ],
      },
      {
        type: 'paragraph',
        text: 'Der häufigste Fall in der Praxis ist eine Mischung: 80 Prozent des Prozesses sind stumpfe Regelarbeit, und an genau einer Stelle steckt das unscharfe Stück. Dann baust du die 80 Prozent regelbasiert und steckst das Modell nur an die eine Stelle, an der es wirklich gebraucht wird. Das ist billiger, schneller und leichter abzusichern, als alles dem Modell zu überlassen.',
      },
      { type: 'heading', level: 2, text: 'Wo der schnelle ROI versteckt liegt' },
      {
        type: 'paragraph',
        text: [
          'Der schnellste Return sitzt fast immer in der unsichtbaren Handarbeit — in den kleinen Brücken, die Mitarbeiter zwischen zwei Systemen von Hand schlagen, weil nie jemand sie automatisiert hat. Oft ist das auch der Nährboden für ',
          { kind: 'link', href: '/lexikon/schatten-it', text: 'Schatten-IT' },
          ': halbgare Excel-Makros und private Tools, die einspringen, wo der saubere Prozess fehlt. Genau diese Stellen automatisiert man regelbasiert in Tagen, nicht Monaten.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Die Rechnung ist nüchtern: gesparte Stunden pro Woche mal Stundensatz, gegen einmaligen Bauaufwand und geringe Laufkosten. Bei regelbasierter Automatisierung steht diese Rechnung meist nach wenigen Wochen im Plus, weil der Bau überschaubar und der Betrieb fast gratis ist. Bei einer Modell-Lösung musst du laufende Kosten pro Aufruf und den höheren Test- und Absicherungsaufwand dagegenrechnen — was den Break-even nach hinten schiebt. Beides kann sich lohnen. Aber man sollte es vorher wissen, nicht hinterher.',
      },
      {
        type: 'paragraph',
        text: [
          'Wenn du selbst überschlagen willst, welcher Prozess sich zuerst lohnt, hilft der ',
          { kind: 'link', href: '/werkzeuge/automatisierung-roi', text: 'Automatisierungs-ROI-Rechner' },
          ' — ein paar Eingaben, eine ehrliche Hausnummer, ohne erfundene Versprechen.',
        ],
      },
      { type: 'heading', level: 2, text: 'Wie ich das angehe' },
      {
        type: 'paragraph',
        text: [
          'Mein Vorgehen ist langweilig und genau deshalb belastbar: Erst den Prozess aufnehmen, dann fragen, wo wirklich Unschärfe steckt. Was klar regelbar ist, wird regelbar gebaut. Was echtes Sprachverständnis braucht, bekommt ein Modell — aber nur dort und mit klaren Leitplanken. Wie das im Engagement aussieht, steht bei der Leistung ',
          { kind: 'link', href: '/leistungen/ai', text: 'KI & Automatisierung' },
          '.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Wenn du wissen willst, wo in deinem Betrieb der schnelle Hebel liegt und ob er überhaupt KI braucht, ',
          { kind: 'link', href: '/lagebild', text: 'fordere ein digitales Lagebild an' },
          '. 30 Minuten, ehrliche Einschätzung, kein Tool-Verkauf.',
        ],
      },
    ],
    takeaways: [
      'Die Frage ist nie „KI oder nicht", sondern: Was ist das einfachste Werkzeug, das die Aufgabe sicher erledigt.',
      'Klar definierte, regelbare Prozesse gehören in Workflow-Automatisierung — deterministisch, nachvollziehbar, billig. Ein Sprachmodell ist hier teurer und unzuverlässiger.',
      'Ein LLM lohnt sich bei unstrukturiertem Input: Freitext zusammenfassen, klassifizieren, aus wechselnden Layouts extrahieren, Fragen auf eigenen Dokumenten (RAG).',
      'Der häufigste Fall ist die Mischung: 80 % regelbasiert bauen, das Modell nur an die eine unscharfe Stelle setzen.',
      'Der schnellste ROI sitzt in der unsichtbaren Handarbeit zwischen zwei Systemen — regelbasiert in Tagen automatisiert.',
    ],
  },
  {
    kind: 'internal',
    slug: 'ransomware-wiederanlauf',
    title: 'Ransomware-Ernstfall. Die Frage ist nicht ob, sondern wie schnell ihr wieder arbeitet.',
    date: '2026-06-14',
    excerpt:
      'Schutz allein reicht nicht. Entscheidend ist, wie schnell ihr nach einem Ransomware-Treffer wieder arbeitsfähig seid. RTO, RPO, 3-2-1-Backup und ein geübter Wiederanlaufplan — nüchtern erklärt.',
    seoTitle: 'Ransomware: Wie schnell arbeitet ihr wieder?',
    seoDescription: 'Schutz allein reicht nicht. Entscheidend ist, wie schnell ihr nach einem Ransomware-Treffer wieder arbeitet: RTO, RPO, 3-2-1-Backup, geübter Wiederanlauf.',
    tags: ['ransomware', 'bcm', 'security', 'wiederanlauf', 'strategie'],
    reading: 7,
    body: [
      {
        type: 'paragraph',
        text: 'Über Ransomware wird viel geredet, fast immer aus der Schutz-Perspektive: Firewall, Endpoint-Schutz, Awareness-Schulung. Das ist alles richtig und gehört dazu. Aber es beantwortet die falsche Frage. Die richtige Frage lautet nicht „Wie halten wir den Angreifer draußen?" — sondern „Wenn es uns trifft, wie schnell sind wir wieder arbeitsfähig?". Denn treffen kann es jeden. Die Statistik ist eindeutig, und kein Mittelständler ist zu klein, um interessant zu sein.',
      },
      {
        type: 'paragraph',
        text: [
          'Wenn du eine grobe Hausnummer brauchst, was ein Tag Stillstand dein Haus kostet: Der ',
          { kind: 'link', href: '/werkzeuge/cyber-schaden', text: 'Stillstand-Rechner' },
          ' ordnet das in drei Angaben ein — Umsatz, IT-Abhängigkeit, Vorbereitung. Keine Anmeldung, eine Minute.',
        ],
      },
      { type: 'heading', level: 2, text: 'Schutz ist die halbe Miete — Wiederanlauf die andere' },
      {
        type: 'paragraph',
        text: [
          'Prävention senkt die Wahrscheinlichkeit, dass es passiert. Wiederanlauf entscheidet, was es kostet, wenn es trotzdem passiert. Beides braucht es. Wer nur in Prävention investiert, hat im Ernstfall trotzdem ein verschlüsseltes Haus — nur eben ein gut verteidigtes verschlüsseltes Haus. Was dann zählt, ist ',
          { kind: 'link', href: '/lexikon/bcm', text: 'Business Continuity Management' },
          ': der nüchterne Plan, wie der Betrieb weiterläuft, während die IT brennt.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Das ist keine Panikmache. ',
          { kind: 'link', href: '/lexikon/ransomware', text: 'Ransomware' },
          ' verschlüsselt deine Daten und fordert Lösegeld. Modern kommt fast immer ein zweiter Hebel dazu: Die Angreifer kopieren die Daten vorher ab und drohen mit Veröffentlichung. Zahlen ist keine verlässliche Lösung — selbst nach Zahlung kommen die Daten oft nur unvollständig zurück, und du hast einer kriminellen Organisation gerade bewiesen, dass sich der Angriff lohnt.',
        ],
      },
      { type: 'heading', level: 2, text: 'RTO und RPO — die zwei Zahlen, die alles steuern' },
      {
        type: 'paragraph',
        text: 'Bevor du über Backups oder Tools redest, brauchst du zwei Zahlen. Sie klingen technisch, sind aber im Kern Geschäftsentscheidungen — und sie gehören auf den Tisch der Geschäftsführung, nicht in die IT-Abteilung allein.',
      },
      {
        type: 'list',
        items: [
          'RTO (Recovery Time Objective): Wie lange darf ein Prozess maximal stillstehen, bevor es wirklich wehtut? Antwort in Stunden oder Tagen, pro Prozess.',
          'RPO (Recovery Point Objective): Wie viel Datenverlust ist verkraftbar? Antwort in Zeit — eine Stunde Arbeit nachträglich wiederholen ist etwas anderes als ein ganzer Tag.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Beide Zahlen unterscheiden sich pro Prozess. Die Produktionssteuerung darf vielleicht zwei Stunden stillstehen, die Lohnbuchhaltung drei Tage. Wer für alles dieselbe Anforderung setzt, zahlt entweder zu viel oder schützt das Falsche. Eine grobe Einordnung, wie das aussehen kann:',
      },
      {
        type: 'table',
        headers: ['Prozess-Kritikalität', 'Typische RTO', 'Typische RPO', 'Was das bedeutet'],
        rows: [
          ['Geschäftskritisch (z. B. Produktion, Auftragsannahme)', '< 4 Stunden', '< 1 Stunde', 'Redundanz und häufige Sicherung, schneller Wiederanlauf geübt.'],
          ['Wichtig (z. B. Buchhaltung, CRM)', '1 Arbeitstag', '< 1 Tag', 'Tägliche Sicherung reicht, Wiederanlauf dokumentiert.'],
          ['Unkritisch (z. B. Archiv, interne Wikis)', 'Mehrere Tage', 'Mehrere Tage', 'Standard-Backup, kein Sonderaufwand nötig.'],
        ],
      },
      {
        type: 'paragraph',
        text: 'Die Zahlen in der Tabelle sind Richtwerte, keine Vorschrift. Der Wert der Übung liegt nicht in der perfekten Zahl, sondern darin, dass ihr euch einmal pro Prozess festlegt. Das allein bringt mehr Klarheit als jedes gekaufte Tool.',
      },
      { type: 'heading', level: 2, text: 'Das Backup, das einen Ransomware-Angriff übersteht' },
      {
        type: 'paragraph',
        text: 'Fast jeder hat ein Backup. Fast keiner hat ein Backup, das einen Ransomware-Angriff übersteht. Der Unterschied entscheidet im Ernstfall über Wochen Stillstand oder einen Tag. Moderne Ransomware sucht gezielt nach Backups und verschlüsselt sie mit — ein Backup auf demselben Netz, auf das der verschlüsselnde Account Zugriff hat, ist im Zweifel mit weg.',
      },
      { type: 'heading', level: 3, text: 'Die 3-2-1-Regel als Minimum' },
      {
        type: 'paragraph',
        text: 'Die Faustregel ist alt, aber sie hält: drei Kopien deiner Daten, auf zwei verschiedenen Medientypen, eine davon außer Haus. Das schützt nicht nur gegen Ransomware, sondern auch gegen Brand, Diebstahl und den schlichten Hardware-Tod. Sie ist das Minimum, nicht das Ziel.',
      },
      { type: 'heading', level: 3, text: 'Offline und immutable — der entscheidende Zusatz' },
      {
        type: 'paragraph',
        text: 'Gegen Ransomware reicht 3-2-1 allein nicht. Es braucht mindestens eine Kopie, an die der Angreifer nicht herankommt. Zwei Wege führen dahin: Offline (physisch getrennt, etwa ein Band oder eine Platte, die nach dem Backup abgeklemmt wird) oder immutable (unveränderlich für einen festgelegten Zeitraum — einmal geschrieben, lässt es sich bis zum Ablauf der Frist nicht löschen oder überschreiben, auch nicht von einem Admin-Account). Immutable Storage gibt es inzwischen bei jedem ernsthaften Backup-Anbieter und in der Cloud. Das ist der eine Hebel, der im Ernstfall wirklich den Unterschied macht.',
      },
      {
        type: 'paragraph',
        text: 'Und der Punkt, an dem die meisten scheitern: Ein Backup, das nie zurückgespielt wurde, ist kein Backup, sondern eine Hoffnung. Restores gehören geübt — regelmäßig, mit Stoppuhr, gegen die RTO. Erst der getestete Restore beweist, dass die Zahl auf dem Papier in der Realität hält.',
      },
      { type: 'heading', level: 2, text: 'Der Wiederanlaufplan — geübt, nicht abgeheftet' },
      {
        type: 'paragraph',
        text: 'Ein Wiederanlaufplan, der im Ordner liegt und nie durchgespielt wurde, fällt im Ernstfall auseinander. Im Ernstfall ist Stress, oft sind Systeme aus, die E-Mail funktioniert nicht, und der eine Mensch, der alles weiß, ist im Urlaub. Genau dafür wird geprobt, bevor es ernst wird.',
      },
      {
        type: 'paragraph',
        text: 'Ein belastbarer Plan beantwortet vor dem Ernstfall die unbequemen Fragen:',
      },
      {
        type: 'list',
        items: [
          'Wer entscheidet was, und wer vertritt diese Person, wenn sie nicht erreichbar ist?',
          'Wie kommunizieren wir, wenn E-Mail und Telefonanlage Teil des Angriffs sind? (Kontaktliste auf Papier, alternativer Kanal.)',
          'In welcher Reihenfolge fahren wir Systeme wieder hoch? Erst die Identität, dann die kritischen Prozesse — nicht durcheinander.',
          'Ab wann und wie melden wir den Vorfall — an Behörden, Versicherung, betroffene Kunden?',
          'Wer darf, falls überhaupt, mit den Angreifern kommunizieren, und wer wird vorher hinzugezogen?',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Wenn dein Unternehmen unter ',
          { kind: 'link', href: '/lexikon/nis2', text: 'NIS2' },
          ' fällt, ist der geübte Meldeweg ohnehin Pflicht — erhebliche Vorfälle müssen kurzfristig gemeldet werden, und das geht nur mit einem Prozess, der vorher steht. Eine bestehende ',
          { kind: 'link', href: '/lexikon/iso-27001', text: 'ISO 27001' },
          '-Struktur deckt die Notfallvorsorge in weiten Teilen schon ab. Wer hier sauber aufgestellt ist, hat den Wiederanlauf nicht obendrauf, sondern eingebaut.',
        ],
      },
      { type: 'heading', level: 2, text: 'Was die meisten unterschätzen' },
      {
        type: 'paragraph',
        text: 'Drei Dinge sehe ich immer wieder. Erstens: Das Backup läuft, aber niemand hat je einen vollständigen Restore unter Zeitdruck getestet. Zweitens: Die RTO/RPO-Frage wurde nie gestellt, also gilt implizit „alles ist gleich wichtig" — was im Ernstfall heißt, dass die Reihenfolge improvisiert wird. Drittens: Der Plan kennt die Technik, aber nicht die Menschen — wer ruft wen an, wenn das interne Verzeichnis verschlüsselt ist?',
      },
      {
        type: 'paragraph',
        text: 'Keiner dieser Punkte kostet viel Geld. Sie kosten ein paar Tage Vorbereitung und die Bereitschaft, einmal ernsthaft durchzuspielen, was niemand erleben will. Das ist die günstigste Versicherung, die es gibt.',
      },
      { type: 'heading', level: 2, text: 'Der pragmatische Einstieg' },
      {
        type: 'paragraph',
        text: [
          'Du musst nicht alles auf einmal lösen. Der Einstieg ist ein Lagebild: Welche Prozesse sind wirklich kritisch, wie steht es um Backup und Restore, und wo klafft die größte Lücke zwischen dem, was ihr glaubt, und dem, was im Ernstfall hält. Genau das schauen wir uns bei der ',
          { kind: 'link', href: '/leistungen/strategie', text: 'Digitalen Transformation, Change & Security' },
          ' an — nüchtern, priorisiert, ohne Schreckens-Folien.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Wenn du wissen willst, wie schnell dein Haus nach einem Treffer wieder läuft — und wo es klemmt, bevor es ernst wird, ',
          { kind: 'link', href: '/lagebild', text: 'fordere ein digitales Lagebild an' },
          '. 30 Minuten, ehrliche Einschätzung, klare nächste Schritte. Ohne Panikmache, ohne Tool-Verkauf.',
        ],
      },
    ],
    takeaways: [
      'Prävention senkt die Wahrscheinlichkeit, Wiederanlauf senkt den Schaden. Du brauchst beides — die entscheidende Frage ist „wie schnell wieder arbeitsfähig", nicht nur „wie halten wir den Angreifer draußen".',
      'RTO und RPO pro Prozess festlegen: Wie lange darf er stillstehen, wie viel Datenverlust ist verkraftbar? Das sind Geschäftsentscheidungen, nicht IT-Tickets.',
      '3-2-1-Backup ist das Minimum. Gegen Ransomware braucht es zusätzlich eine offline oder immutable Kopie, an die der Angreifer nicht herankommt.',
      'Ein nie getesteter Restore ist eine Hoffnung, kein Backup. Restore und Wiederanlaufplan gehören geübt — mit Stoppuhr, gegen die RTO, inklusive der Frage, wer wen erreicht, wenn die IT brennt.',
    ],
  },
  {
    kind: 'internal',
    slug: 'cyber-versicherung-fragebogen',
    title: 'Cyber-Versicherung: Warum der Fragebogen eure Security-Checkliste ist.',
    date: '2026-06-15',
    excerpt:
      'Der Antragsfragebogen einer Cyber-Police fragt MFA, Backups, EDR, Patches, Awareness und Notfallplan ab. Das ist faktisch eine Mindest-Checkliste — erst das Niveau heben, dann versichern.',
    seoTitle: 'Cyber-Versicherung: Der Fragebogen als Check',
    seoDescription: 'Der Fragebogen einer Cyber-Police fragt MFA, Backups, EDR, Patches, Awareness und Notfallplan ab – faktisch eine Mindest-Checkliste vor dem Abschluss.',
    tags: ['cyber-versicherung', 'security', 'mfa', 'bcm', 'strategie'],
    reading: 6,
    body: [
      {
        type: 'paragraph',
        text: [
          'Die meisten Mittelständler stoßen auf ihre eigene Security-Lage nicht über einen Auditor, sondern über einen Versicherungsmakler. Der Auslöser ist ein Antragsformular für eine ',
          { kind: 'link', href: '/lexikon/cyber-versicherung', text: 'Cyber-Versicherung' },
          '. Vier Seiten, dreißig Fragen, und plötzlich steht schwarz auf weiß, was im Haus fehlt. Das ist kein Zufall. Der Fragebogen ist nichts anderes als eine Mindest-Checkliste für brauchbare Sicherheits-Hygiene — die Versicherer haben sie nur vor euch ausgefüllt.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Ich sehe das in fast jedem Mandat. Erst der Druck der Police bringt Themen auf den Tisch, die jahrelang als „später" gelaufen sind. Insofern ist die Cyber-Versicherung der vielleicht ehrlichste Treiber für Security im Mittelstand. Nicht aus Einsicht, sondern weil der Markt sonst nicht zeichnet.',
      },
      { type: 'heading', level: 2, text: 'Warum der Markt härter geworden ist' },
      {
        type: 'paragraph',
        text: [
          'Vor ein paar Jahren bekam man eine Cyber-Police fast nebenbei. Ein paar Ankreuzfragen, fertig. Das ist vorbei. Die Schadenwelle durch ',
          { kind: 'link', href: '/lexikon/ransomware', text: 'Ransomware' },
          ' hat die Versicherer Geld gekostet, und sie haben reagiert. Heute prüfen sie den technischen Reifegrad vor der Zeichnung — und sie prüfen ihn wieder, wenn ein Schaden eintritt.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Das hat eine unangenehme Konsequenz. Wer den Fragebogen optimistisch ausfüllt, um die Police zu bekommen, hat keine Versicherung gekauft, sondern ein Risiko. Stimmen die Angaben im Schadenfall nicht mit der Realität überein, ist die Deckung in Gefahr — Stichwort Obliegenheitsverletzung. Du zahlst die Prämie und stehst am Ende trotzdem allein da.',
      },
      { type: 'heading', level: 2, text: 'Der Fragebogen, übersetzt in Klartext' },
      {
        type: 'paragraph',
        text: 'Die Formulare unterscheiden sich im Detail, aber die Substanz ist überall gleich. Sechs Blöcke tauchen praktisch immer auf. Lies sie nicht als Versicherungsfragen, sondern als Maßnahmenliste:',
      },
      {
        type: 'table',
        headers: ['Was der Fragebogen fragt', 'Welche Maßnahme dahintersteht'],
        rows: [
          ['Ist MFA für alle Remote-Zugänge und Admins aktiv?', 'Multi-Faktor-Authentifizierung flächendeckend — der wirksamste Einzelschutz gegen Kontoübernahme.'],
          ['Werden Backups regelmäßig erstellt und getestet?', 'Eine Backup-Strategie nach 3-2-1, offline-fähig und im Ernstfall geprobt — nicht nur eingerichtet.'],
          ['Läuft EDR/Antivirus auf allen Endpunkten?', 'Endpoint Detection & Response statt klassischem Virenscanner — Angriffe erkennen, nicht nur Signaturen abgleichen.'],
          ['Wie schnell werden kritische Patches eingespielt?', 'Geregeltes Patch-Management mit Fristen — bekannte Lücken sind das häufigste Einfallstor.'],
          ['Gibt es Awareness-Schulungen für Mitarbeitende?', 'Regelmäßige Sensibilisierung gegen Phishing und Social Engineering — der Mensch bleibt das erste Ziel.'],
          ['Existiert ein Notfall- und Wiederanlaufplan?', 'Ein belastbarer Incident-Response- und Wiederanlaufplan — geübt, nicht nur abgeheftet.'],
        ],
      },
      {
        type: 'paragraph',
        text: 'Sechs Zeilen. Wer die ehrlich mit „ja, nachweisbar" beantworten kann, hat ein solides Sicherheits-Fundament. Wer an drei Zeilen ins Stocken gerät, kennt jetzt seine Roadmap.',
      },
      { type: 'heading', level: 2, text: 'Die drei Stellen, an denen es im Mittelstand klemmt' },
      { type: 'heading', level: 3, text: 'MFA ist da, aber nicht überall' },
      {
        type: 'paragraph',
        text: [
          { kind: 'link', href: '/lexikon/mfa', text: 'MFA' },
          ' ist meist für das Webmail aktiv, aber nicht für den VPN-Zugang, nicht für die Admin-Konten und nicht für den alten Terminalserver, den keiner mehr auf dem Schirm hat. Genau die Lücken sucht ein Angreifer. Der Fragebogen fragt nach „allen" Zugängen, und „alle" heißt alle.',
        ],
      },
      { type: 'heading', level: 3, text: 'Backups laufen, aber niemand hat den Ernstfall geprobt' },
      {
        type: 'paragraph',
        text: [
          'Eine Sicherung, die nie zurückgespielt wurde, ist eine Vermutung, keine Sicherheit. Moderne Ransomware verschlüsselt gezielt auch die Backups. Wer keine offline- oder unveränderbare Kopie hat und den Wiederanlauf nicht mindestens einmal durchgespielt hat, hat im Schadenfall ein Problem. Die ',
          { kind: 'link', href: '/lexikon/backup-321', text: '3-2-1-Regel' },
          ' ist hier kein Dogma, sondern das Minimum.',
        ],
      },
      { type: 'heading', level: 3, text: 'Den Notfallplan gibt es nur im Kopf des IT-Leiters' },
      {
        type: 'paragraph',
        text: [
          'Wenn der Wiederanlaufplan eine ungeschriebene Annahme ist, fällt er genau dann aus, wenn der IT-Leiter im Urlaub ist und das Telefon klingelt. Hier hilft ein nüchterner Blick auf ',
          { kind: 'link', href: '/lexikon/bcm', text: 'Business Continuity Management' },
          ': Welche Prozesse müssen in welcher Zeit wieder laufen, wer entscheidet, wer meldet. Das muss nicht dick sein. Es muss nur existieren und geübt sein.',
        ],
      },
      { type: 'heading', level: 2, text: 'Reihenfolge: erst das Niveau, dann die Police' },
      {
        type: 'paragraph',
        text: 'Der teuerste Fehler ist, die Police zu nehmen, wie sie gerade zu bekommen ist, und die Lücken offenzulassen. Die richtige Reihenfolge ist umgekehrt:',
      },
      {
        type: 'list',
        items: [
          'Fragebogen nüchtern durchgehen und ehrlich beantworten — jede Frage, die ein „eher nicht" auslöst, ist ein Befund.',
          'Die Lücken in eine kleine Roadmap übersetzen und nach Wirkung priorisieren — MFA und getestete Backups zuerst, sie schlagen am stärksten durch.',
          'Erst dann zeichnen — mit Angaben, die im Schadenfall standhalten, und damit zu Konditionen, die ein gehobenes Niveau honorieren.',
          'Den Stand dokumentieren, damit die jährliche Erneuerung kein Ratespiel wird.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Der Nebeneffekt ist angenehm: Ein höheres Sicherheitsniveau senkt nicht nur das Risiko, es senkt oft auch die Prämie und erweitert die Deckung. Die Investition in die Maßnahmen zahlt also doppelt — einmal in Schutz, einmal in besseren Vertragskonditionen.',
      },
      {
        type: 'quote',
        text: 'Eine Cyber-Police ersetzt keine Sicherheit. Sie federt den Restschaden ab, nachdem die Hygiene gegriffen hat. Wer das verwechselt, kauft ein teures Stück Papier.',
      },
      { type: 'heading', level: 2, text: 'Versicherung ist die letzte Schicht, nicht die erste' },
      {
        type: 'paragraph',
        text: [
          'Die Police steht am Ende einer Kette, nicht am Anfang. Davor liegen die technischen und organisatorischen Maßnahmen, die den Schaden überhaupt erst unwahrscheinlich machen. Wer ohnehin in Richtung ',
          { kind: 'link', href: '/lexikon/isms', text: 'ISMS' },
          ', ',
          { kind: 'link', href: '/lexikon/nis2', text: 'NIS2' },
          ' oder ISO 27001 unterwegs ist, erfüllt den Versicherungsfragebogen fast nebenbei — die Anforderungen überlappen zu großen Teilen.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Wenn du wissen willst, wo dein Haus auf dem Fragebogen ehrlich steht, ist der ',
          { kind: 'link', href: '/werkzeuge/iso-27001-readiness', text: 'ISO-27001-Readiness-Check' },
          ' ein guter erster Aufschlag — er deckt dieselben Maßnahmen strukturiert ab. Die saubere Einordnung deiner Lage, die Lücken zur Police und die priorisierten ersten Schritte klären wir im Lagebild. Das ist Teil von ',
          { kind: 'link', href: '/leistungen/strategie', text: 'Digitale Transformation, Change & Security' },
          '.',
        ],
      },
      {
        type: 'paragraph',
        text: [
          'Du hast einen Fragebogen auf dem Tisch und bist unsicher, was du guten Gewissens ankreuzen kannst? ',
          { kind: 'link', href: '/kontakt', text: 'Frag eine 30-Minuten-Einschätzung an' },
          '. Wir gehen die sechs Blöcke durch — ehrlich, ohne Panikmache, ohne Tool-Verkauf.',
        ],
      },
    ],
    takeaways: [
      'Der Antragsfragebogen einer Cyber-Police ist faktisch eine Mindest-Checkliste: MFA, Backups, EDR, Patch-Management, Awareness, Notfallplan.',
      'Reihenfolge zählt — erst das Sicherheitsniveau heben, dann zeichnen. Sonst drohen Deckungslücken und Obliegenheitsverletzung im Schadenfall.',
      'Die drei häufigsten Lücken im Mittelstand: MFA nicht flächendeckend, Backups nie getestet, Notfallplan nur im Kopf.',
      'Ein höheres Niveau zahlt doppelt: weniger Risiko und meist bessere Prämie sowie Deckung.',
      'Die Police ist die letzte Schicht, nicht die erste. ISMS, NIS2 oder ISO 27001 erfüllen den Fragebogen fast nebenbei.',
    ],
  },
  {
    kind: 'internal',
    slug: 'drei-jahre-neuausrichtung',
    title: 'Drei Jahre Braum Consulting. Was hat funktioniert, was nicht, wohin es jetzt geht.',
    date: '2026-05-16',
    excerpt:
      'Braum Consulting wird drei. Ehrliche Bilanz, neue Aufstellung als digitaler Lotse für den Industriemittelstand. Vier Felder, ein Ansprechpartner, kein Berater-Theater.',
    seoTitle: 'Drei Jahre Braum Consulting: eine Bilanz',
    seoDescription: 'Braum Consulting wird drei: ehrliche Bilanz und neue Aufstellung als digitaler Lotse für den Mittelstand. Vier Felder, ein Ansprechpartner.',
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
    seoTitle: 'Sichtbar in KI-Antworten: SEO reicht nicht',
    seoDescription: 'AI Overviews, ChatGPT, Perplexity: Wer auf Platz 1 rankt, steht nicht automatisch in der Antwort. Was GEO und LLMO bedeuten und wo du anfängst.',
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
    seoTitle: 'Copilot im Mittelstand: was wirklich hilft',
    seoDescription: 'Copilot einschalten ist einfach, sinnvoll einsetzen nicht. Was im KMU-Alltag Arbeit abnimmt – und warum Berechtigungen wichtiger sind als die Lizenz.',
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
    updated: '2026-11-11',
    excerpt:
      'Die Übergangsfrist auf die 2022er-Version ist abgelaufen. Was sich konkret geändert hat, was die meisten KMU jetzt im ISMS nachholen — und wie das Verhältnis zu NIS-2 und TISAX aussieht.',
    seoTitle: 'ISO 27001:2022 – was 2026 im ISMS gilt',
    seoDescription: 'Die Übergangsfrist auf ISO 27001:2022 ist abgelaufen. Was sich geändert hat, was KMU im ISMS nachholen und wie es zu NIS-2 und TISAX steht.',
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
        text: 'Die NIS-2-Richtlinie gilt EU-weit seit Oktober 2024 und betrifft tausende deutsche Mittelständler und Zulieferer. Eine bestehende ISO-27001-Zertifizierung deckt rund 70-80 Prozent der NIS-2-Anforderungen ab — die restlichen 20-30 sind meldepflicht-spezifische Themen (Vorfall-Meldung in 24 Stunden, Lieferketten-Anforderungen).',
      },
      {
        type: 'paragraph',
        text: 'Update November 2026: Hier stand ursprünglich „NIS-2 ist seit 2024 in Kraft“. Genauer: Die EU-Richtlinie gilt seit dem 18. Oktober 2024. In Deutschland ist das NIS-2-Umsetzungsgesetz seit dem 6. Dezember 2025 in Kraft.',
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
    updated: '2026-11-12',
    excerpt:
      'NIS2 verunsichert tausende Mittelständler. Drei nüchterne Fragen klären, ob du direkt, mittelbar oder gar nicht betroffen bist — und was die ersten Schritte sind.',
    seoTitle: 'NIS2: Bin ich betroffen? Die Kurzprüfung',
    seoDescription: 'Drei nüchterne Fragen klären, ob dein Betrieb direkt, mittelbar oder gar nicht von NIS2 betroffen ist – und was die ersten Schritte sind.',
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
        text: 'Update November 2026: Das deutsche NIS-2-Umsetzungsgesetz ist seit dem 6. Dezember 2025 in Kraft. Betroffene Unternehmen müssen sich beim BSI registrieren, die Frist dafür beträgt drei Monate. Die Stellen, an denen der Text noch vom ausstehenden Gesetz sprach, sind angepasst.',
      },
      {
        type: 'paragraph',
        text: [
          'Lieber direkt ausprobieren? Der ',
          { kind: 'link', href: '/werkzeuge/nis2-betroffenheit', text: 'NIS2-Betroffenheits-Check' },
          ' führt dich in vier kurzen Fragen durch genau diese Prüfung — ohne Anmeldung, in zwei Minuten.',
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
        text: 'Die Faustregel: mindestens 50 Mitarbeitende oder Umsatz und Bilanzsumme von je über 10 Mio. €. Darunter fällst du in der Regel nicht unter die direkten Pflichten — es sei denn, du bist ein besonders kritischer Anbieter (etwa Betreiber einer kritischen Anlage, im TK- oder Vertrauensdienst-Bereich). Wichtig: Es geht um das Gesamtunternehmen, nicht um die IT-Abteilung. Partner- und verbundene Unternehmen zählen mit, außer ihr seid bei IT-Systemen und Prozessen unabhängig voneinander (§ 28 Abs. 4 BSIG).',
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
          '„Wir warten erst mal ab." — Das Gesetz gilt seit Dezember 2025, und Kunden fragen die Nachweise ohnehin ab.',
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
      'Betroffenheit hängt an drei Dingen: Größe (ab 50 MA oder je über 10 Mio. € Umsatz und Bilanzsumme), Sektor (18 gelistete) und Lieferkette.',
      'Der meistübersehene Fall: mittelbar betroffen als Zulieferer — die Anforderungen kommen per Vertrag, nicht per Gesetz.',
      'NIS2 verlangt belegbare Maßnahmen, kein Zertifikat. Eine bestehende ISO 27001 deckt viel davon ab; Registrierung und Meldepflichten kommen dazu.',
      'Nicht warten: Das deutsche Gesetz gilt seit 6. Dezember 2025, und Kunden fragen Nachweise längst ab.',
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
    seoTitle: 'Was eine M365-Migration wirklich kostet',
    seoDescription: 'Eine Pauschale wäre gelogen. Was eine Microsoft-365-Migration im Mittelstand treibt: die fünf Kostenfaktoren, und wo du sparen kannst und wo nicht.',
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
/**
 * Tag-Seiten mit weniger Beiträgen sind dünner Content: Sie bleiben
 * erreichbar (follow), werden aber nicht indexiert und fehlen in der Sitemap.
 */
export const TAG_INDEX_MIN_POSTS = 3

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
