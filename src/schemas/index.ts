import { z } from "zod";

export const universeSearchSchema = z.object({
  query: z.string().describe("Search query for Roboflow Universe"),
  type: z
    .enum(["model", "dataset", "both"])
    .optional()
    .describe("Filter by resource type"),
  limit: z
    .number()
    .int()
    .min(1)
    .max(20)
    .optional()
    .default(5)
    .describe("Maximum number of results (1-20)"),
});

export const projectListSchema = z.object({
  workspace: z
    .string()
    .optional()
    .describe("Workspace ID. Defaults to the API key owner's workspace."),
});

export const pretrainedListSchema = z.object({
  task: z
    .enum(["all", "ocr", "detection", "classification", "segmentation"])
    .optional()
    .default("all")
    .describe("Filter pretrained models by task type"),
});

export const rapidCreateSchema = z.object({
  prompt: z
    .string()
    .describe(
      "Natural language description of what the model should detect or classify"
    ),
  project_name: z.string().describe("Name for the new project"),
  workspace: z
    .string()
    .optional()
    .describe("Workspace ID. Defaults to the API key owner's workspace."),
});

export const inferenceRunSchema = z.object({
  model_id: z
    .string()
    .describe("Model ID in format 'project/version' (e.g. 'hard-hat/3')"),
  image: z
    .string()
    .describe("Image as a URL, base64 string, or local file path"),
  confidence: z
    .number()
    .min(0)
    .max(100)
    .optional()
    .default(40)
    .describe("Minimum confidence threshold (0-100)"),
  overlap: z
    .number()
    .min(0)
    .max(100)
    .optional()
    .default(30)
    .describe("Maximum overlap threshold for NMS (0-100)"),
  format: z
    .enum(["json", "image"])
    .optional()
    .default("json")
    .describe("Response format"),
});

export const inferenceClassifySchema = z.object({
  model_id: z
    .string()
    .describe(
      "Classification model ID in format 'project/version' (e.g. 'cats-vs-dogs/2')"
    ),
  image: z
    .string()
    .describe("Image as a URL, base64 string, or local file path"),
  top_k: z
    .number()
    .int()
    .optional()
    .default(5)
    .describe("Number of top predictions to return"),
});

export const workflowListSchema = z.object({
  workspace: z
    .string()
    .optional()
    .describe("Workspace ID. Defaults to the API key owner's workspace."),
});

export const workflowRunSchema = z.object({
  workflow_id: z.string().describe("Workflow ID to execute"),
  image: z
    .string()
    .describe("Image as a URL, base64 string, or local file path"),
  parameters: z
    .record(z.string(), z.unknown())
    .optional()
    .describe("Additional workflow parameters"),
  workspace: z
    .string()
    .optional()
    .describe("Workspace ID. Defaults to the API key owner's workspace."),
});

export const apiStatusSchema = z.object({});

export const uploadImageSchema = z.object({
  project_id: z.string().describe("Target project ID"),
  image: z
    .string()
    .describe("Image as a URL, base64 string, or local file path"),
  split: z
    .enum(["train", "valid", "test"])
    .optional()
    .default("train")
    .describe("Dataset split to upload into"),
  tag: z.string().optional().describe("Optional tag for the uploaded image"),
  workspace: z
    .string()
    .optional()
    .describe("Workspace ID. Defaults to the API key owner's workspace."),
});

// Export inferred types for tool inputs
export type UniverseSearchInput = z.infer<typeof universeSearchSchema>;
export type ProjectListInput = z.infer<typeof projectListSchema>;
export type PretrainedListInput = z.infer<typeof pretrainedListSchema>;
export type RapidCreateInput = z.infer<typeof rapidCreateSchema>;
export type InferenceRunInput = z.infer<typeof inferenceRunSchema>;
export type InferenceClassifyInput = z.infer<typeof inferenceClassifySchema>;
export type WorkflowListInput = z.infer<typeof workflowListSchema>;
export type WorkflowRunInput = z.infer<typeof workflowRunSchema>;
export type ApiStatusInput = z.infer<typeof apiStatusSchema>;
export type UploadImageInput = z.infer<typeof uploadImageSchema>;
