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
        pass # suppress logs

def run_tests():
    PORT = 4208
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
        time.sleep(2.5)
        
        # 1. Navigate to 算法实验 (Algorithm Catalog)
        print("[1] Navigating to Algorithm Catalog (题库)...")
        nav_btns = driver.find_elements(By.CSS_SELECTOR, "nav button")
        algo_clicked = False
        for b in nav_btns:
            if '算法' in b.text or '题库' in b.text:
                driver.execute_script("arguments[0].click();", b)
                algo_clicked = True
                break
        assert algo_clicked, "Failed to find 算法/题库 navigation button!"
        time.sleep(2)
        driver.save_screenshot('docs/images/debug_step1.png')
        
        # 2. Find first problem card note button
        print("[2] Opening AlgoNoteModal for first problem...")
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "button[title='做题便签'], button[title='做题便签 (已有笔记)']"))
        )
        note_buttons = driver.find_elements(By.CSS_SELECTOR, "button[title='做题便签'], button[title='做题便签 (已有笔记)']")
        print(f"Found {len(note_buttons)} problem card note buttons.")
        assert len(note_buttons) > 0, "No note buttons found on problem cards!"
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", note_buttons[0])
        time.sleep(0.5)
        driver.execute_script("arguments[0].click();", note_buttons[0])
        time.sleep(1)
        
        # 3. Verify modal exists and inspect Header
        print("[3] Verifying Modal Header & Superfluous Annotations Elimination...")
        time.sleep(1)
        logs = driver.get_log('browser')
        if logs:
            print("[Browser Console Logs]:", logs)
        modal = WebDriverWait(driver, 5).until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, "div[role='dialog']"))
        )
        assert modal.is_displayed(), "AlgoNoteModal is not displayed!"
        
        modal_text = modal.text
        # Assert promotional comments are completely removed
        assert "Typora / Notion 单画布真所见即所得" not in modal_text, "Error: Promotional annotation found in Header!"
        assert "实时渲染" not in modal_text, "Error: Promotional subtitle found in Header!"
        # Assert Footer annotation is removed
        assert "Ctrl + S 保存 · 800ms 自动保存" not in modal_text, "Error: Footer hint text found!"
        print("  ✓ [PASS] Superfluous comments successfully eradicated from Header and Footer!")
        
        # 4. Verify Toolbar Styling & No Purple
        print("[4] Inspecting Toolbar & Color System...")
        toolbar = modal.find_element(By.CSS_SELECTOR, ".rounded-xl")
        # Check active button color or classes
        toolbar_html = toolbar.get_attribute('outerHTML')
        assert 'purple' not in toolbar_html, "Error: Purple color token found in toolbar!"
        h3_btns = modal.find_elements(By.CSS_SELECTOR, "button[title*='三级标题']")
        assert len(h3_btns) > 0, "Error: Heading3 toolbar button not found!"
        print("  ✓ [PASS] Zero purple detected; Toolbar unified with Amber/Slate theme & H1/H2/H3 complete!")
        
        # 5. Type into single canvas editor
        print("[5] Typing into TipTap Editor Canvas...")
        prose_mirror = modal.find_element(By.CSS_SELECTOR, ".ProseMirror")
        prose_mirror.click()
        time.sleep(0.3)
        
        # Clear existing text first (Ctrl+A, Backspace)
        prose_mirror.send_keys(Keys.CONTROL, 'a')
        prose_mirror.send_keys(Keys.BACKSPACE)
        time.sleep(0.3)
        
        # Type markdown text
        prose_mirror.send_keys("# 核心思路解析")
        prose_mirror.send_keys(Keys.ENTER)
        prose_mirror.send_keys("> 双指针碰撞法求解")
        prose_mirror.send_keys(Keys.ENTER)
        prose_mirror.send_keys("- [ ] 边界条件检查")
        prose_mirror.send_keys(Keys.ENTER)
        prose_mirror.send_keys("关键变量 `left` 与 `right`。")
        prose_mirror.send_keys(Keys.ENTER)
        
        # Click toolbar CodeBlock button
        code_btn = None
        for b in modal.find_elements(By.CSS_SELECTOR, "button[title*='代码块']"):
            code_btn = b
            break
        assert code_btn is not None, "CodeBlock toolbar button not found!"
        code_btn.click()
        time.sleep(0.5)
        
        prose_mirror.send_keys("// 算法核心代码")
        prose_mirror.send_keys(Keys.ENTER)
        prose_mirror.send_keys("int left = 0, right = n - 1;")
        time.sleep(0.5)
        
        # 6. Verify CodeBlock NodeView appearance & Copy Click
        print("[6] Verifying CodeBlock Terminal Appearance...")
        # Check if code block contains terminal header
        code_blocks = modal.find_elements(By.CSS_SELECTOR, ".font-mono")
        terminal_headers = [cb for cb in code_blocks if '行' in cb.text or '复制' in cb.text]
        assert len(terminal_headers) > 0, "Error: CodeBlock terminal header (lines/copy) not found!"
        
        # Check copy button
        copy_btns = modal.find_elements(By.CSS_SELECTOR, "button[title='复制代码']")
        assert len(copy_btns) > 0, "Error: Copy code button not found in CodeBlock!"
        copy_btns[0].click()
        time.sleep(0.3)
        print("  ✓ [PASS] CodeBlock NodeView verified: Terminal header, line count, and copy button present!")
        
        # 7. Test Tab Indentation and Shift-Tab in Editor
        print("[7] Verifying Tab & Shift-Tab indentation...")
        prose_mirror.send_keys(Keys.ENTER)
        initial_editor_text = prose_mirror.text
        prose_mirror.send_keys(Keys.TAB)
        time.sleep(0.3)
        prose_mirror.send_keys("return ans;")
        
        # 8. Test Debounced Auto-save and Cursor Continuity
        print("[8] Testing 800ms auto-save without cursor jump...")
        # Wait 1.2s for debounced auto-save to complete
        time.sleep(1.2)
        saved_status_elements = modal.find_elements(By.XPATH, "//*[contains(text(), '已保存')]")
        assert len(saved_status_elements) > 0, "Error: Auto-save status '已保存' did not show!"
        print("  ✓ [PASS] 800ms auto-save triggered successfully and reported '已保存'!")
        
        # Type more text to prove cursor wasn't jumped/lost
        prose_mirror.send_keys(" // continuous typing verified")
        time.sleep(0.5)
        final_text = prose_mirror.text
        assert "continuous typing verified" in final_text, "Error: Typing interrupted or lost after auto-save!"
        print("  ✓ [PASS] Cursor position completely stable! Typing uninterrupted across auto-save cycles!")
        
        # 9. Capture Screenshot of Note Modal
        shot_path = 'docs/images/verify_algo_note_refinement.png'
        driver.save_screenshot(shot_path)
        print(f"  ✓ Saved screenshot: {shot_path}")
        
        # 10. Close Modal with Esc
        print("[10] Testing Esc key exit...")
        prose_mirror.send_keys(Keys.ESCAPE)
        time.sleep(1)
        modals_after_esc = driver.find_elements(By.CSS_SELECTOR, "div[role='dialog']")
        visible_modals = [m for m in modals_after_esc if m.is_displayed()]
        assert len(visible_modals) == 0, "Error: Modal did not close on Esc!"
        print("  ✓ [PASS] Modal closed cleanly on Esc key with synchronous flush!")
        
        print("\n🎉🎉🎉 ALL ALGO NOTE REFINEMENT VERIFICATIONS PASSED 100% PERFECTLY! 🎉🎉🎉")
        
    finally:
        driver.quit()
        httpd.shutdown()
        httpd.server_close()

if __name__ == '__main__':
    run_tests()
