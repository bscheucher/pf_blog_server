import pool from "../config/database.js";
import { findPostById } from "./postService.js";

/**
 * Find all tags
 * @returns {array} of tag objects
 *
 */
export const findAllTags = async () => {
  try {
    const query = `SELECT * FROM blog_tags`;
    const result = await pool.query(query);
    console.log(result.rows);
    return result.rows;
  } catch (err) {
    throw new Error(`Failed to fetch tags: ${err.message}`);
  }
};

/**
 * Find a tag by its ID.
 * @param {number} id - The tag ID.
 * @returns {object} The tag object.
 */
export const findTagById = async (id) => {
  try {
    const query = `SELECT * FROM blog_tags WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  } catch (err) {
    throw new Error(`Failed to fetch tag with ID ${id}: ${err.message}`);
  }
};

/**
 * Add a tag to a post.
 * @param {number} postId - The post ID.
 * @param {number} tagId - The tag ID.
 * @returns {object} The new mapping object.
 */
export const addTagToPost = async (postId, tagId) => {
  try {
    const post = await findPostById(postId);
    const tag = await findTagById(tagId);
    if (!post) {
      throw new Error("No post with this ID.");
    }
    if (!tag) {
      throw new Error("No tag with this ID.");
    }

    const query = `INSERT INTO blog_post_tags (post_id, tag_id) VALUES ($1, $2) RETURNING *;`;
    const result = await pool.query(query, [postId, tagId]);
    return result.rows[0];
  } catch (err) {
    throw new Error(
      `Failed to add tag ${tagId} to post ${postId}: ${err.message}`
    );
  }
};

export const editPostTags = async (postId, newTagIds) => {
  try {
    // Find the post by its ID
    const post = await findPostById(postId);

    // Check if the post exists
    if (!post) {
      throw new Error("No post with this ID.");
    }

    // Remove the old tags from the post
    const deleteQuery = `DELETE FROM blog_post_tags WHERE post_id = $1;`;
    const deleteValues = [postId];
    await pool.query(deleteQuery, deleteValues);

    // Insert the new tags into the post
    const insertQuery = `INSERT INTO blog_post_tags(post_id, tag_id) VALUES($1, $2) RETURNING *;`;

    // Insert each tag one by one
    for (let tagId of newTagIds) {
      const insertValues = [postId, tagId];
      await pool.query(insertQuery, insertValues);
    }

    // Return a success message or the updated post
    return { postId, newTagIds };
  } catch (err) {
    throw new Error(`Failed to update tags for post ${postId}: ${err.message}`);
  }
};

/**
 * Find all tags of a given post.
 * @param {number} postId - The post ID.
 * @returns {Array} List of tags for the post.
 */
export const findTagsOfPost = async (postId) => {
  try {
    const query = `
      SELECT t.id, t.name 
      FROM blog_post_tags pt
      JOIN blog_tags t ON pt.tag_id = t.id
      WHERE pt.post_id = $1;
    `;
    const result = await pool.query(query, [postId]);
    return result.rows;
  } catch (err) {
    throw new Error(`Failed to fetch tags for post ${postId}: ${err.message}`);
  }
};

/**
 * Remove a tag from a post.
 * @param {number} postId - The post ID.
 * @param {number} tagId - The tag ID.
 * @returns {object} The deleted mapping object.
 */
export const removeTagFromPost = async (postId, tagId) => {
  try {
    const query = `DELETE FROM blog_post_tags WHERE post_id = $1 AND tag_id = $2 RETURNING *;`;
    const result = await pool.query(query, [postId, tagId]);
    return result.rows[0];
  } catch (err) {
    throw new Error(`Failed to remove tag from post ${postId}: ${err.message}`);
  }
};
