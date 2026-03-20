# ✦ StyleHub Decors
### Luxury Pinterest-Style Affiliate Platform

---

## 🆓 Free Services Used (No Credit Card Needed)

| Service     | What For               | Free Tier                         |
|-------------|------------------------|-----------------------------------|
| **Firebase**    | Database + Auth    | 1GB storage, 50K reads/day        |
| **Cloudinary**  | Image hosting      | 25GB storage, 25GB bandwidth/mo   |
| **Vercel**      | Site hosting       | Unlimited hobby projects          |
| **Amazon Associates** | Earn commission | Free to join                  |

**Total monthly cost: ₹0**

---

## 🗂 Project Structure

```
stylehub-decors/
├── app/
│   ├── layout.jsx              # Root layout + fonts
│   ├── globals.css             # Full design system
│   ├── page.jsx                # 🏠 Homepage
│   ├── loading.jsx             # Loading skeleton
│   ├── not-found.jsx           # 404 page
│   ├── error.jsx               # Error boundary
│   ├── fashion/page.jsx        # 👗 Fashion category
│   ├── home-decor/page.jsx     # 🏡 Home Decor category
│   └── [category]/[slug]/      # 💰 Money pages
│       └── page.jsx
│
├── components/
│   ├── Navbar.jsx              # Glass sticky navbar
│   ├── Footer.jsx              # Footer + 5-click admin trigger
│   ├── PostCard.jsx            # Pinterest card
│   ├── ProductCard.jsx         # Conversion product block
│   └── admin/
│       ├── AdminModal.jsx      # Admin modal container
│       ├── AdminDashboard.jsx  # Posts, stats, analytics
│       └── PostForm.jsx        # Create/edit with image upload
│
├── hooks/
│   ├── useClickTracker.js      # Track affiliate clicks
│   └── usePostView.js          # Track page views
│
├── lib/
│   ├── firebase.js             # Firebase init
│   ├── firestore.js            # All DB helpers
│   ├── cloudinary.js           # Image upload (FREE)
│   └── utils.js                # Helpers
│
├── .env.example                # ← Copy to .env.local
├── next.config.js
├── tailwind.config.js
├── vercel.json
└── package.json
```

---

## 🚀 Setup Guide (Full Step-by-Step)

### Step 1 — Install dependencies

```bash
npm install
```

---

### Step 2 — Firebase Setup (10 min, FREE)

Firebase stores your **post data** and handles **admin login**.

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add Project"** → name it `stylehub-decors` → Create

**Enable Firestore:**
- Left menu → **Firestore Database** → Create database
- Choose **Production mode** → Select a region → Done

**Add Security Rules** (paste this exactly):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null;
      match /products/{productId} {
        allow read: if true;
        allow write: if request.auth != null;
      }
    }
    match /analytics/{id} {
      allow create: if true;
      allow read: if request.auth != null;
    }
  }
}
```

**Enable Authentication:**
- Left menu → **Authentication** → Get started
- **Sign-in method** tab → Enable **Email/Password**
- **Users** tab → **Add User** → Enter your email + password
  (this is your admin login)

**Get Firebase Config:**
- Top left: ⚙️ → **Project settings**
- Scroll down to **"Your apps"** → Click **Web** (`</>`)
- Register app → Copy the `firebaseConfig` object

---

### Step 3 — Cloudinary Setup (5 min, FREE)

Cloudinary stores your **post cover images** and **product images**.
25GB free — more than enough for years.

1. Sign up free at [cloudinary.com](https://cloudinary.com) — no credit card
2. After login, note your **Cloud Name** (shown on dashboard)
3. Go to: **Settings** (⚙️) → **Upload** tab → scroll to **Upload Presets**
4. Click **"Add upload preset"**
   - **Signing Mode:** `Unsigned` ← important!
   - **Preset name:** `stylehub-decors-uploads` (or any name)
   - **Folder:** `stylehub-decors` (optional, keeps images organised)
   - Click **Save**
5. Copy the preset name

---

### Step 4 — Environment Variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in:

```env
# Firebase (from Project Settings → Your apps → Web)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=stylehub-decors-abc.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=stylehub-decors-abc
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc...

# Cloudinary (from your dashboard)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=stylehub-decors-uploads

# Site
NEXT_PUBLIC_SITE_URL=https://your-site.vercel.app

# Amazon tag
NEXT_PUBLIC_AMAZON_TAG=yourname-21
```

---

### Step 5 — Run Locally

```bash
npm run dev
# → http://localhost:3000
```

---

### Step 6 — Deploy to Vercel (FREE)

**Option A — Vercel CLI:**
```bash
npm i -g vercel
vercel
# When asked: add environment variables
# Paste each value from .env.local
```

**Option B — GitHub (recommended for updates):**
```bash
git init && git add . && git commit -m "Initial commit"
# Push to GitHub
# Connect repo at vercel.com/new
# Add all env vars in Vercel dashboard → Settings → Environment Variables
```

---

## 🔐 Admin Panel Access

The admin is **completely hidden** from visitors.

**How to open it:**
> Click the copyright text in the footer **exactly 5 times** within 2 seconds:
> `"© 2026 StyleHub Decors. All rights reserved."`
> → Admin login modal appears

**Login:** Use the email + password you created in Firebase Authentication.

---

## 💰 How Affiliate Links Work

```
1. You join Amazon Associates (associates.amazon.in) — FREE
2. Search any product on Amazon
3. Click "Get Link" → copy the URL
   Example: amazon.in/dp/B09XYZ?tag=yourname-21
4. Paste that URL into "Affiliate Link" when adding a product
5. When a visitor clicks → goes to Amazon → if they buy within 24hr
   → Amazon pays YOU 1–10% commission
```

**Your tag** (e.g. `yourname-21`) **must be in every link.**
The site warns you if a link is missing the tag.

---

## 📊 Analytics

Every click on "View on Amazon" is tracked in Firebase:
- Which post was viewed
- Which product was clicked
- Timestamp

View it in Admin → Analytics tab.

---

## 📌 Pinterest Strategy

- Create a Pinterest Business account (free)
- Pin your post cover images → link to your post URL
- Best title format: `"Aesthetic Room Setup Under ₹2000 | Amazon India"`
- Pin 5–10 times/day for best reach
- Vertical (2:3) images perform best

---

## 🆓 Cost Breakdown

| Month | Firebase   | Cloudinary | Vercel | Total |
|-------|------------|------------|--------|-------|
| 1–∞   | ₹0         | ₹0         | ₹0     | **₹0** |

You only pay if you exceed free tiers — which requires massive traffic.

---

*Built to convert. Zero monthly cost. Deploy and start pinning.*
