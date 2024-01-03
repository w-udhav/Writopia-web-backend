const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const app = express();

app
  .use(cors())
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use("/user", require("./routes/userRoutes"))
  .use("/blog", require("./routes/blogRoutes"))
  .use("/category", require("./routes/categoryRoutes"));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log(err));
