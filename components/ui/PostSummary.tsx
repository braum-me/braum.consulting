/**
 * TL;DR-Box oben in jedem Blog-Post.
 * Server-Component. Brand-Akzent links, Mono-Eyebrow oben.
 * AI/LLM-freundlich: klare Struktur, leichter Parseable Hook.
 */

interface PostSummaryProps {
  text: string
}

export default function PostSummary({ text }: PostSummaryProps) {
  return (
    <aside
      aria-label="TL;DR"
      className="not-prose mb-12 mt-2"
      style={{
        padding: '20px 24px',
        background:
          'linear-gradient(145deg, rgba(220, 128, 68, 0.06), rgba(146, 48, 30, 0.03))',
        border: '1px solid rgba(220, 128, 68, 0.25)',
        borderLeft: '3px solid var(--accent)',
        borderRadius: 'var(--r-sm)',
      }}
    >
      <p
        className="font-mono uppercase"
        style={{
          fontSize: 10,
          letterSpacing: '0.22em',
          color: 'var(--brand)',
          marginBottom: 10,
        }}
      >
        TL;DR
      </p>
      <p
        className="font-body"
        style={{
          fontSize: 16,
          lineHeight: 1.6,
          color: 'var(--fg-default)',
          margin: 0,
        }}
      >
        {text}
      </p>
    </aside>
  )
}
