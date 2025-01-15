import pool from "../config/database.js";
import { findPostById } from "./postService.js";

/**
 * Find all categories
 * @returns {array} of category objects
 * 
 */
export const findAllCategories = async () => {
  try {
    const query = `SELECT * FROM blog_categories`;
    const result = await pool.query(query);
    return result.rows;
  } catch (err) {
    throw new Error(`Failed to fetch category: ${err.message}`);
  }
};


/**
 * Find a category by its ID.
 * @param {number} id - The category ID.
 * @returns {object} The category object.
 */
export const findCategoryById = async (id) => {
  try {
    const query = `SELECT * FROM blog_categories WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  } catch (err) {
    throw new Error(`Failed to fetch category: ${err.message}`);
  }
};

/**
 * Add a category to a post.
 * @param {number} postId - The post ID.
 * @param {number} categoryId - The Category ID.
 * @returns {object} The new mapping object.
 */
export const addCategoryToPost = async (postId, categoryId) => {
  try {
    // Find the post and category by their IDs
    const post = await findPostById(postId);
    const category = await findCategoryById(categoryId);

    // Check if the post or category exists
    if (!post) {
      throw new Error("No post with this ID.");
    }
    if (!category) {
      throw new Error("No category with this ID.");
    }

    // Insert the mapping into the database
    const query = `INSERT INTO blog_post_categories(post_id, category_id) VALUES($1, $2) RETURNING *;`;
    const values = [postId, categoryId];
    const result = await pool.query(query, values);

    // Return the newly created mapping object
    return result.rows[0];
  } catch (err) {
    throw new Error(
      `Failed to add category ${categoryId} to post ${postId}: ${err.message}`
    );
  }
};

export const editPostCategories = async (postId, newCategoryIds) => {
  try {
    // Find the post by its ID
    const post = await findPostById(postId);

    // Check if the post exists
    if (!post) {
      throw new Error("No post with this ID.");
    }

    // Remove the old categories from the post
    const deleteQuery = `DELETE FROM blog_post_categories WHERE post_id = $1;`;
    const deleteValues = [postId];
    await pool.query(deleteQuery, deleteValues);

    // Insert the new categories into the post
    const insertQuery = `INSERT INTO blog_post_categories(post_id, category_id) VALUES($1, $2) RETURNING *;`;

    // Insert each category one by one
    for (let categoryId of newCategoryIds) {
      const insertValues = [postId, categoryId];
      await pool.query(insertQuery, insertValues);
    }

    // Return a success message or the updated post
    return { postId, newCategoryIds };
  } catch (err) {
    throw new Error(`Failed to update categories for post ${postId}: ${err.message}`);
  }
};

/**
 * Find all categories of a given post.
 * @param {number} postId - The post ID.
 * @returns {Array} List of categories for the post.
 */
export const findCategoriesOfPost = async (postId) => {
  try {
    const query = `
      SELECT c.id, c.name 
      FROM blog_post_categories pc
      JOIN blog_categories c ON pc.category_id = c.id
      WHERE pc.post_id = $1;
    `;
    const result = await pool.query(query, [postId]);
    return result.rows;
  } catch (err) {
    throw new Error(`Failed to fetch categories: ${err.message}`);
  }
};

/**
 * Remove a category from a post.
 * @param {number} postId - The post ID.
 * @param {number} categoryId - The category ID.
 * @returns {object} The deleted mapping object.
 */
export const removeCategoryFromPost = async (postId, categoryId) => {
  try {
    const query = `DELETE FROM blog_post_categories WHERE post_id = $1 AND category_id = $2 RETURNING *;`;
    const values = [postId, categoryId];
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw new Error(`Failed to remove category: ${err.message}`);
  }
};
