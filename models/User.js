const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    minlength: [5, "Username must be at least 6 characters"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  hashedPassword: {
    type: String,
    required: [true, "Password is required"],
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  blogPosts: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "BlogPost",
    default: [],
  },
  comments: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Comment",
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);
