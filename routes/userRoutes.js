const { createUser, loginUser } = require("../controllers/UserController");
const checkRole = require("../middlewares/checkRole");

const router = require("express").Router();

router.post("/register", createUser);
router.post("/login", loginUser);

router.post("/admin/register", checkRole(["admin"]), createUser);

module.exports = router;
