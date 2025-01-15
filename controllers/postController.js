import {
  addPost,
  findAllPosts,
  findPostById,
  editPost,
  removePost,
  findPostsByCategoryName,
  findPostsByTagName,
  seekInPosts,
} from "../services/postService.js";

export const createPost = async (req, res) => {
  try {
    const { title, content, authorId } = req.body; // Destructure body content
    if (!title || !content || !authorId) {
      return res
        .status(400)
        .json({ error: "All fields are required: title, content, authorId" });
    }
    const post = await addPost(title, content, authorId); // Pass the arguments correctly
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await findAllPosts();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPostById = async (req, res) => {
  try {
    const post = await findPostById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPostsByCategoryName = async (req, res) => {
  const categoryName = req.query.categoryName; // Use req.query instead of req.body
  console.log(req.query);

  if (!categoryName || typeof categoryName !== "string") {
    console.log(categoryName);
    return res.status(400).json({ error: "Invalid category name" });
  }

  try {
    const posts = await findPostsByCategoryName(categoryName);

    if (posts.length === 0) {
      return res
        .status(200)
        .json({ message: "No posts found for the specified category" });
    }

    res.status(200).json(posts);
  } catch (err) {
    console.error("Error in getPostsByCategoryNames:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getPostsByTagName = async (req, res) => {
  const tagName = req.query.tagName;
  console.log(req.query);

  if (!tagName || typeof tagName !== "string") {
    console.log(tagName);
    return res.status(400).json({ error: "Invalid tag name" });
  }

  try {
    const posts = await findPostsByTagName(tagName);

    if (posts.length === 0) {
      return res
        .status(200)
        .json({ message: "No posts found for the specified tag" });
    }

    res.status(200).json(posts);
  } catch (err) {
    console.error("Error in getPostsByTagNames:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;

    // Fetch the existing post
    const existingPost = await findPostById(req.params.id);
    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Use the existing values if new values are not provided
    const updatedTitle = title ?? existingPost.title;
    const updatedContent = content ?? existingPost.content;

    // Update the post
    const post = await editPost(req.params.id, {
      title: updatedTitle,
      content: updatedContent,
    });
    if (!post) return res.status(404).json({ message: "Post not found" });

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;

  // Validate if the ID is provided
  if (!id) {
    return res.status(400).json({ error: "Post ID is required" });
  }

  try {
    // Call the service function to remove the post
    await removePost(id);
    res.status(200).json({ message: `Post with ID ${id} has been deleted` });
  } catch (error) {
    // Handle "not found" error separately
    if (error.message.includes("not found")) {
      return res.status(404).json({ error: error.message });
    }

    // Handle general server errors
    res.status(500).json({ error: "Internal server error" });
  }
};

export const searchInPosts = async (req, res) => {
  const queryObject = req.query.query;
  const query = queryObject.query;
  console.log(query);

  try {
    if (!query || query.trim().length < 3) {
      return res
        .status(400)
        .json({ error: "Query must be at least 3 characters long." });
    }

    const posts = await seekInPosts(query.trim());
    return res.status(200).json(posts);
  } catch (err) {
    console.error(`Error searching for query "${query}":`, err);
    return res
      .status(500)
      .json({ error: "An error occurred while searching posts." });
  }
};
