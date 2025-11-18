# Quick Guide: Get Your DATABASE_URL

## Steps to Get Your Supabase Database Connection String

### Method 1: Via Supabase Dashboard (Recommended)

1. Visit: https://supabase.com/dashboard/project/pjhfigfywqibleeyksfy/settings/database

2. Scroll to "Connection string" section

3. Select the **"Connection pooling"** tab (this is important for serverless!)

4. You'll see a connection string like:
   ```
   postgresql://postgres.pjhfigfywqibleeyksfy:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```

5. **Getting your password:**
   - If you don't see the full password, click "Reset database password"
   - Copy the new password immediately (you won't see it again!)
   - Replace `[YOUR-PASSWORD]` in the connection string

6. Copy the complete connection string

### Method 2: Via Supabase CLI

```bash
# Get project details
supabase projects list

# You can use the pooler connection:
# Format: postgresql://postgres.{ref}:{password}@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

## Adding to Vercel

### For Production Deployment:

1. Go to https://vercel.com/dashboard
2. Select your `inquirybot` project
3. Go to **Settings** → **Environment Variables**
4. Add new variable:
   - **Name**: `DATABASE_URL`
   - **Value**: `postgresql://postgres.pjhfigfywqibleeyksfy:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres`
   - **Environments**: Check all (Production, Preview, Development)
5. Click "Save"

### For Local Development:

Add to your `.env` file (this file is gitignored, so it's safe):

```env
DATABASE_URL="postgresql://postgres.pjhfigfywqibleeyksfy:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
```

## Important Notes

- **Use connection pooling** (port 6543) for serverless functions (Vercel)
- **Direct connection** (port 5432) is for long-running processes only
- The connection string is sensitive - never commit it to Git!
- Your password is in the Supabase dashboard under Settings → Database

## Verifying It Works

Test your connection locally:

```bash
# Generate Prisma client with your DATABASE_URL
npx prisma generate

# Check database connectivity (optional)
npx prisma db pull
```

If successful, you're ready to deploy!

## Your Project Details

- **Project Reference**: `pjhfigfywqibleeyksfy`
- **Region**: East US (North Virginia)
- **Dashboard**: https://supabase.com/dashboard/project/pjhfigfywqibleeyksfy

## Troubleshooting

**"Connection refused" error:**
- Make sure you're using the pooler connection (port 6543), not direct (port 5432)

**"Password authentication failed":**
- Reset your database password in Supabase dashboard
- Update your DATABASE_URL with the new password

**"No such project":**
- Verify the project reference ID is `pjhfigfywqibleeyksfy`
- Check you're logged into the correct Supabase account

