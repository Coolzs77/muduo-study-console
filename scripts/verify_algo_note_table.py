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
    PORT = 4212
    httpd = socketserver.TCPServer(("127.0.0.1", PORT), DistHandler)
    server_thread = threading.Thread(target=httpd.serve_forever, daemon=True)
    server_thread.start()
    print(f"[*] Local static server serving {DIST_DIR} on http://127.0.0.1:{PORT}")
    
    opts = Options()
    opts.add_argument('--headless=new')
    opts.add_argument('--window-size=1280,900')
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
        
        # 3. Verify Table Toolbar Button
        print("[3] Verifying Table toolbar button...")
        table_btn = driver.find_element(By.CSS_SELECTOR, "button[aria-label='表格']")
        assert table_btn is not None, "Table toolbar button not found!"
        print("  ✅ Table toolbar button located.")
        
        # Clear existing content if any
        editor = driver.find_element(By.CSS_SELECTOR, ".ProseMirror")
        driver.execute_script("arguments[0].innerHTML = '<p></p>';", editor)
        time.sleep(0.3)
        
        # Click Table button to insert 3x3 table
        print("[4] Inserting 3x3 GFM table via toolbar button...")
        driver.execute_script("arguments[0].click();", table_btn)
        time.sleep(0.6)
        
        tables = driver.find_elements(By.CSS_SELECTOR, ".ProseMirror table")
        assert len(tables) > 0, "Table element was not created in editor!"
        print("  ✅ Table DOM node created successfully in TipTap.")
        
        # Verify Table styling (th, td, border, rounded)
        th_elements = driver.find_elements(By.CSS_SELECTOR, ".ProseMirror th")
        td_elements = driver.find_elements(By.CSS_SELECTOR, ".ProseMirror td")
        print(f"  ✅ Found {len(th_elements)} header cells and {len(td_elements)} data cells (expected 3 th, 6 td for 3x3 table).")
        assert len(th_elements) == 3, f"Expected 3 th headers, got {len(th_elements)}"
        assert len(td_elements) == 6, f"Expected 6 td cells, got {len(td_elements)}"
        
        # Verify table styles
        th_bg = driver.execute_script("return window.getComputedStyle(arguments[0]).backgroundColor;", th_elements[0])
        print(f"  ✅ Table Header background computed color: {th_bg}")
        
        # 5. Populate Table Cells via real typing and Tab navigation
        print("[5] Populating table cells with sample complexity matrix via Tab navigation...")
        th_elements[0].click()
        time.sleep(0.3)
        driver.switch_to.active_element.send_keys("操作类型")
        driver.switch_to.active_element.send_keys(Keys.TAB)
        time.sleep(0.2)
        driver.switch_to.active_element.send_keys("时间复杂度")
        driver.switch_to.active_element.send_keys(Keys.TAB)
        time.sleep(0.2)
        driver.switch_to.active_element.send_keys("空间复杂度")
        driver.switch_to.active_element.send_keys(Keys.TAB)
        time.sleep(0.2)
        driver.switch_to.active_element.send_keys("二分查找")
        driver.switch_to.active_element.send_keys(Keys.TAB)
        time.sleep(0.2)
        driver.switch_to.active_element.send_keys("O(log n)")
        driver.switch_to.active_element.send_keys(Keys.TAB)
        time.sleep(0.2)
        driver.switch_to.active_element.send_keys("O(1)")
        time.sleep(0.5)

        # 6. Trigger manual save or wait for debounced auto-save
        print("[6] Saving table note...")
        save_btn = driver.find_element(By.XPATH, "//button[contains(., '立即保存')]")
        driver.execute_script("arguments[0].click();", save_btn)
        time.sleep(1.5)
        
        # Check localStorage saved Markdown
        saved_storage = driver.execute_script("return localStorage.getItem('muduo_algo_notes');")
        assert saved_storage is not None, "Notes store not found in localStorage!"
        notes_dict = json.loads(saved_storage)
        assert len(notes_dict) > 0, "Notes dict is empty!"
        
        # Get active note content
        active_md = list(notes_dict.values())[0]['content']
        print(f"\nSaved Markdown Table in Storage:\n{active_md}\n")
        assert '| 操作类型 | 时间复杂度 | 空间复杂度 |' in active_md, "Serialized MD missing header row!"
        assert '| --- | --- | --- |' in active_md or '| --- |' in active_md, "Serialized MD missing table delimiter!"
        assert '二分查找' in active_md and 'O(log n)' in active_md, "Serialized MD missing data row 1!"
        print("  ✅ GFM Table Markdown serialization roundtrip verified 100%!")
        
        # 7. Take screenshot of table rendering in note modal
        screenshot_path = 'docs/images/verify_algo_note_table.png'
        driver.save_screenshot(screenshot_path)
        print(f"  ✅ Screenshot saved to {screenshot_path}")
        
        # Copy to brain artifact directory if exists
        brain_dir = r"C:\Users\86166\.gemini\antigravity\brain\ce427dc2-ed55-4196-a38e-98a9dc8b6fed"
        if os.path.exists(brain_dir):
            shutil.copy2(screenshot_path, os.path.join(brain_dir, "verify_algo_note_table.png"))
            print(f"  ✅ Copied screenshot to brain artifact directory.")
            
        # 8. Close Modal and Re-open to verify Markdown -> TipTap Table re-hydration
        print("[7] Closing modal and reopening to verify roundtrip re-hydration...")
        close_btn = driver.find_element(By.CSS_SELECTOR, "button[title='关闭便签 (Esc 自动保存)']")
        driver.execute_script("arguments[0].click();", close_btn)
        time.sleep(1)
        
        # Re-open note modal
        note_buttons = driver.find_elements(By.CSS_SELECTOR, "button[title='做题便签'], button[title='做题便签 (已有笔记)']")
        driver.execute_script("arguments[0].click();", note_buttons[0])
        time.sleep(1)
        
        re_tables = driver.find_elements(By.CSS_SELECTOR, ".ProseMirror table")
        assert len(re_tables) > 0, "Re-hydrated table not found on reopening modal!"
        re_text = driver.find_element(By.CSS_SELECTOR, ".ProseMirror table").text
        assert '操作类型' in re_text and '二分查找' in re_text, "Re-hydrated table content mismatch!"
        print("  ✅ Table cleanly re-hydrated from Markdown into TipTap DOM on modal reopening!")
        
        print("\n🎉 ALL TABLE INTEGRATION AND SERIALIZATION TESTS PASSED PERFECTLY!")
        
    finally:
        driver.quit()
        httpd.shutdown()

if __name__ == '__main__':
    run_tests()
