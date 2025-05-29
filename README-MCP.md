# Playwright Automation Template with MCP Server

This repository provides a comprehensive Playwright automation template featuring a **Model Context Protocol (MCP) Server** for browser automation, along with practical examples for web testing and interaction.

## 🚀 Features

- **MCP Server Integration**: Full-featured Playwright automation server compatible with MCP clients
- **JWT.io Automation**: Specialized scripts for JWT.io website automation
- **Cross-Platform Support**: Works on Linux, Windows, and macOS
- **VNC/GUI Support**: Desktop GUI support for visual browser automation
- **Comprehensive Examples**: Ready-to-use demo scripts and test files

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd playwrite-template

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

## 🔧 Quick Start

### Basic Playwright Tests

```bash
# Run Google search test
npm test

# Run JWT decode test
npm run test:jwt

# Run demo scripts
npm run demo:apnic
npm run demo:jwt
```

### MCP Server

```bash
# Start MCP server
npm run mcp:server

# Test MCP client
npm run mcp:test

# Run JWT.io automation via MCP
npm run mcp:jwt
```

## 🛠 MCP Server Architecture

### Available Tools

The Playwright MCP Server provides 8 core automation tools:

| Tool | Description | Parameters |
|------|-------------|------------|
| `launch_browser` | Launch browser instance | `headless`, `viewport` |
| `navigate` | Navigate to URL | `url`, `waitUntil` |
| `click_element` | Click element | `selector` |
| `fill_input` | Fill input field | `selector`, `text` |
| `get_text` | Get element text | `selector` |
| `screenshot` | Take screenshot | `path`, `fullPage` |
| `close_browser` | Close browser | - |
| `get_page_info` | Get page status | - |

### MCP Client Usage

```javascript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const transport = new StdioClientTransport({
  command: 'node',
  args: ['mcp-server.js']
});

const client = new Client({
  name: 'my-client',
  version: '1.0.0'
}, { capabilities: {} });

await client.connect(transport);

// Launch browser
await client.callTool({
  name: 'launch_browser',
  arguments: { headless: false }
});

// Navigate to website
await client.callTool({
  name: 'navigate',
  arguments: { url: 'https://example.com' }
});
```

### Configuration

Create `mcp-config.json` for client configuration:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "node",
      "args": ["mcp-server.js"],
      "env": {
        "DISPLAY": ":1"
      }
    }
  }
}
```

## 🧪 Testing Examples

### JWT.io Automation

The template includes specialized automation for JWT.io:

- **V2 UI Forcing**: Automatically switches to JWT.io v2 interface
- **Cookie Management**: Sets required cookies for consistent behavior
- **DNS Resolution**: Handles DNS resolution issues with host mapping
- **Token Processing**: Automated JWT token encoding/decoding

### Example Usage

```javascript
// Automated JWT.io interaction
await client.callTool({
  name: 'navigate',
  arguments: { url: 'https://jwt.io/?version=v2' }
});

await client.callTool({
  name: 'fill_input',
  arguments: { 
    selector: 'textarea[data-testid="jwt-encoded-input"]',
    text: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  }
});
```

## 🔧 Advanced Features

### Error Handling

The MCP server includes robust error handling:

- **Graceful Degradation**: Fallback behavior when elements aren't found
- **Detailed Error Messages**: Comprehensive error reporting
- **Page State Inspection**: Automatic page status checking

### Browser Configuration

```javascript
// Custom browser launch with host resolution
await client.callTool({
  name: 'launch_browser',
  arguments: {
    headless: false,
    args: ['--host-resolver-rules=MAP jwt.io:443 104.18.32.191:443']
  }
});
```

### VNC/GUI Support

For desktop environments:

```bash
# Start VNC server
./start-vnc.sh

# Set display environment
export DISPLAY=:1

# Run with GUI support
npm run mcp:jwt
```

## 📁 Project Structure

```
playwrite-template/
├── mcp-server.js              # Main MCP server implementation
├── test-mcp-client.js         # MCP client test script
├── apnic-search-demo.js      # APNIC search demo
├── jwt-decode-demo.js        # JWT decode demo
├── mcp-config.json           # MCP configuration example
├── tests/
│   ├── google-search.spec.js # Google search test
│   └── jwt-decode.spec.js    # JWT decode test
└── README.md                 # This file
```

## 🐛 Troubleshooting

### Common Issues

1. **Browser Launch Failures**
   ```bash
   # Install system dependencies
   npx playwright install-deps
   ```

2. **MCP Connection Issues**
   ```bash
   # Check Node.js version (requires 16+)
   node --version
   
   # Reinstall MCP SDK
   npm install @modelcontextprotocol/sdk
   ```

3. **JWT.io Access Problems**
   - Use DNS resolution flags: `--host-resolver-rules`
   - Set proper cookies: `ab-variant=variant`
   - Force v2 UI: `?version=v2`

4. **Display Issues (Linux)**
   ```bash
   # Start VNC
   ./start-vnc.sh
   
   # Set display
   export DISPLAY=:1
   ```

## 📝 Development

### Adding New MCP Tools

1. Add tool definition in `setupToolHandlers()`
2. Implement tool method in the class
3. Add case handler in the switch statement
4. Update documentation

### Testing Changes

```bash
# Test MCP client functionality
npm run mcp:test

# Test full JWT workflow
npm run mcp:jwt
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Resources

- [Playwright Documentation](https://playwright.dev/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [JWT.io](https://jwt.io/)
- [MCP SDK](https://github.com/modelcontextprotocol/typescript-sdk)
