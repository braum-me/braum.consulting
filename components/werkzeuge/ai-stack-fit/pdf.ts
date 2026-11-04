/**
 * Client-side PDF rendering using jsPDF. Lazy-imported so the ~50KB lib
 * only loads when the user actually requests a PDF.
 *
 * Layout: A4 portrait, brand-aligned (Forest/Mint/Cream), single source
 * of truth for both the email attachment and the user-side download.
 */

import type { Friction, Profile, Scored } from "./data";

export interface PdfData {
  profile: Profile;
  profileSummary: string;
  synergy: number;
  aiReadiness: number;
  cost: number;
  dominantFamily: string;
  frictions: Friction[];
  topPicks: Array<{
    categoryLabel: string;
    pick: Scored;
  }>;
  refreshLabel: string;
}

// Orange Dark-Brand (gespiegelt aus app/globals.css). Namen bleiben der
// Einfachheit halber „FOREST/MINT", tragen aber Copper-Werte.
const FOREST_DEEPEST: [number, number, number] = [15, 14, 12];   // --bg-base #0F0E0C
const FOREST_DEEP: [number, number, number] = [35, 34, 32];      // --bg-elevated #232220
const FOREST_MID: [number, number, number] = [60, 44, 32];       // warmer Gradient-Lift
const MINT: [number, number, number] = [220, 128, 68];           // --brand #DC8044
const CREAM: [number, number, number] = [242, 240, 235];         // --fg-default
const FG_MUTED: [number, number, number] = [159, 155, 146];      // --fg-muted
const FG_DIM: [number, number, number] = [130, 126, 119];        // --fg-subtle

