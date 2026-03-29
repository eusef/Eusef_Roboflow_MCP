#!/usr/bin/env bash
set -euo pipefail

INSTALL_DIR="${HOME}/.roboflow/mcp-server"

echo "Uninstalling Roboflow MCP Server..."

# Remove MCP server registration from Claude Code
if command -v claude &> /dev/null; then
  echo "Removing MCP server from Claude Code..."
  claude mcp remove -s user roboflow 2>/dev/null && echo "Removed 'roboflow' from Claude Code." || echo "No 'roboflow' MCP entry found in Claude Code settings."
else
  echo "Claude Code CLI not found. If you added the MCP server manually, remove the 'roboflow' entry from your settings.json."
fi

# Remove installed files
if [ -d "${INSTALL_DIR}" ]; then
  rm -rf "${INSTALL_DIR}"
  echo "Removed ${INSTALL_DIR}"
else
  echo "No installation found at ${INSTALL_DIR}"
fi

# Clean up parent dir if empty
rmdir "${HOME}/.roboflow" 2>/dev/null && echo "Removed ${HOME}/.roboflow" || true

echo ""
echo "Uninstall complete."
