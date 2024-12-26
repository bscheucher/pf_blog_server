import pool from "../config/database.js";

export const addPost = async (title, content, authorId) => {
  const query = `
        INSERT INTO blog_posts (title, content, author_id)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
  const values = [title, content, authorId];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const findAllPosts = async () => {
  const query = `
        SELECT p.*, u.username AS author
        FROM blog_posts p
        JOIN blog_users u ON p.author_id = u.id;
    `;
  const result = await pool.query(query);
  return result.rows;
};

export const findPostById = async (id) => {
  const query = `
        SELECT p.*, u.username AS author
        FROM blog_posts p
        JOIN blog_users u ON p.author_id = u.id
        WHERE p.id = $1;
    `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

export const editPost = async (id, { title, content }) => {
  const query = `
          UPDATE blog_posts
          SET title = $1, content = $2, updated_at = NOW()
          WHERE id = $3
          RETURNING *;
      `;
  const values = [title, content, id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const removePost = async (id) => {
  const query = `
        DELETE FROM blog_posts
        WHERE id = $1
        RETURNING *;
    `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};
