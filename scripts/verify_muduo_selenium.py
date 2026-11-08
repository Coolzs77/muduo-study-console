# -*- coding: utf-8 -*-
import sys
import os
import time
import threading
import http.server
import socketserver

for k in ['HTTP_PROXY', 'HTTPS_PROXY', 'ALL_PROXY', 'http_proxy', 'https_proxy', 'all_proxy']:
    os.environ.pop(k, None)

sys.stdout.reconfigure(encoding='utf-8')

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options

DIST_DIR = os.path.abspath('dist')

class DistHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIST_DIR, **kwargs)
    def log_message(self, format, *args):
        pass # suppress logs

def run_tests():
    PORT = 4199
    httpd = socketserver.TCPServer(("127.0.0.1", PORT), DistHandler)
    server_thread = threading.Thread(target=httpd.serve_forever, daemon=True)
    server_thread.start()
    print(f"[*] Local static server serving {DIST_DIR} on http://127.0.0.1:{PORT}")
    
    opts = Options()
    opts.add_argument('--headless=new')
    opts.add_argument('--window-size=1600,1050')
    opts.add_argument('--no-sandbox')
    opts.add_argument('--disable-gpu')
    
    driver = webdriver.Chrome(options=opts)
    os.makedirs('docs/images', exist_ok=True)
    
    try:
        url = f"http://127.0.0.1:{PORT}/"
        driver.get(url)
        time.sleep(3)
        
        # 1. Check Dashboard
        print("[1] Inspecting Dashboard View...")
        dashboard_text = driver.find_element(By.TAG_NAME, 'body').text
        assert '吃透' not in dashboard_text, "Error: '吃透' found in DashboardView!"
        assert '学习进度' in dashboard_text, "Error: '学习进度' missing in DashboardView!"
        assert '已学习' in dashboard_text, "Error: '已学习' missing in DashboardView!"
        print("  ✓ [PASS] Dashboard verified: '学习进度' & '已学习' present, ZERO '吃透'!")
        shot_dash = 'docs/images/verify_muduo_dashboard_learning.png'
        driver.save_screenshot(shot_dash)
        print(f"  ✓ Saved screenshot: {shot_dash}")
        
        # 2. Check Daily Curriculum View
        print("[2] Switching to Daily Curriculum View...")
        nav_btns = driver.find_elements(By.CSS_SELECTOR, "nav button")
        for b in nav_btns:
            if '任务' in b.text:
                b.click()
                break
        time.sleep(1.5)
        daily_text = driver.find_element(By.TAG_NAME, 'body').text
        assert '吃透' not in daily_text, "Error: '吃透' found in Daily Curriculum view!"
        assert '学习进度' in daily_text, "Error: '学习进度' missing in Daily view!"
        print("  ✓ [PASS] Daily Curriculum verified: '学习进度' present, ZERO '吃透'!")
        shot_daily = 'docs/images/verify_muduo_daily_learning.png'
        driver.save_screenshot(shot_daily)
        print(f"  ✓ Saved screenshot: {shot_daily}")

        # 3. Check Reader View
        print("[3] Switching to Knowledge Reader View...")
        for b in driver.find_elements(By.CSS_SELECTOR, "nav button"):
            if '项目' in b.text:
                b.click()
                break
        time.sleep(1.5)
        reader_text = driver.find_element(By.TAG_NAME, 'body').text
        assert '吃透' not in reader_text, "Error: '吃透' found in Knowledge Reader view!"
        print("  ✓ [PASS] Knowledge Reader verified: ZERO '吃透'!")
        shot_reader = 'docs/images/verify_muduo_reader_learning.png'
        driver.save_screenshot(shot_reader)
        print(f"  ✓ Saved screenshot: {shot_reader}")

        # 4. Check Source Roadmap View
        print("[4] Switching to Source Roadmap View...")
        for b in driver.find_elements(By.CSS_SELECTOR, "nav button"):
            if '源码' in b.text:
                b.click()
                break
        time.sleep(1.5)
        source_text = driver.find_element(By.TAG_NAME, 'body').text
        assert '吃透' not in source_text, "Error: '吃透' found in Source Roadmap view!"
        assert '已学习' in source_text, "Error: '已学习' missing in Source Roadmap view!"
        print("  ✓ [PASS] Source Roadmap verified: '已学习' present, ZERO '吃透'!")
        shot_source = 'docs/images/verify_muduo_source_learning.png'
        driver.save_screenshot(shot_source)
        print(f"  ✓ Saved screenshot: {shot_source}")

        print("\n🎉🎉 ALL MUDUO VIEWS VERIFIED: '吃透' COMPLETELY REPLACED BY '学习' WITH ZERO DEFECTS! 🎉🎉")
    finally:
        driver.quit()
        httpd.shutdown()
        httpd.server_close()

if __name__ == '__main__':
    run_tests()
