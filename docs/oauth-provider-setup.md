# Google and GitHub OAuth Setup

Use these values for local development in this project:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5050`
- Google callback: `http://localhost:5050/api/auth/google/callback`
- GitHub callback: `http://localhost:5050/api/auth/github/callback`

If you change `server/.env PORT`, the callback URLs must change too.

## Backend Environment

Set these in `server/.env` locally and in Render environment variables:

```env
FRONTEND_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5050/api/auth/google/callback
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_CALLBACK_URL=http://localhost:5050/api/auth/github/callback
```

For Render production, use your real URLs:

```env
FRONTEND_URL=https://your-vercel-app.vercel.app
GOOGLE_CALLBACK_URL=https://your-render-backend.onrender.com/api/auth/google/callback
GITHUB_CALLBACK_URL=https://your-render-backend.onrender.com/api/auth/github/callback
```

## Frontend Environment

Local `client/.env` should keep:

```env
VITE_API_TARGET=http://localhost:5050
```

In Vercel, set:

```env
VITE_API_URL=https://your-render-backend.onrender.com
```

Do not put OAuth client secrets in frontend env variables.

## Google Cloud Console

1. Open Google Cloud Console.
2. Create or select a project.
3. Go to `APIs & Services` -> `OAuth consent screen`.
4. Configure the app name, support email, and developer contact email.
5. Go to `Credentials` -> `Create Credentials` -> `OAuth client ID`.
6. Choose `Web application`.
7. Add Authorized JavaScript origins:
   - Local: `http://localhost:5173`
   - Production: `https://your-vercel-app.vercel.app`
8. Add Authorized redirect URIs:
   - Local: `http://localhost:5050/api/auth/google/callback`
   - Production: `https://your-render-backend.onrender.com/api/auth/google/callback`
9. Copy the Client ID and Client Secret to backend environment variables.

## GitHub Developer Settings

1. Open GitHub `Settings` -> `Developer settings` -> `OAuth Apps`.
2. Click `New OAuth App`.
3. Set Application name to `MyBlogs`.
4. Set Homepage URL:
   - Local testing: `http://localhost:5173`
   - Production: `https://your-vercel-app.vercel.app`
5. Set Authorization callback URL:
   - Local: `http://localhost:5050/api/auth/github/callback`
   - Production: `https://your-render-backend.onrender.com/api/auth/github/callback`
6. Copy the Client ID and Client Secret to backend environment variables.

## Render and Vercel

- Render build command: `npm install`
- Render start command: `npm start`
- Render root directory: `server`
- Vercel root directory: `client`
- Vercel production env must include `VITE_API_URL`.

## Failure Redirects

The backend redirects failed OAuth attempts to:

```text
FRONTEND_URL/login?error=oauth_failed
```

Missing provider email redirects with:

```text
FRONTEND_URL/login?error=oauth_email_missing
```

Missing OAuth credentials redirects with:

```text
FRONTEND_URL/login?error=oauth_not_configured
```
