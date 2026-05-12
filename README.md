# 🚀 MERN Portfolio — Complete Setup Guide
### From zero to running on localhost

---

## 📋 PREREQUISITES

Install these first if you don't have them:

| Tool | Version | Download |
|------|---------|----------|
| Node.js | 18+ | https://nodejs.org |
| MongoDB | Local or Atlas | https://www.mongodb.com |
| Git | Latest | https://git-scm.com |

---

## 📁 PROJECT STRUCTURE

```
portfolio/
├── client/          ← React + Vite frontend (port 5173)
└── server/          ← Node.js + Express backend (port 5000)
```

---

## ⚙️ STEP 1 — BACKEND SETUP

### 1.1 Navigate to server folder
```bash
cd portfolio/server
```

### 1.2 Install dependencies
```bash
npm install
```

### 1.3 Configure environment variables
Open `server/.env` and fill in your values:

```env
PORT=5000
NODE_ENV=development

# MongoDB — choose ONE:
# Option A: Local MongoDB (simplest for localhost)
MONGODB_URI=mongodb://localhost:27017/portfolio

# Option B: MongoDB Atlas (free cloud)
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/portfolio

JWT_SECRET=change_this_to_a_long_random_string_minimum_32_chars
JWT_EXPIRES_IN=7d

ADMIN_EMAIL=admin@myportfolio.com
ADMIN_PASSWORD=MySecurePass123!

CLIENT_URL=http://localhost:5173

# Cloudinary (optional for localhost — skip if not needed)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Gmail (optional — for contact form emails)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your.gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM=Your Name <your.gmail@gmail.com>
```

### 1.4 Start the backend
```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected: localhost
🚀 Server running on http://localhost:5000
```

### 1.5 Create your admin account (ONE TIME ONLY)
Open a new terminal and run:
```bash
curl -X POST http://localhost:5000/api/auth/setup \
  -H "Content-Type: application/json" \
  -d '{"name": "Your Name"}'
```

Or visit: `http://localhost:5000/api/health` to verify backend is running.

---

## ⚙️ STEP 2 — FRONTEND SETUP

### 2.1 Navigate to client folder
```bash
cd portfolio/client
```

### 2.2 Install dependencies
```bash
npm install
```

> ⚠️ If you get peer dependency errors, run:
> ```bash
> npm install --legacy-peer-deps
> ```

### 2.3 Verify environment
The `client/.env` file should have:
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Your Name | Portfolio
VITE_APP_URL=http://localhost:5173
```

The Vite proxy is configured — all `/api` calls automatically forward to `:5000`.

### 2.4 Start the frontend
```bash
npm run dev
```

You should see:
```
  VITE v5.x ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

---

## ✅ STEP 3 — VERIFY EVERYTHING WORKS

Open your browser and check:

| URL | What you should see |
|-----|---------------------|
| `http://localhost:5173` | Portfolio homepage |
| `http://localhost:5173/admin/login` | Admin login page |
| `http://localhost:5000/api/health` | `{"success":true}` |

### Login to Admin Panel
1. Go to `http://localhost:5173/admin/login`
2. Email: (value you set in `ADMIN_EMAIL`)
3. Password: (value you set in `ADMIN_PASSWORD`)

---

## 🛠️ STEP 4 — POPULATE YOUR PORTFOLIO

After logging in, go to each admin section:

### 4.1 Profile → `/admin/profile`
- Set your name, title, bio, location
- Upload your photo
- Add social links (GitHub, LinkedIn, etc.)
- Set your stats (years experience, projects, clients)

### 4.2 Projects → `/admin/projects`
- Add each of your projects
- Upload thumbnails
- Add tech stack, GitHub links, live URLs
- Mark your best ones as "Featured"

### 4.3 Skills → `/admin/skills`
- Add skills by category (Frontend, Backend, Database, etc.)
- Set proficiency level (0-100)
- Choose a color for each skill

### 4.4 Experience → `/admin/experience`
- Add each job/freelance position
- Add responsibilities (one per line)
- Check "I currently work here" for current roles

### 4.5 Blogs → `/admin/blogs`
- Write articles in Markdown format
- Toggle "Publish immediately" when ready

---

## 📦 RUNNING BOTH SERVERS SIMULTANEOUSLY

**Option A: Two terminals**
```bash
# Terminal 1
cd portfolio/server && npm run dev

# Terminal 2
cd portfolio/client && npm run dev
```

**Option B: Install concurrently (from portfolio root)**
```bash
# In the portfolio/ root folder
npm init -y
npm install concurrently

# Add to package.json scripts:
"dev": "concurrently \"cd server && npm run dev\" \"cd client && npm run dev\""

# Then just run:
npm run dev
```

---

## 🔧 COMMON ISSUES & FIXES

### ❌ "MongoDB connection failed"
- Make sure MongoDB is running: `sudo systemctl start mongod` (Linux) or open MongoDB Compass
- Or use MongoDB Atlas free tier instead

