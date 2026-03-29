import { describe, it, expect, afterEach } from "vitest";
import { getInferenceEndpoint, getApiEndpoint } from "../src/lib/endpoints.js";

describe("getInferenceEndpoint", () => {
  it("returns detect host for detection", () => {
    expect(getInferenceEndpoint("detection")).toBe(
      "https://detect.roboflow.com"
    );
  });

  it("returns classify host for classification", () => {
    expect(getInferenceEndpoint("classification")).toBe(
      "https://classify.roboflow.com"
    );
  });

  it("returns outline host for segmentation", () => {
    expect(getInferenceEndpoint("segmentation")).toBe(
      "https://outline.roboflow.com"
    );
  });
});

describe("getApiEndpoint", () => {
  const originalEnv = process.env.ROBOFLOW_API_URL;

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.ROBOFLOW_API_URL;
    } else {
      process.env.ROBOFLOW_API_URL = originalEnv;
    }
  });

  it("returns default API URL", () => {
    delete process.env.ROBOFLOW_API_URL;
    expect(getApiEndpoint()).toBe("https://api.roboflow.com");
  });

  it("respects ROBOFLOW_API_URL override", () => {
    process.env.ROBOFLOW_API_URL = "https://custom.roboflow.com";
    expect(getApiEndpoint()).toBe("https://custom.roboflow.com");
  });
});
