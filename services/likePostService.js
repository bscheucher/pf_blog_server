import pool from "../config/database.js";
import { findPostById } from "./postService.js";
import { findUserById } from "./userService.js";

export const addLikeToPost = async (postId, userId) => {
  try {
    const post = await findPostById(postId);
    const user = await findUserById(userId);

    if (!post) throw new Error(`No post found with ID: ${postId}`);
    if (!user) throw new Error(`No user found with ID: ${userId}`);

    // Check if the like already exists
    const existingLikeQuery = `
        SELECT * FROM blog_post_likes WHERE post_id = $1 AND user_id = $2;
      `;
    const existingLikeResult = await pool.query(existingLikeQuery, [
      postId,
      userId,
    ]);
    if (existingLikeResult.rowCount > 0) {
      throw new Error("User has already liked this post.");
    }

    // Add the like
    const query = `
        INSERT INTO blog_post_likes(post_id, user_id) 
        VALUES($1, $2) RETURNING *;
      `;
    const result = await pool.query(query, [postId, userId]);
    return result.rows[0];
  } catch (err) {
    throw new Error(`Failed to add like to post: ${err.message}`);
  }
};

export const removeLikeFromPost = async (postId, userId) => {
  try {
    const query = `
        DELETE FROM blog_post_likes WHERE post_id = $1 AND user_id = $2 RETURNING *;
      `;
    const result = await pool.query(query, [postId, userId]);

    if (result.rowCount === 0) return null; // No like found
    return result.rows[0];
  } catch (err) {
    throw new Error(`Failed to remove like: ${err.message}`);
  }
};

export const findLikesOfPost = async (postId) => {
  try {
    const query = `
        SELECT u.id, u.username 
        FROM blog_post_likes pl
        JOIN blog_users u ON pl.user_id = u.id
        WHERE pl.post_id = $1;
      `;
    const result = await pool.query(query, [postId]);
    return result.rows;
  } catch (err) {
    throw new Error(`Failed to fetch likes for post ${postId}: ${err.message}`);
  }
};
