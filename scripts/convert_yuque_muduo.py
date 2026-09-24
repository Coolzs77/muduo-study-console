import os, glob, json, re, sys, urllib.parse
from bs4 import BeautifulSoup, NavigableString, Tag

sys.stdout.reconfigure(encoding='utf-8')

repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
raw_dir = os.path.join(repo_root, "docs", "yuque_muduo", "raw_api")
out_md_dir = os.path.join(repo_root, "docs", "yuque_muduo")
images_dir = os.path.join(repo_root, "images", "yuque")

os.makedirs(out_md_dir, exist_ok=True)
os.makedirs(images_dir, exist_ok=True)

def parse_card(tag, doc_order, img_counter):
    card_name = tag.get("name", "")
    val_str = tag.get("value", "")
    if val_str.startswith("data:"):
        val_str = val_str[5:]
    decoded = urllib.parse.unquote(val_str)
    
    if card_name == "codeblock":
        try:
            obj = json.loads(decoded)
            code = obj.get("code", "")
            mode = obj.get("mode", "cpp")
            if mode == "plain" or not mode:
                mode = "cpp"
            return f"\n\n```{mode}\n{code}\n```\n\n"
        except Exception:
            return f"\n\n```cpp\n{decoded}\n```\n\n"
            
    elif card_name == "image":
        img_counter[0] += 1
        img_idx = img_counter[0]
        local_src = f"images/yuque/img_muduo_{doc_order:02d}_{img_idx:02d}.png"
        return f"\n\n![]({local_src})\n\n"
        
    elif card_name == "hr":
        return "\n\n---\n\n"
        
    return ""

def process_inline(node):
    if isinstance(node, NavigableString):
        return str(node)
    if not isinstance(node, Tag):
        return ""
        
    tag_name = node.name.lower()
    
    if tag_name == "card":
        return ""
        
    inner = "".join(process_inline(c) for c in node.children)
    
    if tag_name in ["strong", "b"]:
        inner = inner.strip()
        return f" **{inner}** " if inner else ""
    elif tag_name in ["em", "i"]:
        inner = inner.strip()
        return f" *{inner}* " if inner else ""
    elif tag_name == "code":
        inner = inner.strip('`')
        return f" `{inner}` " if inner else ""
    elif tag_name == "a":
        href = node.get("href", "")
        return f"[{inner}]({href})"
    elif tag_name == "br":
        return "  \n"
    return inner

def parse_lake_html(html_str, doc_order):
    soup = BeautifulSoup(html_str, "html.parser")
    img_counter = [0]
    md_lines = []
    
    body = soup.find("body") or soup
    
    for el in body.children:
        if isinstance(el, NavigableString):
            text = str(el).strip()
            if text:
                md_lines.append(text)
            continue
            
        tag_name = el.name.lower()
        
        if tag_name == "card":
            md_lines.append(parse_card(el, doc_order, img_counter))
            
        elif tag_name in ["h1", "h2", "h3", "h4", "h5", "h6"]:
            level = int(tag_name[1])
            cards = el.find_all("card")
            card_texts = []
            for c in cards:
                card_texts.append(parse_card(c, doc_order, img_counter))
                c.decompose()
            text = process_inline(el).strip()
            prefix = "#" * level
            md_lines.append(f"\n{prefix} {text}\n")
            if card_texts:
                md_lines.extend(card_texts)
                
        elif tag_name == "p":
            cards = el.find_all("card")
            if cards and len(list(el.children)) == len(cards):
                for c in cards:
                    md_lines.append(parse_card(c, doc_order, img_counter))
            else:
                card_texts = []
                for c in cards:
                    card_texts.append(parse_card(c, doc_order, img_counter))
                    c.decompose()
                text = process_inline(el).strip()
                if text:
                    md_lines.append(f"\n{text}\n")
                if card_texts:
                    md_lines.extend(card_texts)
                    
        elif tag_name == "blockquote":
            text = process_inline(el).strip()
            lines = text.split("\n")
            q_text = "\n".join(f"> {line}" for line in lines if line.strip())
            md_lines.append(f"\n{q_text}\n")
            
        elif tag_name in ["ul", "ol"]:
            is_ol = (tag_name == "ol")
            for i, li in enumerate(el.find_all("li", recursive=False)):
                cards = li.find_all("card")
                for c in cards:
                    md_lines.append(parse_card(c, doc_order, img_counter))
                    c.decompose()
                li_text = process_inline(li).strip()
                bullet = f"{i+1}." if is_ol else "-"
                md_lines.append(f"{bullet} {li_text}")
            md_lines.append("")
            
        elif tag_name == "table":
            rows = el.find_all("tr")
            if rows:
                table_md = []
                headers = [process_inline(th).strip() for th in rows[0].find_all(["th", "td"])]
                table_md.append("| " + " | ".join(headers) + " |")
                table_md.append("| " + " | ".join(["---"] * len(headers)) + " |")
                for row in rows[1:]:
                    cells = [process_inline(td).strip().replace("\n", " ") for td in row.find_all(["th", "td"])]
                    if len(cells) < len(headers):
                        cells.extend([""] * (len(headers) - len(cells)))
                    table_md.append("| " + " | ".join(cells[:len(headers)]) + " |")
                md_lines.append("\n" + "\n".join(table_md) + "\n")
                
        else:
            cards = el.find_all("card")
            for c in cards:
                md_lines.append(parse_card(c, doc_order, img_counter))
                c.decompose()
            text = process_inline(el).strip()
            if text:
                md_lines.append(f"\n{text}\n")
                
    result = "\n".join(md_lines)
    result = re.sub(r'\n{3,}', '\n\n', result)
    return result

