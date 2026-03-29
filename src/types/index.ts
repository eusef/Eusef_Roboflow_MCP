// ---- Universe & Discovery ----

export interface UniverseSearchResult {
  id: string;
  name: string;
  type: "model" | "dataset";
  url: string;
  description: string;
  class_count: number;
  image_count: number;
  created_at: string;
  updated_at: string;
  license: string;
  owner: string;
}

export interface ProjectInfo {
  id: string;
  name: string;
  type: string;
  workspace: string;
  classes: string[];
  image_count: number;
  created_at: string;
  updated_at: string;
  annotation_group: string;
  versions: number;
}

export interface PretrainedModel {
  id: string;
  name: string;
  task: "ocr" | "detection" | "classification" | "segmentation";
  description: string;
  model_type: string;
  endpoint: string;
}

// ---- Rapid Creation ----

export interface RapidCreateResult {
  project_id: string;
  project_name: string;
  model_id: string;
  workspace: string;
  status: "created" | "training" | "ready";
  classes: string[];
  created_at: string;
}

// ---- Inference ----

export interface InferencePrediction {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  class: string;
  class_id: number;
}

export interface InferenceResult {
  predictions: InferencePrediction[];
  image: {
    width: number;
    height: number;
  };
  time: number;
  model_id: string;
}

export interface ClassificationPrediction {
  class: string;
  confidence: number;
  class_id: number;
}

export interface ClassificationResult {
  predictions: ClassificationPrediction[];
  top: string;
  confidence: number;
  time: number;
  model_id: string;
}

// ---- Workflows ----

export interface WorkflowInfo {
  id: string;
  name: string;
  description: string;
  workspace: string;
  created_at: string;
  updated_at: string;
  steps: number;
}

export interface WorkflowRunResult {
  workflow_id: string;
  outputs: Record<string, unknown>[];
  time: number;
  status: "success" | "error";
  error_message?: string;
}

// ---- Utilities ----

export interface ApiStatus {
  status: "ok" | "degraded" | "down";
  version: string;
  rate_limit: {
    remaining: number;
    limit: number;
    reset_at: string;
  };
  workspace?: string;
}

export interface UploadResult {
  id: string;
  project_id: string;
  filename: string;
  split: "train" | "valid" | "test";
  tag?: string;
  uploaded_at: string;
  duplicate: boolean;
}

// ---- Errors ----

export interface RoboflowError {
  error: string;
  code: string;
  suggestion: string;
  related_tool?: string;
  docs_url?: string;
}
