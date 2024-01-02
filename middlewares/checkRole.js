const checkRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  next();
};

module.exports = checkRole;
