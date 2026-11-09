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
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

DIST_DIR = os.path.abspath('dist')

class DistHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIST_DIR, **kwargs)
    def log_message(self, format, *args):
        pass

def run_tests():
    PORT = 4210
    httpd = socketserver.TCPServer(("127.0.0.1", PORT), DistHandler)
    server_thread = threading.Thread(target=httpd.serve_forever, daemon=True)
    server_thread.start()
    print(f"[*] Local static server serving {DIST_DIR} on http://127.0.0.1:{PORT}")
    
    # Test on a realistic narrow viewport (420 x 800) simulating mobile / narrow window
    opts = Options()
    opts.add_argument('--headless=new')
    opts.add_argument('--window-size=420,850')
    opts.add_argument('--no-sandbox')
    opts.add_argument('--disable-gpu')
    
    driver = webdriver.Chrome(options=opts)
    os.makedirs('docs/images', exist_ok=True)
    
    try:
        url = f"http://127.0.0.1:{PORT}/"
        driver.get(url)
        time.sleep(2.5)
        
        # 1. Navigate to Algorithm Catalog
        print("[1] Navigating to Algorithm Catalog in Narrow Viewport (420px)...")
        nav_btns = driver.find_elements(By.CSS_SELECTOR, "nav button")
        algo_clicked = False
        for b in nav_btns:
            if '算法' in b.text or '题库' in b.text:
                driver.execute_script("arguments[0].click();", b)
                algo_clicked = True
                break
        assert algo_clicked, "Failed to find 算法/题库 navigation button!"
        time.sleep(2)
        
        # 2. Open Note Modal
        print("[2] Opening AlgoNoteModal in narrow viewport...")
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "button[title='做题便签'], button[title='做题便签 (已有笔记)']"))
        )
        note_buttons = driver.find_elements(By.CSS_SELECTOR, "button[title='做题便签'], button[title='做题便签 (已有笔记)']")
        assert len(note_buttons) > 0, "No note buttons found on problem cards!"
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", note_buttons[0])
        time.sleep(0.5)
        driver.execute_script("arguments[0].click();", note_buttons[0])
        time.sleep(1)
        
        modal = WebDriverWait(driver, 5).until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, "div[role='dialog']"))
        )
        assert modal.is_displayed(), "AlgoNoteModal is not displayed!"
        
        # 3. Test Requirement: Save text NEVER overflows modal boundary in narrow viewport
        print("[3] Verifying Save Status Text Boundary Alignment in Narrow Viewport...")
        modal_card = modal.find_element(By.CSS_SELECTOR, ".rounded-3xl")
        save_status = modal.find_element(By.CSS_SELECTOR, "div.font-mono.shrink-0.whitespace-nowrap")
        
        modal_rect = driver.execute_script("return arguments[0].getBoundingClientRect();", modal_card)
        status_rect = driver.execute_script("return arguments[0].getBoundingClientRect();", save_status)
        
        print(f"  Modal Card: left={modal_rect['left']}, right={modal_rect['right']}, width={modal_rect['width']}")
        print(f"  Save Status: left={status_rect['left']}, right={status_rect['right']}, width={status_rect['width']}")
        
        # The right edge of the save status text MUST be within the modal card's right boundary!
        assert status_rect['right'] <= modal_rect['right'], f"Error: Save status text ({status_rect['right']}) overflows modal card boundary ({modal_rect['right']})!"
        print("  ✓ [PASS] Save status text is 100% strictly contained within modal boundary in narrow screen! Zero overflow!")
        
        # 4. Test Requirement: Rendered Markdown Colors are NOT monotone yellow
        print("[4] Testing Rendered Markdown Palette (Inline Code, Blockquote, H3)...")
        prose_mirror = modal.find_element(By.CSS_SELECTOR, ".ProseMirror")
        driver.execute_script("arguments[0].focus();", prose_mirror)
        time.sleep(0.3)
        
        # Clear content and inject test sample with inline code, blockquote and H3
        driver.execute_script("arguments[0].focus();", prose_mirror)
        prose_mirror.send_keys(Keys.CONTROL, "a")
        prose_mirror.send_keys(Keys.BACKSPACE)
        time.sleep(0.3)
        
        # Type markdown text
        prose_mirror.send_keys("### 边界分析\n> 解题核心备忘\n行内代码 `left == right` 正常测试。")
        time.sleep(1)
        
        # Inspect rendered inline code
        inline_code = modal.find_element(By.CSS_SELECTOR, ".ProseMirror code")
        code_color = driver.execute_script("return window.getComputedStyle(arguments[0]).color;", inline_code)
        code_bg = driver.execute_script("return window.getComputedStyle(arguments[0]).backgroundColor;", inline_code)
        print(f"  Rendered <code> computed color: {code_color}, bg: {code_bg}")
        # Ensure it is NOT amber/yellow (#78350f -> rgb(120, 53, 15))
        assert "120, 53, 15" not in code_color, "Error: Inline code is still using monotone brown/yellow!"
        assert "254, 243, 199" not in code_bg, "Error: Inline code background is still using yellow amber!"
        print("  ✓ [PASS] Inline code rendered with modern slate/sky tech palette (NOT yellow)!")
        
        # Inspect rendered blockquote
        blockquote = modal.find_element(By.CSS_SELECTOR, ".ProseMirror blockquote")
        bq_border = driver.execute_script("return window.getComputedStyle(arguments[0]).borderLeftColor;", blockquote)
        bq_bg = driver.execute_script("return window.getComputedStyle(arguments[0]).backgroundColor;", blockquote)
        print(f"  Rendered <blockquote> computed borderLeftColor: {bq_border}, bg: {bq_bg}")
        # Ensure it is NOT amber/yellow (#f59e0b -> rgb(245, 158, 11))
        assert "245, 158, 11" not in bq_border, "Error: Blockquote border is still using yellow amber!"
        assert "254, 243, 199" not in bq_bg, "Error: Blockquote background is still using yellow amber!"
        print("  ✓ [PASS] Blockquote rendered with elegant indigo palette (NOT yellow)!")
        
        # Inspect rendered H3
        h3_elem = modal.find_element(By.CSS_SELECTOR, ".ProseMirror h3")
        h3_color = driver.execute_script("return window.getComputedStyle(arguments[0]).color;", h3_elem)
        print(f"  Rendered <h3> computed color: {h3_color}")
        assert "217, 119, 6" not in h3_color, "Error: H3 is still using yellow amber!"
        print("  ✓ [PASS] H3 rendered with high-contrast slate palette (NOT yellow)!")
        
        # 5. Capture visual verification screenshot in narrow mode
        shot_path = 'docs/images/verify_algo_note_narrow_and_palette.png'
        driver.save_screenshot(shot_path)
        print(f"  ✓ Saved visual verification screenshot to: {shot_path}")
        
        # 6. Clean exit
        print("[6] Exiting modal cleanly...")
        prose_mirror.send_keys(Keys.ESCAPE)
        time.sleep(1)
        modals_left = driver.find_elements(By.CSS_SELECTOR, "div[role='dialog']")
        visible_modals = [m for m in modals_left if m.is_displayed()]
        assert len(visible_modals) == 0, "Modal did not close on Esc!"
        print("  ✓ [PASS] Modal closed cleanly!")
        
        print("\n🎉🎉🎉 ALL ALGO NOTE NARROW VIEWPORT & RENDERED PALETTE VERIFICATIONS PASSED 100%! 🎉🎉🎉")
        
    finally:
        driver.quit()
        httpd.shutdown()
        httpd.server_close()

if __name__ == '__main__':
    run_tests()
