# OAuth Login Implementation Plan

## Goal

Add Google and GitHub one-click login/register without changing the existing UI design or breaking email/password auth.

## Steps

1. Update the backend user model so OAuth users can exist without a password.
2. Add Passport Google and GitHub strategies that find, create, or link users by email.
3. Add backend OAuth start/callback routes and redirect successful auth to the frontend with an app JWT.
4. Add a frontend auth success route that reads the JWT, fetches `/api/auth/me`, stores the same localStorage user shape, and redirects to the feed.
5. Connect existing Google and GitHub buttons on Login and Register pages.
6. Add env examples and provider setup docs for local and Render/Vercel production.
7. Verify install, build, lint, and local API behavior.
