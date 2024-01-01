const jwt = require("jsonwebtoken");
const User = require("../models/User");

const checkRole = (roles) => async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token)
      return res.status(401).json({ msg: "No token, authorization denied" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id);
    if (!user) return res.status(401).json({ msg: "Invalid token" });
    if (!roles.includes(user.role))
      return res.status(401).json({ msg: "Unauthorized" });

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in checkRole middleware");
    res.status(500).send("Server error");
  }
};

module.exports = checkRole;
