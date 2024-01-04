const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const authenticateToken = require("../middlewares/authenticateToken");
const checkRole = require("../middlewares/checkRole");
const router = require("express").Router();

router.use(authenticateToken);
// router.use(checkRole(["admin"]));

router.get("/all", checkRole(["admin"]), getCategories);
router.post("/create", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;
