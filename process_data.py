#!/usr/bin/env python3
"""
處理 Notion 匯出的美食資料，轉換地址為座標
"""
import csv
import json
import os
import re
import glob
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut
import time

# 初始化 geocoder
geolocator = Nominatim(user_agent="winnie_foodmap_v1", timeout=10)

def clean_address(addr):
    """清理地址格式"""
    if not addr:
        return None
    # 移除換行符號，清理多餘空格
    addr = addr.replace('\n', ', ').replace('\r', '')
    addr = re.sub(r'\s+', ' ', addr).strip()
    # 確保有 Canada
    if 'Canada' not in addr and 'CA' not in addr:
        addr += ', Canada'
    return addr

def geocode_address(address, retries=3):
    """將地址轉換為經緯度"""
    if not address:
        return None, None
    
    for attempt in range(retries):
        try:
            location = geolocator.geocode(address)
            if location:
                return location.latitude, location.longitude
            # 嘗試簡化地址
            parts = address.split(',')
            if len(parts) > 2:
                simplified = ', '.join(parts[:2]) + ', Canada'
                location = geolocator.geocode(simplified)
                if location:
                    return location.latitude, location.longitude
        except GeocoderTimedOut:
            time.sleep(1)
        except Exception as e:
            print(f"Error geocoding {address}: {e}")
        time.sleep(0.5)
    return None, None

def count_stars(rating_str):
    """計算星星數量"""
    if not rating_str:
        return 0
    return rating_str.count('🌟')

def read_blog_content(name, base_path):
    """讀取對應的 blog 內容"""
    # 尋找匹配的 md 檔案
    pattern = os.path.join(base_path, f"{name}*.md")
    matches = glob.glob(pattern)
    
    if not matches:
        # 嘗試模糊匹配
        all_mds = glob.glob(os.path.join(base_path, "*.md"))
        for md_file in all_mds:
            filename = os.path.basename(md_file)
            if name.lower() in filename.lower():
                matches = [md_file]
                break
    
    if matches:
        try:
            with open(matches[0], 'r', encoding='utf-8') as f:
                content = f.read()
                # 移除標題行和元資料，保留正文
                lines = content.split('\n')
                body_lines = []
                in_body = False
                for line in lines:
                    if line.startswith('Post:'):
                        in_body = True
                        continue
                    if in_body and line.strip():
                        body_lines.append(line)
                    elif not in_body and not any(line.startswith(x) for x in ['#', 'Google map', 'Kinds:', 'Types:', 'Rating:', 'Post:']):
                        if line.strip():
                            body_lines.append(line)
                
                return '\n'.join(body_lines[-20:]) if body_lines else None  # 最後20行作為摘要
        except Exception as e:
            print(f"Error reading {matches[0]}: {e}")
    return None

def process_csv_files(base_path):
    """處理所有 EAT EAT EAT CSV 檔案"""
    all_restaurants = []
    
    # 找到所有 EAT CSV 檔案（非 _all 版本）
    csv_files = glob.glob(os.path.join(base_path, "EAT EAT EAT *.csv"))
    csv_files = [f for f in csv_files if '_all' not in f]
    
    # 地區對應
    region_map = {}
    md_files = glob.glob(os.path.join(base_path, "*.md"))
    for md in md_files:
        name = os.path.basename(md).split(' ')[0]
        if name in ['Toronto', 'Montreal', 'Ottawa', 'Kingston', 'Hamilton', 'Niagara', 
                    'Guelph', 'Orangeville', 'Vancouver', 'Calgary', 'Banff', 'Quebec',
                    'Huntsville', 'Orillia', 'Algonquin']:
            region_map[name] = name
    
    seen_names = set()
    
    for csv_file in csv_files:
        print(f"Processing: {csv_file}")
        try:
            with open(csv_file, 'r', encoding='utf-8-sig') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    name = row.get("Can't stop Eating", "").strip()
                    if not name or name in seen_names:
                        continue
                    seen_names.add(name)
                    
                    address = row.get("Google map Thank you", "")
                    kinds = row.get("Kinds", "")
                    types = row.get("Types", "")
                    rating = row.get("Rating", "")
                    
                    clean_addr = clean_address(address)
                    lat, lng = geocode_address(clean_addr)
                    
                    if lat and lng:
                        # 讀取 blog 內容
                        blog = read_blog_content(name, base_path)
                        
                        restaurant = {
                            "name": name,
                            "address": clean_addr,
                            "lat": lat,
                            "lng": lng,
                            "cuisine": kinds,
                            "type": types,
                            "rating": count_stars(rating),
                            "blog": blog
                        }
                        all_restaurants.append(restaurant)
                        print(f"  ✓ {name}: ({lat:.4f}, {lng:.4f})")
                    else:
                        print(f"  ✗ {name}: Could not geocode")
                    
                    time.sleep(0.3)  # 避免 API 限制
                    
        except Exception as e:
            print(f"Error processing {csv_file}: {e}")
    
    return all_restaurants

def main():
    base_path = "/home/claude"
    output_path = "/home/claude/foodmap/data/restaurants.json"
    
    print("="*50)
    print("🍜 Processing Notion Food Data")
    print("="*50)
    
    restaurants = process_csv_files(base_path)
    
    print(f"\n✅ Total restaurants processed: {len(restaurants)}")
    
    # 儲存 JSON
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(restaurants, f, ensure_ascii=False, indent=2)
    
    print(f"📁 Saved to: {output_path}")
    
    # 輸出統計
    cuisines = {}
    for r in restaurants:
        c = r['cuisine']
        cuisines[c] = cuisines.get(c, 0) + 1
    
    print("\n📊 Cuisine breakdown:")
    for c, count in sorted(cuisines.items(), key=lambda x: -x[1]):
        print(f"   {c}: {count}")

if __name__ == "__main__":
    main()
