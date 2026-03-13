# 🍜 Winnie's Food Map

互動式美食地圖網站，展示加拿大各地的美食探索紀錄。

## 🚀 快速部署到 GitHub Pages

### 步驟 1: 建立 GitHub Repository
1. 前往 [github.com/new](https://github.com/new)
2. Repository name: `food-map` (或你喜歡的名稱)
3. 選擇 **Public**
4. 點擊 **Create repository**

### 步驟 2: 上傳檔案
```bash
# 在本地資料夾執行
git init
git add .
git commit -m "Initial commit: Food map website"
git branch -M main
git remote add origin https://github.com/你的帳號/food-map.git
git push -u origin main
```

### 步驟 3: 啟用 GitHub Pages
1. 進入 Repository → **Settings**
2. 左側選單找到 **Pages**
3. Source 選擇 **Deploy from a branch**
4. Branch 選擇 **main** / **(root)**
5. 點擊 **Save**

等待約 1-2 分鐘，你的網站就會在：
`https://你的帳號.github.io/food-map/`

---

## 📝 如何新增餐廳

編輯 `data/restaurants.json` 檔案，新增餐廳資料：

```json
{
  "name": "餐廳名稱",
  "address": "地址",
  "lat": 43.6532,      // 緯度
  "lng": -79.3832,     // 經度
  "cuisine": "Japanese", // 料理類型
  "type": "Main Noodle", // 餐點類型
  "rating": 4,          // 評分 1-5
  "city": "Toronto",    // 城市
  "blog": "你的心得文章（可選，留空則填 null）"
}
```

### 如何取得座標 (lat, lng)？

**方法 1: Google Maps**
1. 打開 [Google Maps](https://maps.google.com)
2. 搜尋餐廳名稱
3. 右鍵點擊地點 → 第一行就是座標
4. 點擊複製座標

**方法 2: 直接從地址搜尋**
1. 搜尋餐廳地址
2. 網址中會有類似 `@43.6532,-79.3832,17z`
3. 第一個數字是緯度，第二個是經度

---

## 🎨 自訂樣式

主要顏色在 `css/style.css` 的 `:root` 區塊：

```css
:root {
  --accent-primary: #6366f1;    /* 主色調 */
  --accent-secondary: #a855f7;  /* 次要色調 */
  --bg-primary: #0a0a0f;        /* 背景色 */
}
```

---

## 📁 檔案結構

```
food-map/
├── index.html           # 主頁面
├── css/
│   └── style.css        # 樣式檔
├── js/
│   └── app.js           # 互動邏輯
├── data/
│   └── restaurants.json # 餐廳資料
└── README.md            # 說明文件
```

---

## 🔧 技術堆疊

- **地圖**: Leaflet.js + CartoDB Dark Tiles
- **樣式**: 純 CSS (與 Portfolio 一致的設計系統)
- **字體**: Outfit + JetBrains Mono
- **託管**: GitHub Pages (免費)

---

## 📱 功能特色

- ✅ 互動式深色地圖
- ✅ 按城市/料理類型/評分篩選
- ✅ 點擊查看詳細資訊和心得
- ✅ 一鍵開啟 Google Maps 導航
- ✅ 響應式設計 (手機/平板/電腦)
- ✅ 與 Portfolio 風格一致

---

Made with 🍜 by Winnie
