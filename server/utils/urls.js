const PLACEHOLDER_PATTERN = /(your-|placeholder|example\.com)/i;

const cleanUrl = (value) => {
  const url = String(value || "").trim().replace(/\/+$/, "");
  return url && !PLACEHOLDER_PATTERN.test(url) ? url : "";
};

const cleanUrlList = (value) => {
  return String(value || "")
    .split(",")
    .map(cleanUrl)
    .filter(Boolean);
};

const getFrontendUrl = () => {
  return (
    cleanUrl(process.env.FRONTEND_URL) ||
    cleanUrl(process.env.CLIENT_URL) ||
    cleanUrl(process.env.LOCAL_CLIENT_URL) ||
    "http://localhost:5173"
  );
};

const buildFrontendRedirect = (path) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getFrontendUrl()}${normalizedPath}`;
};

export { buildFrontendRedirect, cleanUrl, cleanUrlList, getFrontendUrl };
