const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user)
      return res
        .status(400)
        .json({ msg: "User already exists", errorCode: "email" });

    user = await User.findOne({ username });
    if (user)
      return res
        .status(400)
        .json({ msg: "Username already exists", errorCode: "username" });

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = new User({
      username,
      email,
      hashedPassword,
    });

    await user.save();

    // User is regiestered ==> create and sign a token
    const payload = {
      user: {
        id: user._id,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5h" },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ token, msg: "User created successfully" });
      }
    );
  } catch (error) {
    res.status(500).send("Server error");
  }
};

exports.loginUser = async (req, res) => {
  const { name, password } = req.body;

  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

  let user;

  if (emailRegex.test(name)) {
    user = await User.findOne({ email: name });
  } else {
    user = await User.findOne({ username: name });
  }

  if (!user) {
    return res
      .status(400)
      .json({ msg: "User does not exist", errorCode: "none" });
  }

  const isMatch = await bcrypt.compare(password, user.hashedPassword);
  if (!isMatch) {
    return res
      .status(400)
      .json({ msg: "Incorrect password", errorCode: "password" });
  }

  const payload = {
    user: {
      id: user._id,
      role: user.role,
    },
  };

  jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: "5h" },
    (err, token) => {
      if (err) throw err;
      res.json({ token });
    }
  );
};

// exports.forgotPassword = async (req, res) => {
//   const { email } = req.body;
// };
