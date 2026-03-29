import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

describe("MCP Server Integration", () => {
  let client: Client;
  let transport: StdioClientTransport;

  beforeAll(async () => {
    transport = new StdioClientTransport({
      command: "node",
      args: ["dist/index.js"],
      env: { ...process.env, ROBOFLOW_API_KEY: "test-key-for-integration" },
      cwd: import.meta.dirname ? undefined : undefined,
    });

    client = new Client({ name: "test-client", version: "1.0.0" });
    await client.connect(transport);
  });

  afterAll(async () => {
    await client.close();
  });

  it("lists all 10 tools", async () => {
    const { tools } = await client.listTools();
    const names = tools.map((t) => t.name).sort();
    expect(names).toEqual([
      "roboflow_api_status",
      "roboflow_inference_classify",
      "roboflow_inference_run",
      "roboflow_pretrained_list",
      "roboflow_project_list",
      "roboflow_rapid_create",
      "roboflow_universe_search",
      "roboflow_upload_image",
      "roboflow_workflow_list",
      "roboflow_workflow_run",
    ]);
  });

  it("each tool has a description", async () => {
    const { tools } = await client.listTools();
    for (const tool of tools) {
      expect(tool.description).toBeTruthy();
      expect(tool.description!.length).toBeGreaterThan(20);
    }
  });

  it("each tool has an input schema", async () => {
    const { tools } = await client.listTools();
    for (const tool of tools) {
      expect(tool.inputSchema).toBeTruthy();
      expect(tool.inputSchema.type).toBe("object");
    }
  });

  it("roboflow_pretrained_list returns catalog (no API key needed)", async () => {
    const result = await client.callTool({
      name: "roboflow_pretrained_list",
      arguments: { task: "all" },
    });
    expect(result.isError).toBeFalsy();
    const data = JSON.parse((result.content as any)[0].text);
    expect(data.models.length).toBeGreaterThan(0);
    expect(data.models[0].id).toBeTruthy();
    expect(data.models[0].name).toBeTruthy();
  });

  it("roboflow_pretrained_list filters by task", async () => {
    const result = await client.callTool({
      name: "roboflow_pretrained_list",
      arguments: { task: "ocr" },
    });
    const data = JSON.parse((result.content as any)[0].text);
    expect(data.models).toHaveLength(1);
    expect(data.models[0].task_type).toBe("ocr");
  });

  it("roboflow_api_status returns auth error with invalid key", async () => {
    const result = await client.callTool({
      name: "roboflow_api_status",
      arguments: {},
    });
    expect(result.isError).toBe(true);
    const text = (result.content as any)[0].text;
    expect(text).toContain("AUTH_INVALID_KEY");
    expect(text).toContain("Suggestion:");
  });

  it("roboflow_universe_search returns auth error with invalid key", async () => {
    const result = await client.callTool({
      name: "roboflow_universe_search",
      arguments: { query: "hard hat detection" },
    });
    expect(result.isError).toBe(true);
    const text = (result.content as any)[0].text;
    expect(text).toContain("Error:");
  });

  it("roboflow_inference_run returns auth error with invalid key", async () => {
    const result = await client.callTool({
      name: "roboflow_inference_run",
      arguments: {
        model_id: "test/1",
        image: "https://example.com/test.jpg",
      },
    });
    expect(result.isError).toBe(true);
  });
});
