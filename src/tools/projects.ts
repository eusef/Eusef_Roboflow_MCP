import { RoboflowClient } from "../lib/client.js";
import type { ProjectListInput } from "../schemas/index.js";

interface ProjectApiResponse {
  projects?: Array<{
    id: string;
    name: string;
    type: string;
    created: string;
    images: number;
    classes: { count: number };
    models: { count: number };
    annotation: string;
  }>;
  workspace?: {
    name: string;
  };
}

export async function projectList(
  client: RoboflowClient,
  input: ProjectListInput
) {
  const workspace =
    input.workspace ?? process.env.ROBOFLOW_WORKSPACE ?? undefined;
  const path = workspace ? `/${workspace}` : "/";

  const data = await client.get<ProjectApiResponse>(path);

  const projects = (data.projects ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    type: p.type,
    created_at: p.created ?? "",
    image_count: p.images ?? 0,
    class_count: p.classes?.count ?? 0,
    model_count: p.models?.count ?? 0,
    annotation_group: p.annotation ?? "",
  }));

  return {
    workspace: data.workspace?.name ?? workspace ?? "default",
    projects,
    message:
      projects.length > 0
        ? `Found ${projects.length} project(s). Use roboflow_inference_run to test a model from any project.`
        : "No projects found. Use roboflow_rapid_create to create your first model, or roboflow_universe_search to find existing models.",
  };
}
