import { describe, expect, it } from "vitest";
import { summarize } from "../src/summarize.js";

describe("summarize", () => {
  it("collapses duplicate and blank labels into a sorted, structured result", () => {
    const result = summarize([
      { label: "Home Security", confidence: 0.6 },
      { label: "home security", confidence: 0.8 },
      { label: "   ", confidence: 0.9 },
      { label: "Motion Detected", confidence: 0.7 },
    ]);

    expect(result.insights).toEqual([
      { label: "Home Security", confidence: 0.8 },
      { label: "Motion Detected", confidence: 0.7 },
    ]);
    expect(result.droppedBlankLabels).toBe(1);
  });

  it("filters out results below a configurable confidence threshold", () => {
    const result = summarize(
      [
        { label: "Package Delivered", confidence: 0.9 },
        { label: "Cat On Porch", confidence: 0.2 },
      ],
      { minConfidence: 0.5 }
    );

    expect(result.insights).toEqual([{ label: "Package Delivered", confidence: 0.9 }]);
    expect(result.droppedBelowThreshold).toBe(1);
  });

  it("keeps items with missing confidence instead of crashing or defaulting to zero", () => {
    const result = summarize([{ label: "Unknown Object" }], { minConfidence: 0.5 });

    expect(result.insights).toEqual([{ label: "Unknown Object", confidence: null }]);
    expect(result.droppedBelowThreshold).toBe(0);
    expect(result.missingConfidenceCount).toBe(1);
  });
});
