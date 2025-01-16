import express from "express";
import { validateUserInput } from "../middleware/validateUserMiddleware.js";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getPostsByCategoryName,
  getPostsByTagName,
  searchInPosts,
} from "../controllers/postController.js";
import {
  createComment,
  getAllCommentsOfPosts,
} from "../controllers/commentController.js";

import {
  assignCategoryToPost,
  getCategoriesOfPost,
  deleteCategoryFromPost,
  getAllCategories,
  updatePostCategories,
} from "../controllers/categoryController.js";

import {
  assignTagToPost,
  deleteTagFromPost,
  getTagsOfPost,
  getAllTags,
  updatePostTags,
} from "../controllers/tagController.js";

import {
  assignLikeToPost,
  deleteLikeFromPost,
  getLikesOfPost,
} from "../controllers/likePostController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

const router = express.Router();

router.post("/", authenticateToken, createPost);
router.get("/", getAllPosts);
router.get("/of-category", getPostsByCategoryName);
router.get("/of-tag", getPostsByTagName);
router.get("/search", searchInPosts);
router.post("/comment", authenticateToken, createComment);

router.get("/categories", getAllCategories);
router.post("/add-category", authenticateToken, assignCategoryToPost);
router.put("/update-categories", authenticateToken, updatePostCategories);
router.delete("/delete-category", authenticateToken, deleteCategoryFromPost);
router.get("/:postId/categories", getCategoriesOfPost);

router.get("/tags", getAllTags);
router.post("/add-tag", authenticateToken, assignTagToPost);
router.put("/update-tags", authenticateToken, updatePostTags);
router.delete("/delete-tag", authenticateToken, deleteTagFromPost);
router.get("/:postId/tags", getTagsOfPost);

router.post("/add-like", authenticateToken, assignLikeToPost);
router.delete("/delete-like", authenticateToken, deleteLikeFromPost);
router.get("/:postId/likes", getLikesOfPost);

router.get("/:id", getPostById);
router.get("/:postId/comments", getAllCommentsOfPosts);
router.put("/:id", authenticateToken, updatePost);
router.delete("/:id", authenticateToken, deletePost);

export default router;
