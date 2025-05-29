#!/usr/bin/env node

/**
 * CASIO Test Summary - Final verification and success proof
 * CASIOテストの最終検証と成功証明
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'

interface TextContent {
    type: 'text'
    text: string
}

interface ToolCallResult {
    content: TextContent[]
    isError?: boolean
}

async function summaryTest(): Promise<void> {
    console.log('='.repeat(60))
    console.log('🎯 CASIO UNIX TIME CONVERSION TEST - FINAL SUMMARY')
    console.log('='.repeat(60))
    console.log('📅 Test Date: May 29, 2025')
    console.log('🔢 Unix Timestamp: 1748491564')
    console.log('📅 Expected Date: 2025年05月29日')
    console.log('🕐 Expected Time: 13:06:04')
    console.log('🌐 URL: https://keisan.casio.jp/exec/system/1526004418')
    console.log('='.repeat(60))

    let client: Client | null = null

    try {
        // MCPサーバーに接続
        console.log('\n🔌 Step 1: Connecting to MCP server...')
        const transport = new StdioClientTransport({
            command: 'node',
            args: ['dist/mcp-server.js'],
            env: { ...process.env, DISPLAY: ':1' },
        })

        client = new Client(
            {
                name: 'casio-summary-test',
                version: '1.0.0',
            },
            { capabilities: {} }
        )

        await client.connect(transport)
        console.log('   ✅ MCP server connected successfully')

        // ブラウザ起動
        console.log('\n🌐 Step 2: Launching browser...')
        await client.callTool({
            name: 'launch_browser',
            arguments: {
                headless: false, // 表示可能にして確認
                viewport: { width: 1280, height: 720 },
            },
        })
        console.log('   ✅ Browser launched successfully')

        // CASIOサイトに移動
        console.log('\n🧭 Step 3: Navigating to CASIO calculator...')
        await client.callTool({
            name: 'navigate',
            arguments: { url: 'https://keisan.casio.jp/exec/system/1526004418' },
        })
        console.log('   ✅ Navigation completed')

        // ページロード待機
        console.log('\n⏳ Step 4: Waiting for page to load...')
        await new Promise(resolve => setTimeout(resolve, 3000))
        console.log('   ✅ Page loaded')

        // 初期状態スクリーンショット
        await client.callTool({
            name: 'screenshot',
            arguments: { path: 'test-results/summary-initial.png' },
        })

        // Unix時間入力
        console.log('\n📝 Step 5: Entering Unix timestamp 1748491564...')
        await client.callTool({
            name: 'fill_input',
            arguments: {
                selector: '#var_unix',
                text: '1748491564',
            },
        })
        console.log('   ✅ Unix timestamp entered in field #var_unix')

        // 入力後スクリーンショット
        await client.callTool({
            name: 'screenshot',
            arguments: { path: 'test-results/summary-input.png' },
        })

        // 計算ボタンクリック
        console.log('\n🖱️ Step 6: Clicking calculate button...')
        await client.callTool({
            name: 'click_element',
            arguments: { selector: '#executebtn' },
        })
        console.log('   ✅ Calculate button #executebtn clicked')

        // 計算結果待機
        console.log('\n⏳ Step 7: Waiting for calculation to complete...')
        await new Promise(resolve => setTimeout(resolve, 3000))
        console.log('   ✅ Calculation completed')

        // 結果スクリーンショット
        await client.callTool({
            name: 'screenshot',
            arguments: { path: 'test-results/summary-result.png' },
        })

        // 結果取得と検証
        console.log('\n🔍 Step 8: Retrieving and verifying results...')
        const result = await client.callTool({
            name: 'get_text',
            arguments: { selector: '#inparea' },
        })

        const resultText = (result as ToolCallResult).content[0]?.text || ''
        console.log('   📋 Result text retrieved from #inparea table')

        // 詳細検証
        console.log('\n📊 Step 9: Detailed verification...')

        const expectedDate = '2025年05月29日'
        const expectedTime = '13:06:04'

        const dateFound = resultText.includes(expectedDate)
        const timeFound = resultText.includes(expectedTime)

        console.log(`   🔍 Searching for date "${expectedDate}": ${dateFound ? '✅ FOUND' : '❌ NOT FOUND'}`)
        console.log(`   🔍 Searching for time "${expectedTime}": ${timeFound ? '✅ FOUND' : '❌ NOT FOUND'}`)

        if (resultText.length > 0) {
            console.log('\n📝 Raw result content:')
            console.log('   ' + resultText.replace(/\n/g, '\\n').substring(0, 200) + '...')
        }

        // 最終判定
        console.log('\n' + '='.repeat(60))
        console.log('🎯 FINAL TEST RESULT')
        console.log('='.repeat(60))

        if (dateFound && timeFound) {
            console.log('🎉 SUCCESS: Test PASSED!')
            console.log('✅ Unix timestamp 1748491564 successfully converted to:')
            console.log(`   📅 Date: ${expectedDate}`)
            console.log(`   🕐 Time: ${expectedTime}`)
            console.log('\n🏆 CASIO Unix time conversion test completed successfully!')
        } else {
            console.log('❌ FAILURE: Test did not pass verification')
            console.log(`   Date verification: ${dateFound ? 'PASS' : 'FAIL'}`)
            console.log(`   Time verification: ${timeFound ? 'PASS' : 'FAIL'}`)
            console.log('\n📋 Please check the screenshots for manual verification.')
        }

        console.log('\n📸 Screenshots saved:')
        console.log('   - summary-initial.png (before input)')
        console.log('   - summary-input.png (after input)')
        console.log('   - summary-result.png (final result)')

        // ブラウザ終了
        console.log('\n🚪 Step 10: Closing browser...')
        await client.callTool({
            name: 'close_browser',
            arguments: {},
        })
        console.log('   ✅ Browser closed')

        console.log('\n' + '='.repeat(60))
        console.log('✅ CASIO TEST SUMMARY COMPLETED')
        console.log('='.repeat(60))
    } catch (error) {
        console.error('\n❌ Test failed with error:', error)

        // エラー時のスクリーンショット
        if (client) {
            try {
                await client.callTool({
                    name: 'screenshot',
                    arguments: { path: 'test-results/summary-error.png' },
                })
                console.log('📸 Error screenshot saved: summary-error.png')
            } catch (screenshotError) {
                console.error('Failed to save error screenshot:', screenshotError)
            }
        }

        process.exit(1)
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
}

// 実行
if (import.meta.url === `file://${process.argv[1]}`) {
    summaryTest().catch(error => {
        console.error('Fatal error:', error)
        process.exit(1)
    })
}

export { summaryTest }
