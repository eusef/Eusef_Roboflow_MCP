# Roboflow MCP Server

A Model Context Protocol (MCP) server that gives AI coding agents programmatic access to Roboflow's computer vision platform. Provides 10 tools across 5 groups: Discovery, Rapid Creation, Inference, Workflows, and Utilities.

## Quick Install

```bash
curl -fsSL https://raw.githubusercontent.com/eusef/Eusef_Roboflow_MCP/main/install.sh | bash
```

This clones the repo to `~/.roboflow/mcp-server`, installs dependencies, builds, and prints the config snippet to add to Claude Code.

## Prerequisites

- Node.js >= 20.0.0
- A Roboflow API key (get one at https://app.roboflow.com/settings/api)

## Installation

```bash
git clone https://github.com/eusef/Eusef_Roboflow_MCP.git
cd Eusef_Roboflow_MCP
npm install
npm run build
```

## Configuration

Set your Roboflow API key as an environment variable:

```bash
export ROBOFLOW_API_KEY="your_api_key_here"
```

Optional environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `ROBOFLOW_API_KEY` | Your Roboflow API key (required) | -- |
| `ROBOFLOW_API_URL` | Override the base API URL | `https://api.roboflow.com` |
| `ROBOFLOW_WORKSPACE` | Default workspace ID | API key owner's workspace |

## Adding to Claude Code

Add this to your Claude Code MCP settings (`~/.claude/settings.json` or project-level `.claude/settings.json`):

```json
{
  "mcpServers": {
    "roboflow": {
      "command": "node",
      "args": ["/absolute/path/to/Eusef_Roboflow_MCP/dist/index.js"],
      "env": {
        "ROBOFLOW_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

## Available Tools

### Discovery
| Tool | Description |
|------|-------------|
| `roboflow_api_status` | Check API connectivity and key validity |
| `roboflow_universe_search` | Search Universe for existing models and datasets |
| `roboflow_project_list` | List projects in your workspace |
| `roboflow_pretrained_list` | List curated pre-trained APIs (OCR, people, PPE, etc.) |

### Rapid Creation
| Tool | Description |
|------|-------------|
| `roboflow_rapid_create` | Create a model from a natural language prompt (no training data needed) |

### Inference
| Tool | Description |
|------|-------------|
| `roboflow_inference_run` | Run object detection or segmentation on an image |
| `roboflow_inference_classify` | Run classification on an image |

### Workflows
| Tool | Description |
|------|-------------|
| `roboflow_workflow_list` | List available Workflows in a workspace |
| `roboflow_workflow_run` | Execute a Workflow pipeline |

### Utilities
| Tool | Description |
|------|-------------|
| `roboflow_upload_image` | Upload an image to a project dataset |

## Running Tests

```bash
npm test
```

## Development

Watch mode for TypeScript compilation:

```bash
npm run dev
```

Start the server directly:

```bash
npm start
```

## License

MIT
