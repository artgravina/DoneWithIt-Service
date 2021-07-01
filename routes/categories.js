const express = require("express");
const router = express.Router();
const categoriesStore = require("../store/categories");

router.get("/", (req, res) => {
  const categories = categoriesStore.getCategories();
  res.send(categories);
});

router.get("/:id", (req, res) => {
  const category = categoriesStore.getCategory(parseInt(req.params.id));
  if (!category) return res.status(404).send();
  res.send(category);
});

module.exports = router;
