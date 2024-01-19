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

router.get("/all", getCategories);
router.post("/create", checkRole(["admin"]), createCategory);
router.put("/:id", checkRole(["admin"]), updateCategory);
router.delete("/:id", checkRole(["admin"]), deleteCategory);

module.exports = router;
