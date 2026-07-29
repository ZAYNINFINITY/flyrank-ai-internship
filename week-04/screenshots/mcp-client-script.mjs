import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({
  command: "npx",
  args: [
    "-y",
    "@modelcontextprotocol/server-filesystem",
    "C:\\Users\\user"
  ]
});

const client = new Client(
  { name: "fl-05-client", version: "1.0.0" },
  { capabilities: {} }
);

await client.connect(transport);

console.log("=== MCP Client Connected ===");
console.log("Server: @modelcontextprotocol/server-filesystem\n");

// List available tools
const toolsResult = await client.listTools();
console.log("=== Available Tools ===");
for (const tool of toolsResult.tools) {
  console.log(`  ${tool.name}: ${tool.description}`);
}
console.log();

// Task 1: Read a specific file (this very script)
console.log("=== TASK 1: Read a local file ===");
const readResult = await client.callTool({
  name: "read_file",
  arguments: {
    path: "C:\\Users\\user\\AppData\\Local\\Temp\\mcp-test\\client.mjs"
  }
});
console.log(`Tool: read_file`);
console.log(`Path: client.mjs`);
console.log(`Content length: ${readResult.content[0].text.length} characters`);
console.log(`First 200 chars:\n${readResult.content[0].text.substring(0, 200)}\n`);

// Task 2: List directory contents  
console.log("=== TASK 2: List directory structure ===");
const listResult = await client.callTool({
  name: "list_directory",
  arguments: {
    path: "C:\\Users\\user\\AppData\\Local\\Temp\\mcp-test"
  }
});
console.log(`Tool: list_directory`);
console.log("Contents:");
for (const entry of listResult.content[0].text.split('\n')) {
  console.log(`  ${entry}`);
}
console.log();

// Task 3: Search for files by pattern
console.log("=== TASK 3: Search files by name pattern ===");
const searchResult = await client.callTool({
  name: "search_files",
  arguments: {
    path: "C:\\Users\\user\\AppData\\Local\\Temp\\mcp-test",
    pattern: "*.mjs"
  }
});
console.log(`Tool: search_files`);
console.log(`Pattern: *.mjs`);
console.log("Matches:");
for (const entry of searchResult.content[0].text.split('\n')) {
  console.log(`  ${entry}`);
}
console.log();

await client.close();
console.log("=== MCP Session Complete ===");
