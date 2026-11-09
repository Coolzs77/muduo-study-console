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
    PORT = 4209
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
        time.sleep(1)
        
        modal = WebDriverWait(driver, 5).until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, "div[role='dialog']"))
        )
        assert modal.is_displayed(), "AlgoNoteModal is not displayed!"
        print("  ✓ [PASS] AlgoNoteModal opened successfully!")

        # 2.5 Verify Problem Sub-line: Solution Pattern & Big-O Complexity
        print("[2.5] Verifying Solution Pattern & Complexity display in Header...")
        modal_header_text = modal.find_element(By.CSS_SELECTOR, ".border-b").text
        print("  Modal Header text:\n", modal_header_text)
        assert "解法:" in modal_header_text, "Error: '解法:' label missing from problem header!"
        assert "O(" in modal_header_text, "Error: Big-O complexity missing from problem header!"
        print("  ✓ [PASS] Problem solution pattern and complexity accurately displayed below title!")
        
        # 3. Test Requirement: Save text strictly ON THE RIGHT of toolbar buttons, NOT BELOW
        print("[3] Testing Toolbar Layout & Save Status Horizontal Positioning...")
        toolbar = modal.find_element(By.CSS_SELECTOR, ".rounded-xl.bg-slate-100\\/90, .rounded-xl")
        save_status_container = modal.find_element(By.CSS_SELECTOR, "div.font-mono.shrink-0.whitespace-nowrap")
        
        toolbar_rect = driver.execute_script("return arguments[0].getBoundingClientRect();", toolbar)
        status_rect = driver.execute_script("return arguments[0].getBoundingClientRect();", save_status_container)
        
        print(f"  Toolbar rect: top={toolbar_rect['top']}, bottom={toolbar_rect['bottom']}, right={toolbar_rect['right']}")
        print(f"  Status rect:  top={status_rect['top']}, bottom={status_rect['bottom']}, left={status_rect['left']}")
        
        # Verify vertical alignment (both in the same row)
        vertical_diff = abs(toolbar_rect['top'] - status_rect['top'])
        assert vertical_diff < 15, f"Error: Save status wrapped to next line! vertical diff: {vertical_diff}px"
        # Verify horizontal positioning (strictly on the right side of toolbar)
        assert status_rect['left'] >= toolbar_rect['right'] - 10, f"Error: Status text ({status_rect['left']}) is not to the right of toolbar ({toolbar_rect['right']})!"
        print("  ✓ [PASS] Save status text is STRICTLY on the right of formatting buttons on the same row! No line wrapping!")
        
        # 4. Test Requirement: Single click toggle on/off for buttons (not staying stuck)
        print("[4] Testing Button Single-Click Toggle Mechanics (On / Off)...")
        prose_mirror = modal.find_element(By.CSS_SELECTOR, ".ProseMirror")
        driver.execute_script("arguments[0].focus();", prose_mirror)
        time.sleep(0.3)
        
        # Test Bold button toggle
        bold_btn = modal.find_element(By.CSS_SELECTOR, "button[aria-label='加粗']")
        class_before = bold_btn.get_attribute('class')
        print("  Bold button initial class:", class_before)
        assert 'text-blue-700' not in class_before, "Bold button should not be active initially!"
        
        # Click 1: Turn ON Bold
        driver.execute_script("arguments[0].click();", bold_btn)
        time.sleep(0.3)
        class_after_click1 = bold_btn.get_attribute('class')
        print("  Bold button after click 1:", class_after_click1)
        assert 'text-blue-700' in class_after_click1 or 'bg-blue-100' in class_after_click1, "Bold button failed to turn active!"
        
        # Click 2: Turn OFF Bold (Toggle off, must not stay stuck)
        driver.execute_script("arguments[0].click();", bold_btn)
        time.sleep(0.3)
        class_after_click2 = bold_btn.get_attribute('class')
        print("  Bold button after click 2:", class_after_click2)
        assert 'text-blue-700' not in class_after_click2 and 'bg-blue-100' not in class_after_click2, "Bold button stayed stuck in active state!"
        print("  ✓ [PASS] Bold button successfully toggled ON and OFF via single clicks!")
        
        # Test H1 button toggle
        h1_btn = modal.find_element(By.CSS_SELECTOR, "button[aria-label='一级标题']")
        driver.execute_script("arguments[0].click();", h1_btn)
        time.sleep(0.3)
        class_h1_on = h1_btn.get_attribute('class')
        print("  H1 button after click 1:", class_h1_on)
        assert 'text-sky-700' in class_h1_on or 'bg-sky-100' in class_h1_on, "H1 button failed to turn active!"
        
        # Click H1 again to toggle off back to paragraph
        driver.execute_script("arguments[0].click();", h1_btn)
        time.sleep(0.3)
        class_h1_off = h1_btn.get_attribute('class')
        print("  H1 button after click 2:", class_h1_off)
        assert 'text-sky-700' not in class_h1_off and 'bg-sky-100' not in class_h1_off, "H1 button stayed stuck in active state!"
        print("  ✓ [PASS] H1 button successfully toggled ON and OFF (switched back to paragraph)!")
        
        # 5. Test Requirement: Distinct colors for different formatting categories
        print("[5] Testing Category-Distinct Color System (No single monotone yellow)...")
        buttons = {
            '加粗': ('button[aria-label="加粗"]', 'blue'),
            '斜体': ('button[aria-label="斜体"]', 'purple'),
            '行内代码': ('button[aria-label="行内代码"]', 'cyan'),
            '一级标题': ('button[aria-label="一级标题"]', 'sky'),
            '二级标题': ('button[aria-label="二级标题"]', 'indigo'),
            '待办清单': ('button[aria-label="待办清单"]', 'emerald'),
            '代码块': ('button[aria-label="代码块"]', 'rose'),
            '引用块': ('button[aria-label="引用块"]', 'amber')
        }
        
        color_found = set()
        for label, (selector, color_keyword) in buttons.items():
            btn = modal.find_element(By.CSS_SELECTOR, selector)
            btn_html = btn.get_attribute('outerHTML')
            assert color_keyword in btn_html, f"Button {label} missing expected color theme '{color_keyword}' in HTML: {btn_html}"
            color_found.add(color_keyword)
            print(f"  ✓ Button '{label}' accurately themed with distinct color: {color_keyword}")
        
        assert len(color_found) >= 6, f"Expected at least 6 distinct color themes across toolbar, found {len(color_found)}"
        print("  ✓ [PASS] Multiple distinct colors assigned to different feature categories! Monotone yellow eradicated!")
        
        # 6. Test Requirement: CodeBlock content real-time syntax highlighting
        print("[6] Testing Real-time CodeBlock Syntax Highlighting in Editor...")
        # Clear editor first
        driver.execute_script("arguments[0].focus();", prose_mirror)
        prose_mirror.send_keys(Keys.CONTROL, "a")
        prose_mirror.send_keys(Keys.BACKSPACE)
        time.sleep(0.3)
        
        # Click CodeBlock button to insert code block
        code_block_btn = modal.find_element(By.CSS_SELECTOR, "button[aria-label='代码块']")
        driver.execute_script("arguments[0].click();", code_block_btn)
        time.sleep(0.5)
        
        # Type C++ snippet with multiple tokens
        sample_code = "int search(vector<int>& nums, int target) {\n  // Two pointer solution\n  int left = 0;\n  return -1;\n}"
        driver.execute_script("arguments[0].focus();", prose_mirror)
        prose_mirror.send_keys(sample_code)
        time.sleep(1)
        
        # Verify syntax highlighting spans exist inside codeBlock
        highlight_spans = driver.find_elements(By.CSS_SELECTOR, ".ProseMirror pre code span[class*='hljs-']")
        print(f"  Found {len(highlight_spans)} syntax highlighted token spans inside CodeBlock.")
        assert len(highlight_spans) > 0, "Error: No hljs syntax highlight spans found inside CodeBlock!"
        
        token_types = set()
        for span in highlight_spans:
            cls = span.get_attribute('class')
            txt = span.text
            token_types.add(cls)
            print(f"    Token: '{txt}' -> class: '{cls}'")
            
        assert any('hljs-type' in c or 'hljs-keyword' in c for c in token_types), "Error: Missing hljs-type/keyword!"
        assert any('hljs-comment' in c for c in token_types), "Error: Missing hljs-comment!"
        print("  ✓ [PASS] C++ CodeBlock actively rendered with real-time VSCode syntax highlighting tokens (types, comments, keywords, numbers)!")
        
        # 7. Capture visual proof screenshot
        shot_path = 'docs/images/verify_algo_note_multitoggle_and_highlight.png'
        driver.save_screenshot(shot_path)
        print(f"  ✓ Saved visual verification screenshot to: {shot_path}")
        
        # 8. Close modal with Esc
        print("[8] Testing Modal clean exit via Esc...")
        prose_mirror.send_keys(Keys.ESCAPE)
        time.sleep(1)
        modals_left = driver.find_elements(By.CSS_SELECTOR, "div[role='dialog']")
        visible_modals = [m for m in modals_left if m.is_displayed()]
        assert len(visible_modals) == 0, "Modal did not close on Esc!"
        print("  ✓ [PASS] Modal closed cleanly!")
        
        print("\n🎉🎉🎉 ALL ALGO NOTE MULTI-COLOR, TOGGLE & SYNTAX HIGHLIGHT VERIFICATIONS PASSED 100%! 🎉🎉🎉")
        
    finally:
        driver.quit()
        httpd.shutdown()
        httpd.server_close()

if __name__ == '__main__':
    run_tests()
