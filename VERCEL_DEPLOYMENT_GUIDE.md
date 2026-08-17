# 🚀 Vercel Deployment Guide - LIT'ERA

This guide walks you through deploying the LIT'ERA application to **Vercel**.

---

## 📋 Overview of Setup

- **Frontend**: Vite + React (SPA served from `dist/public`)
- **Backend API**: Express running as Serverless Functions via `api/index.ts`
- **Routing**: Handled by `vercel.json` rewrites (routes `/api/*` to serverless function, all other routes to `index.html`)

---

## Step 1: Push or Import to GitHub / GitLab / Bitbucket

If you haven't already:
1. Initialize/commit your local repository.
2. Push your project to your GitHub account (public or private).

---

## Step 2: Set Up a MySQL Database

Vercel is a serverless platform that requires an external cloud database. You can use any free MySQL cloud provider:

### Recommended Free MySQL Providers:
- **[Aiven for MySQL](https://aiven.io/mysql)** (Free tier available)
- **[TiDB Cloud (Serverless)](https://tidbcloud.com)** (Free 5GB tier, fully MySQL-compatible)
- **[PlanetScale](https://planetscale.com)**
- **[Railway](https://railway.app)** / **[Render](https://render.com)**

### Get Connection URL:
Copy your connection string in this format (TiDB Cloud uses port `4000` and the `sys` database):
```
mysql://<username>:<password>@<host>.tidbcloud.com:4000/sys
```
TLS 1.2+ with certificate verification is applied automatically for any non-local host,
so no `?ssl=...` query string is needed. Percent-encode special characters in the password
(`@` becomes `%40`).

---

## Step 3: Import Project in Vercel

1. Log in to [Vercel](https://vercel.com).
2. Click **"Add New..."** → **"Project"**.
3. Import your GitHub repository (`LIT-ERA`).
4. In the **Configure Project** screen:
   - **Framework Preset**: `Vite` (or `Other`)
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `npm run build` (or leave default)
   - **Output Directory**: `dist/public`

---

## Step 4: Configure Environment Variables in Vercel

Under **Environment Variables**, add the following:

| Variable Name | Value / Description | Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | Your Cloud MySQL connection URI | `mysql://<user>:<password>@<host>.tidbcloud.com:4000/sys` |
| `SESSION_SECRET` | Required. Random 32+ char string signing the login cookie | output of `openssl rand -hex 32` |
| `ADMIN_CODE` | Optional code for registering admin accounts | `<your-admin-code>` |
| `NODE_ENV` | Environment mode | `production` |

---

## Step 5: Deploy

1. Click **"Deploy"**.
2. Vercel will install dependencies, build the frontend (`dist/public`), and bundle the serverless API (`api/index.ts`).
3. Once finished, Vercel will generate your live URL (e.g. `https://lit-era.vercel.app`).

---

## Step 6: Push Database Schema (One-Time)

To create the database tables in your cloud MySQL instance:

From your local machine or terminal:
```bash
# Set your cloud database URL in .env or run directly:
DATABASE_URL="your-cloud-mysql-connection-url" npm run db:push
```

---

## 🔍 Verification & Health Check

After deployment:
1. **Frontend**: Open `https://your-app.vercel.app/` - ensure home, about, events, magazine, and MUN pages load.
2. **API**: Visit `https://your-app.vercel.app/api/content` - returns active thoughts, quotes, and riddles.
3. **Admin**: Register at `/login` with your `ADMIN_CODE` to access `/admin` dashboard.

---

## 🛠️ Project Structure for Vercel

```
├── api/
│   └── index.ts          # Vercel Serverless Function entrypoint
├── client/               # React + Vite Frontend
│   └── src/
├── server/               # Express Routes and Database Layer
│   ├── routes.ts
│   ├── storage.ts
│   └── db.ts
├── shared/               # Shared Schemas and Types
│   ├── schema.ts
│   └── routes.ts
├── vercel.json           # Vercel configuration & rewrites
└── package.json
```
