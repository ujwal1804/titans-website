# Environment Variables Setup Guide

## MyFxBook API Configuration

To use the MyFxBook API integration, you need to create a `.env.local` file in the root directory of your project.

### Step 1: Create `.env.local` file

Create a new file named `.env.local` in the root directory (same level as `package.json`).

### Step 2: Add Your Credentials

Copy and paste the following into your `.env.local` file, replacing with your actual credentials:

**For passwords with special characters like `$`, try these options (in order of preference):**

**Option 1: Escape the dollar sign with backslash (RECOMMENDED)**
```env
# MyFxBook API Configuration
MYFXBOOK_API_URL=https://www.myfxbook.com/api
MYFXBOOK_EMAIL=ujwal.raina.ur@gmail.com
MYFXBOOK_PASSWORD=!000crORE\$tu
```

**Option 2: Use single quotes**
```env
MYFXBOOK_PASSWORD='!000crORE$tu'
```

**Option 3: Use double quotes**
```env
MYFXBOOK_PASSWORD="!000crORE$tu"
```

**Option 4: No quotes, just escape the $**
```env
MYFXBOOK_PASSWORD=!000crORE\$tu
```

**Note:** The backslash escape (`\$`) is usually the most reliable method in Next.js environment files.

### Step 3: Restart Your Development Server

After creating or updating `.env.local`, restart your Next.js development server:

```bash
# Stop the current server (Ctrl+C)
# Then restart it
npm run dev
```

## Environment Variables Explained

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `MYFXBOOK_API_URL` | No | Base URL for MyFxBook API | `https://www.myfxbook.com/api` |
| `MYFXBOOK_EMAIL` | Yes | Your MyFxBook account email | None |
| `MYFXBOOK_PASSWORD` | Yes | Your MyFxBook account password | None |

## Security Notes

✅ **DO:**
- Keep `.env.local` in your local development environment only
- Add `.env.local` to `.gitignore` (already done)
- Use different credentials for development and production
- Use environment variables in your hosting platform (Vercel, Netlify, etc.)

❌ **DON'T:**
- Commit `.env.local` to version control
- Share your credentials publicly
- Use production credentials in development
- Hardcode credentials in your source code

## Troubleshooting

### Error: "MyFxBook credentials are not configured"

This means the environment variables are not set. Make sure:
1. The `.env.local` file exists in the root directory
2. The file contains `MYFXBOOK_EMAIL` and `MYFXBOOK_PASSWORD`
3. You've restarted your development server after creating/updating the file

### Environment Variables Not Loading

If your environment variables aren't loading:
1. Make sure the file is named exactly `.env.local` (not `.env` or `.env.local.txt`)
2. Restart your Next.js development server
3. Check that there are no spaces around the `=` sign
4. Make sure there are no quotes around the values (unless the value itself contains spaces)

## Cloudinary Configuration

For payment screenshot uploads, you need to configure Cloudinary:

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Get your credentials from the Dashboard
3. Add to `.env.local`:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

See `CLOUDINARY_SETUP.md` for detailed setup instructions.

## Google Sheets Configuration

For storing form submissions:

```env
# Google Sheets (via Apps Script)
GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

See `GOOGLE_SHEETS_SETUP.md` for detailed setup instructions.

## Example `.env.local` File

```env
# MyFxBook API Configuration
MYFXBOOK_API_URL=https://www.myfxbook.com/api
MYFXBOOK_EMAIL=ujwal.raina.ur@gmail.com
MYFXBOOK_PASSWORD=!000crORE\$tu

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Google Sheets (via Apps Script)
GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec

# Gmail Configuration (for email notifications)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
```

### Handling Special Characters in Passwords

If your password contains special characters like `$`, try these methods:

**Method 1: Escape with backslash (BEST for Next.js)**
```env
MYFXBOOK_PASSWORD=!000crORE\$tu
```

**Method 2: Single quotes**
```env
MYFXBOOK_PASSWORD='!000crORE$tu'
```

**Method 3: Double quotes**
```env
MYFXBOOK_PASSWORD="!000crORE$tu"
```

**Troubleshooting:**
- If quotes don't work, try escaping: `\$` instead of `$`
- Restart your dev server after changing `.env.local`
- Check the console logs to see what password is being read
- Make sure there are no extra spaces around the `=` sign

## Production Deployment

For production deployments (Vercel, Netlify, etc.), add these environment variables in your hosting platform's dashboard:

1. Go to your project settings
2. Navigate to "Environment Variables" or "Secrets"
3. Add each variable:
   - `MYFXBOOK_API_URL`
   - `MYFXBOOK_EMAIL`
   - `MYFXBOOK_PASSWORD`

The `.env.local` file is only for local development and will not be deployed to production.

