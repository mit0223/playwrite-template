import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { expect, test } from '@playwright/test'

interface TextContent {
    type: 'text'
    text: string
}

interface ToolCallResult {
    content: TextContent[]
    isError?: boolean
}

test.describe('CASIO Unix Time Conversion', () => {
    test('Convert Unix timestamp 1748491564 to Japanese date/time', async ({ page }) => {
        test.setTimeout(60000) // 60秒のタイムアウト

        let client: Client | null = null

        try {
            // MCPサーバーに接続
            console.log('🔌 Connecting to MCP server...')
            const transport = new StdioClientTransport({
                command: 'node',
                args: ['dist/mcp-server.js'],
                env: { ...process.env, DISPLAY: ':1' },
            })

            client = new Client(
                {
                    name: 'casio-unix-conversion-test',
                    version: '1.0.0',
                },
                { capabilities: {} }
            )

            await client.connect(transport)
            console.log('✅ MCP server connected successfully')

            // ブラウザ起動
            console.log('🌐 Launching browser...')
            await client.callTool({
                name: 'launch_browser',
                arguments: {
                    headless: false,
                    viewport: { width: 1280, height: 720 },
                },
            })
            console.log('✅ Browser launched successfully')

            // CASIOサイトに移動
            console.log('🧭 Navigating to CASIO calculator...')
            await client.callTool({
                name: 'navigate',
                arguments: { url: 'https://keisan.casio.jp/exec/system/1526004418' },
            })
            console.log('✅ Navigation completed')

            // ページロード待機
            await new Promise(resolve => setTimeout(resolve, 3000))

            // 初期状態スクリーンショット
            await client.callTool({
                name: 'screenshot',
                arguments: { path: 'test-results/casio-test-initial.png' },
            })

            // Unix時間入力
            console.log('📝 Entering Unix timestamp 1748491564...')
            await client.callTool({
                name: 'fill_input',
                arguments: {
                    selector: '#var_unix',
                    text: '1748491564',
                },
            })
            console.log('✅ Unix timestamp entered')

            // 入力後スクリーンショット
            await client.callTool({
                name: 'screenshot',
                arguments: { path: 'test-results/casio-test-input.png' },
            })

            // 計算ボタンクリック
            console.log('🖱️ Clicking calculate button...')
            await client.callTool({
                name: 'click_element',
                arguments: { selector: '#executebtn' },
            })
            console.log('✅ Calculate button clicked')

            // 計算結果待機
            await new Promise(resolve => setTimeout(resolve, 3000))

            // 結果スクリーンショット
            await client.callTool({
                name: 'screenshot',
                arguments: { path: 'test-results/casio-test-result.png' },
            })

            // 結果取得
            console.log('🔍 Retrieving calculation results...')
            const result = await client.callTool({
                name: 'get_text',
                arguments: { selector: '#inparea' },
            })

            const resultText = (result as ToolCallResult).content[0]?.text || ''
            console.log('📋 Result text retrieved')

            // 期待する値
            const expectedDate = '2025年05月29日'
            const expectedTime = '13:06:04'

            // 検証
            const dateFound = resultText.includes(expectedDate)
            const timeFound = resultText.includes(expectedTime)

            console.log(`🔍 Date "${expectedDate}": ${dateFound ? '✅ FOUND' : '❌ NOT FOUND'}`)
            console.log(`🔍 Time "${expectedTime}": ${timeFound ? '✅ FOUND' : '❌ NOT FOUND'}`)

            // Playwrightアサーション
            expect(dateFound, `Expected date "${expectedDate}" not found in result`).toBe(true)
            expect(timeFound, `Expected time "${expectedTime}" not found in result`).toBe(true)

            // ブラウザ終了
            await client.callTool({
                name: 'close_browser',
                arguments: {},
            })
            console.log('✅ Browser closed')

            console.log('🎉 Test completed successfully!')

        } catch (error) {
            console.error('❌ Test failed:', error)

            // エラー時のスクリーンショット
            if (client) {
                try {
                    await client.callTool({
                        name: 'screenshot',
                        arguments: { path: 'test-results/casio-test-error.png' },
                    })
                    console.log('📸 Error screenshot saved')
                } catch (screenshotError) {
                    console.error('Failed to save error screenshot:', screenshotError)
                }
            }

            throw error

        } finally {
            if (client) {
                try {
                    await client.close()
                    console.log('🔌 MCP connection closed')
                } catch (closeError) {
                    console.error('Error closing MCP connection:', closeError)
                }
            }
        }
    })
})