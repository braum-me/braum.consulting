/**
 * Tracking-Helfer für das AI-Stack-Fit-Tool.
 *
 * Portiert aus braum.org, aber an das zentrale `trackEvent` der Orange-Site
 * delegiert — so gibt es nur EINE window.umami-Deklaration (in lib/analytics.ts)
 * und keinen Typkonflikt. Die FUNNEL-Oberfläche bleibt unverändert, damit der
 * Tool-Code unangetastet bleibt.
 */

import { trackEvent } from '@/lib/analytics'

export type TrackData = Record<string, string | number | boolean | null | undefined>;

export function track(event: string, data?: TrackData): void {
  trackEvent(event, data);
}

/* ── Funnel event names — single source of truth ──────────────── */
export const FUNNEL = {
  // Lab navigation
  labTileClick: (slug: string) => track(`lab.tile.click`, { slug }),
  labDetailCta: (slug: string, target: string) =>
    track(`lab.detail.cta`, { slug, target }),
  labExternalClick: (target: string) => track(`lab.external.click`, { target }),

  // AI-Stack-Fit wizard
  toolOpened: () => track(`tool.opened`, { tool: "ai-stack-fit" }),
  toolModeSelected: (mode: "greenfield" | "audit", source: "card" | "demo") =>
    track(`tool.mode.selected`, { tool: "ai-stack-fit", mode, source }),
  toolStepCompleted: (step: string) =>
    track(`tool.step.completed`, { tool: "ai-stack-fit", step }),
  toolDemoClicked: (demo: string) =>
    track(`tool.demo.clicked`, { tool: "ai-stack-fit", demo }),
  toolRandomized: (source: "landing" | "result") =>
    track(`tool.randomized`, { tool: "ai-stack-fit", source }),
  toolResultShown: (props: TrackData) =>
    track(`tool.result.shown`, { tool: "ai-stack-fit", ...props }),
  toolRestart: () => track(`tool.restart`, { tool: "ai-stack-fit" }),
  toolEditProfile: () => track(`tool.edit_profile`, { tool: "ai-stack-fit" }),
  toolCategoryExpanded: (category: string) =>
    track(`tool.category.expanded`, { tool: "ai-stack-fit", category }),
  toolCtaConsult: () => track(`tool.cta.consult`, { tool: "ai-stack-fit" }),
};