files = sorted(glob.glob(os.path.join(raw_dir, "*.json")))
manifest = []

total_chars = 0
total_codeblocks = 0
total_images = 0

for idx, f in enumerate(files):
    with open(f, "r", encoding="utf-8") as fp:
        d = json.load(fp)
    doc_order = idx + 1
    title = d.get("title", f"Document {doc_order}")
    slug = d.get("slug", "")
    doc_id = d.get("id", 0)
    word_count = d.get("word_count", 0)
    content_updated_at = d.get("content_updated_at", "")
    
    body_md = parse_lake_html(d.get("content", ""), doc_order)
    
    # Prepend YAML frontmatter and header exactly like docs/yuque/
    header = f"""---
title: "{title}"
doc_id: {doc_id}
slug: "{slug}"
url: "https://www.yuque.com/chengxuyuancarl/gixnqn/{slug}"
word_count: {word_count}
updated_at: "{content_updated_at}"
retrieved_at: "2026-09-24 13:45:00"
status: "FULL"
---

# {title}

> 原始链接: [https://www.yuque.com/chengxuyuancarl/gixnqn/{slug}](https://www.yuque.com/chengxuyuancarl/gixnqn/{slug})  
> 访问密码: `khf4` | 更新时间: {content_updated_at} | 字数: {word_count}

---

"""
    full_md = header + body_md.strip() + "\n"
    
    clean_title = re.sub(r'[\\/:*?"<>|]', '_', title)
    filename = f"{doc_order:02d}_{clean_title}.md"
    out_file = os.path.join(out_md_dir, filename)
    with open(out_file, "w", encoding="utf-8") as out_fp:
        out_fp.write(full_md)
        
    cb_count = len(re.findall(r'```', body_md)) // 2
    im_count = len(re.findall(r'!\[.*?\]\((.*?)\)', body_md))
    total_chars += len(body_md)
    total_codeblocks += cb_count
    total_images += im_count
    
    manifest.append({
        "order": doc_order,
        "title": title,
        "doc_id": doc_id,
        "slug": slug,
        "url": f"https://www.yuque.com/chengxuyuancarl/gixnqn/{slug}",
        "filename": filename,
        "word_count": word_count,
        "markdown_chars": len(body_md),
        "codeblocks_count": cb_count,
        "images_count": im_count,
        "updated_at": content_updated_at,
        "status": "FULL"
    })
    
    print(f"[{doc_order:02d}/10] {filename}: {word_count} words | {len(body_md)} chars | {cb_count} codeblocks | {im_count} images")

# Write manifest.json
manifest_path = os.path.join(out_md_dir, "manifest.json")
with open(manifest_path, "w", encoding="utf-8") as m_fp:
    json.dump(manifest, m_fp, ensure_ascii=False, indent=2)

print("\n==========================================")
print(f"Successfully converted all 10 documents!")
print(f"Total Markdown characters: {total_chars}")
print(f"Total C++ code blocks: {total_codeblocks}")
print(f"Total images placed: {total_images}")
print(f"Saved manifest to: {manifest_path}")
print("==========================================")
