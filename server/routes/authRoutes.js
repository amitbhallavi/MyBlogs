import express from "express";
import passport from "passport";
import {
  getCurrentUser,
  loginUser,
  oauthRedirectSuccess,
  registerUser,
  updateCurrentUser,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { getOAuthProviderConfig, getOAuthStatus } from "../utils/oauthConfig.js";
import { buildFrontendRedirect } from "../utils/urls.js";

const router = express.Router();

const getFailureRedirect = (code = "oauth_failed") => {
  return buildFrontendRedirect(`/login?error=${encodeURIComponent(code)}`);
};

const requireOAuthConfig = (provider) => (req, res, next) => {
  const config = getOAuthProviderConfig(provider);
  const configured = config.clientID && config.clientSecret;

  if (!configured) {
    res.redirect(getFailureRedirect("oauth_not_configured"));
    return;
  }

  next();
};

const handleOAuthCallback = (provider) => (req, res, next) => {
  passport.authenticate(provider, { session: false }, (error, user) => {
    if (error || !user) {
      res.redirect(getFailureRedirect(error?.oauthCode || "oauth_failed"));
      return;
    }

    req.user = user;
    next();
  })(req, res, next);
};

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getCurrentUser);
router.put("/me", protect, updateCurrentUser);
router.get("/oauth/status", (req, res) => {
  res.json(getOAuthStatus());
});

router.get(
  "/google",
  requireOAuthConfig("google"),
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  requireOAuthConfig("google"),
  handleOAuthCallback("google"),
  oauthRedirectSuccess("google")
);

router.get(
  "/github",
  requireOAuthConfig("github"),
  passport.authenticate("github", {
    scope: ["user:email"],
    session: false,
  })
);

router.get(
  "/github/callback",
  requireOAuthConfig("github"),
  handleOAuthCallback("github"),
  oauthRedirectSuccess("github")
);

export default router;
