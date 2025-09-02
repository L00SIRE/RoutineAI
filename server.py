#!/usr/bin/env python3
"""
Simple HTTP server for RoutineAI
Serves the application on localhost:8000
"""

import http.server
import socketserver
import os
import sys
from pathlib import Path

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers for local development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

def main():
    PORT = 8000
    
    # Change to the script's directory
    os.chdir(Path(__file__).parent)
    
    try:
        with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
            print(f"🚀 RoutineAI Server starting...")
            print(f"📱 Open your browser and go to: http://localhost:{PORT}")
            print(f"🎤 Make sure to allow microphone access for voice commands")
            print(f"🔔 Enable notifications when prompted for alarms")
            print(f"⏹️  Press Ctrl+C to stop the server")
            print("-" * 50)
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped")
        sys.exit(0)
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()

