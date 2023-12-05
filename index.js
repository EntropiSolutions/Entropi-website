//requiring packages
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const path = require("path");
const app = express();

//preferences
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "Views"));
app.use(express.static("Public"));
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Schemas
const newSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: Number,
  company: String,
  website: String,
});

const Users = mongoose.model("Users", newSchema);

//Home page
app.get("/", function (req, res) {
  res.render("index");
});

//Post
app.post("/", async function (req, res) {
  try {
    const user = new Users({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      company: req.body.company,
      website: req.body.website,
    });
    await user.save();
    res.render("index");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

//Listen
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function () {
  console.log("The server is up and running on port:3000");
});
