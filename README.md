# Playwright Automation Template with TypeScript & Enhanced MCP Server

🎉 **完全統合されたPlaywright MCP（Model Context Protocol）サーバー with TypeScript**

このリポジトリは、JWT.io自動化に特化した包括的なPlaywright TypeScriptテンプレートと、完全機能のMCPサーバーを提供します。

## ✨ 主要機能

- **TypeScript完全対応**: 型安全性とエディタサポート
- **ESLint + Prettier設定**: コード品質とフォーマット統一
- **9つの完全なMCPツール**: ブラウザ起動からクッキー設定まで
- **JWT.io特化最適化**: v2 UI強制、DNS解決修正、クッキー管理
- **堅牢なエラーハンドリング**: 複数要素の競合解決、グレースフルフォールバック
- **VNC/GUI サポート**: 視覚的ブラウザ操作の確認
- **包括的テストスイート**: 基本からJWT.io特化まで複数のテストレベル
- **VS Code完全統合**: タスク、デバッグ、拡張機能設定済み

## 🚀 クイックスタート

```bash
# 依存関係インストール
npm install
npx playwright install

# TypeScriptビルド
npm run build

# JWT.io自動化テスト
npm run demo

# MCP サーバーテスト
npm run mcp:test
```

## 🔧 開発環境

### TypeScript設定
- **タブ幅**: 4スペース
- **セミコロン**: なし
- **フォーマッタ**: Prettier
- **リンター**: ESLint with TypeScript

### VS Code機能
- コード補完とIntelliSense
- 自動フォーマット（保存時）
- ESLint自動修正
- デバッグ設定済み
- タスクランナー統合

## 🛠 MCPサーバー機能

### 利用可能な9つのツール

| ツール | 説明 | 主要パラメータ |
|--------|------|----------------|
| `launch_browser` | ブラウザ起動 | `headless`, `args`, `viewport` |
| `navigate` | URL移動 | `url`, `waitUntil` |
| `click_element` | 要素クリック | `selector` |
| `fill_input` | 入力フィールド入力 | `selector`, `text` |
| `get_text` | テキスト取得 | `selector` |
| `screenshot` | スクリーンショット | `path`, `fullPage` |
| `close_browser` | ブラウザ終了 | - |
| `get_page_info` | ページ情報取得 | - |
| **`set_cookie`** | **クッキー設定** | **`name`, `value`, `domain`** |

### JWT.io特化機能

```javascript
// JWT.io v2 UI + ab-variantクッキー設定
await client.callTool({
  name: 'launch_browser',
  arguments: { 
    headless: false
  }
});

await client.callTool({
  name: 'set_cookie',
  arguments: { 
    name: 'ab-variant',
    value: 'variant',
    domain: '.jwt.io'
  }
});

await client.callTool({
  name: 'navigate',
  arguments: { url: 'https://jwt.io/' }
});
```

## 📋 利用可能なテストスクリプト

### NPMスクリプト

```bash
# MCP関連
npm run mcp:server          # MCPサーバー起動
npm run mcp:jwt             # JWT.io自動化テスト
npm run mcp:test            # 包括的テスト

# 従来のPlaywrightテスト
npm test                    # 標準テスト
npm run demo:jwt            # JWTデモ
npm run demo:apnic          # APNICデモ
```

### 直接実行

```bash
# 各種テストファイル
node browser-mcp-test.js          # example.com自動化
node jwt-mcp-client-test.js       # JWT.io完全自動化
```

## 🔧 設定とカスタマイゼーション

### MCP クライアント設定例

```json
{
  "mcpServers": {
    "playwright": {
      "command": "node",
      "args": ["/workspaces/playwrite-template/mcp-server.js"],
      "env": {
        "DISPLAY": ":1"
      }
    }
  }
}
```

### JWT.io自動化のベストプラクティス

1. **ab-variantクッキー**: `.jwt.io`ドメインで`variant`値を設定
2. **セレクター競合回避**: `head title`など具体的なセレクター使用

## 📸 実行結果確認

生成されるスクリーンショット：
- `mcp-test-screenshot.png` - テスト結果

## 🐛 トラブルシューティング

### よくある問題と解決策

1. **MCPサーバー接続失敗**
   ```bash
   # Node.jsバージョン確認（16+必須）
   node --version
   ```

2. **JWT.ioアクセス問題**
   - DNS解決: `--host-resolver-rules`使用
   - クッキー設定: `ab-variant=variant`確認
   - v2 UI: URLパラメータ追加

3. **ブラウザ起動失敗**
   ```bash
   npx playwright install-deps
   export DISPLAY=:1
   ```

4. **セレクター競合**
   - `title` → `head title`使用
   - より具体的なセレクター指定

## 📁 プロジェクト構成

```
playwrite-template/
├── mcp-server.js                 # メインMCPサーバー（9ツール）
├── test-mcp-client.js            # 包括的MCPテスト
├── mcp-config.json               # MCP設定例
├── package.json                  # 更新されたスクリプト
└── *.png                         # 生成されたスクリーンショット
```

## 🎯 次のステップ

1. **AIクライアント統合**: Claude Desktop, VS Code Codyなどと連携
2. **カスタムツール追加**: プロジェクト固有の自動化機能を追加
3. **スケーリング**: 複数サイトの同時自動化

## 📄 ライセンス

MIT License - 詳細は[LICENSE](LICENSE)ファイルを参照

---
