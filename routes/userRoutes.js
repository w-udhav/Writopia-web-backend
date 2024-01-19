const {
  createUser,
  loginUser,
  getUser,
  verifyUser,
  status,
} = require("../controllers/UserController");
const authenticateToken = require("../middlewares/authenticateToken");

const router = require("express").Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/me", authenticateToken, getUser);
router.get("/verify/:id", verifyUser);
router.get("/status", authenticateToken, status);

module.exports = router;
