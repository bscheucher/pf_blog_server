import express from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/postController.js";
import {
  createComment,
  getAllCommentsOfPosts,
} from "../controllers/commentController.js";

import {
  assignCategoryToPost,
  getCategoriesOfPost,
  deleteCategoryFromPost,
} from "../controllers/categoryController.js";

import {
  assignTagToPost,
  deleteTagFromPost,
  getTagsOfPost,
} from "../controllers/tagController.js";

import {assignLikeToPost, deleteLikeFromPost, getLikesOfPost} from "../controllers/likePostController.js"

const router = express.Router();

router.post("/", createPost);
router.get("/", getAllPosts);
router.post("/comment", createComment);

router.post("/add-category", assignCategoryToPost);
router.delete("/delete-category", deleteCategoryFromPost);
router.get("/:postId/categories", getCategoriesOfPost);

router.post("/add-tag", assignTagToPost);
router.delete("/delete-tag", deleteTagFromPost);
router.get("/:postId/tags", getTagsOfPost);

router.post("/add-like", assignLikeToPost);
router.delete("/delete-like", deleteLikeFromPost);
router.get("/:postId/likes", getLikesOfPost);

router.get("/:id", getPostById);
router.get("/:postId/comments", getAllCommentsOfPosts);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

export default router;
