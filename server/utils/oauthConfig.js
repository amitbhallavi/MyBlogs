const getEnv = (...keys) => {
  for (const key of keys) {
    const value = process.env[key]?.trim();
    if (value) return value;
  }

  return "";
};

const getOAuthProviderConfig = (provider) => {
  if (provider === "google") {
    return {
      clientID: getEnv("GOOGLE_CLIENT_ID", "GOOGLE_OAUTH_CLIENT_ID"),
      clientSecret: getEnv("GOOGLE_CLIENT_SECRET", "GOOGLE_OAUTH_CLIENT_SECRET"),
      callbackURL: getEnv("GOOGLE_CALLBACK_URL", "GOOGLE_OAUTH_CALLBACK_URL"),
    };
  }

  if (provider === "github") {
    return {
      clientID: getEnv("GITHUB_CLIENT_ID", "GITHUB_OAUTH_CLIENT_ID"),
      clientSecret: getEnv("GITHUB_CLIENT_SECRET", "GITHUB_OAUTH_CLIENT_SECRET"),
      callbackURL: getEnv("GITHUB_CALLBACK_URL", "GITHUB_OAUTH_CALLBACK_URL"),
    };
  }

  return {
    clientID: "",
    clientSecret: "",
    callbackURL: "",
  };
};

const getOAuthStatus = () => {
  const google = getOAuthProviderConfig("google");
  const github = getOAuthProviderConfig("github");

  return {
    google: {
      configured: Boolean(google.clientID && google.clientSecret),
      missing: [
        !google.clientID ? "GOOGLE_CLIENT_ID" : "",
        !google.clientSecret ? "GOOGLE_CLIENT_SECRET" : "",
      ].filter(Boolean),
    },
    github: {
      configured: Boolean(github.clientID && github.clientSecret),
      missing: [
        !github.clientID ? "GITHUB_CLIENT_ID" : "",
        !github.clientSecret ? "GITHUB_CLIENT_SECRET" : "",
      ].filter(Boolean),
    },
  };
};

export { getOAuthProviderConfig, getOAuthStatus };
