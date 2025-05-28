# Playwright VNC Demo

このプロジェクトは、GitHub Codespaces環境でPlaywrightを使用してGoogle検索を実行し、VNC経由で視覚的に確認できるデモです。

## セットアップ

1. GitHub Codespacesでこのリポジトリを開きます
2. devcontainerが自動的にビルドされ、必要なパッケージがインストールされます

## 使用方法

### 1. VNCセッションの開始

```bash
npm run start-vnc
```

このコマンドを実行すると、以下が起動されます：
- Xvfb（仮想ディスプレイ）
- Openbox（ウィンドウマネージャー）
- VNCサーバー
- NoVNC（WebSocketプロキシ）

### 2. VNC画面の表示

1. Codespacesのポート転送タブで、ポート6080が転送されていることを確認
2. ブラウザで新しいタブを開き、`https://[your-codespace-url]-6080.app.github.dev/vnc.html` にアクセス
3. "Connect" ボタンをクリックしてVNC画面に接続

### 3. Playwrightデモの実行

VNC画面が表示されている状態で、以下のコマンドを実行：

```bash
# Google検索デモの実行
npm run demo

# または直接実行
node google-search-demo.js
```

### 4. Playwrightテストの実行

```bash
# ヘッドレスモードでテスト実行
npm test

# ヘッド付きモードでテスト実行（VNC画面で確認可能）
npm run test-headed
```

## ファイル構成

- `.devcontainer/devcontainer.json` - devcontainer設定
- `.devcontainer/setup.sh` - セットアップスクリプト
- `google-search-demo.js` - Google検索デモスクリプト
- `tests/google-search.spec.js` - Playwrightテストファイル
- `playwright.config.js` - Playwright設定

## 注意事項

- VNCセッションはCodespacesの起動時に自動的には開始されません。手動で `npm run start-vnc` を実行してください
- ブラウザの操作はVNC画面で視覚的に確認できます
- デモは意図的にゆっくり実行されるように設定されています（slowMo設定）

## トラブルシューティング

### VNC画面が表示されない場合
1. `npm run start-vnc` が正常に実行されているか確認
2. ポート6080が正しく転送されているか確認
3. ブラウザのコンソールでエラーメッセージを確認

### Playwrightが動作しない場合
1. `npx playwright install` を再実行
2. `DISPLAY=:1` 環境変数が設定されているか確認
3. VNCセッションが起動しているか確認
