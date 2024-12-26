import {
  addTagToPost,
  findTagsOfPost,
  removeTagFromPost,
} from "../services/tagService.js";

const validateIds = (postId, tagId) => {
  if (!postId || isNaN(postId) || postId <= 0) {
    throw new Error("Invalid post ID. It must be a positive integer.");
  }
  if (!tagId || isNaN(tagId) || tagId <= 0) {
    throw new Error("Invalid tag ID. It must be a positive integer.");
  }
};

export const assignTagToPost = async (req, res) => {
  try {
    const { postId, tagId } = req.body;
    validateIds(postId, tagId);

    const tag = await addTagToPost(postId, tagId);
    res.status(201).json(tag);
  } catch (err) {
    console.error("Error assigning tag to post:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const getTagsOfPost = async (req, res) => {
  const postId = parseInt(req.params.postId, 10);

  if (isNaN(postId) || postId <= 0) {
    return res
      .status(400)
      .send("Invalid post ID. It must be a positive integer.");
  }

  try {
    const tags = await findTagsOfPost(postId);
    if (tags.length > 0) {
      res.status(200).json(tags);
    } else {
      res.status(404).send("No tags found for the specified post.");
    }
  } catch (err) {
    console.error("Error fetching tags:", err.message);
    res.status(500).send("An error occurred while fetching the tags.");
  }
};

export const deleteTagFromPost = async (req, res) => {
  try {
    const { postId, tagId } = req.body;
    validateIds(postId, tagId);

    const tag = await removeTagFromPost(postId, tagId);
    if (!tag) {
      return res.status(404).json({ message: "Tag not found." });
    }
    res.status(200).json({ message: "Tag deleted successfully." });
  } catch (err) {
    console.error("Error deleting tag from post:", err.message);
    res.status(500).json({ error: err.message });
  }
};
