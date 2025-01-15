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
  JOIN blog_users u ON p.author_id = u.id
  ORDER BY p.created_at DESC;
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

export const findPostsByCategoryName = async (categoryName) => {
  const query = `
    SELECT blog_posts.*, blog_users.username AS author
    FROM blog_posts
    JOIN blog_post_categories ON blog_posts.id = blog_post_categories.post_id
    JOIN blog_categories ON blog_post_categories.category_id = blog_categories.id
	  JOIN blog_users ON blog_posts.author_id = blog_users.id
    WHERE blog_categories.name = $1
    ORDER BY blog_posts.created_at DESC;
  `;

  try {
    const result = await pool.query(query, [categoryName]);
    return result.rows;
  } catch (error) {
    console.error("Error finding posts by category name:", error);
    throw new Error("Database query failed");
  }
};

export const findPostsByTagName = async (tagName) => {
  const query = `
    SELECT blog_posts.*, blog_users.username AS author
    FROM blog_posts
    JOIN blog_post_tags ON blog_posts.id = blog_post_tags.post_id
    JOIN blog_tags ON blog_post_tags.tag_id = blog_tags.id
	  JOIN blog_users ON blog_posts.author_id = blog_users.id
    WHERE blog_tags.name = $1
    ORDER BY blog_posts.created_at DESC;
  `;

  try {
    const result = await pool.query(query, [tagName]);
    return result.rows;
  } catch (error) {
    console.error("Error finding posts by tag name:", error);
    throw new Error("Database query failed");
  }
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

export const removePost = async (postId) => {
  const query = "DELETE FROM blog_posts WHERE id = $1 RETURNING *";

  try {
    // Execute the delete query
    const result = await pool.query(query, [postId]);

    // Check if the post existed
    if (result.rowCount === 0) {
      throw new Error(`Post with ID ${postId} not found`);
    }
  } catch (error) {
    // Re-throw the error for the controller to handle
    throw new Error(`Failed to delete post: ${error.message}`);
  }
};

export const seekInPosts = async (query) => {
  const searchPattern = `%${query}%`;
  const sql = `
    SELECT blog_posts.*, blog_users.username AS author
    FROM blog_posts
    JOIN blog_users ON blog_posts.author_id = blog_users.id
    WHERE blog_posts.title ILIKE $1 OR blog_posts.content ILIKE $1
    ORDER BY blog_posts.created_at DESC;
  `;
  const result = await pool.query(sql, [searchPattern]);
  return result.rows;
};
