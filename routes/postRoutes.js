import express from "express";
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

const router = express.Router();

router.post("/", createPost);
router.get("/", getAllPosts);
router.get("/of-category", getPostsByCategoryName);
router.get("/of-tag", getPostsByTagName);
router.get("/search", searchInPosts);
router.post("/comment", createComment);

router.get("/categories", getAllCategories);
router.post("/add-category", assignCategoryToPost);
router.put("/update-categories", updatePostCategories);
router.delete("/delete-category", deleteCategoryFromPost);
router.get("/:postId/categories", getCategoriesOfPost);

router.get("/tags", getAllTags);
router.post("/add-tag", assignTagToPost);
router.put("/update-tags", updatePostTags);
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
