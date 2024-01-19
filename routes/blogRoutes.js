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
const { upload } = require("../server");

const router = require("express").Router();

//* Public
router.use(authenticateToken);

router.get("/", getBlogs);
router.get("/:id", getThatBlog);
router.post("/:id/comment", addComment);
router.delete("/:id/comment/:commentId", deleteComment);
router.delete("/:id", deleteBlog);

router.post("/", upload.single("image"), createBlog);

//! Admin only
router.get("/:id");
router.put("/:id", checkRole(["admin"]), updateBlog);

module.exports = router;
