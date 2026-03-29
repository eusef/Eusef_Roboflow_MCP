import { RoboflowClient } from "../lib/client.js";
import type { UniverseSearchInput } from "../schemas/index.js";

interface UniverseApiResponse {
  results?: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
    description?: string;
    classes?: { count: number };
    images?: { count: number };
    model?: { type: string; map: number | null };
    created: string;
  }>;
}

export async function universeSearch(
  client: RoboflowClient,
  input: UniverseSearchInput
) {
  const params: Record<string, string | number> = {
    q: input.query,
    limit: input.limit ?? 5,
  };

  if (input.type && input.type !== "both") {
    params.type = input.type;
  }

  const data = await client.get<UniverseApiResponse>(
    "/universe/search",
    params
  );

  const results = (data.results ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    type: r.type === "model" ? ("model" as const) : ("dataset" as const),
    url: r.url ?? `https://universe.roboflow.com/${r.id}`,
    description: r.description ?? "",
    class_count: r.classes?.count ?? 0,
    image_count: r.images?.count ?? 0,
    model_type: r.model?.type ?? null,
    map_score: r.model?.map ?? null,
    created_at: r.created ?? "",
  }));

  if (results.length === 0) {
    return {
      results: [],
      message: `No models or datasets found for '${input.query}'. Try broader terms or check Roboflow Universe directly at https://universe.roboflow.com`,
    };
  }

  return {
    results,
    message: `Found ${results.length} result(s). Use roboflow_inference_run to test a model, or browse results at their URLs.`,
  };
}
