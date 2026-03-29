import { RoboflowClient } from "../lib/client.js";
import { normalizeImage } from "../lib/image.js";
import { getInferenceEndpoint } from "../lib/endpoints.js";
import type {
  InferenceRunInput,
  InferenceClassifyInput,
} from "../schemas/index.js";

interface DetectionApiResponse {
  predictions: Array<{
    class: string;
    confidence: number;
    x: number;
    y: number;
    width: number;
    height: number;
    detection_id?: string;
  }>;
  image: { width: number; height: number };
  time?: number;
}

interface ClassificationApiResponse {
  predictions: Array<{
    class: string;
    confidence: number;
  }>;
  top?: string;
  confidence?: number;
  time?: number;
}

export async function inferenceRun(
  client: RoboflowClient,
  input: InferenceRunInput
) {
  const image = await normalizeImage(input.image);
  const confidence = (input.confidence ?? 40) / 100;
  const overlap = (input.overlap ?? 30) / 100;

  const host = getInferenceEndpoint("detection");
  const url = `${host}/${input.model_id}?confidence=${confidence}&overlap=${overlap}&format=${input.format ?? "json"}`;

  const data = await client.requestUrl<DetectionApiResponse>(url, {
    method: "POST",
    body: JSON.stringify({ image }),
  });

  const predictions = (data.predictions ?? []).map((p) => ({
    class: p.class,
    confidence: p.confidence,
    x: p.x,
    y: p.y,
    width: p.width,
    height: p.height,
    detection_id: p.detection_id ?? "",
  }));

  let message: string;
  if (predictions.length === 0) {
    message = `No predictions above confidence threshold ${input.confidence ?? 40}%. Try lowering the confidence parameter or check if the model was trained for this type of object.`;
  } else {
    message = `Found ${predictions.length} prediction(s). Highest confidence: ${Math.max(...predictions.map((p) => p.confidence)).toFixed(2)}.`;
  }

  return {
    predictions,
    image: data.image ?? { width: 0, height: 0 },
    model_id: input.model_id,
    inference_time_ms: Math.round((data.time ?? 0) * 1000),
    message,
  };
}

export async function inferenceClassify(
  client: RoboflowClient,
  input: InferenceClassifyInput
) {
  const image = await normalizeImage(input.image);

  const host = getInferenceEndpoint("classification");
  const url = `${host}/${input.model_id}`;

  const data = await client.requestUrl<ClassificationApiResponse>(url, {
    method: "POST",
    body: JSON.stringify({ image }),
  });

  const allPredictions = data.predictions ?? [];
  const topK = input.top_k ?? 5;
  const predictions = allPredictions.slice(0, topK).map((p) => ({
    class: p.class,
    confidence: p.confidence,
  }));

  let message: string;
  if (predictions.length === 0) {
    message = "No classification predictions returned. Verify the model ID and that it is a classification model.";
  } else if (predictions[0].confidence < 0.5) {
    message = `Top prediction confidence is below 50% (${predictions[0].class}: ${predictions[0].confidence.toFixed(2)}). The model may not have been trained on images like this.`;
  } else {
    message = `Top prediction: ${predictions[0].class} (${predictions[0].confidence.toFixed(2)} confidence).`;
  }

  return {
    predictions,
    model_id: input.model_id,
    inference_time_ms: Math.round((data.time ?? 0) * 1000),
    message,
  };
}
