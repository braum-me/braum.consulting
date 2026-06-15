export default function ItalicAccent({ children }: { children: React.ReactNode }) {
  return (
    <em
      className="italic-accent"
      style={{
        fontFamily: '"Instrument Serif", Georgia, serif',
        fontStyle: 'italic',
        color: 'var(--brand)',
      }}
    >
      {children}
    </em>
  )
}
