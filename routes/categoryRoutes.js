const authenticateToken = require("../middlewares/authenticateToken");
const checkRole = require("../middlewares/checkRole");
const router = require("express").Router();

router.use(authenticateToken);
router.use(checkRole(["admin"]));

router.get("/all", getCategories);
router.post("/create", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);