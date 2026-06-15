#!/usr/bin/env node
/**
 * Generate components/werkzeuge/ai-stack-fit/systems.generated.ts from
 * data/ai-stack-fit/data.csv. The generated file is the single source for the SYSTEMS
 * array — `data.ts` re-exports it alongside scoring logic, NEXT_STEPS,
 * INDUSTRY_INSIGHTS etc., which are human-curated.
 *
 * Modes:
 *   pnpm gen:data           re-generate systems.generated.ts
 *   pnpm gen:data --diff    diff old vs new
 *   pnpm gen:data --check   exit 1 if generated content would differ
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, "..");

const CSV_PATH = join(ROOT, "data/ai-stack-fit/data.csv");
const REFRESH_DATE_PATH = join(ROOT, "data/ai-stack-fit/REFRESH_DATE");
const OUT_PATH = join(ROOT, "components/werkzeuge/ai-stack-fit/systems.generated.ts");

const args = process.argv.slice(2);
const mode = args.includes("--diff") ? "diff" : args.includes("--check") ? "check" : "apply";

function parseCSV(text) {
  const rows = [];
  let i = 0;
  const len = text.length;
  while (i < len) {
    const row = [];
    let field = "";
    let quoted = false;
    while (i < len) {
      const ch = text[i];
      if (quoted) {
        if (ch === '"') {
          if (text[i + 1] === '"') {
            field += '"';
            i += 2;
            continue;
          }
          quoted = false;
          i++;
          continue;
        }
        field += ch;
        i++;
        continue;
      }
      if (ch === '"') {
        quoted = true;
        i++;
        continue;
      }
      if (ch === ",") {
        row.push(field);
        field = "";
        i++;
        continue;
      }
      if (ch === "\n" || ch === "\r") {
        row.push(field);
        field = "";
        i++;
        if (ch === "\r" && text[i] === "\n") i++;
        break;
      }
      field += ch;
      i++;
    }
    if (field !== "" || row.length > 0) row.push(field);
    if (row.length > 1 || (row.length === 1 && row[0] !== "")) rows.push(row);
  }
  return rows;
}

function parseRow(row, header) {
  const obj = {};
  for (let i = 0; i < header.length; i++) {
    obj[header[i]] = row[i] ?? "";
  }
  return obj;
}

function csvRowsToSystems(rows) {
  if (rows.length === 0) throw new Error("data.csv is empty");
  const [header, ...body] = rows;
  const required = ["id", "cat", "label", "family", "sizes", "strat", "base", "ai", "eu", "cost", "note"];
  for (const k of required) {
    if (!header.includes(k)) throw new Error(`data.csv: missing column '${k}'`);
  }
  return body.map((row, idx) => {
    const r = parseRow(row, header);
    if (!r.id) throw new Error(`data.csv: row ${idx + 2} has empty id`);
    const num = (k) => {
      const v = Number(r[k]);
      if (!Number.isFinite(v)) {
        throw new Error(`data.csv: row '${r.id}' field '${k}' not a number ('${r[k]}')`);
      }
      return v;
    };
    const arr = (k) => {
      const v = String(r[k] ?? "").trim();
      if (!v) return [];
      return v.split(/\s*,\s*/).filter(Boolean);
    };
    const flagRaw = String(r.flag ?? "").trim();
    if (flagRaw && flagRaw !== "underdog" && flagRaw !== "rising") {
      throw new Error(`data.csv: row '${r.id}' has invalid flag '${flagRaw}' (allowed: underdog, rising, or empty)`);
    }
    return {
      id: r.id,
      cat: r.cat,
      label: r.label,
      family: r.family,
      sizes: arr("sizes"),
      strat: arr("strat"),
      base: num("base"),
      ai: num("ai"),
      eu: num("eu"),
      cost: num("cost"),
      note: r.note,
      flag: flagRaw || undefined,
    };
  });
}

function refreshDateLabel(iso) {
  const m = /^(\d{4})-(\d{2})/.exec(iso);
  if (!m) return iso;
  const yr = m[1];
  const mo = parseInt(m[2], 10);
  const quarter = `Q${Math.ceil(mo / 3)}`;
  return `${yr}-${quarter}`;
}

