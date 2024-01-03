const {
  createUser,
  loginUser,
  logoutUser,
} = require("../controllers/UserController");

const router = require("express").Router();

router.post("/register", createUser);
router.post("/login", loginUser);

module.exports = router;
