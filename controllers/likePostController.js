import {
  addLikeToPost,
  findLikesOfPost,
  removeLikeFromPost,
} from "../services/likePostService.js";


const validateIds = (postId, userId) => {
  if (!postId || isNaN(postId) || postId <= 0) {
    throw new Error("Invalid post ID. It must be a positive integer.");
  }
  if (!userId || isNaN(userId) || userId <= 0) {
    throw new Error("Invalid user ID. It must be a positive integer.");
  }
};

export const assignLikeToPost = async (req, res) => {
  try {
    const { postId, userId } = req.body;
    validateIds(postId, userId);

    const like = await addLikeToPost(postId, userId);
    res.status(201).json(like);
  } catch (err) {
    console.error("Error assigning like to post:", err.message);
    res.status(err.message.includes("Invalid") ? 400 : 500).json({
      error: err.message,
    });
  }
};

export const getLikesOfPost = async (req, res) => {
  try {
    const postId = parseInt(req.params.postId, 10);
    validateIds(postId, 1); // Dummy userId to reuse the function

    const likes = await findLikesOfPost(postId);
    if (likes.length === 0) {
      return res.status(200).json({ message: "No likes found for the specified post.", likes: [] });
    }
    res.status(200).json(likes);
  } catch (err) {
    console.error("Error fetching likes:", err.message);
    res.status(500).send("An error occurred while fetching the likes.");
  }
};


export const deleteLikeFromPost = async (req, res) => {
  try {
    const { postId, userId } = req.body;
    validateIds(postId, userId);

    const like = await removeLikeFromPost(postId, userId);
    if (!like) {
      return res.status(404).json({ message: "Like not found." });
    }
    res.status(200).json({ message: "Like deleted successfully." });
  } catch (err) {
    console.error("Error deleting like from post:", err.message);
    res.status(500).json({ error: err.message });
  }
};
