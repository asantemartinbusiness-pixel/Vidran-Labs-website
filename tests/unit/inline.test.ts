import { describe, expect, it } from "vitest";
import { inline, isSafeUrl, markdown } from "@/lib/inline";

describe("markdown rendering safety", () => {
  it("renders internal and external links", () => {
    expect(inline("[Sage](/products/sage/)")).toBe('<a href="/products/sage/">Sage</a>');
    expect(inline("[x](https://example.org)")).toContain('href="https://example.org"');
    expect(inline("[mail](mailto:a@b.co)")).toContain('href="mailto:a@b.co"');
  });

  it("neutralises script-capable URLs", () => {
    for (const bad of ["javascript:alert(1)", "JaVaScRiPt:alert(1)", "data:text/html,<script>1</script>", "vbscript:x", "//evil.example/x"]) {
      expect(isSafeUrl(bad)).toBe(false);
    }
    expect(inline("[x](javascript:alert(1))")).not.toContain("javascript:");
    expect(markdown("![i](javascript:alert(1))")).not.toContain("javascript:");
  });

  it("escapes raw HTML instead of passing it through", () => {
    expect(inline("hi <img src=x onerror=alert(1)>")).not.toContain("<img");
    expect(markdown("<script>alert(1)</script>")).not.toContain("<script>");
  });

  it("does not double-escape entities or code", () => {
    expect(inline("`<b>`")).toBe("<code>&lt;b&gt;</code>");
    expect(inline("Research & development")).toBe("Research &amp; development");
  });
});
