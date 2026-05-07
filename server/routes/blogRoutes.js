import express from "express";
import {
  addComment,
  createBlog,
  deleteBlog,
  deleteComment,
  getBlogById,
  getBlogs,
  getMyBlogs,
  toggleLike,
  updateBlog,
} from "../controllers/blogController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getBlogs).post(protect, createBlog);
router.get("/my", protect, getMyBlogs);
router.route("/:id").get(getBlogById).put(protect, updateBlog).delete(protect, deleteBlog);
router.patch("/:id/like", protect, toggleLike);
router.post("/:id/comments", protect, addComment);
router.delete("/:id/comments/:commentId", protect, deleteComment);

export default router;
