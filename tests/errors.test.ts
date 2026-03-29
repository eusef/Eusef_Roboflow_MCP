import { describe, it, expect } from "vitest";
import {
  RoboflowApiError,
  formatError,
  ErrorCodes,
} from "../src/lib/errors.js";

describe("RoboflowApiError", () => {
  it("creates error with default suggestion", () => {
    const err = new RoboflowApiError("Bad key", ErrorCodes.AUTH_INVALID_KEY);
    expect(err.code).toBe("AUTH_INVALID_KEY");
    expect(err.suggestion).toContain("ROBOFLOW_API_KEY");
    expect(err.docs_url).toContain("authentication");
    expect(err.message).toBe("Bad key");
  });

  it("allows custom suggestion override", () => {
    const err = new RoboflowApiError("Test", ErrorCodes.MODEL_NOT_FOUND, {
      suggestion: "Custom suggestion",
    });
    expect(err.suggestion).toBe("Custom suggestion");
  });

  it("includes related_tool for known errors", () => {
    const err = new RoboflowApiError("Not found", ErrorCodes.MODEL_NOT_FOUND);
    expect(err.related_tool).toBe("roboflow_universe_search");
  });
});

describe("formatError", () => {
  it("formats RoboflowApiError", () => {
    const err = new RoboflowApiError("Test error", ErrorCodes.AUTH_MISSING_KEY);
    const result = formatError(err);
    expect(result.isError).toBe(true);
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe("text");
    expect(result.content[0].text).toContain("Test error");
    expect(result.content[0].text).toContain("AUTH_MISSING_KEY");
    expect(result.content[0].text).toContain("Suggestion:");
  });

  it("formats generic Error", () => {
    const result = formatError(new Error("generic failure"));
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("generic failure");
  });

  it("formats string errors", () => {
    const result = formatError("something went wrong");
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("something went wrong");
  });
});
