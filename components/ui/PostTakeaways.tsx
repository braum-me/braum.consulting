/**
 * Key-Takeaways-Box am Ende von Blog-Posts.
 * Server-Component. Auch als <ItemList> JSON-LD im Page-Schema für
 * AI/LLM-Discovery — Chat-Assistenten erkennen die Liste klar.
 */

import { CheckCircle2 } from 'lucide-react'

interface PostTakeawaysProps {
  items: string[]
}

export default function PostTakeaways({ items }: PostTakeawaysProps) {
  if (items.length === 0) return null

  return (
    <aside
      aria-label="Key Takeaways"
      className="not-prose mt-16"
      style={{
        padding: '28px 30px',
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--r-md)',
      }}
    >
      <p
        className="font-mono uppercase"
        style={{
          fontSize: 10,
          letterSpacing: '0.22em',
          color: 'var(--brand)',
          marginBottom: 18,
        }}
      >
        Key Takeaways
      </p>
      <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {items.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-3"
            style={{
              padding: '12px 0',
              borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)',
            }}
          >
            <span
              className="inline-flex shrink-0 items-center justify-center"
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                background: 'rgba(220, 128, 68, 0.10)',
                border: '1px solid rgba(220, 128, 68, 0.30)',
                color: 'var(--brand)',
                marginTop: 2,
              }}
            >
              <CheckCircle2 size={13} strokeWidth={1.8} />
            </span>
            <p
              className="font-body"
              style={{
                fontSize: 16,
                lineHeight: 1.55,
                color: 'var(--fg-default)',
                margin: 0,
              }}
            >
              {item}
            </p>
          </li>
        ))}
      </ol>
    </aside>
  )
}
