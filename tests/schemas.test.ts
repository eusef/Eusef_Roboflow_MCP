import { describe, it, expect } from "vitest";
import {
  universeSearchSchema,
  projectListSchema,
  pretrainedListSchema,
  rapidCreateSchema,
  inferenceRunSchema,
  inferenceClassifySchema,
  workflowListSchema,
  workflowRunSchema,
  apiStatusSchema,
  uploadImageSchema,
} from "../src/schemas/index.js";

describe("universeSearchSchema", () => {
  it("accepts valid input with required fields", () => {
    const result = universeSearchSchema.parse({ query: "hard hat detection" });
    expect(result.query).toBe("hard hat detection");
    expect(result.limit).toBe(5);
  });

  it("accepts all optional fields", () => {
    const result = universeSearchSchema.parse({
      query: "dogs",
      type: "model",
      limit: 10,
    });
    expect(result.type).toBe("model");
    expect(result.limit).toBe(10);
  });

  it("rejects limit > 20", () => {
    expect(() =>
      universeSearchSchema.parse({ query: "test", limit: 25 })
    ).toThrow();
  });

  it("rejects invalid type", () => {
    expect(() =>
      universeSearchSchema.parse({ query: "test", type: "invalid" })
    ).toThrow();
  });
});

describe("projectListSchema", () => {
  it("accepts empty object", () => {
    const result = projectListSchema.parse({});
    expect(result.workspace).toBeUndefined();
  });

  it("accepts workspace", () => {
    const result = projectListSchema.parse({ workspace: "my-workspace" });
    expect(result.workspace).toBe("my-workspace");
  });
});

describe("pretrainedListSchema", () => {
  it("defaults to all", () => {
    const result = pretrainedListSchema.parse({});
    expect(result.task).toBe("all");
  });

  it("accepts specific task", () => {
    const result = pretrainedListSchema.parse({ task: "ocr" });
    expect(result.task).toBe("ocr");
  });
});

describe("rapidCreateSchema", () => {
  it("accepts valid input", () => {
    const result = rapidCreateSchema.parse({
      prompt: "red hard hats",
      project_name: "hard-hat-detection",
    });
    expect(result.prompt).toBe("red hard hats");
    expect(result.project_name).toBe("hard-hat-detection");
  });

  it("rejects missing prompt", () => {
    expect(() =>
      rapidCreateSchema.parse({ project_name: "test" })
    ).toThrow();
  });
});

describe("inferenceRunSchema", () => {
  it("accepts valid input with defaults", () => {
    const result = inferenceRunSchema.parse({
      model_id: "hard-hat/3",
      image: "https://example.com/image.jpg",
    });
    expect(result.confidence).toBe(40);
    expect(result.overlap).toBe(30);
    expect(result.format).toBe("json");
  });

  it("accepts custom confidence", () => {
    const result = inferenceRunSchema.parse({
      model_id: "test/1",
      image: "data:image/jpeg;base64,abc123",
      confidence: 80,
    });
    expect(result.confidence).toBe(80);
  });

  it("rejects confidence > 100", () => {
    expect(() =>
      inferenceRunSchema.parse({
        model_id: "test/1",
        image: "test.jpg",
        confidence: 150,
      })
    ).toThrow();
  });
});

describe("inferenceClassifySchema", () => {
  it("accepts valid input", () => {
    const result = inferenceClassifySchema.parse({
      model_id: "cats-dogs/2",
      image: "https://example.com/cat.jpg",
    });
    expect(result.top_k).toBe(5);
  });
});

describe("workflowListSchema", () => {
  it("accepts empty object", () => {
    const result = workflowListSchema.parse({});
    expect(result.workspace).toBeUndefined();
  });
});

describe("workflowRunSchema", () => {
  it("accepts valid input", () => {
    const result = workflowRunSchema.parse({
      workflow_id: "wf-123",
      image: "https://example.com/image.jpg",
    });
    expect(result.workflow_id).toBe("wf-123");
    expect(result.parameters).toBeUndefined();
  });

  it("accepts parameters", () => {
    const result = workflowRunSchema.parse({
      workflow_id: "wf-123",
      image: "test.jpg",
      parameters: { threshold: 0.5 },
    });
    expect(result.parameters).toEqual({ threshold: 0.5 });
  });
});

describe("apiStatusSchema", () => {
  it("accepts empty object", () => {
    const result = apiStatusSchema.parse({});
    expect(result).toEqual({});
  });
});

describe("uploadImageSchema", () => {
  it("accepts valid input with defaults", () => {
    const result = uploadImageSchema.parse({
      project_id: "my-project",
      image: "https://example.com/image.jpg",
    });
    expect(result.split).toBe("train");
    expect(result.tag).toBeUndefined();
  });

  it("accepts all fields", () => {
    const result = uploadImageSchema.parse({
      project_id: "my-project",
      image: "test.jpg",
      split: "valid",
      tag: "batch-1",
      workspace: "my-ws",
    });
    expect(result.split).toBe("valid");
    expect(result.tag).toBe("batch-1");
  });
});
