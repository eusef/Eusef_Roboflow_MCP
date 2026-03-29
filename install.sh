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
echo "Add the following to your Claude Code MCP settings"
echo "(~/.claude/settings.json or .claude/settings.json):"
echo ""
cat <<CONF
{
  "mcpServers": {
    "roboflow": {
      "command": "node",
      "args": ["${ENTRY_POINT}"],
      "env": {
        "ROBOFLOW_API_KEY": "YOUR_API_KEY_HERE"
      }
    }
  }
}
CONF
echo ""
echo "Get your API key at https://app.roboflow.com/settings/api"
echo "Done."
