const {
  addComment,
  getBlogs,
  getThatBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  deleteComment,
} = require("../controllers/blogController");
const authenticateToken = require("../middlewares/authenticateToken");
const checkRole = require("../middlewares/checkRole");

const router = require("express").Router();

//* Public
router.use(authenticateToken);

router.get("/", getBlogs);
router.get("/:id", getThatBlog);
router.post("/:id/comment", addComment);
router.delete("/:id/comment/:commentId", deleteComment);

//! Admin only
router.post("/", checkRole(["admin"]), createBlog);
router.put("/:id", checkRole(["admin"]), updateBlog);
router.delete("/:id", checkRole(["admin"]), deleteBlog);

module.exports = router;
