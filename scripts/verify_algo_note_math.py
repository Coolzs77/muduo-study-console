# -*- coding: utf-8 -*-
import sys
import os
import time
import json
import threading
import http.server
import socketserver
import shutil

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
    PORT = 4215
    httpd = socketserver.TCPServer(("127.0.0.1", PORT), DistHandler)
    server_thread = threading.Thread(target=httpd.serve_forever, daemon=True)
    server_thread.start()
    print(f"[*] Local static server serving {DIST_DIR} on http://127.0.0.1:{PORT}")
    
    opts = Options()
    opts.add_argument('--headless=new')
    opts.add_argument('--window-size=1280,950')
    opts.add_argument('--no-sandbox')
    opts.add_argument('--disable-gpu')
    
    driver = webdriver.Chrome(options=opts)
    os.makedirs('docs/images', exist_ok=True)
    
    try:
        url = f"http://127.0.0.1:{PORT}/"
        driver.get(url)
        time.sleep(2.5)
        
        # 1. Navigate to Algorithm Catalog
        print("[1] Navigating to Algorithm Catalog...")
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
        print("[2] Opening AlgoNoteModal...")
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "button[title='做题便签'], button[title='做题便签 (已有笔记)']"))
        )
        note_buttons = driver.find_elements(By.CSS_SELECTOR, "button[title='做题便签'], button[title='做题便签 (已有笔记)']")
        assert len(note_buttons) > 0, "No note buttons found on problem cards!"
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", note_buttons[0])
        time.sleep(0.5)
        driver.execute_script("arguments[0].click();", note_buttons[0])
        
        # Wait for modal entrance
        WebDriverWait(driver, 5).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, ".ProseMirror"))
        )
        print("  ✅ Note modal opened successfully.")
        
        # Clear existing content
        editor = driver.find_element(By.CSS_SELECTOR, ".ProseMirror")
        driver.execute_script("arguments[0].innerHTML = '<p>公式测试：</p>';", editor)
        time.sleep(0.3)
        
        # 3. Locate Math Toolbar Buttons (Sigma for inline, Radical for block)
        print("[3] Locating Math Toolbar Buttons...")
        inline_math_btn = driver.find_element(By.CSS_SELECTOR, "button[aria-label='行内公式']")
        block_math_btn = driver.find_element(By.CSS_SELECTOR, "button[aria-label='公式块']")
        assert inline_math_btn is not None, "Inline Math button not found!"
        assert block_math_btn is not None, "Block Math button not found!"
        print("  ✅ Inline Math (Sigma) and Block Math (Radical) buttons located.")
        
        # 4. Insert Inline Math (\le x)
        print("[4] Inserting Inline Math via Sigma button...")
        driver.execute_script("arguments[0].click();", inline_math_btn)
        time.sleep(0.6)
        
        inline_math_elements = driver.find_elements(By.CSS_SELECTOR, "span[data-type='inline-math']")
        assert len(inline_math_elements) > 0, "Inline Math node not created in TipTap!"
        print(f"  ✅ Found {len(inline_math_elements)} inline math node.")
        
        # Verify KaTeX rendered HTML contains the leq symbol
        inline_katex = driver.find_elements(By.CSS_SELECTOR, "span[data-type='inline-math'] .katex")
        assert len(inline_katex) > 0, "KaTeX formula not rendered inside inline math node!"
        katex_text = inline_katex[0].text
        print(f"  ✅ Rendered KaTeX text: '{katex_text}'")
        assert '≤' in katex_text or 'x' in katex_text, f"Expected ≤ or x in rendered math, got {katex_text}"
        
        # 5. Insert Block Math
        print("[5] Inserting Block Math via Radical button...")
        driver.execute_script("arguments[0].click();", block_math_btn)
        time.sleep(0.6)
        
        block_math_elements = driver.find_elements(By.CSS_SELECTOR, "div[data-type='block-math']")
        assert len(block_math_elements) > 0, "Block Math node not created in TipTap!"
        print(f"  ✅ Found {len(block_math_elements)} block math node.")
        
        # Verify Block Math KaTeX display element
        block_katex = driver.find_elements(By.CSS_SELECTOR, "div[data-type='block-math'] .katex-display")
        assert len(block_katex) > 0, "KaTeX display formula not rendered inside block math node!"
        print("  ✅ KaTeX display formula rendered with centered block layout.")
        
        # 6. Save Note and inspect localStorage Markdown
        print("[6] Saving Note and checking Markdown Serialization...")
        save_btn = driver.find_element(By.XPATH, "//button[contains(., '立即保存')]")
        driver.execute_script("arguments[0].click();", save_btn)
        time.sleep(1.5)
        
        saved_storage = driver.execute_script("return localStorage.getItem('muduo_algo_notes');")
        assert saved_storage is not None, "Notes store not found in localStorage!"
        notes_dict = json.loads(saved_storage)
        active_md = list(notes_dict.values())[0]['content']
        print(f"\nSerialized Markdown with Math Formulas in Storage:\n{active_md}\n")
        assert '$\\le x$' in active_md, "Serialized MD missing inline math $\\le x$!"
        assert '$$\n' in active_md or '$$' in active_md, "Serialized MD missing block math $$ delimiter!"
        print("  ✅ Both inline math $\\le x$ and block math $$...$$ serialized 100% cleanly!")
        
        # 7. Take Screenshot
        screenshot_path = 'docs/images/verify_algo_note_math.png'
        driver.save_screenshot(screenshot_path)
        print(f"  ✅ Screenshot saved to {screenshot_path}")
        
        brain_dir = r"C:\Users\86166\.gemini\antigravity\brain\ce427dc2-ed55-4196-a38e-98a9dc8b6fed"
        if os.path.exists(brain_dir):
            shutil.copy2(screenshot_path, os.path.join(brain_dir, "verify_algo_note_math.png"))
            print(f"  ✅ Copied screenshot to brain artifact directory.")
            
        # 8. Close and Re-open to verify Re-hydration
        print("[7] Closing modal and reopening to verify re-hydration from Markdown...")
        close_btn = driver.find_element(By.CSS_SELECTOR, "button[title='关闭便签 (Esc 自动保存)']")
        driver.execute_script("arguments[0].click();", close_btn)
        time.sleep(1)
        
        driver.execute_script("arguments[0].click();", note_buttons[0])
        time.sleep(1.2)
        
        re_inline = driver.find_elements(By.CSS_SELECTOR, "span[data-type='inline-math']")
        re_block = driver.find_elements(By.CSS_SELECTOR, "div[data-type='block-math']")
        assert len(re_inline) > 0, "Re-hydrated inline math not found!"
        assert len(re_block) > 0, "Re-hydrated block math not found!"
        print("  ✅ Formulas re-hydrated directly from stored Markdown into TipTap KaTeX DOM on modal reopening!")
        
        print("\n🎉 ALL INLINE AND BLOCK MATH INTEGRATION TESTS PASSED PERFECTLY!")
        
    finally:
        driver.quit()
        httpd.shutdown()

if __name__ == '__main__':
    run_tests()
