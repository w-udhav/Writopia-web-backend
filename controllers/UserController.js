const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

function sendEmail(data) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USERID,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.MAIL_USERID,
    to: data.email,
    subject: data.subject,
    text: data.link,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      return false;
    } else {
      console.log("Email sent: " + info.response);
      return true;
    }
  });
}

//? 1. get the data from the body or params or query
//? 2. validate the data

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
    const hashedPassword = await bcrypt.hash(password, salt); //SHA256
    user = new User({
      username,
      email,
      hashedPassword,
      isAdmin: false,
      role: "user",
    });

    await user.save();

    // User is regiestered ==> create and sign a token
    const payload = {
      user: {
        id: user._id,
        role: user.role,
      },
    };

    const link = `${process.env.SERVER_URL}/user/verify/${user._id}`;
    const data = {
      email: user.email,
      subject: "Verify your account",
      link,
    };

    sendEmail(data);

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5h" },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({
          msg: "User created successfully",
          token,
          data: {
            user: {
              id: user._id,
              username: user.username,
              email: user.email,
              isAdmin: user.isAdmin,
              isVerified: user.isVerified,
            },
          },
        });
      }
    );
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.loginUser = async (req, res) => {
  const { name, password } = req.body;

  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

  let user;

  try {
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
        res.json({
          token,
          data: {
            user: {
              id: user._id,
              username: user.username,
              email: user.email,
              isAdmin: user.isAdmin,
              isVerified: user.isVerified,
            },
          },
        });
      }
    );
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

exports.getUser = async (req, res) => {
  res.json(req.user);
};

exports.verifyUser = async (req, res) => {
  const { id } = req.params;
  let user = await User.findById(id);
  if (!user) return res.status(404).json({ msg: "User not found" });

  if (user.isVerified)
    return res.status(400).json({ msg: "User Already verified" });

  user.isVerified = true;
  await user.save();
  res.status(200).json({ msg: "User verified" });
};

exports.status = async (req, res) => {
  const { id } = req.user;
  let user = await User.findById(id);
  if (!user) return res.status(404).json({ msg: "User not found" });

  res.status(200).json(user.isVerified);
};
