# InquiryBot Setup Guide

## Environment Variables

This application requires the following environment variables to be set in your Vercel project:

### Required Variables

1. **DATABASE_URL** - Supabase PostgreSQL connection string
   - Get from: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/settings/database
   - Format: `postgresql://postgres.YOUR_PROJECT_ID:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres`
   - Navigate to your Supabase project settings → Database → Connection string (Pooler mode)
   - Copy the connection string and replace `[YOUR-PASSWORD]` with your actual database password

2. **VITE_ANTHROPIC_API_KEY** - Your Anthropic API key
   - Get from: https://console.anthropic.com/settings/keys
   - Format: `sk-ant-api03-...`

### Setting Environment Variables in Vercel

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your `inquirybot` project
3. Navigate to Settings → Environment Variables
4. Add each variable:
   - Name: `DATABASE_URL`
   - Value: (your Supabase connection string)
   - Environment: Production, Preview, Development

   - Name: `VITE_ANTHROPIC_API_KEY`
   - Value: (your Anthropic API key from https://console.anthropic.com/settings/keys)
   - Environment: Production, Preview, Development

5. After adding variables, redeploy your application

### Getting Your Database Password

If you don't have your Supabase database password:

1. Visit: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/settings/database
2. Under "Database Settings", find the "Database password" section
3. Click "Reset database password" if needed
4. Copy the new password
5. Update your DATABASE_URL with the new password

## Deployment

The application is configured to deploy automatically to Vercel. The `vercel.json` file includes:
- Build configuration pointing to Vite output
- URL rewrites for client-side routing
- CORS headers for API routes

## Database Schema

The database schema has been created with a single table `chat_sessions`:
- `id` (uuid) - Unique identifier for each chat session
- `topic` (text) - The topic the user searched for
- `questions` (jsonb) - Array of generated questions
- `selected_question` (text) - The question being explored in this chat
- `messages` (jsonb) - Array of chat messages
- `created_at` (timestamp) - When the session was created
- `updated_at` (timestamp) - Last update time

## Features

- **Shareable Chat URLs**: Each chat session gets a unique URL (`/chat/[id]`) that can be shared
- **Auto-save**: Chat sessions are automatically saved to the database after each message
- **Session State History**: The inquiry history button (bottom right) remains in session state only
- **Full Context Sharing**: Shared URLs display both the question sidebar and chat history

## Local Development

For local development, you'll need to:

1. Create a `.env.local` file (or update `.env`) with:
```
DATABASE_URL="postgresql://postgres.YOUR_PROJECT_ID:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
VITE_ANTHROPIC_API_KEY="your-anthropic-api-key-here"
```

2. Run `npm install` to install dependencies and generate Prisma client
3. Run `npm run dev` for local development
4. Run `npm run build` to build for production

## Supabase Project Details

- Project Reference ID: `YOUR_PROJECT_ID` (find this in your Supabase dashboard)
- Project URL: https://supabase.com/dashboard/project/YOUR_PROJECT_ID
- Region: Configure based on your needs
- Database: PostgreSQL with Row Level Security enabled (public access for sharing)

