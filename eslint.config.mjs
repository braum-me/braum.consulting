// ESLint 9 Flat Config. eslint-config-next v16 liefert native Flat-Config-Arrays
// (./core-web-vitals + ./typescript) — direkt einbinden, kein FlatCompat nötig.
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypeScript from 'eslint-config-next/typescript'

const eslintConfig = [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'out/**',
      'next-env.d.ts',
      'e2e/**',
      'playwright.config.ts',
      'public/**',
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    // Tuning ohne Code-Refactor: Regeln, die erst mit eslint-config-next v16 /
    // dem neuen react-hooks-Plugin als ERROR dazukamen und über den ganzen
    // (bislang ungelinteten) Bestand feuern, auf warn/off setzen. So bleibt
    // `pnpm lint` aussagekräftig (echte Fehler tauchen auf), ohne dass wir
    // funktionierenden Code grossflächig umbauen müssen.
    rules: {
      // Rein stilistisch (DE-Texte mit ', ", > in JSX) — kein Sicherheits-/Bug-Risiko.
      'react/no-unescaped-entities': 'off',
      // Sehr neue, aggressive React-Compiler-Ära-Regeln: feuern auf legitime
      // Mount-/Measure-/Init-Patterns. Als Hinweis behalten, nicht als Blocker.
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/purity': 'warn',
      'react-hooks/refs': 'warn',
      // Feuert u.a. auf den bewusst seeded PRNG in HeroParticles (lokale
      // Mutation im useMemo, kein echter Purity-Verstoß) — gleiche Familie.
      'react-hooks/immutability': 'warn',
    },
  },
]

export default eslintConfig
