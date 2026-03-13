# 🍽️ Winnie's Food Map

An interactive culinary map showcasing food exploration records across Canada.

## 🚀 Quick Deployment to GitHub Pages

### Step 1: Create a GitHub Repository
1. Go to [github.com/new](https://github.com/new)
2. Repository name: `food-map` (or your preferred name)
3. Select **Public**
4. Click **Create repository**

### Step 2: Upload Files
```bash
# Execute in your local folder
git init
git add .
git commit -m "Initial commit: Food map website"
git branch -M main
git remote add origin https://github.com/你的帳號/food-map.git
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Navigate to Repository → **Settings**
2. Find **Pages** in the left sidebar
3. Under Source, select **Deploy from a branch**
4. Select **main** / **(root)** for the branch
5. Click **Save**

Wait 1-2 minutes, and your site will be live at:
`https://YourUsername.github.io/food-map/`

---

## 📝 How to Add Restaurants

Edit the `data/restaurants.json` file to add new entries:

```json
{
  "name": "Restaurant Name",
  "address": "Address",
  "lat": 43.6532,      // Latitude
  "lng": -79.3832,     // Longitude
  "cuisine": "Japanese", // Cuisie type
  "type": "Main Noodle", // Restaurant type
  "rating": 4,          // Rating 1-5
  "city": "Toronto",    // City
  "blog": "Your review link（Optional, otherwise use null）"
}
```

### How to get Coordinates (lat, lng)?

**Method 1: Google Maps**
1. Open [Google Maps](https://maps.google.com)
2. Search for the restaurant.
3. Right-click the location → The first line shows the coordinates.
4. Click to copy.

**Method 2: Extract from URL**
1. Search for the address.
2. The URL will contain something like `@43.6532,-79.3832,17z`
3. The first number is Latitude; the second is Longitude.

---

## 🎨 Custom Styles

Primary colors are located in the `:root` section of `css/style.css`:

```css
:root {
  --accent-primary: #6366f1;    /* Primary Accent */
  --accent-secondary: #a855f7;  /* Secondary Accent */
  --bg-primary: #0a0a0f;        /* Background Color */
}
```

---

## 📁 File Structure

```
food-map/
├── index.html           # Main Page
├── css/
│   └── style.css        # Stylesheets
├── js/
│   └── app.js           # Interactive Logic
├── data/
│   └── restaurants.json # Restaurant Data
└── README.md            # Documentation
```

---

## 🔧 Tech Stack

- **Mapping**: Leaflet.js + CartoDB Dark Tiles
- **Styling**: Pure CSS (Consistent with Portfolio design system)
- **Typography**: Outfit + JetBrains Mono
- **Hosting**: GitHub Pages (Free)

---

## 📱 Key Features

- ✅ Interactive Dark Mode Map
- ✅ Filter by City / Cuisine / Rating
- ✅ Detailed Info & Reviews on Click
- ✅ One-tap Google Maps Navigation
- ✅ Fully Responsive (Mobile / Tablet / Desktop)
- ✅ Consistent UI style with Portfolio

---

Made by Winnie
