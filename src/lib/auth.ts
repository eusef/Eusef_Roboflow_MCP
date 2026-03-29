import { getApiEndpoint } from "./endpoints.js";
import { RoboflowApiError, ErrorCodes } from "./errors.js";

/**
 * Read the Roboflow API key from the ROBOFLOW_API_KEY environment variable.
 * Throws a structured error if the key is not set.
 */
export function getApiKey(): string {
  const key = process.env.ROBOFLOW_API_KEY;
  if (!key || key.trim() === "") {
    throw new RoboflowApiError(
      "ROBOFLOW_API_KEY environment variable is not set.",
      ErrorCodes.AUTH_MISSING_KEY
    );
  }
  return key.trim();
}

/**
 * Validate the API key by making a lightweight request to the Roboflow API.
 * Returns true if valid, throws RoboflowApiError if not.
 */
export async function validateApiKey(apiKey?: string): Promise<boolean> {
  const key = apiKey ?? getApiKey();
  const url = `${getApiEndpoint()}/?api_key=${encodeURIComponent(key)}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(10_000),
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "TimeoutError") {
      throw new RoboflowApiError(
        "Timed out connecting to Roboflow API.",
        ErrorCodes.NETWORK_TIMEOUT
      );
    }
    throw new RoboflowApiError(
      "Cannot reach the Roboflow API.",
      ErrorCodes.NETWORK_UNREACHABLE
    );
  }

  if (response.status === 401) {
    throw new RoboflowApiError(
      "The provided API key is invalid.",
      ErrorCodes.AUTH_INVALID_KEY
    );
  }

  if (!response.ok) {
    throw new RoboflowApiError(
      `Roboflow API returned HTTP ${response.status}.`,
      ErrorCodes.NETWORK_UNREACHABLE
    );
  }

  return true;
}

/**
 * Build auth headers for Roboflow API requests.
 */
export function getAuthHeaders(apiKey?: string): Record<string, string> {
  const key = apiKey ?? getApiKey();
  return {
    "Content-Type": "application/json",
    "X-Api-Key": key,
  };
}
