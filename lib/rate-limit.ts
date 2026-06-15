/**
 * Simple in-memory token-bucket rate-limiter (MVP).
 * Pro Key (üblich: IP-Adresse) wird ein Bucket gehalten.
 *
 * Geltungsbereich / Produktionsrisiko:
 *   Der Bucket-State liegt im Prozess-Speicher. Bei EINER Instanz (aktuelles
 *   Coolify-Setup, 1 Replika) ist das korrekt und ausreichend. Sobald horizontal
 *   skaliert wird (mehrere Replikas / serverlose Lambdas), gilt das Limit PRO
 *   INSTANZ — das effektive Limit multipliziert sich mit der Instanzzahl, und
 *   ein Angreifer kann durch Load-Balancing zwischen Instanzen mehr Requests
 *   durchbringen. Auch ein Neustart/Deploy leert alle Buckets.
 *
 *   Migrationspfad ohne Call-Site-Änderung: `consume()` durch eine Variante mit
 *   gemeinsamem Store (Redis / Upstash) ersetzen — gleiche Signatur, Buckets
 *   atomar im Store statt in der Map. Bis dahin: Single-Replika beibehalten
 *   (siehe COOLIFY.md / Launch-Runbook).
 */

interface Bucket {
  tokens:     number
  lastRefill: number
}

const buckets = new Map<string, Bucket>()

/** capacity tokens, refilling at `refillPerHour` per hour */
export function consume(
  key: string,
  capacity = 5,
  refillPerHour = 5,
): { allowed: boolean; remaining: number; retryAfterSeconds: number } {
  const now = Date.now()
  const refillRatePerMs = refillPerHour / (60 * 60 * 1000)

  let b = buckets.get(key)
  if (!b) {
    b = { tokens: capacity, lastRefill: now }
    buckets.set(key, b)
  }

  // refill since last visit
  const elapsed = now - b.lastRefill
  const refill = elapsed * refillRatePerMs
  b.tokens = Math.min(capacity, b.tokens + refill)
  b.lastRefill = now

  if (b.tokens >= 1) {
    b.tokens -= 1
    return {
      allowed: true,
      remaining: Math.floor(b.tokens),
      retryAfterSeconds: 0,
    }
  }

  // tokens left under 1, calculate when next token will be available
  const missing = 1 - b.tokens
  const retryAfterMs = missing / refillRatePerMs
  return {
    allowed: false,
    remaining: 0,
    retryAfterSeconds: Math.ceil(retryAfterMs / 1000),
  }
}

/** Cleanup-helper für Tests/Long-Running-Prozesse */
export function _resetRateLimit() {
  buckets.clear()
}
