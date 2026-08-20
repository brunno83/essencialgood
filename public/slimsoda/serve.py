#!/usr/bin/env python3
"""Servidor local simples. Rode:  python3 serve.py"""
import http.server, os, socketserver, webbrowser
PORT = int(os.environ.get("PORT", "8000"))
os.chdir(os.path.dirname(os.path.abspath(__file__)))
class H(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()
    def log_message(self, *a):
        pass
with socketserver.TCPServer(("127.0.0.1", PORT), H) as httpd:
    url = f"http://127.0.0.1:{PORT}/index.html"
    print("Servindo em", url, "\nCtrl+C para parar.")
    try:
        webbrowser.open(url)
    except Exception:
        pass
    httpd.serve_forever()
