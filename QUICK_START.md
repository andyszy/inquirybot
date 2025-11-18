# Quick Start - InquiryBot

## 🚀 Run Locally

```bash
# Option 1: With API support (recommended)
vercel dev

# Option 2: Just frontend (API won't work)
npm run dev
```

## What I Fixed

The recursive invocation error happened because:
- `package.json` had: `"dev": "vercel dev"`
- When you ran `vercel dev`, it tried to run the `dev` script
- Which tried to run `vercel dev` again → infinite loop!

**Solution**:
- `package.json`: `"dev": "vite"` (back to normal)
- `vercel.json`: Added `"devCommand": "vite"` 
- Now `vercel dev` knows to run `vite`, and handles the API routes

## Development Commands

```bash
# Start with Vercel (includes API routes)
vercel dev
# Opens at http://localhost:3000

# OR start with just Vite (faster, no API)
npm run dev
# Opens at http://localhost:5173
```

## Important Notes

### Using `vercel dev` (Recommended)
✅ API routes work (`/api/chat/*`)  
✅ Auto-save to database works  
✅ URL redirect works  
🐌 Slightly slower startup  

### Using `npm run dev` (Frontend Only)
⚡ Fast startup  
❌ API routes return 404  
❌ Chat sessions won't save  
✅ Good for UI/styling work  

## For Production

Just push to Git and Vercel will auto-deploy:

```bash
git add .
git commit -m "Your message"
git push
```

---

**TL;DR**: Run `vercel dev` for full functionality!

