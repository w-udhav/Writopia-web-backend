const BlogPost = require("../models/BlogPost");
const Comment = require("../models/Comment");
const { upload } = require("../server");

exports.getBlogs = async (req, res) => {
  try {
    const query = { isPublished: true };
    if (req.query.category) {
      query.category = req.query.category;
    }
    if (req.query.isPublished) {
      query.isPublished = req.query.isPublished;
    }
    const blogs = await BlogPost.find(query).populate(
      "author category comments"
    );
    blogs.forEach((blog) => {
      if (blog.imageUrl) {
        blog.imageUrl = `${process.env.SERVER_URL}/${blog.imageUrl}`;
      }
    });
    blogs.reverse();
    res.status(200).json({ blogs });
  } catch (error) {
    console.error("Error in getBlogs controller");
    res.status(500).send("Server error");
  }
};

exports.getThatBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await BlogPost.findById(id).populate(
      "author category comments"
    );
    res.status(200).json({ blog });
  } catch (error) {
    console.error("Error in getThatBlog controller");
    res.status(500).send("Server error");
  }
};

exports.addComment = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  try {
    const blog = await BlogPost.findById(id);
    if (!blog) return res.status(404).json({ msg: "Blog not found" });
    const newComment = new Comment({
      content,
      user: req.user.id,
      post: id,
    });
    await newComment.save();
    blog.comments.push(newComment.id);
    await blog.save();
    res.status(201).json({ newComment });
  } catch (error) {
    console.error("Error in addComment controller");
    res.status(500).send("Server error");
  }
};

exports.deleteComment = async (req, res) => {
  const { id, commentId } = req.params;
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ msg: "Comment not found" });
    if (comment.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "Unauthorized" });
    await comment.remove();
    const blog = await BlogPost.findById(id);
    blog.comments = blog.comments.filter(
      (comment) => comment.toString() !== commentId
    );
    await blog.save();
    res.status(200).json({ msg: "Comment deleted" });
  } catch (error) {
    console.error("Error in deleteComment controller");
    res.status(500).send("Server error");
  }
};

//! Admin only
exports.createBlog = async (req, res) => {
  const { title, content, category } = req.body;
  try {
    let isPublished = req.user.role === "admin" ? true : false;
    const newBlog = new BlogPost({
      title,
      content,
      category,
      author: req.user.id,
      isPublished,
      imageUrl: req.file.path,
    });
    await newBlog.save();
    res.status(201).json({ newBlog });
  } catch (error) {
    console.error("Error in createBlog controller");
    res.status(500).send("Server error");
  }
};

exports.updateBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await BlogPost.findById(id);
    if (!blog) return res.status(404).json({ msg: "Blog not found" });
    if (blog.author.toString() !== req.user.id && req.user.role !== "admin")
      return res.status(401).json({ msg: "Unauthorized" });

    const { isPublished } = req.body;
    blog.isPublished = isPublished;

    await blog.save();
    res.status(200).json({ blog });
  } catch (error) {
    res.status(500).send("Server error");
  }
};

exports.deleteBlog = async (req, res) => {
  const { id } = req.params;
  const blog = await BlogPost.findById(id);
  if (!blog) return res.status(404).json({ msg: "Blog not found" });
  try {
    if (
      blog.author.toString() !== req.user.id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({ msg: "Unauthorized" });
    }
    await blog.deleteOne();
    res.status(200).json({ msg: "Blog deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};
