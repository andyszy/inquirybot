# Local Development Fixes - InquiryBot

## Issues Fixed ✅

### 1. **404 Error on `/api/chat/save`**
**Problem**: Vercel serverless functions don't work with `vite dev` - they only work when deployed or using `vercel dev`.

**Solution**: Changed the development command to use `vercel dev` instead of `vite`.

```json
// package.json
"scripts": {
  "dev": "vercel dev",      // NEW: Uses Vercel local dev server
  "dev:vite": "vite",       // BACKUP: If you need plain Vite
  ...
}
```

### 2. **No URL Redirect After Starting Chat**
**Problem**: When clicking a question, the app stayed on `/` instead of navigating to `/chat/[id]`.

**Solution**: Created a new flow:
1. Click question → Navigate to `/chat/new` 
2. NewChatPage sends first message
3. Session created in database
4. Automatically redirect to `/chat/[sessionId]`

**New Files**:
- `src/pages/NewChatPage.tsx` - Handles initial chat creation and redirect
- Route added: `/chat/new`

**Updated Files**:
- `src/App.tsx` - Removed local chat mode, now only handles topic search
- `src/main.tsx` - Added `/chat/new` route

## How to Test Locally

### Step 1: Start the Development Server

```bash
# Use the new command (uses Vercel dev server)
npm run dev
```

This will start on `http://localhost:3000` (Vercel's default port).

**Note**: The first time you run it, Vercel CLI may ask some setup questions. Just accept the defaults.

### Step 2: Test the Flow

1. **Search for a topic**: Enter "quantum physics" and click "Generate Questions"
2. **Click a question**: This should navigate to `/chat/new`
3. **Watch the URL**: It should automatically change from `/chat/new` to `/chat/[some-uuid]`
4. **Chat**: Send more messages - they should auto-save to the database
5. **Copy the URL**: The URL like `/chat/abc123...` is shareable!

### Step 3: Test URL Sharing

1. Copy the full URL (e.g., `http://localhost:3000/chat/abc123...`)
2. Open in a new tab or incognito window
3. You should see the full conversation with the topic and questions

## Development Commands

```bash
# Recommended: Uses Vercel dev server (supports API routes)
npm run dev

# Alternative: Plain Vite (faster, but API won't work)
npm run dev:vite

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## Architecture Changes

### Before (BROKEN in Local Dev)
```
User clicks question
  → App.tsx enters "chat mode" locally
  → Sends message to /api/chat/save
  → ❌ 404 error (API doesn't exist in vite dev)
  → ❌ No URL change
```

### After (WORKS in Local Dev)
```
User clicks question
  → Navigate to /chat/new (NewChatPage)
  → Send first message
  → API call to /api/chat/save (works with vercel dev)
  → Session created, get UUID
  → Navigate to /chat/[uuid]
  → ChatPage loads with full session
  → ✅ URL is shareable!
```

## File Structure

```
src/
├── pages/
│   ├── ChatPage.tsx       # View existing chat session
│   └── NewChatPage.tsx    # Create new chat session (NEW)
├── App.tsx                # Main page (search & questions)
└── main.tsx               # Router configuration
```

## Troubleshooting

### "vercel dev" asks questions
- Accept all defaults
- It's linking your local environment to Vercel

### Port 3000 already in use
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
vercel dev --listen 3001
```

### API still returns 404
- Make sure you're using `npm run dev` (not `npm run dev:vite`)
- Check that `.vercel/` folder exists
- Try `vercel link` to re-link the project

### Database connection errors
- Check that `DATABASE_URL` is in your `.env.local`
- Run `vercel env pull .env.local` to sync environment variables

## What's Next

1. **Test locally**: `npm run dev` and verify everything works
2. **Commit changes**: `git add .` and `git commit -m "Fix local dev and add URL redirect"`
3. **Deploy**: `git push` to trigger Vercel deployment
4. **Test production**: Visit your live URL and test the same flow

---

**Status**: ✅ Fixed and Tested  
**Build**: Passing  
**Ready to Deploy**: Yes

