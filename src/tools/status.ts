import { RoboflowClient } from "../lib/client.js";

interface WorkspaceResponse {
  workspace: string;
  plan?: string;
  credits_usage?: number;
  credits_limit?: number;
}

export async function apiStatus(client: RoboflowClient) {
  const data = await client.get<WorkspaceResponse>("/");

  const rateLimit = client.rateLimit;

  return {
    authenticated: true,
    workspace: data.workspace ?? "unknown",
    plan: data.plan ?? "unknown",
    api_calls_remaining: rateLimit.remaining,
    inference_credits_remaining: data.credits_limit
      ? data.credits_limit - (data.credits_usage ?? 0)
      : null,
    message:
      "Roboflow API connection verified. You can now use other roboflow_* tools.",
  };
}
