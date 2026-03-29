// Error code constants
export const ErrorCodes = {
  AUTH_INVALID_KEY: "AUTH_INVALID_KEY",
  AUTH_MISSING_KEY: "AUTH_MISSING_KEY",
  INPUT_INVALID_IMAGE: "INPUT_INVALID_IMAGE",
  INPUT_INVALID_PARAMS: "INPUT_INVALID_PARAMS",
  MODEL_NOT_FOUND: "MODEL_NOT_FOUND",
  MODEL_WRONG_TYPE: "MODEL_WRONG_TYPE",
  QUOTA_EXCEEDED: "QUOTA_EXCEEDED",
  QUOTA_RATE_LIMITED: "QUOTA_RATE_LIMITED",
  IMAGE_LOAD_FAILED: "IMAGE_LOAD_FAILED",
  IMAGE_INVALID_FORMAT: "IMAGE_INVALID_FORMAT",
  NETWORK_TIMEOUT: "NETWORK_TIMEOUT",
  NETWORK_UNREACHABLE: "NETWORK_UNREACHABLE",
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

const ERROR_SUGGESTIONS: Record<ErrorCode, string> = {
  AUTH_INVALID_KEY:
    "Check that your ROBOFLOW_API_KEY is correct. You can find it at https://app.roboflow.com/settings/api",
  AUTH_MISSING_KEY:
    "Set the ROBOFLOW_API_KEY environment variable. Get your key at https://app.roboflow.com/settings/api",
  INPUT_INVALID_IMAGE:
    "Provide a valid image URL, base64 string, or local file path.",
  INPUT_INVALID_PARAMS:
    "Check the tool parameters. Use the tool description for valid options.",
  MODEL_NOT_FOUND:
    "Verify the model ID is in 'project/version' format (e.g. 'hard-hat/3'). Search Universe to find available models.",
  MODEL_WRONG_TYPE:
    "This model does not support the requested operation. Use roboflow_pretrained_list to find compatible models.",
  QUOTA_EXCEEDED:
    "Your Roboflow plan's inference quota is exhausted. Check usage at https://app.roboflow.com/settings/billing",
  QUOTA_RATE_LIMITED:
    "Too many requests. Wait a moment and retry. Rate limits reset every minute.",
  IMAGE_LOAD_FAILED:
    "Could not load the image. If using a URL, verify it is publicly accessible. If using a file path, verify it exists.",
  IMAGE_INVALID_FORMAT:
    "Unsupported image format. Roboflow accepts JPEG, PNG, and WebP.",
  NETWORK_TIMEOUT:
    "Request timed out. Check your network connection and try again.",
  NETWORK_UNREACHABLE:
    "Cannot reach the Roboflow API. Check your network connection or visit https://status.roboflow.com",
};

const ERROR_DOCS: Partial<Record<ErrorCode, string>> = {
  AUTH_INVALID_KEY: "https://docs.roboflow.com/api-reference/authentication",
  AUTH_MISSING_KEY: "https://docs.roboflow.com/api-reference/authentication",
  MODEL_NOT_FOUND: "https://docs.roboflow.com/deploy/hosted-api",
  QUOTA_EXCEEDED: "https://roboflow.com/pricing",
};

const ERROR_RELATED_TOOLS: Partial<Record<ErrorCode, string>> = {
  MODEL_NOT_FOUND: "roboflow_universe_search",
  MODEL_WRONG_TYPE: "roboflow_pretrained_list",
  AUTH_MISSING_KEY: "roboflow_api_status",
  QUOTA_EXCEEDED: "roboflow_api_status",
};

export class RoboflowApiError extends Error {
  public readonly code: ErrorCode;
  public readonly suggestion: string;
  public readonly related_tool?: string;
  public readonly docs_url?: string;

  constructor(
    message: string,
    code: ErrorCode,
    options?: {
      suggestion?: string;
      related_tool?: string;
      docs_url?: string;
    }
  ) {
    super(message);
    this.name = "RoboflowApiError";
    this.code = code;
    this.suggestion = options?.suggestion ?? ERROR_SUGGESTIONS[code];
    this.related_tool =
      options?.related_tool ?? ERROR_RELATED_TOOLS[code];
    this.docs_url = options?.docs_url ?? ERROR_DOCS[code];
  }
}

/**
 * Format an error into an MCP-compatible error response.
 * Returns an object with isError: true and a structured text content block.
 */
export function formatError(error: unknown): {
  isError: true;
  content: Array<{ type: "text"; text: string }>;
} {
  if (error instanceof RoboflowApiError) {
    const parts: string[] = [
      `Error: ${error.message}`,
      `Code: ${error.code}`,
      `Suggestion: ${error.suggestion}`,
    ];
    if (error.related_tool) {
      parts.push(`Related tool: ${error.related_tool}`);
    }
    if (error.docs_url) {
      parts.push(`Docs: ${error.docs_url}`);
    }
    return {
      isError: true,
      content: [{ type: "text", text: parts.join("\n") }],
    };
  }

  if (error instanceof Error) {
    return {
      isError: true,
      content: [{ type: "text", text: `Error: ${error.message}` }],
    };
  }

  return {
    isError: true,
    content: [{ type: "text", text: `Error: ${String(error)}` }],
  };
}
