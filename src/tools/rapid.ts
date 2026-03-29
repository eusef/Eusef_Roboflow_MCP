import { RoboflowClient } from "../lib/client.js";
import type { RapidCreateInput } from "../schemas/index.js";

interface RapidApiResponse {
  project?: {
    id: string;
    name: string;
    url: string;
  };
  model?: {
    id: string;
  };
  status?: string;
}

export async function rapidCreate(
  client: RoboflowClient,
  input: RapidCreateInput
) {
  const workspace =
    input.workspace ?? process.env.ROBOFLOW_WORKSPACE ?? undefined;

  const body = {
    prompt: input.prompt,
    project_name: input.project_name,
    ...(workspace ? { workspace } : {}),
  };

  const data = await client.post<RapidApiResponse>(
    "/rapid/create",
    body
  );

  return {
    project_id: data.project?.id ?? "",
    project_url:
      data.project?.url ??
      `https://app.roboflow.com/${workspace ?? ""}/${input.project_name}`,
    model_id: data.model?.id ?? "",
    status: "created" as const,
    message:
      "Rapid model created. Use roboflow_inference_run to test it with a sample image.",
  };
}
