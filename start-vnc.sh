#!/bin/bash

echo "🚀 Starting VNC session..."

# 既存のプロセスをクリーンアップ
pkill -f Xvfb
pkill -f openbox
pkill -f x11vnc
pkill -f websockify

# 少し待機
sleep 2

# 環境変数の設定
export DISPLAY=:1

echo "📺 Starting Xvfb (Virtual Display)..."
Xvfb :1 -screen 0 1024x768x24 -ac +extension GLX +render -noreset &
XVFB_PID=$!

# Xvfbが起動するまで待機
sleep 3

echo "🖼️ Starting Openbox window manager..."
openbox-session &
OPENBOX_PID=$!

# Openboxが起動するまで待機
sleep 2

echo "🔗 Starting VNC server..."
x11vnc -display :1 -nopw -listen localhost -xkb -ncache 10 -ncache_cr -rfbport 5901 -forever -shared &
VNC_PID=$!

# VNCサーバーが起動するまで待機
sleep 2

echo "🌐 Starting NoVNC WebSocket proxy..."
websockify --web=/usr/share/novnc/ 6080 localhost:5901 &
WEBSOCKIFY_PID=$!

echo "✅ VNC session started successfully!"
echo "📱 Access VNC via browser at: https://[your-codespace-url]-6080.app.github.dev/vnc.html"
echo "🖱️ Process IDs:"
echo "   Xvfb: $XVFB_PID"
echo "   Openbox: $OPENBOX_PID"
echo "   VNC: $VNC_PID"
echo "   WebSocket: $WEBSOCKIFY_PID"

# プロセスIDを保存
echo $XVFB_PID > /tmp/xvfb.pid
echo $OPENBOX_PID > /tmp/openbox.pid
echo $VNC_PID > /tmp/vnc.pid
echo $WEBSOCKIFY_PID > /tmp/websockify.pid

# プロセスの状態を監視
wait
