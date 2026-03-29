import { RoboflowClient } from "../lib/client.js";
import { normalizeImage } from "../lib/image.js";
import type { UploadImageInput } from "../schemas/index.js";

interface UploadApiResponse {
  id?: string;
  duplicate?: boolean;
  success?: boolean;
}

export async function uploadImage(
  client: RoboflowClient,
  input: UploadImageInput
) {
  const image = await normalizeImage(input.image);
  const workspace =
    input.workspace ?? process.env.ROBOFLOW_WORKSPACE ?? undefined;
  const split = input.split ?? "train";

  const path = workspace
    ? `/${workspace}/${input.project_id}/upload`
    : `/${input.project_id}/upload`;

  const body: Record<string, unknown> = {
    image,
    split,
  };

  if (input.tag) {
    body.tag = input.tag;
  }

  const data = await client.post<UploadApiResponse>(path, body);

  return {
    image_id: data.id ?? "",
    project_id: input.project_id,
    status: "uploaded" as const,
    duplicate: data.duplicate ?? false,
    message: data.duplicate
      ? `Image already exists in ${input.project_id}. No duplicate was created.`
      : `Image uploaded to ${input.project_id} (${split} set). Upload more images or start training in the Roboflow UI.`,
  };
}
