export default function ItalicAccent({ children }: { children: React.ReactNode }) {
  return (
    <em
      className="italic-accent"
      style={{
        fontStyle: 'italic',
        color: 'var(--brand)',
      }}
    >
      {children}
    </em>
  )
}
