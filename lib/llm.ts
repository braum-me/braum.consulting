/**
 * OpenRouter-Wrapper für Lagebild-Briefing-Generierung.
 *
 * Native fetch, kein SDK — OpenRouter ist OpenAI-API-kompatibel.
 * Default-Modell: moonshotai/kimi-k2-0905 (~0.5ct/Briefing bei 8k Tokens).
 * Modell-Wechsel über ENV OPENROUTER_MODEL ohne Code-Änderung.
 *
 * Verwendung:
 *   const briefing = await generateBriefing({ wizard, anrede: 'du' })
 *
 * Fehler-Modi:
 *   - LLMConfigError    (ENV fehlt)
 *   - LLMHttpError      (HTTP non-2xx)
 *   - LLMParseError     (Response nicht parsebar)
 *   - LLMTimeoutError   (>60s)
 */

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'
const DEFAULT_MODEL  = 'moonshotai/kimi-k2-0905'
const TIMEOUT_MS     = 60_000

/**
 * Fallback-Modell-Cascade — wenn das Primary-Modell scheitert (HTTP-Error,
 * Timeout, leere Response), wird das nächste Modell versucht. So bleibt das
 * Lagebild-Briefing robust gegen einzelne Modell-Outages bei OpenRouter.
 */
const FALLBACK_MODELS = [
  'deepseek/deepseek-chat-v3.1',
  'anthropic/claude-sonnet-4.5',
] as const

export class LLMConfigError  extends Error { constructor(m: string) { super(m); this.name = 'LLMConfigError'  } }
export class LLMHttpError    extends Error { constructor(m: string, public status: number) { super(m); this.name = 'LLMHttpError' } }
export class LLMParseError   extends Error { constructor(m: string) { super(m); this.name = 'LLMParseError'   } }
export class LLMTimeoutError extends Error { constructor(m: string) { super(m); this.name = 'LLMTimeoutError' } }

interface ChatMessage {
  role:    'system' | 'user' | 'assistant'
  content: string
}

interface ChatCompletionResponse {
  id:      string
  model:   string
  choices: Array<{
    message:       ChatMessage
    finish_reason: string
  }>
  usage?: {
    prompt_tokens:     number
    completion_tokens: number
    total_tokens:      number
  }
}

export interface LLMCallOptions {
  system:      string
  user:        string
  /** Override default-model, optional. */
  model?:      string
  /** 0.0 (deterministic) ... 1.0 (creative). Default 0.4 (Briefing-Voice stabil). */
  temperature?: number
  /** Max output tokens. Default 4000 (~3000 Wörter Markdown). */
  maxTokens?:  number
}

export interface LLMResult {
  text:   string
  model:  string
  tokens: { prompt: number; completion: number; total: number }
  /** ms vom Request-Start bis Response. */
  latencyMs: number
}

/**
 * Single-Try Chat-Completion gegen OpenRouter.
 * Wirft typed errors statt String-Mess.
 * Wird intern von chatComplete() mit Fallback-Cascade aufgerufen.
 */
async function chatCompleteOnce(opts: LLMCallOptions, model: string): Promise<LLMResult> {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    throw new LLMConfigError('OPENROUTER_API_KEY ist nicht gesetzt.')
  }

  const t0 = Date.now()
  const controller = new AbortController()
  const timeout    = setTimeout(() => controller.abort(), TIMEOUT_MS)

  let response: Response
  try {
    response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type':  'application/json',
        'HTTP-Referer': 'https://braum.consulting',
        'X-Title':      'braum.consulting · Lagebild-Briefing',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: opts.system },
          { role: 'user',   content: opts.user   },
        ] satisfies ChatMessage[],
        temperature: opts.temperature ?? 0.4,
        max_tokens:  opts.maxTokens   ?? 4000,
      }),
      signal: controller.signal,
    })
  } catch (err) {
    clearTimeout(timeout)
    if (err instanceof Error && err.name === 'AbortError') {
      throw new LLMTimeoutError(`LLM-Request abgebrochen nach ${TIMEOUT_MS}ms.`)
    }
    throw err
  } finally {
    clearTimeout(timeout)
  }

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new LLMHttpError(
      `OpenRouter ${response.status} (${model}): ${body.slice(0, 500)}`,
      response.status,
    )
  }

  let data: ChatCompletionResponse
  try {
    data = await response.json() as ChatCompletionResponse
  } catch {
    throw new LLMParseError(`OpenRouter-Response (${model}) war kein gültiges JSON.`)
  }

  const text = data.choices?.[0]?.message?.content
  if (!text) {
    throw new LLMParseError(`OpenRouter-Response (${model}) enthielt keinen Text.`)
  }

  return {
    text,
    model: data.model,
    tokens: {
      prompt:     data.usage?.prompt_tokens     ?? 0,
      completion: data.usage?.completion_tokens ?? 0,
      total:      data.usage?.total_tokens      ?? 0,
    },
    latencyMs: Date.now() - t0,
  }
}

/**
 * Chat-Completion mit Fallback-Cascade:
 *   1. Primary: opts.model || OPENROUTER_MODEL || DEFAULT_MODEL
 *   2. FALLBACK_MODELS in Reihenfolge
 *
 * Wenn der erste Versuch HttpError/TimeoutError/ParseError wirft, geht's
 * zum nächsten Modell. ConfigError (kein API-Key) wird sofort propagiert.
 *
 * Wenn alle Modelle scheitern, wird der letzte Error des letzten Modells
 * geworfen — Caller bekommt die echte Fehler-Ursache.
 */
export async function chatComplete(opts: LLMCallOptions): Promise<LLMResult> {
  const primary = opts.model ?? process.env.OPENROUTER_MODEL ?? DEFAULT_MODEL
  const chain   = [primary, ...FALLBACK_MODELS.filter(m => m !== primary)]

  let lastErr: unknown = null
  for (const model of chain) {
    try {
      const result = await chatCompleteOnce(opts, model)
      if (model !== primary) {
        console.warn(`[llm] primary "${primary}" failed, used fallback "${model}"`)
      }
      return result
    } catch (err) {
      // ConfigError ist nicht retryable
      if (err instanceof LLMConfigError) throw err
      lastErr = err
      console.warn(`[llm] model "${model}" failed:`, err instanceof Error ? err.message : err)
      // weiter zum nächsten Modell
    }
  }
  throw lastErr ?? new LLMHttpError('Alle LLM-Modelle haben gescheitert.', 0)
}
