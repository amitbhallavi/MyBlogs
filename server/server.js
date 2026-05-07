import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import passport from "passport";
import connectDB from "./config/db.js";
import configurePassport from "./config/passport.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import { cleanUrl, getFrontendUrl } from "./utils/urls.js";
import "colors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is missing");
  process.exit(1);
}

const allowedOrigins = [
  getFrontendUrl(),
  cleanUrl(process.env.CLIENT_URL),
  cleanUrl(process.env.LOCAL_CLIENT_URL) || "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
].filter(Boolean);

configurePassport();
app.set("trust proxy", 1);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
  })
);

app.use(
  session({
    name: "myblogs.oauth",
    secret: process.env.SESSION_SECRET || process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 10 * 60 * 1000,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  })
);

app.use(passport.initialize());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "MyBlogs API is running" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);

app.use(notFound);
app.use(errorHandler);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`.bgBlue);
    });
  })
  .catch((error) => {
    console.error(`Database connection failed: ${error.message}`);
    process.exit(1);
  });
