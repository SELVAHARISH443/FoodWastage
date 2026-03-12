# Google OAuth Setup Guide

## Problem
You're seeing "Access blocked: Authorization Error - The OAuth client was not found" because the Google Client ID is not properly configured.

## Solution: Get Your Google Client ID

### Step 1: Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click the project dropdown at the top
3. Click "NEW PROJECT"
4. Name it "FoodWastage" or similar
5. Click "CREATE"
6. Wait for project creation to complete

### Step 2: Enable Google+ API
1. In Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google+ API" 
3. Click on it and press "ENABLE"

### Step 3: Create OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "CREATE CREDENTIALS" > "OAuth client ID"
3. If asked, configure OAuth consent screen:
   - User Type: **External**
   - Click "CREATE"
   - Fill in:
     - App name: "FoodWastage"
     - User support email: Your email
     - Developer contact: Your email
   - Click "SAVE AND CONTINUE"
   - Skip optional sections
   - Click "SAVE AND CONTINUE"
   - Click "BACK TO DASHBOARD"

### Step 4: Configure OAuth Client
1. Go back to "Credentials"
2. Click "CREATE CREDENTIALS" > "OAuth client ID"
3. Application type: **Web application**
4. Name: "FoodWastage Web Client"
5. **Add Authorized JavaScript origins:**
   - `http://localhost:8090`
   - `http://localhost:3000` (if using different port)
   - Your production domain (e.g., `https://foodwastage.com`)

6. **Add Authorized redirect URIs:**
   - `http://localhost:8090` (just the domain, the OAuth library handles the rest)
   - Your production domain

7. Click "CREATE"
8. Copy the **Client ID** (looks like: `XXX-abc123...apps.googleusercontent.com`)

### Step 5: Configure Your App
1. Open `frontend/.env.local`
2. Replace `YOUR_GOOGLE_CLIENT_ID_HERE` with your copied Client ID
3. Save the file
4. Restart the frontend dev server (`npm run dev`)

## Example .env.local
```
VITE_GOOGLE_CLIENT_ID=123456789-abc123def456ghi789jkl.apps.googleusercontent.com
```

## Test the Integration
1. Go to `http://localhost:8090/login`
2. Click "Continue with Google"
3. You should see Google's sign-in dialog (not an error)
4. Sign in and you'll be redirected to the dashboard

## Troubleshooting

### Error: "The OAuth client was not found"
- Your Client ID is invalid or you haven't added it to .env.local
- Check that VITE_GOOGLE_CLIENT_ID doesn't have trailing spaces
- Restart the dev server after updating .env.local

### Error: "Redirect URI mismatch"
- The origin where your app is running doesn't match Google's settings
- If running on different port (e.g., 8091), add it to Google Cloud Console:
  - Go to Credentials > OAuth 2.0 Client ID > Edit
  - Add the new origin
  - Save

### Error: "invalid_client"
- Client ID is missing or incorrect
- Follow Step 5 again carefully

## Notes
- The Client ID is public (safe to share with code)
- Never share the Client Secret
- This setup allows local development and testing
- For production, update the authorized origins with your domain

## Need Help?
- Check Google Cloud Console for your project status
- Ensure OAuth consent screen is configured ("Credentials" > "OAuth consent screen")
- Clear browser cache if you're still getting old errors
