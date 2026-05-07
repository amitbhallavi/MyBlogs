import asyncHandler from "../middleware/asyncHandler.js";
import Blog from "../models/Blog.js";
import { formatBlog } from "../utils/formatters.js";

const normalizeTags = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) {
    return tags.map((tag) => String(tag).trim()).filter(Boolean);
  }
  return String(tags)
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
};

const calculateReadTime = (text) => {
  const words = String(text || "").trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
};

const getBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({})
    .sort({ createdAt: -1 })
    .populate("author", "name email profilePic profileImage avatar");

  res.json(blogs.map(formatBlog));
});

const getMyBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({ author: req.user._id })
    .sort({ createdAt: -1 })
    .populate("author", "name email profilePic profileImage avatar");

  res.json(blogs.map(formatBlog));
});

const getBlogById = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("author", "name email profilePic profileImage avatar");

  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  res.json(formatBlog(blog));
});

const createBlog = asyncHandler(async (req, res) => {
  const content = req.body.content || req.body.description;
  const description = req.body.description || req.body.content;

  if (!req.body.title || !description) {
    res.status(400);
    throw new Error("Title and content are required");
  }

  const blog = await Blog.create({
    title: req.body.title,
    content,
    description,
    image: req.body.image || "",
    category: req.body.category || "",
    categoryColor: req.body.categoryColor || "",
    tags: normalizeTags(req.body.tags),
    readTime: req.body.readTime || calculateReadTime(content),
    author: req.user._id,
    authorName: req.user.name,
  });

  const populatedBlog = await blog.populate("author", "name email profilePic profileImage avatar");
  res.status(201).json(formatBlog(populatedBlog));
});

const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  if (blog.author.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to update this blog");
  }

  const nextContent = req.body.content ?? req.body.description ?? blog.content;
  const nextDescription = req.body.description ?? req.body.content ?? blog.description;

  blog.title = req.body.title ?? blog.title;
  blog.content = nextContent;
  blog.description = nextDescription;
  blog.image = req.body.image ?? blog.image;
  blog.category = req.body.category ?? blog.category;
  blog.categoryColor = req.body.categoryColor ?? blog.categoryColor;
  blog.tags = req.body.tags === undefined ? blog.tags : normalizeTags(req.body.tags);
  blog.readTime = req.body.readTime ?? calculateReadTime(nextContent);

  const updatedBlog = await blog.save();
  const populatedBlog = await updatedBlog.populate("author", "name email profilePic profileImage avatar");

  res.json(formatBlog(populatedBlog));
});

const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  if (blog.author.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to delete this blog");
  }

  await blog.deleteOne();
  res.json(formatBlog(blog));
});

const toggleLike = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  const userId = req.user._id.toString();
  const existingLikeIndex = blog.likes.findIndex((like) => like.toString() === userId);

  if (existingLikeIndex >= 0) {
    blog.likes.splice(existingLikeIndex, 1);
  } else {
    blog.likes.push(req.user._id);
  }

  const updatedBlog = await blog.save();
  const populatedBlog = await updatedBlog.populate("author", "name email profilePic profileImage avatar");

  res.json(formatBlog(populatedBlog));
});

const addComment = asyncHandler(async (req, res) => {
  const { text } = req.body;

  if (!text || !text.trim()) {
    res.status(400);
    throw new Error("Comment text is required");
  }

  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  blog.comments.push({
    user: req.user._id,
    name: req.user.name,
    text,
  });

  const updatedBlog = await blog.save();
  const populatedBlog = await updatedBlog.populate("author", "name email profilePic profileImage avatar");

  res.status(201).json(formatBlog(populatedBlog));
});

const deleteComment = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  const comment = blog.comments.id(req.params.commentId);

  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }

  const isCommentOwner = comment.user.toString() === req.user._id.toString();
  const isBlogOwner = blog.author.toString() === req.user._id.toString();

  if (!isCommentOwner && !isBlogOwner) {
    res.status(403);
    throw new Error("Not authorized to delete this comment");
  }

  blog.comments.pull({ _id: req.params.commentId });
  const updatedBlog = await blog.save();
  const populatedBlog = await updatedBlog.populate("author", "name email profilePic profileImage avatar");

  res.json(formatBlog(populatedBlog));
});

export {
  getBlogs,
  getMyBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleLike,
  addComment,
  deleteComment,
};
