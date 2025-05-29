#!/usr/bin/env node
/**
 * MCP Client Test Script
 * Simple test client to verify MCP server functionality
 */
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
async function testMCPServer() {
    console.log('🚀 Starting MCP Server test...');
    let client = null;
    try {
        // StdioClientTransportでMCPサーバーを起動
        console.log('📡 Creating transport...');
        const transport = new StdioClientTransport({
            command: 'node',
            args: ['dist/mcp-server.js'],
            env: { ...process.env, DISPLAY: ':1' },
        });
        console.log('🔧 Creating client...');
        client = new Client({
            name: 'mcp-test-client',
            version: '1.0.0',
        }, {
            capabilities: {},
        });
        console.log('🔌 Connecting to MCP server...');
        await client.connect(transport);
        console.log('✅ Connected to MCP server');
        // ツール一覧を取得
        console.log('📋 Fetching tool list...');
        const tools = await client.listTools();
        console.log('📋 Available tools:', tools.tools.map(t => t.name));
        // ブラウザを起動（JWT.io用の設定を追加）
        console.log('🌐 Launching browser...');
        const launchResult = await client.callTool({
            name: 'launch_browser',
            arguments: {
                headless: false,
            },
        });
        console.log('🌐 Browser launch result:', launchResult.content[0]?.text || 'No text content');
        // JWT.io v2 UI用のクッキーを設定
        console.log('🍪 Setting ab-variant cookie...');
        const cookieResult = await client.callTool({
            name: 'set_cookie',
            arguments: {
                name: 'ab-variant',
                value: 'variant',
                domain: '.jwt.io',
                path: '/',
            },
        });
        console.log('🍪 Cookie result:', cookieResult.content[0]?.text || 'No text content');
        // jwt.ioに移動（v2パラメータを追加）
        console.log('🧭 Navigating to JWT.io...');
        const navResult = await client.callTool({
            name: 'navigate',
            arguments: { url: 'https://jwt.io/' },
        });
        console.log('🧭 Navigation result:', navResult.content[0]?.text || 'No text content');
        // ページタイトルを取得（head titleセレクターを使用）
        console.log('📰 Getting page title...');
        const titleResult = await client.callTool({
            name: 'get_text',
            arguments: { selector: 'head title' },
        });
        console.log('📰 Page title:', titleResult.content[0]?.text || 'No text content');
        // サンプルJWTトークンを入力してテスト
        console.log('📝 Testing JWT input...');
        const sampleToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
        try {
            await client.callTool({
                name: 'fill_input',
                arguments: {
                    selector: 'textarea[data-testid="jwt-encoded-input"], .jwt-input, textarea[placeholder*="token"], textarea[placeholder*="JWT"]',
                    text: sampleToken,
                },
            });
            console.log('✅ JWT token filled successfully');
        }
        catch (error) {
            console.log('ℹ️ Could not fill JWT token:', error.message);
        }
        // 少し待機
        console.log('⏳ Waiting 2 seconds...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        // スクリーンショットを撮影
        console.log('📸 Taking screenshot...');
        const screenshotResult = await client.callTool({
            name: 'screenshot',
            arguments: { path: 'test-results/mcp-test-screenshot.png' },
        });
        console.log('📸 Screenshot result:', screenshotResult.content[0]?.text || 'No text content');
        // ブラウザを閉じる
        console.log('🔐 Closing browser...');
        await client.callTool({
            name: 'close_browser',
            arguments: {},
        });
        console.log('🎉 MCP Server test completed successfully!');
    }
    catch (error) {
        console.error('❌ Error during MCP test:', error);
        console.error('🔍 Error stack:', error.stack);
    }
    finally {
        if (client) {
            await client.close();
        }
    }
}
if (import.meta.url === `file://${process.argv[1]}`) {
    testMCPServer().catch(console.error);
}
//# sourceMappingURL=test-mcp-client.js.map