#!/bin/bash

# Update package lists
sudo apt-get update

# Install additional packages for GUI applications
sudo apt-get install -y \
  openbox \
  x11-apps \
  firefox-esr \
  websockify \
  novnc

# Install Node.js dependencies
npm init -y
npm install playwright @playwright/test

# Install Playwright browsers
npx playwright install
npx playwright install-deps

# Create VNC startup script
cat > /tmp/start-vnc.sh << 'EOF'
#!/bin/bash
export DISPLAY=:1
Xvfb :1 -screen 0 1024x768x24 &
sleep 2
openbox-session &
websockify --web=/usr/share/novnc/ 6080 localhost:5901 &
x11vnc -display :1 -nopw -listen localhost -xkb -ncache 10 -ncache_cr -rfbport 5901 &
EOF

chmod +x /tmp/start-vnc.sh
sudo mv /tmp/start-vnc.sh /usr/local/bin/start-vnc.sh

echo "Setup completed successfully!"