function renderTs(systems, refreshDate) {
  const generatedDate = new Date().toISOString().slice(0, 10);
  const header = `/* eslint-disable */
/**
 * AI-Stack-Fit · System catalogue (auto-generated)
 *
 * Source: data/ai-stack-fit/data.csv · Generated: ${generatedDate}
 * Last data refresh: ${refreshDate}
 *
 * DO NOT EDIT BY HAND. Edit data/ai-stack-fit/data.csv instead, then run:
 *   pnpm gen:data
 *
 * Score logic, NEXT_STEPS, INDUSTRY_INSIGHTS etc. live in data.ts and are
 * human-curated.
 */

import type { System } from "./data";

/** ISO-date string of the last data refresh (manual operator review). */
export const DATA_REFRESH_DATE = ${JSON.stringify(refreshDate)};

/** Human-friendly label for the data freshness banner in the UI. */
export const DATA_REFRESH_LABEL = ${JSON.stringify(refreshDateLabel(refreshDate))};

export const SYSTEMS: System[] = [
`;

  const body = systems
    .map((s) => {
      const sizes = s.sizes.map((x) => JSON.stringify(x)).join(", ");
      const strat = s.strat.map((x) => JSON.stringify(x)).join(", ");
      const flagPart = s.flag ? `, flag: ${JSON.stringify(s.flag)}` : "";
      return `  { id: ${JSON.stringify(s.id)}, cat: ${JSON.stringify(s.cat)}, label: ${JSON.stringify(s.label)}, family: ${JSON.stringify(s.family)}, sizes: [${sizes}], strat: [${strat}], base: ${s.base}, ai: ${s.ai}, eu: ${s.eu}, cost: ${s.cost}, note: ${JSON.stringify(s.note)}${flagPart} },`;
    })
    .join("\n");

  return `${header}${body}\n];\n`;
}

function diff(oldTs, newTs) {
  const oldLines = oldTs.split("\n");
  const newLines = newTs.split("\n");
  const out = [];
  const max = Math.max(oldLines.length, newLines.length);
  let inDiff = false;
  for (let i = 0; i < max; i++) {
    const a = oldLines[i] ?? "";
    const b = newLines[i] ?? "";
    if (a === b) {
      if (inDiff) {
        out.push("  ...");
        inDiff = false;
      }
      continue;
    }
    inDiff = true;
    if (a) out.push(`- ${a}`);
    if (b) out.push(`+ ${b}`);
  }
  return out.join("\n");
}

const csv = readFileSync(CSV_PATH, "utf8");
const rows = parseCSV(csv);
const systems = csvRowsToSystems(rows);
const refreshDate = readFileSync(REFRESH_DATE_PATH, "utf8").trim();
const newTs = renderTs(systems, refreshDate);

if (mode === "diff") {
  const existing = existsSync(OUT_PATH) ? readFileSync(OUT_PATH, "utf8") : null;
  if (!existing) {
    console.log("No existing systems.generated.ts — would create it.");
    console.log(`\nNew file (${systems.length} systems):\n`);
    console.log(`${newTs.slice(0, 800)}\n... (truncated)`);
  } else if (existing === newTs) {
    console.log("✓ systems.generated.ts is up to date.");
  } else {
    console.log("=== diff (old → new) ===\n");
    console.log(diff(existing, newTs));
  }
  process.exit(0);
}

if (mode === "check") {
  const existing = existsSync(OUT_PATH) ? readFileSync(OUT_PATH, "utf8") : null;
  if (existing !== newTs) {
    console.error("✗ systems.generated.ts is out of sync with data/ai-stack-fit/data.csv.");
    console.error("  Run: pnpm gen:data");
    process.exit(1);
  }
  console.log("✓ systems.generated.ts in sync.");
  process.exit(0);
}

writeFileSync(OUT_PATH, newTs);
console.log(`✓ wrote ${OUT_PATH}`);
console.log(`  ${systems.length} systems · refresh date: ${refreshDate}`);
