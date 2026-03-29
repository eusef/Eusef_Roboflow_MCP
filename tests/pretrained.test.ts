import { describe, it, expect } from "vitest";
import { pretrainedList } from "../src/tools/pretrained.js";

describe("pretrainedList", () => {
  it("returns all models when task is 'all'", () => {
    const result = pretrainedList({ task: "all" });
    expect(result.models.length).toBeGreaterThan(0);
    expect(result.message).toContain("pre-trained model");
  });

  it("filters by detection task", () => {
    const result = pretrainedList({ task: "detection" });
    expect(result.models.every((m) => m.task_type === "detection")).toBe(true);
    expect(result.models.length).toBeGreaterThan(5);
  });

  it("filters by ocr task", () => {
    const result = pretrainedList({ task: "ocr" });
    expect(result.models.every((m) => m.task_type === "ocr")).toBe(true);
    expect(result.models.length).toBe(1);
  });

  it("filters by segmentation task", () => {
    const result = pretrainedList({ task: "segmentation" });
    expect(result.models.every((m) => m.task_type === "segmentation")).toBe(
      true
    );
  });

  it("returns empty for classification (no pretrained classification models)", () => {
    const result = pretrainedList({ task: "classification" });
    expect(result.models).toHaveLength(0);
    expect(result.message).toContain("No pre-trained models found");
  });

  it("each model has required fields", () => {
    const result = pretrainedList({ task: "all" });
    for (const model of result.models) {
      expect(model.id).toBeTruthy();
      expect(model.name).toBeTruthy();
      expect(model.task_type).toBeTruthy();
      expect(model.description).toBeTruthy();
      expect(Array.isArray(model.classes)).toBe(true);
      expect(model.classes.length).toBeGreaterThan(0);
      expect(model.docs_url).toContain("https://");
      expect(Array.isArray(model.example_use_cases)).toBe(true);
    }
  });
});