### ❌ "CORS error" in browser
- Confirm `CLIENT_URL=http://localhost:5173` in `server/.env`
- Restart the backend after changing .env

### ❌ "Cannot find module" errors
- Run `npm install` again in the failing directory
- Delete `node_modules` and `package-lock.json`, then reinstall

### ❌ TypeScript errors on @/ imports
- Make sure `vite.config.ts` has the alias configured
- Run `npm install` to ensure all type packages are present

### ❌ Images not uploading
- For localhost, Cloudinary credentials are optional
- The app will still work — images just won't be stored remotely
- Add Cloudinary credentials in `.env` when ready

### ❌ Emails not sending (contact form)
- Contact form still saves to database even if email fails
- For Gmail: enable 2FA → create App Password → use that as EMAIL_PASS
- Visit: https://myaccount.google.com/apppasswords

---

## 🎨 CUSTOMIZATION GUIDE

### Change your name across the site
Search and replace `Your Name` / `YourName` in:
- `client/index.html` (meta tags)
- `client/src/components/layout/Navbar.tsx`
- `client/src/components/layout/Footer.tsx`
- `client/src/components/sections/Hero.tsx`
- `client/src/pages/admin/AdminLogin.tsx`

### Change the accent color (cyan → any color)
In `client/tailwind.config.js`, change:
```js
cyan: {
  DEFAULT: '#00f5ff',  // ← change this
```

### Change fonts
In `client/index.html`, replace the Google Fonts URL.
In `client/tailwind.config.js`, update `fontFamily`.

### Add your real social links
Update the hardcoded links in:
- `client/src/components/sections/Hero.tsx`
- `client/src/components/layout/Footer.tsx`

Or better: add them via Admin → Profile → Social Links.

---

## 🚀 DEPLOYMENT (When Ready)

### Frontend → Vercel
```bash
cd client
npm run build        # Test build locally first
# Then push to GitHub and import to vercel.com
```
Set environment variable in Vercel:
```
VITE_API_URL=https://your-backend.onrender.com/api
```

### Backend → Render
1. Push server/ to GitHub
2. Create Web Service on render.com
3. Build command: `npm install`
4. Start command: `npm start`
5. Add all environment variables from `.env`

### MongoDB Atlas
1. Create free cluster at mongodb.com/atlas
2. Create database user
3. Whitelist IP: `0.0.0.0/0` (allow all for Render)
4. Copy connection string to `MONGODB_URI`

---

## 📝 QUICK COMMAND REFERENCE

```bash
# Backend
cd server
npm run dev          # Start with hot reload
npm start            # Production start

# Frontend  
cd client
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

---

## 🏗️ WHAT'S BEEN BUILT

### Backend API Endpoints
```
POST   /api/auth/setup        → Create admin (run once)
POST   /api/auth/login        → Admin login
POST   /api/auth/logout       → Admin logout
GET    /api/auth/me           → Get current user

GET    /api/profile           → Get portfolio profile (public)
PUT    /api/profile           → Update profile (admin)

GET    /api/projects          → Get all projects (public)
GET    /api/projects/:id      → Get single project (public)
POST   /api/projects          → Create project (admin)
PUT    /api/projects/:id      → Update project (admin)
DELETE /api/projects/:id      → Delete project (admin)

GET    /api/skills            → Get all skills (public)
POST   /api/skills            → Create skill (admin)
PUT    /api/skills/:id        → Update skill (admin)
DELETE /api/skills/:id        → Delete skill (admin)

GET    /api/experience        → Get all experience (public)
POST   /api/experience        → Create experience (admin)
PUT    /api/experience/:id    → Update experience (admin)
DELETE /api/experience/:id    → Delete experience (admin)

GET    /api/blogs             → Get published blogs (public)
GET    /api/blogs/:slug       → Get single blog (public)
POST   /api/blogs             → Create blog (admin)
PUT    /api/blogs/:slug       → Update blog (admin)
DELETE /api/blogs/:id         → Delete blog (admin)

POST   /api/contact           → Send contact message (public)
GET    /api/contact           → Get all messages (admin)
PATCH  /api/contact/:id/read  → Mark as read (admin)
DELETE /api/contact/:id       → Delete message (admin)

GET    /api/testimonials      → Get visible testimonials (public)
POST   /api/testimonials      → Create testimonial (admin)
PUT    /api/testimonials/:id  → Update testimonial (admin)
DELETE /api/testimonials/:id  → Delete testimonial (admin)
```

### Frontend Pages
```
/                → Home (Hero + Projects preview + Skills + Contact)
/about           → About page with bio and stats
/projects        → All projects with category filter
/skills          → Skills grouped by category
/experience      → Timeline of work experience
/blog            → Blog listing page
/contact         → Contact form
/admin/login     → Admin login
/admin/dashboard → Dashboard with stats
/admin/projects  → CRUD projects
/admin/skills    → CRUD skills
/admin/experience→ CRUD experience
/admin/messages  → Inbox (read/delete contact messages)
/admin/blogs     → CRUD blog posts
/admin/profile   → Edit profile, bio, social links
```
