import { RoboflowClient } from "../lib/client.js";
import { normalizeImage } from "../lib/image.js";
import type {
  WorkflowListInput,
  WorkflowRunInput,
} from "../schemas/index.js";

interface WorkflowListApiResponse {
  workflows?: Array<{
    id: string;
    name: string;
    description?: string;
    created: string;
    steps?: number;
    status?: string;
  }>;
}

interface WorkflowRunApiResponse {
  outputs?: Record<string, unknown>;
  time?: number;
  status?: string;
  error?: string;
}

export async function workflowList(
  client: RoboflowClient,
  input: WorkflowListInput
) {
  const workspace =
    input.workspace ?? process.env.ROBOFLOW_WORKSPACE ?? undefined;
  const path = workspace
    ? `/${workspace}/workflows`
    : "/workflows";

  const data = await client.get<WorkflowListApiResponse>(path);

  const workflows = (data.workflows ?? []).map((w) => ({
    id: w.id,
    name: w.name,
    description: w.description ?? "",
    created_at: w.created ?? "",
    steps: w.steps ?? 0,
    status: (w.status as "active" | "draft") ?? "active",
  }));

  return {
    workflows,
    message:
      workflows.length > 0
        ? `Found ${workflows.length} workflow(s). Use roboflow_workflow_run to execute one.`
        : "No workflows found. Create workflows in the Roboflow UI at https://app.roboflow.com",
  };
}

export async function workflowRun(
  client: RoboflowClient,
  input: WorkflowRunInput
) {
  const image = await normalizeImage(input.image);
  const workspace =
    input.workspace ?? process.env.ROBOFLOW_WORKSPACE ?? undefined;

  const path = workspace
    ? `/${workspace}/workflows/${input.workflow_id}/run`
    : `/workflows/${input.workflow_id}/run`;

  const body = {
    image,
    ...(input.parameters ?? {}),
  };

  const data = await client.post<WorkflowRunApiResponse>(path, body);

  return {
    workflow_id: input.workflow_id,
    execution_time_ms: Math.round((data.time ?? 0) * 1000),
    outputs: data.outputs ?? {},
    status: data.status === "error" ? ("failed" as const) : ("completed" as const),
    error: data.error ?? null,
    message:
      data.status === "error"
        ? `Workflow execution failed: ${data.error ?? "Unknown error"}. Check workflow configuration in the Roboflow UI.`
        : "Workflow executed successfully.",
  };
}
