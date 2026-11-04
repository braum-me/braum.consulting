'use client'

import { motion } from 'motion/react'
import {
  Layers, Sparkles, Database, Globe, ShieldCheck, Cloud,
  MessageSquare, Mail, FolderOpen,
  Brain, Bot, Workflow,
  BarChart3, Boxes, FileSpreadsheet,
  Code2, Palette, Image as ImageIcon,
  Lock, KeyRound, Eye,
  Server, Container, Network,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Eyebrow from '@/components/ui/Eyebrow'
import ItalicAccent from '@/components/ui/ItalicAccent'
import AccentGlow from '@/components/ui/AccentGlow'
import { StackPillarVisual, type StackPillarTile } from '@/components/ui/StackPillarVisual'

const EASE = [0.16, 1, 0.3, 1] as const

interface Pillar {
  Icon:    LucideIcon
  eyebrow: string
  title:   string
  context: string
  tools:   string[]
  visual:  {
    primary:   StackPillarTile
    secondary: StackPillarTile
    tertiary:  StackPillarTile
    accent?:   'brand' | 'cool' | 'success'
  }
}

const STACK: Pillar[] = [
  {
    Icon: Layers,
    eyebrow: 'Modern Work & Collaboration',
    title:   'State of the art im Mittelstand.',
    context: 'Was Teams täglich anfassen.',
    tools: [
      'Microsoft 365 · Teams',
      'SharePoint · Exchange Online',
      'OneDrive · Viva',
      'Google Workspace',
      'Power Platform (CoE)',
      'Microsoft Intune',
    ],
    visual: {
      primary:   { Icon: MessageSquare, label: 'Teams · M365' },
      secondary: { Icon: Mail,          label: 'Exchange'    },
      tertiary:  { Icon: FolderOpen,    label: 'SharePoint'  },
      accent:    'brand',
    },
  },
  {
    Icon: Sparkles,
    eyebrow: 'AI & Automation',
    title:   'Vom Prompt zum produktiven Workflow.',
    context: 'AI als Werkzeug, nicht als Theater.',
    tools: [
      'Microsoft Copilot · GenAI',
      'OpenAI · ChatGPT',
      'Claude Enterprise',
      'HeyGen · ElevenLabs · Gamma',
      'Power Automate · n8n',
      'Azure AI · Chatbots',
    ],
    visual: {
      primary:   { Icon: Sparkles, label: 'Copilot · GPT' },
      secondary: { Icon: Brain,    label: 'Claude'        },
      tertiary:  { Icon: Workflow, label: 'n8n · Flow'    },
      accent:    'brand',
    },
  },
  {
    Icon: Database,
    eyebrow: 'Enterprise-Apps & Data',
    title:   'Was im Mittelstand wirklich läuft.',
    context: 'Vom Vertrieb bis ins Reporting.',
    tools: [
      'SAP-Plattform · SuccessFactors',
      'SAP SAC / DWC · Power BI',
      'Microsoft Fabric · Dataverse',
      'Autodesk Inventor + Vault',
      'CIM Database · Adobe Sign',
    ],
    visual: {
      primary:   { Icon: BarChart3,        label: 'Power BI · SAC' },
      secondary: { Icon: Boxes,            label: 'SAP · Fabric'   },
      tertiary:  { Icon: FileSpreadsheet,  label: 'Dataverse'      },
      accent:    'cool',
    },
  },
  {
    Icon: Globe,
    eyebrow: 'Web & CMS',
    title:   'Vom KMU-Site bis zur eigenen Praxis.',
    context: 'Schnell, aber pflegbar.',
    tools: [
      'Next.js 16',
      'Astro 5',
      'React 19',
      'Tailwind 4',
      'WordPress · Elementor',
      'Sanity · Payload · Strapi',
    ],
    visual: {
      primary:   { Icon: Code2,     label: 'Next · React' },
      secondary: { Icon: Palette,   label: 'Tailwind'     },
      tertiary:  { Icon: ImageIcon, label: 'Sanity · WP'  },
      accent:    'brand',
    },
  },
  {
    Icon: ShieldCheck,
    eyebrow: 'IT-Security & IAM',
    title:   'Auditfähig, nicht nur theoretisch.',
    context: 'Was vor dem nächsten Audit hält.',
    tools: [
      'ISO 27001 · TISAX L3 · NIS-2',
      'Zero Trust Architecture',
      'Arctic Wolf SOC · Azure SIEM',
      'Tenfold · Quest IdM',
      'SAML SSO · Azure RBAC · Entra ID',
    ],
    visual: {
      primary:   { Icon: ShieldCheck, label: 'ISO · TISAX'   },
      secondary: { Icon: Lock,        label: 'Zero Trust'    },
      tertiary:  { Icon: KeyRound,    label: 'Entra · SSO'   },
      accent:    'success',
    },
  },
  {
    Icon: Cloud,
    eyebrow: 'Cloud & Infrastruktur',
    title:   'Selbst-gehostet, wo es Sinn macht.',
    context: 'Vom Container bis zum Edge.',
    tools: [
      'Azure Landing Zone',
      'Docker · Kubernetes',
      'Cloudflare · VMware',
      'Coolify · Proxmox',
    ],
    visual: {
      primary:   { Icon: Cloud,     label: 'Azure · CF'  },
      secondary: { Icon: Container, label: 'Docker · K8s' },
      tertiary:  { Icon: Server,    label: 'Proxmox'     },
      accent:    'cool',
    },
  },
]

void Bot; void Network; void Eye

/**
 * UeberStack als Pillars-Grid — analog Section1Architecture in M365Showcase.
 * 7 Säulen-Glass-Cards mit Icon, Eyebrow, Title, Context, Tools-Liste.
 */
export default function UeberStack() {
  return (
    <section
      aria-label="Stack"
      className="relative w-screen overflow-hidden"
      style={{
        marginLeft: 'calc(-50vw + 50%)',
        background: 'var(--bg-base)',
        padding: 'clamp(80px, 10vw, 128px) 0',
      }}
    >
      <AccentGlow position="bottom-left" intensity="low" />

      <div className="relative z-[3] mx-auto w-full max-w-[var(--container-wide)] px-6 md:px-12">
        <div className="max-w-[900px]">
          <Eyebrow num="04">Stack</Eyebrow>
          <h2
            className="mt-8 font-display font-bold"
            style={{
              fontSize: 'clamp(36px, 4.8vw, 64px)',
              lineHeight: 1.05,
              letterSpacing: 'var(--tr-display)',
              color: 'var(--fg-default)',
            }}
          >
            Sechs Säulen, ein <ItalicAccent>Werkzeugkasten</ItalicAccent>.
          </h2>
          <p
            className="mt-6 font-body"
            style={{
              fontSize: '17px',
              lineHeight: 1.65,
              color: 'var(--fg-muted)',
              maxWidth: '680px',
            }}
          >
            Kein „wir können alles", eine kuratierte Auswahl aus Hauptjob
            und eigener Praxis. Was hier steht, habe ich produktiv im Einsatz —
            in der Industrie oder beim KMU.
          </p>
        </div>

        <ul
          className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
          style={{ listStyle: 'none', padding: 0 }}
        >
          {STACK.map((p, i) => (
            <motion.li
              key={p.eyebrow}
              className="glass-card relative h-full overflow-hidden"
              style={{ minHeight: '420px' }}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.55, delay: i * 0.06, ease: EASE }}
            >
              {/* Visual-Stage */}
              <div
                className="relative p-5"
                style={{ borderBottom: '1px solid var(--border-subtle)' }}
              >
                <div className="absolute right-5 top-5 z-[4]">
                  <span
                    className="font-mono uppercase"
                    style={{
                      fontSize: '9px',
                      letterSpacing: '0.18em',
                      color: 'var(--fg-subtle)',
                      padding: '3px 7px',
                      background: 'rgba(15, 14, 12, 0.75)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--r-pill)',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    Säule {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <StackPillarVisual {...p.visual} />
              </div>

              {/* Card-Body */}
              <div className="relative z-[3] flex flex-col" style={{ padding: '24px 28px 28px' }}>
                <p
                  className="font-mono uppercase"
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.18em',
                    color: 'var(--brand)',
                  }}
                >
                  {p.eyebrow}
                </p>
                <h3
                  className="mt-2 font-display font-semibold"
                  style={{
                    fontSize: '20px',
                    lineHeight: 1.2,
                    letterSpacing: 'var(--tr-heading)',
                    color: 'var(--fg-default)',
                  }}
                >
                  {p.title}
                </h3>
                <p
                  className="mt-2 font-body italic"
                  style={{
                    fontSize: '13px',
                    lineHeight: 1.5,
                    color: 'var(--fg-muted)',
                  }}
                >
                  {p.context}
                </p>

                <motion.ul
                  className="mt-auto pt-5"
                  style={{ listStyle: 'none', padding: '16px 0 0', margin: 0 }}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-12%' }}
                  variants={{
                    hidden: {},
                    show: { transition: { staggerChildren: 0.05, delayChildren: 0.3 } },
                  }}
                >
                  {p.tools.map(t => (
                    <motion.li
                      key={t}
                      className="flex items-start gap-2 py-1 font-mono"
                      style={{
                        fontSize: '11px',
                        color: 'var(--fg-default)',
                        letterSpacing: '0.02em',
                      }}
                      variants={{
                        hidden: { opacity: 0, x: -4 },
                        show:   { opacity: 1, x: 0, transition: { duration: 0.35, ease: EASE } },
                      }}
                    >
                      <span
                        aria-hidden
                        style={{ color: 'var(--accent)', fontSize: 10, paddingTop: 2 }}
                      >
                        ▸
                      </span>
                      <span>{t}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
