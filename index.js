//requiring packages
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const _ = require("lodash");
const path = require("path");
const app = express();

//preferences
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "Views"));
app.use(express.static("Public"));
mongoose.set("strictQuery", false);
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "osnishant2210@gmail.com",
    pass: process.env.MAIL_PASS,
  },
});
//Schemas
const newSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: Number,
  company: String,
  website: String,
  timestamp: { type: Date, default: Date.now },
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

    // Send email notification to the owner
    const mailOptions = {
      from: "nishantmailer7@gmail.com", // replace with your email
      to: "info@entropisolutions.io", // replace with owner's email
      subject: "New User Entry",
      text: `A new user wants to reach out to you:\n\nName: ${req.body.name}\nEmail: ${req.body.email}\nPhone Number: ${req.body.phone}\nCompany Name: ${req.body.company}\nCompany Website: ${req.body.website}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email notification:", error);
      } else {
        console.log("Email notification sent:", info.response);
      }
    });

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
  console.log("The server is up and running");
});
