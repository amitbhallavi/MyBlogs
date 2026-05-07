import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";
import { getOAuthProviderConfig } from "../utils/oauthConfig.js";

const getServerUrl = () => {
  return (
    process.env.SERVER_URL ||
    process.env.RENDER_EXTERNAL_URL ||
    `http://localhost:${process.env.PORT || 5000}`
  ).replace(/\/+$/, "");
};

const getCallbackUrl = (provider) => {
  const config = getOAuthProviderConfig(provider);
  if (config.callbackURL) return config.callbackURL;

  if (provider === "google") {
    return `${getServerUrl()}/api/auth/google/callback`;
  }

  return `${getServerUrl()}/api/auth/github/callback`;
};

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

const getGitHubVerifiedEmail = async (accessToken) => {
  if (!accessToken) return "";

  const response = await fetch("https://api.github.com/user/emails", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "MyBlogs OAuth",
    },
  });

  if (!response.ok) return "";

  const emails = await response.json();
  const primaryVerified = emails.find((item) => item.primary && item.verified);
  const firstVerified = emails.find((item) => item.verified);

  return normalizeEmail(primaryVerified?.email || firstVerified?.email);
};

const getProfileEmail = async (provider, profile, accessToken) => {
  const emailFromList = profile.emails?.find((item) => item?.value)?.value;
  const email = normalizeEmail(
    emailFromList ||
      profile._json?.email ||
      (provider === "github" ? await getGitHubVerifiedEmail(accessToken) : "")
  );

  if (!email) {
    const error = new Error("Provider email is missing");
    error.oauthCode = "oauth_email_missing";
    throw error;
  }

  return email;
};

const getProfileAvatar = (profile) => {
  return profile.photos?.find((item) => item?.value)?.value || profile._json?.avatar_url || "";
};

const getProfileName = (profile, email) => {
  return profile.displayName || profile.username || email.split("@")[0];
};

const linkProviderToExistingUser = async ({ user, provider, providerId, avatar }) => {
  if (provider === "google" && !user.googleId) {
    user.googleId = providerId;
  }

  if (provider === "github" && !user.githubId) {
    user.githubId = providerId;
  }

  user.avatar = user.avatar || avatar;
  user.profilePic = user.profilePic || avatar;
  user.profileImage = user.profileImage || avatar;

  await user.save();
  return user;
};

const findOrCreateOAuthUser = async (provider, profile, accessToken) => {
  const email = await getProfileEmail(provider, profile, accessToken);
  const providerId = profile.id;
  const avatar = getProfileAvatar(profile);
  const providerIdField = provider === "google" ? "googleId" : "githubId";

  const providerUser = await User.findOne({ [providerIdField]: providerId });
  if (providerUser) {
    return providerUser;
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return linkProviderToExistingUser({
      user: existingUser,
      provider,
      providerId,
      avatar,
    });
  }

  return User.create({
    name: getProfileName(profile, email),
    email,
    authProvider: provider,
    [providerIdField]: providerId,
    avatar,
    profilePic: avatar,
    profileImage: avatar,
  });
};

const configurePassport = () => {
  const googleConfig = getOAuthProviderConfig("google");
  const githubConfig = getOAuthProviderConfig("github");

  if (googleConfig.clientID && googleConfig.clientSecret) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: googleConfig.clientID,
          clientSecret: googleConfig.clientSecret,
          callbackURL: getCallbackUrl("google"),
          state: true,
        },
        async (_accessToken, _refreshToken, profile, done) => {
          try {
            const user = await findOrCreateOAuthUser("google", profile, _accessToken);
            done(null, user);
          } catch (error) {
            done(error, null);
          }
        }
      )
    );
  }

  if (githubConfig.clientID && githubConfig.clientSecret) {
    passport.use(
      new GitHubStrategy(
        {
          clientID: githubConfig.clientID,
          clientSecret: githubConfig.clientSecret,
          callbackURL: getCallbackUrl("github"),
          scope: ["user:email"],
          state: true,
        },
        async (_accessToken, _refreshToken, profile, done) => {
          try {
            const user = await findOrCreateOAuthUser("github", profile, _accessToken);
            done(null, user);
          } catch (error) {
            done(error, null);
          }
        }
      )
    );
  }
};

export default configurePassport;