/**
 * Paints a forest-gradient background plus a subtle mint glow, mirroring
 * the website's atmospheric layer. Stacked rectangles approximate a
 * vertical gradient (jsPDF has no native gradients).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- jsPDF instance lacks a typed surface here
function paintBackground(doc: any, width: number, height: number): void {
  const STEPS = 64;
  const stepH = height / STEPS;
  for (let i = 0; i < STEPS; i++) {
    const t = i / (STEPS - 1);
    // Soft bell peaking ~38% from top, then fading back toward bottom
    const x = (t - 0.38) * 2.8;
    const bell = Math.exp(-(x * x));
    const lift = bell * 0.75;
    const r = Math.round(FOREST_DEEPEST[0] + (FOREST_MID[0] - FOREST_DEEPEST[0]) * lift);
    const g = Math.round(FOREST_DEEPEST[1] + (FOREST_MID[1] - FOREST_DEEPEST[1]) * lift);
    const b = Math.round(FOREST_DEEPEST[2] + (FOREST_MID[2] - FOREST_DEEPEST[2]) * lift);
    doc.setFillColor(r, g, b);
    doc.rect(0, i * stepH, width, stepH + 0.4, "F");
  }
  // Subtle mint glow top-right (uses GState for alpha if available)
  const GStateCtor = (doc as { GState?: new (opts: { opacity: number }) => unknown }).GState;
  if (typeof GStateCtor === "function") {
    doc.setGState(new GStateCtor({ opacity: 0.06 }));
    doc.setFillColor(...MINT);
    doc.ellipse(width - 28, 22, 75, 55, "F");
    doc.setGState(new GStateCtor({ opacity: 0.04 }));
    doc.setFillColor(...FOREST_DEEP);
    doc.ellipse(20, height - 30, 90, 65, "F");
    doc.setGState(new GStateCtor({ opacity: 1 }));
  }
}

export async function buildPdf(data: PdfData): Promise<Uint8Array> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  const margin = 18;
  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();
  let y = margin;

  // ── Background ──
  paintBackground(doc, width, height);

  // ── Header ──
  doc.setTextColor(...MINT);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("BRAUM CONSULTING · AI-FIRST TECHSTACK", margin, y);
  y += 8;

  doc.setTextColor(...CREAM);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("Ihr AI-First Stack", margin, y);
  doc.setTextColor(...MINT);
  doc.text(".", margin + doc.getTextWidth("Ihr AI-First Stack"), y);
  y += 6;

  doc.setTextColor(...FG_MUTED);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(data.profileSummary, margin, y);
  y += 8;

  doc.setTextColor(...FG_DIM);
  doc.setFontSize(7);
  doc.text(`Daten-Stand: ${data.refreshLabel}`, margin, y);
  y += 6;

  // ── KPI strip ──
  doc.setDrawColor(45, 42, 38);
  doc.setLineWidth(0.2);
  doc.line(margin, y, width - margin, y);
  y += 6;

  const kpiCols = 4;
  const kpiWidth = (width - margin * 2) / kpiCols;
  const kpis: Array<[string, string, string]> = [
    ["STACK-SYNERGIE", `${data.synergy}`, "/100"],
    ["AI-READINESS", `${data.aiReadiness}`, "/100"],
    ["DOMINANTE FAMILIE", data.dominantFamily, ""],
    ["RICHTPREIS", data.cost.toLocaleString("de-DE"), "€/Mo"],
  ];
  kpis.forEach((kpi, i) => {
    const x = margin + i * kpiWidth;
    doc.setTextColor(...FG_DIM);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(kpi[0], x, y);
    doc.setTextColor(...CREAM);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(kpi[1], x, y + 7);
    if (kpi[2]) {
      const numWidth = doc.getTextWidth(kpi[1]);
      doc.setTextColor(...FG_DIM);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(kpi[2], x + numWidth + 1, y + 7);
    }
  });
  y += 18;

  // ── Frictions ──
  if (data.frictions.length > 0) {
    doc.setTextColor(...MINT);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("// SYNERGIE-PRÜFUNG", margin, y);
    y += 5;

    for (const f of data.frictions) {
      if (y > height - 30) {
        doc.addPage();
        paintBackground(doc, width, height);
        y = margin;
      }
      const tag = f.severity === "warn" ? "WARNUNG" : f.severity === "info" ? "HINWEIS" : "OK";
      const tagColor = f.severity === "warn" ? MINT : f.severity === "ok" ? FOREST_DEEP : FG_MUTED;
      doc.setTextColor(...tagColor);
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.text(`[${tag}]`, margin, y);
      doc.setTextColor(...CREAM);
      doc.setFontSize(9);
      doc.text(f.title, margin + 18, y);
      y += 4;
      doc.setTextColor(...FG_MUTED);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(f.body, width - margin * 2 - 18);
      doc.text(lines, margin + 18, y);
      y += lines.length * 3.6 + 4;
    }
    y += 2;
  }

  // ── Top picks per category ──
  if (y > height - 40) {
    doc.addPage();
    paintBackground(doc, width, height);
    y = margin;
  }
  doc.setTextColor(...MINT);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("// EMPFEHLUNG PRO KATEGORIE", margin, y);
  y += 6;

  for (const item of data.topPicks) {
    if (y > height - 22) {
      doc.addPage();
      doc.setFillColor(...FOREST_DEEPEST);
      doc.rect(0, 0, width, height, "F");
      y = margin;
    }
    const sys = item.pick.sys;
    doc.setTextColor(...FG_DIM);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(item.categoryLabel.toUpperCase(), margin, y);
    doc.setTextColor(...MINT);
    doc.text(`${item.pick.score}/100`, width - margin - 18, y);
    y += 4;
    doc.setTextColor(...CREAM);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(sys.label, margin, y);
    y += 4;
    doc.setTextColor(...FG_MUTED);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(sys.note, width - margin * 2);
    doc.text(lines, margin, y);
    y += lines.length * 3.4 + 5;
  }

  // ── Footer ──
  const footerY = height - margin / 1.6;
  doc.setDrawColor(45, 42, 38);
  doc.line(margin, footerY - 4, width - margin, footerY - 4);
  doc.setTextColor(...FG_DIM);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("Tieferes Audit gefällig?  →  braum.consulting", margin, footerY);
  doc.text(`Daten-Stand: ${data.refreshLabel}`, width - margin, footerY, { align: "right" });

  // jsPDF's "arraybuffer" output returns a raw ArrayBuffer, not a Uint8Array.
  // Wrap explicitly so callers always get a proper TypedArray.
  const ab = doc.output("arraybuffer") as ArrayBuffer;
  return new Uint8Array(ab);
}

export function downloadPdf(bytes: Uint8Array, filename: string): void {
  // Slice the buffer to materialise a plain ArrayBuffer (TS rejects
  // ArrayBufferLike for BlobPart since lib.dom 2024).
  const ab = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer;
  const blob = new Blob([ab], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Convert Uint8Array to base64 (browser-native, safe for large buffers). */
export function bytesToBase64(bytes: Uint8Array): string {
  // Chunked conversion to avoid call-stack overflow on large PDFs
  const CHUNK = 0x8000;
  let binary = "";
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode.apply(
      null,
      bytes.subarray(i, Math.min(i + CHUNK, bytes.length)) as unknown as number[],
    );
  }
  return btoa(binary);
}
