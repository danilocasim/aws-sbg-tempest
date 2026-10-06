// Every token named in design-system.md §2.2 (semantic) and §5 (motion) must exist in tokens.css.
import { describe, expect, it } from "vitest";
import { parseTokens, resolve } from "./tokens";

const semantic = ["--bg", "--bg-band", "--surface", "--surface-glass", "--border", "--border-strong", "--divider", "--fg", "--fg-body", "--fg-muted", "--fg-subtle", "--fg-faint", "--accent", "--accent-hover", "--accent-active", "--accent-fg", "--highlight", "--highlight-bg", "--highlight-border", "--gradient-aurora", "--gradient-halo", "--glow-violet", "--glow-steel", "--focus-ring", "--link"];
const motion = ["--dur-fast", "--dur-base", "--dur-slow", "--dur-hero", "--ease-out", "--ease-in-out", "--ease-spring"];
const typeScale = ["--fs-display", "--fs-h1", "--fs-h2", "--fs-h3", "--fs-lead", "--fs-body", "--fs-small", "--fs-eyebrow", "--fs-stat"];
const shape = ["--r-sm", "--r-md", "--r-lg", "--r-pill", "--elev-1", "--elev-accent", "--elev-aurora"];

describe("tokens.css", () => {
  const t = parseTokens();
  it.each([...semantic, ...motion, ...typeScale, ...shape])("defines %s", (name) => {
    expect(t[name]).toBeDefined();
    expect(() => resolve(t, name)).not.toThrow();
  });
  it("uses the §5 values", () => {
    expect(resolve(t, "--dur-fast")).toBe("150ms");
    expect(resolve(t, "--dur-base")).toBe("250ms");
    expect(resolve(t, "--dur-slow")).toBe("500ms");
    expect(resolve(t, "--dur-hero")).toBe("900ms");
    expect(resolve(t, "--ease-out")).toBe("cubic-bezier(0.16, 1, 0.3, 1)");
    expect(resolve(t, "--ease-spring")).toBe("cubic-bezier(0.34, 1.56, 0.64, 1)");
  });
});
