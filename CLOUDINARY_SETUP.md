# Cloudinary Setup for Payment Screenshots

This guide will help you set up Cloudinary to store payment screenshots from the "Get Started" form.

## Step 1: Create a Cloudinary Account

1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account (or log in if you already have one)
3. Once logged in, go to your **Dashboard**

## Step 2: Get Your Cloudinary Credentials

1. In your Cloudinary Dashboard, you'll see your account details
2. Copy the following values:
   - **Cloud Name** (e.g., `your-cloud-name`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz123456`)

## Step 3: Add Credentials to Environment Variables

1. Create or update your `.env.local` file in the project root
2. Add the following environment variables:

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

3. **Important**: Never commit `.env.local` to version control!

## Step 4: Verify Setup

The payment screenshots will be automatically uploaded to Cloudinary in the folder:
- **Folder**: `titans-trading-payment-screenshots`
- **Format**: Images are stored with their original format (JPG, PNG, GIF, WebP)
- **Max Size**: 5MB per file (enforced in the form)

## Step 5: Access Uploaded Images

1. Go to your Cloudinary Dashboard
2. Navigate to **Media Library**
3. Find the folder `titans-trading-payment-screenshots`
4. All uploaded payment screenshots will be stored here

## Features

- ✅ Automatic image optimization
- ✅ Secure URL generation
- ✅ Organized folder structure
- ✅ Direct links stored in Google Sheets
- ✅ File size validation (max 5MB)
- ✅ Image format validation

## Troubleshooting

### Images not uploading?
- Check that all three Cloudinary environment variables are set correctly
- Verify your API credentials in the Cloudinary Dashboard
- Check the server logs for specific error messages

### Getting 401 Unauthorized errors?
- Verify your API Secret is correct
- Make sure there are no extra spaces in your `.env.local` file
- Restart your Next.js development server after adding environment variables

### Images too large?
- The form enforces a 5MB limit
- Compress images before uploading if needed
- Supported formats: JPG, JPEG, PNG, GIF, WebP



