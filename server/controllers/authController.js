import asyncHandler from "../middleware/asyncHandler.js";
import Blog from "../models/Blog.js";
import User from "../models/User.js";
import { formatUser } from "../utils/formatters.js";
import generateToken from "../utils/token.js";
import { buildFrontendRedirect } from "../utils/urls.js";

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, profilePic, profileImage, avatar, bio, gender, location } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email and password are required");
  }

  const normalizedEmail = email.trim().toLowerCase();
  const userExists = await User.findOne({ email: normalizedEmail });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists. Please sign in instead.");
  }

  const user = await User.create({
    name,
    email: normalizedEmail,
    password,
    authProvider: "local",
    profilePic: profilePic || "",
    profileImage: profileImage || profilePic || avatar || "",
    avatar: avatar || profileImage || profilePic || "",
    bio: bio || "",
    gender: gender || "",
    location: location || "",
  });

  res.status(201).json(formatUser(user, generateToken(user._id)));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() });

  if (user && !user.password) {
    res.status(401);
    throw new Error(`Use ${user.authProvider} login for this account`);
  }

  if (user && (await user.matchPassword(password))) {
    res.json(formatUser(user, generateToken(user._id)));
    return;
  }

  res.status(401);
  throw new Error("Invalid email or password");
});

const getCurrentUser = asyncHandler(async (req, res) => {
  res.json(formatUser(req.user));
});

const updateCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const previousName = user.name;

  if (req.body.name !== undefined) {
    const nextName = String(req.body.name).trim();
    if (!nextName) {
      res.status(400);
      throw new Error("Name is required");
    }
    user.name = nextName;
  }

  if (req.body.email !== undefined) {
    const nextEmail = String(req.body.email).trim().toLowerCase();
    if (!nextEmail) {
      res.status(400);
      throw new Error("Email is required");
    }

    const emailOwner = await User.findOne({ email: nextEmail, _id: { $ne: user._id } });
    if (emailOwner) {
      res.status(400);
      throw new Error("Email is already in use");
    }

    user.email = nextEmail;
  }

  user.profilePic = req.body.profilePic !== undefined ? String(req.body.profilePic).trim() : user.profilePic;
  user.profileImage = req.body.profileImage !== undefined ? String(req.body.profileImage).trim() : user.profileImage;
  user.avatar = req.body.avatar !== undefined ? String(req.body.avatar).trim() : user.avatar;
  user.bio = req.body.bio !== undefined ? String(req.body.bio).trim() : user.bio;
  user.gender = req.body.gender !== undefined ? String(req.body.gender).trim() : user.gender;
  user.location = req.body.location !== undefined ? String(req.body.location).trim() : user.location;

  if (req.body.password) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();
  if (previousName !== updatedUser.name) {
    await Blog.updateMany({ author: updatedUser._id }, { authorName: updatedUser.name });
  }

  res.json(formatUser(updatedUser, generateToken(updatedUser._id)));
});

const oauthRedirectSuccess = (provider) =>
  asyncHandler(async (req, res) => {
    if (!req.user) {
      res.redirect(buildFrontendRedirect("/login?error=oauth_failed"));
      return;
    }

    const token = generateToken(req.user._id);
    res.redirect(
      buildFrontendRedirect(`/auth/success?token=${encodeURIComponent(token)}&provider=${provider}`)
    );
  });

export {
  registerUser,
  loginUser,
  getCurrentUser,
  updateCurrentUser,
  oauthRedirectSuccess,
};
