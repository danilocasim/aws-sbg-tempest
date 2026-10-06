import { describe, expect, it } from "vitest";
import { setPasswordEmail } from "../src/templates/set-password";

describe("set-password template", () => {
  const m = setPasswordEmail({ name: "Maya", url: "https://example.test/set-password/abc" });
  it("has text and html parts that both carry the link", () => {
    expect(m.text).toContain("https://example.test/set-password/abc");
    expect(m.html).toContain("https://example.test/set-password/abc");
  });
  it("escapes html in the url", () => {
    const x = setPasswordEmail({ name: "A", url: "https://x.test/?a=1&b=<s>" });
    expect(x.html).not.toContain("<s>");
    expect(x.html).toContain("&lt;s&gt;");
  });
});
