import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email"],
    },
    password: {
      type: String,
      required: function requirePasswordForLocalUser() {
        return this.authProvider === "local";
      },
      minlength: [6, "Password must be at least 6 characters"],
    },
    profilePic: {
      type: String,
      default: "",
    },
    profileImage: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    authProvider: {
      type: String,
      enum: ["local", "google", "github"],
      default: "local",
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    githubId: {
      type: String,
      unique: true,
      sparse: true,
    },
    role: {
      type: String,
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function hashPassword() {
  if (!this.password || !this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function matchPassword(enteredPassword) {
  if (!this.password) {
    return false;
  }

  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
