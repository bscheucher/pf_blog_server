import {
  addPost,
  findAllPosts,
  findPostById,
  editPost,
  removePost,
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
  try {
    const post = await removePost(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
