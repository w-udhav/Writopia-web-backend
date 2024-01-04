const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticateToken = async (req, res, next) => {
  const token = req.header("Authorization").split(" ")[1];
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id);
    if (!user) {
      return res.status(401).json({ msg: "Invalid token" });
    }

    req.user = {
      id: user._id,
      isAdmin: user.isAdmin,
      role: user.role,
      username: user.username,
      email: user.email,
    };
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ msg: "Token expired" });
    } else {
      console.error(err);
      res.status(500).json({ msg: "Server error" });
    }
  }
};

module.exports = authenticateToken;
