# 📄 Dual-Mode Resume Builder

A premium, highly responsive **Dual-Mode Resume Builder** built with React, TypeScript, Vite, and styled with a **Hybrid Modern** theme (mixing "Dark Luxury" glassmorphism and "Bright Modern" interactive states). 

Features integrated **Supabase Email Authentication** to secure resume downloads, and a cloud persistence layer that automatically saves user data and compiled PDF files.

---

## ✨ Features

- **Double-Tab Navigation**:
  - **Create Resume**: Interactive multi-step form editor on the left side and real-time interactive PDF preview on the right side.
  - **My Resumes**: A cloud dashboard containing a list of previous resumes with options to Load, Download PDF, or Delete.
- **Dual-Output PDF Engine**:
  - **The Classic**: A clean, black-and-white minimalist template optimized for ATS screening.
  - **Modern Creative**: A beautiful, premium dual-column design with visual grids, sidebar panels, and custom layouts.
- **Supabase Integration**:
  - **Email Auth**: Restricts document downloads and dashboard access to logged-in users.
  - **Cloud Save & Auto-Restore**: Saves form values to a PostgreSQL database and auto-restores their latest resume on login.
  - **Duplicate/Copying**: Allows creating duplicate copies of active resumes.
  - **Storage Bucket File Uploads**: Automatically renders and saves compiled `.pdf` files to Supabase Storage on download.

---

## ⚙️ Local Development

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory and specify your Supabase credentials (see `.env.example`):
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🚀 Deploying to Production

This project is fully optimized for single-page application (SPA) deployment on **Vercel** and **Netlify**.

### 🌟 Deploying on Vercel

1. Push your code to your GitHub repository.
2. Log in to your [Vercel Dashboard](https://vercel.com/) and click **Add New** ➡️ **Project**.
3. Import your GitHub repository.
4. Vercel will automatically detect **Vite** as the framework:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Expand the **Environment Variables** section and add:
   - `VITE_SUPABASE_URL` = *(Your Supabase URL)*
   - `VITE_SUPABASE_ANON_KEY` = *(Your Supabase Anon Key)*
6. Click **Deploy**.

### ⚡ Deploying on Netlify

1. Push your code to your GitHub repository.
2. Log in to your [Netlify Dashboard](https://app.netlify.com/) and click **Add new site** ➡️ **Import an existing project**.
3. Select GitHub and authorize access to your repository.
4. Netlify will auto-detect the configuration:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Click **Add environment variables** and enter:
   - `VITE_SUPABASE_URL` = *(Your Supabase URL)*
   - `VITE_SUPABASE_ANON_KEY` = *(Your Supabase Anon Key)*
6. Click **Deploy Site**.
