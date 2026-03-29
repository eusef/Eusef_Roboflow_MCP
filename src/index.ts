#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { RoboflowClient } from "./lib/client.js";
import { getApiKey } from "./lib/auth.js";
import { formatError } from "./lib/errors.js";

import {
  universeSearchSchema,
  projectListSchema,
  pretrainedListSchema,
  rapidCreateSchema,
  inferenceRunSchema,
  inferenceClassifySchema,
  workflowListSchema,
  workflowRunSchema,
  apiStatusSchema,
  uploadImageSchema,
} from "./schemas/index.js";

import { apiStatus } from "./tools/status.js";
import { universeSearch } from "./tools/universe.js";
import { projectList } from "./tools/projects.js";
import { pretrainedList } from "./tools/pretrained.js";
import { rapidCreate } from "./tools/rapid.js";
import { inferenceRun, inferenceClassify } from "./tools/inference.js";
import { workflowList, workflowRun } from "./tools/workflows.js";
import { uploadImage } from "./tools/upload.js";

const server = new McpServer({
  name: "@roboflow/mcp-server",
  version: "0.1.0",
});

function createClient(): RoboflowClient {
  return new RoboflowClient({ apiKey: getApiKey() });
}

function success(data: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
  };
}

// --- Group 1: Discovery ---

server.tool(
  "roboflow_api_status",
  "Check Roboflow API connectivity and key validity. Use as a first call to verify setup.",
  apiStatusSchema.shape,
  async () => {
    try {
      const client = createClient();
      const result = await apiStatus(client);
      return success(result);
    } catch (error) {
      return formatError(error);
    }
  }
);

server.tool(
  "roboflow_universe_search",
  "Search Roboflow Universe for existing models and datasets. Use before building a custom model to check if a solution already exists.",
  universeSearchSchema.shape,
  async (args) => {
    try {
      const client = createClient();
      const input = universeSearchSchema.parse(args);
      const result = await universeSearch(client, input);
      return success(result);
    } catch (error) {
      return formatError(error);
    }
  }
);

server.tool(
  "roboflow_project_list",
  "List projects in the authenticated Roboflow workspace.",
  projectListSchema.shape,
  async (args) => {
    try {
      const client = createClient();
      const input = projectListSchema.parse(args);
      const result = await projectList(client, input);
      return success(result);
    } catch (error) {
      return formatError(error);
    }
  }
);

server.tool(
  "roboflow_pretrained_list",
  "List Roboflow's curated pre-trained APIs for common vision tasks (OCR, people detection, PPE, license plates, etc.). These are production-ready, zero-setup endpoints.",
  pretrainedListSchema.shape,
  async (args) => {
    try {
      const input = pretrainedListSchema.parse(args);
      const result = pretrainedList(input);
      return success(result);
    } catch (error) {
      return formatError(error);
    }
  }
);

// --- Group 2: Rapid Model Creation ---

server.tool(
  "roboflow_rapid_create",
  "Create a model using Roboflow Rapid (prompt-based, no training data required). Describe what to detect in natural language.",
  rapidCreateSchema.shape,
  async (args) => {
    try {
      const client = createClient();
      const input = rapidCreateSchema.parse(args);
      const result = await rapidCreate(client, input);
      return success(result);
    } catch (error) {
      return formatError(error);
    }
  }
);

// --- Group 3: Inference ---

server.tool(
  "roboflow_inference_run",
  "Run object detection or segmentation inference on a Roboflow model. Accepts image as URL, base64, or local file path.",
  inferenceRunSchema.shape,
  async (args) => {
    try {
      const client = createClient();
      const input = inferenceRunSchema.parse(args);
      const result = await inferenceRun(client, input);
      return success(result);
    } catch (error) {
      return formatError(error);
    }
  }
);

server.tool(
  "roboflow_inference_classify",
  "Run classification inference on a Roboflow model. Returns top-K class predictions with confidence scores.",
  inferenceClassifySchema.shape,
  async (args) => {
    try {
      const client = createClient();
      const input = inferenceClassifySchema.parse(args);
      const result = await inferenceClassify(client, input);
      return success(result);
    } catch (error) {
      return formatError(error);
    }
  }
);

// --- Group 4: Workflows ---

server.tool(
  "roboflow_workflow_list",
  "List available Roboflow Workflows in a workspace.",
  workflowListSchema.shape,
  async (args) => {
    try {
      const client = createClient();
      const input = workflowListSchema.parse(args);
      const result = await workflowList(client, input);
      return success(result);
    } catch (error) {
      return formatError(error);
    }
  }
);

server.tool(
  "roboflow_workflow_run",
  "Execute a Roboflow Workflow. Workflows chain multiple models and logic steps into a single pipeline.",
  workflowRunSchema.shape,
  async (args) => {
    try {
      const client = createClient();
      const input = workflowRunSchema.parse(args);
      const result = await workflowRun(client, input);
      return success(result);
    } catch (error) {
      return formatError(error);
    }
  }
);

// --- Group 5: Utilities ---

server.tool(
  "roboflow_upload_image",
  "Upload an image to a Roboflow project dataset for training. Specify the dataset split (train/valid/test).",
  uploadImageSchema.shape,
  async (args) => {
    try {
      const client = createClient();
      const input = uploadImageSchema.parse(args);
      const result = await uploadImage(client, input);
      return success(result);
    } catch (error) {
      return formatError(error);
    }
  }
);

// --- Start server ---

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Failed to start MCP server:", error);
  process.exit(1);
});
