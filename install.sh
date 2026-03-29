#!/usr/bin/env bash
set -euo pipefail

INSTALL_DIR="${HOME}/.roboflow/mcp-server"

echo "Installing Roboflow MCP Server to ${INSTALL_DIR}..."

# Clone or update
if [ -d "${INSTALL_DIR}" ]; then
  echo "Existing installation found. Updating..."
  cd "${INSTALL_DIR}"
  git pull --ff-only
else
  git clone https://github.com/eusef/Eusef_Roboflow_MCP.git "${INSTALL_DIR}"
  cd "${INSTALL_DIR}"
fi

# Install and build
npm install --no-fund --no-audit
npm run build

ENTRY_POINT="${INSTALL_DIR}/dist/index.js"

echo ""
echo "Build complete."
echo ""

# Register the MCP server with Claude Code
echo "Registering Roboflow MCP server with Claude Code..."
claude mcp add-json -s user roboflow '{"command":"node","args":["'"${ENTRY_POINT}"'"],"env":{"ROBOFLOW_API_KEY":"${ROBOFLOW_API_KEY}"}}'

echo ""
echo "MCP server registered. Set your API key with:"
echo "  export ROBOFLOW_API_KEY=your_key_here"
echo ""
echo "Get your API key at https://app.roboflow.com/settings/api"
echo "Done."
