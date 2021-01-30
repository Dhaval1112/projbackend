const Category = require("../models/category");

exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((error, cate) => {
    if (error) {
      return res.status(400).json({ error: "Caregory not found in DB" });
    }
    req.category = cate;
    next();
  });
};

exports.createCategory = (req, res) => {
  const category = new Category(req.body);
  category.save((err, category) => {
    if (err || !category) {
      return res.status(400).json({
        error:
          "Category does not edded some error occure while inserting category",
      });
    }
    res.json({ category });
  });
};

exports.getCategory = (req, res) => {
  return res.json(req.category);
};
exports.getAllCategory = (req, res) => {
  Category.find().exec((error, categories) => {
    if (error) {
      return res.status(400).json({
        error: "Categories do not found",
      });
    }
    return res.json(categories);
  });
};

exports.updateCategory = (req, res) => {
  let category = req.category;
  // console.log(req.bodycategory);
  console.log(req.body.name);
  category.name = req.body.name;
  category.save((error, updatedCategory) => {
    if (error) {
      return res.status(400).json({
        error: "Failed to update category",
      });
    }
    res.json({ updatedCategory });
  });
};

exports.removeCategory = (req, res) => {
  const category = req.category;
  category.remove((err, cate) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete category",
      });
    }
    res.json({ message: `Successfully deleted ${cate.name}` });
  });
};
