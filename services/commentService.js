import pool from "../config/database.js";

export const addComment = async (content, postId, userId) => {
  try {
    const query = `
        INSERT INTO blog_comments (content, post_id, user_id)
        VALUES ($1, $2, $3)
        RETURNING *;
      `;
    const values = [content, postId, userId];
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw new Error(`Failed to add comment: ${err.message}`);
  }
};

export const findAllCommentsOfPost = async (postId) => {
  const query = `
        SELECT * FROM blog_comments WHERE post_id = $1;
    `;
  const values = [postId];
  const { rows } = await pool.query(query, values);
  return rows;
};
