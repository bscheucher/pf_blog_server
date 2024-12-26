import {
  addCategoryToPost,
  findCategoriesOfPost,
  removeCategoryFromPost,
  findCategoryById,
} from "../services/categoryService.js";

const validateIds = (postId, categoryId) => {
  if (!postId || isNaN(postId) || postId <= 0) {
    throw new Error("Invalid post ID. It must be a positive integer.");
  }
  if (!categoryId || isNaN(categoryId) || categoryId <= 0) {
    throw new Error("Invalid category ID. It must be a positive integer.");
  }
};

export const assignCategoryToPost = async (req, res) => {
  try {
    const { postId, categoryId } = req.body;
    validateIds(postId, categoryId);

    const category = await addCategoryToPost(postId, categoryId);
    res.status(201).json(category);
  } catch (err) {
    console.error("Error assigning category to post:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const getCategoriesOfPost = async (req, res) => {
  const postId = parseInt(req.params.postId, 10);

  if (isNaN(postId) || postId <= 0) {
    return res
      .status(400)
      .send("Invalid post ID. It must be a positive integer.");
  }

  try {
    const categories = await findCategoriesOfPost(postId);
    if (categories.length > 0) {
      res.status(200).json(categories);
    } else {
      res.status(404).send("No categories found for the specified post.");
    }
  } catch (err) {
    console.error("Error fetching categories:", err.message);
    res.status(500).send("An error occurred while fetching the categories.");
  }
};

export const deleteCategoryFromPost = async (req, res) => {
    try {
      const { postId, categoryId } = req.body;
      validateIds(postId, categoryId);
  
      const category = await removeCategoryFromPost(postId, categoryId);
      if (!category) {
        return res.status(404).json({ message: "Category not found." });
      }
      res.status(200).json({ message: "Category deleted successfully." });
    } catch (err) {
      console.error("Error deleting category from post:", err.message);
      res.status(500).json({ error: err.message });
    }
  };
  
