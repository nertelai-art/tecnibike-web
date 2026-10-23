import { describe, expect, it } from "vitest";
import { scrubAt, totalScroll } from "./scrub-timeline";

const spans = [1.5, 1, 1.5];
const samples = Array.from({ length: 801 }, (_, i) => i / 800);

describe("scrubAt", () => {
  it("starts on the first frame of the first clip", () => {
    expect(scrubAt(0, spans)).toEqual({ index: 0, local: 0, blend: 0 });
  });

  it("ends on the last frame of the last clip, without fading into anything", () => {
    expect(scrubAt(1, spans)).toEqual({ index: 2, local: 1, blend: 0 });
  });

  it("gives each clip a share of the progress proportional to its scroll span", () => {
    const total = totalScroll(spans);
    expect(scrubAt(0.75 / total, spans).index).toBe(0);
    expect(scrubAt(2 / total, spans)).toMatchObject({ index: 1, local: 0.5 });
    expect(scrubAt(3.25 / total, spans)).toMatchObject({ index: 2, local: 0.5 });
  });

  it("never goes backwards: clip index and position only grow with progress", () => {
    let previous = -1;
    for (const p of samples) {
      const s = scrubAt(p, spans);
      const position = s.index + s.local;
      expect(position).toBeGreaterThanOrEqual(previous);
      previous = position;
    }
  });

  it("fades the next clip in only during the tail of the current one", () => {
    for (const p of samples) {
      const s = scrubAt(p, spans, 0.1);
      if (s.local < 0.9) expect(s.blend).toBe(0);
      expect(s.blend).toBeGreaterThanOrEqual(0);
      expect(s.blend).toBeLessThanOrEqual(1);
    }
  });

  it("has fully faded in the next clip by the time it takes over", () => {
    const total = totalScroll(spans);
    const justBefore = scrubAt(1.5 / total - 1e-9, spans, 0.1);
    expect(justBefore.index).toBe(0);
    expect(justBefore.blend).toBeCloseTo(1, 5);
    expect(scrubAt(1.5 / total, spans, 0.1)).toEqual({ index: 1, local: 0, blend: 0 });
  });

  it("clamps progress outside 0–1 and tolerates an empty list", () => {
    expect(scrubAt(-1, spans)).toEqual(scrubAt(0, spans));
    expect(scrubAt(2, spans)).toEqual(scrubAt(1, spans));
    expect(scrubAt(0.5, [])).toEqual({ index: 0, local: 0, blend: 0 });
  });
});
