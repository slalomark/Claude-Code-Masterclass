import { generateCodename } from "@/lib/generateCodename";

describe("generateCodename", () => {
  it("returns a non-empty string", () => {
    expect(generateCodename().length).toBeGreaterThan(0);
  });

  it("returns a PascalCase string with no spaces or special characters", () => {
    expect(generateCodename()).toMatch(/^[A-Z][a-zA-Z]+$/);
  });

  it("contains exactly 3 capitalized segments", () => {
    const codename = generateCodename();
    const segments = codename.split(/(?=[A-Z])/);
    expect(segments).toHaveLength(3);
  });

  it("produces varied results across multiple calls", () => {
    const results = new Set(
      Array.from({ length: 20 }, () => generateCodename()),
    );
    expect(results.size).toBeGreaterThan(1);
  });
});
