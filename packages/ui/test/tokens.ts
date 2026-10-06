import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const tokensCss = readFileSync(fileURLToPath(new URL("../tokens.css", import.meta.url)), "utf8");

/** Parse `--name: value;` declarations (top-level :root only, first occurrence). */
export function parseTokens(css = tokensCss): Record<string, string> {
  const out: Record<string, string> = {};
  for (const m of css.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/gi)) {
    const [, name, value] = m;
    if (name && value && !(name in out)) out[name] = value.trim();
  }
  return out;
}

/** Resolve var() chains to a literal. */
export function resolve(tokens: Record<string, string>, name: string, depth = 0): string {
  const v = tokens[name];
  if (v === undefined) throw new Error(`token ${name} is not defined`);
  if (depth > 10) throw new Error(`token ${name} cycles`);
  const m = v.match(/^var\((--[a-z0-9-]+)\)$/i);
  return m?.[1] ? resolve(tokens, m[1], depth + 1) : v;
}

const channel = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
export function luminance(hex: string): number {
  const h = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => channel(parseInt(h.slice(i, i + 2), 16) / 255));
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}
export function contrast(a: string, b: string): number {
  const [x, y] = [luminance(a), luminance(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
