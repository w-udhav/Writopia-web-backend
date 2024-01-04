const {
  createUser,
  loginUser,
  getUser,
} = require("../controllers/UserController");
const authenticateToken = require("../middlewares/authenticateToken");

const router = require("express").Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/me", authenticateToken, getUser);

module.exports = router;
