const Category = require("../models/Category");

exports.createCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const check = await Category.findOne({ name });
    if (check) return res.status(400).json({ msg: "Category already exists" });
    const category = new Category({ name });
    await category.save();
    res.status(201).json({ category });
  } catch (error) {
    console.error("Error in createCategory controller");
    res.status(500).send("Server error");
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).send("Server error");
  }
};

exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ msg: "Category not found" });
    category.name = name;
    await category.save();
    res.status(200).json({ category });
  } catch (error) {
    console.error("Error in updateCategory controller");
    res.status(500).send("Server error");
  }
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ msg: "Category not found" });
    await category.remove();
    res.status(200).json({ msg: "Category deleted" });
  } catch (error) {
    console.error("Error in deleteCategory controller");
    res.status(500).send("Server error");
  }
};
