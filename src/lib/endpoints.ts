export type TaskType =
  | "detection"
  | "classification"
  | "segmentation"
  | "ocr"
  | "workflow";

const INFERENCE_HOSTS: Record<string, string> = {
  detection: "https://detect.roboflow.com",
  classification: "https://classify.roboflow.com",
  segmentation: "https://outline.roboflow.com",
  ocr: "https://detect.roboflow.com",
  workflow: "https://detect.roboflow.com",
};

const DEFAULT_API_URL = "https://api.roboflow.com";

/**
 * Get the inference endpoint for a given task type.
 */
export function getInferenceEndpoint(taskType: TaskType): string {
  return INFERENCE_HOSTS[taskType] ?? INFERENCE_HOSTS.detection;
}

/**
 * Get the base API endpoint, respecting the ROBOFLOW_API_URL env override.
 */
export function getApiEndpoint(): string {
  return process.env.ROBOFLOW_API_URL ?? DEFAULT_API_URL;
}
