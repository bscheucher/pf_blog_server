import {
  addComment,
  findAllCommentsOfPost,
} from "../services/commentService.js";
import { findPostById } from "../services/postService.js";

export const createComment = async (req, res) => {
  try {
    const { content, postId, userId } = req.body;
    if (!content || !postId || !userId) {
      return res
        .status(400)
        .json({ error: "All fields are required: content, postId, userId" });
    }
    const comment = await addComment(content, postId, userId);
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllCommentsOfPosts = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await findPostById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comments = await findAllCommentsOfPost(postId);
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
