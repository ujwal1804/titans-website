# Cloudinary Upload Troubleshooting Guide

If images are not uploading to Cloudinary, follow these steps:

## Step 1: Check Environment Variables

Make sure your `.env.local` file has all three Cloudinary variables:

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Step 2: Verify Cloudinary Credentials

1. Go to your [Cloudinary Dashboard](https://console.cloudinary.com/)
2. Click on **Settings** (gear icon)
3. Check your:
   - **Cloud name** (should match `CLOUDINARY_CLOUD_NAME`)
   - **API Key** (should match `CLOUDINARY_API_KEY`)
   - **API Secret** (should match `CLOUDINARY_API_SECRET`)

## Step 3: Check Server Logs

When you submit the form, check your terminal/console for:
- `📤 Starting Cloudinary upload...` - File received
- `✅ Cloudinary upload successful` - Upload worked
- `❌ Cloudinary upload error` - Upload failed (check error message)

## Step 4: Common Issues

### Issue: "Cloudinary not configured"
**Solution**: Add all three environment variables to `.env.local` and restart your dev server.

### Issue: "Invalid API credentials"
**Solution**: 
- Double-check your API Key and API Secret
- Make sure there are no extra spaces
- Regenerate API Secret in Cloudinary if needed

### Issue: "File too large"
**Solution**: The form enforces 5MB limit. Compress your image if needed.

### Issue: "Invalid file format"
**Solution**: Only PNG, JPG, JPEG, GIF, and WebP are allowed.

## Step 5: Test Cloudinary Connection

You can test if Cloudinary is working by checking the browser console when submitting:
- Open browser DevTools (F12)
- Go to Console tab
- Submit the form
- Look for error messages

## Step 6: Manual Test

If automatic upload fails, you can manually test Cloudinary:

1. Go to Cloudinary Dashboard
2. Click **Media Library**
3. Try uploading an image manually
4. If that works, the issue is with the code, not credentials

## Still Not Working?

Check:
- ✅ Environment variables are set correctly
- ✅ Dev server was restarted after adding env vars
- ✅ File is actually selected (check browser console)
- ✅ File size is under 5MB
- ✅ File is an image format (PNG, JPG, etc.)
- ✅ Cloudinary account is active (not suspended)

