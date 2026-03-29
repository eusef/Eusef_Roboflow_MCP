import { describe, it, expect } from "vitest";
import { detectImageType, normalizeImage } from "../src/lib/image.js";

describe("detectImageType", () => {
  it("detects URLs", () => {
    expect(detectImageType("https://example.com/image.jpg")).toBe("url");
    expect(detectImageType("http://example.com/img.png")).toBe("url");
  });

  it("detects base64 data URIs", () => {
    expect(
      detectImageType("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ")
    ).toBe("base64");
    expect(
      detectImageType("data:image/png;base64,iVBORw0KGgo")
    ).toBe("base64");
  });

  it("detects raw base64 strings", () => {
    expect(
      detectImageType("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==")
    ).toBe("base64");
  });

  it("detects file paths", () => {
    expect(detectImageType("/path/to/image.jpg")).toBe("file");
    expect(detectImageType("./relative/image.png")).toBe("file");
    expect(detectImageType("image.webp")).toBe("file");
  });
});

describe("normalizeImage", () => {
  it("passes through URLs", async () => {
    const url = "https://example.com/image.jpg";
    const result = await normalizeImage(url);
    expect(result).toBe(url);
  });

  it("passes through base64", async () => {
    const b64 = "data:image/png;base64,iVBORw0KGgo";
    const result = await normalizeImage(b64);
    expect(result).toBe(b64);
  });

  it("throws on non-existent file", async () => {
    await expect(normalizeImage("/nonexistent/image.jpg")).rejects.toThrow(
      "not found or not readable"
    );
  });

  it("rejects invalid URL format", async () => {
    // This looks like a URL but is invalid
    await expect(normalizeImage("https://")).rejects.toThrow();
  });
});
