import { readFile, access } from "node:fs/promises";
import { constants } from "node:fs";
import { RoboflowApiError, ErrorCodes } from "./errors.js";

const BASE64_PATTERN = /^data:image\/[a-zA-Z+]+;base64,/;
const RAW_BASE64_PATTERN = /^[A-Za-z0-9+/]{20,}={0,2}$/;
const URL_PATTERN = /^https?:\/\//i;

/**
 * Detect whether the input is a URL, base64 string, or local file path.
 */
export function detectImageType(input: string): "url" | "base64" | "file" {
  if (URL_PATTERN.test(input)) {
    return "url";
  }
  if (BASE64_PATTERN.test(input) || RAW_BASE64_PATTERN.test(input)) {
    return "base64";
  }
  return "file";
}

/**
 * Normalize an image input to a format the Roboflow API accepts.
 * - URLs are validated and returned as-is.
 * - Base64 strings are returned as-is.
 * - File paths are read and converted to a base64 data URI.
 */
export async function normalizeImage(input: string): Promise<string> {
  const type = detectImageType(input);

  switch (type) {
    case "url": {
      try {
        new URL(input);
      } catch {
        throw new RoboflowApiError(
          `Invalid image URL: ${input}`,
          ErrorCodes.INPUT_INVALID_IMAGE
        );
      }
      return input;
    }

    case "base64": {
      return input;
    }

    case "file": {
      try {
        await access(input, constants.R_OK);
      } catch {
        throw new RoboflowApiError(
          `Image file not found or not readable: ${input}`,
          ErrorCodes.IMAGE_LOAD_FAILED
        );
      }

      const buffer = await readFile(input);
      const ext = input.split(".").pop()?.toLowerCase();
      const mimeMap: Record<string, string> = {
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        webp: "image/webp",
      };
      const mime = mimeMap[ext ?? ""] ?? "image/jpeg";

      if (!mimeMap[ext ?? ""]) {
        throw new RoboflowApiError(
          `Unsupported image format: .${ext}. Use JPEG, PNG, or WebP.`,
          ErrorCodes.IMAGE_INVALID_FORMAT
        );
      }

      return `data:${mime};base64,${buffer.toString("base64")}`;
    }
  }
}
