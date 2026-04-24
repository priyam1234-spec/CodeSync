# CodeSync UI - Setup Guide

## Features Implemented

### 1. Read-Only Presentation Mode
- **Metadata Panel**: Shows line count, character count, estimated reading time, and language tag
- Collapsible panel that can be hidden/shown
- Replaces the old console panel

### 2. URL Compression for Sharing
- Uses LZ-String to compress entire code snippets into URLs
- No database needed for basic sharing!
- Recipients can decode snippets directly from the URL hash
- **Keyboard Shortcut**: Share link copies to clipboard

### 3. Auto-Detect Language
- Automatically detects the programming language as you type
- Supports: Java, JavaScript, TypeScript, Python, C++, Go, Rust
- Pattern-based detection (e.g., `public class` → Java, `console.log` → JavaScript)

### 4. Code Formatting with Prettier
- Built-in code formatter using Prettier
- **Keyboard Shortcut**: `Ctrl+F` (or `Cmd+F` on Mac)
- Formats JavaScript and TypeScript code
- Instant feedback with loading state

### 5. Local-First Storage with Supabase Integration
- App works **immediately** without any backend setup
- Snippets saved to localStorage by default
- Optional Supabase integration for cloud storage and sharing
- Automatic fallback: if Supabase isn't configured, uses localStorage

---

## Quick Start (Local Mode)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the dev server:
   ```bash
   npm run dev
   ```

3. Start coding! Your snippets are automatically saved to your browser's localStorage.

---

## Optional: Supabase Cloud Integration

For cloud storage and real sharing capabilities:

### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Follow the setup wizard

### Step 2: Create the Database Table

1. In your Supabase dashboard, go to the **SQL Editor**
2. Copy the contents of `supabase/schema.sql`
3. Paste and run it

This creates:
- A `snippets` table with proper schema
- Indexes for fast lookups
- Row Level Security policies for public access

### Step 3: Configure Environment Variables

1. Copy the example env file:
   ```bash
   cp .env.example .env
   ```

2. Get your credentials from Supabase:
   - Go to **Settings** → **API**
   - Copy the **Project URL** → `VITE_SUPABASE_URL`
   - Copy the **anon/public key** → `VITE_SUPABASE_ANON_KEY`

3. Update `.env`:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### Step 4: Restart the Dev Server

```bash
npm run dev
```

The sidebar should now show "Connected to Supabase" instead of "Local Storage Mode".

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+S` / `Cmd+S` | Save snippet |
| `Ctrl+F` / `Cmd+F` | Format code |

---

## Data Structure

Snippets are stored with the following schema:

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Unique identifier |
| `title` | Text | Snippet title |
| `code` | Text | Code content |
| `language` | Text | Language (java, javascript, etc.) |
| `created_at` | Timestamp | Creation time |
| `updated_at` | Timestamp | Last modified time |

---

## Future Enhancements

- [ ] User authentication (Supabase Auth)
- [ ] Private snippets with RLS policies tied to user IDs
- [ ] Real-time collaboration (Supabase Realtime)
- [ ] Tags and collections
- [ ] Export to image (social media cards)
- [ ] Syntax highlighting for more languages
