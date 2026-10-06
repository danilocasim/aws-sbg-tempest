// Reproduces design-system.md §2.3 from tokens.css, so a token change that breaks contrast fails CI.
import { describe, expect, it } from "vitest";
import { contrast, parseTokens, resolve } from "./tokens";

const t = parseTokens();
const c = (fg: string, bg: string) => Number(contrast(resolve(t, fg), resolve(t, bg)).toFixed(1));

describe("design-system.md §2.3 contrast table", () => {
  it.each([
    ["--fg", "--bg", 20.2, "headlines"],
    ["--fg-body", "--bg", 16.5, "body"],
    ["--fg-subtle", "--bg", 10.8, "eyebrows"],
    ["--fg-faint", "--bg", 6.6, "smallest allowed text"],
    ["--accent-fg", "--accent", 9.9, "CTA label"],
    ["--accent", "--bg", 9.6, "orange as text or icon"],
    ["--highlight", "--highlight-bg", 8.4, "badge"],
    ["--aurora-2", "--bg", 9.3, "gradient text, weakest stop"],
    ["--fg-body", "--surface", 15.3, "card body"],
    ["--border", "--surface", 1.3, "decorative border"],
  ])("%s on %s ≈ %s:1 (%s)", (fg, bg, expected) => {
    expect(c(fg, bg)).toBeCloseTo(expected, 0);
  });

  it("keeps every text token at AA or better on both canvases", () => {
    for (const fg of ["--fg", "--fg-body", "--fg-muted", "--fg-subtle", "--fg-faint", "--link", "--accent", "--success", "--warning", "--danger", "--info"]) {
      for (const bg of ["--bg", "--bg-band", "--surface"]) expect(c(fg, bg), `${fg} on ${bg}`).toBeGreaterThanOrEqual(4.5);
    }
    expect(c("--accent-fg", "--accent")).toBeGreaterThanOrEqual(4.5);
    expect(c("--highlight", "--highlight-bg")).toBeGreaterThanOrEqual(4.5);
  });
});
