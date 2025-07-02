const express = require("express");
const session = require("express-session");
const cors = require("cors");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(bodyParser.json());
app.use(session({ secret: "your_secret", resave: false, saveUninitialized: true }));

const users = [{ email: "user@example.com", password: "hashed_pw" }]; // Mock DB

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

// POST /api/forgot-password
app.post("/api/forgot-password", (req, res) => {
  const user = users.find(u => u.email === req.body.email);
  if (!user) return res.status(404).send("No user found.");

  const token = crypto.randomBytes(20).toString("hex");

  // Save in session
  req.session.resetToken = token;
  req.session.resetEmail = user.email;

  const resetLink = `http://localhost:5173/reset-password?token=${token}`;
  const mailOptions = {
    to: user.email,
    from: process.env.EMAIL_USER,
    subject: "Password Reset",
    text: `Click here to reset your password: ${resetLink}`
  };

  transporter.sendMail(mailOptions, err => {
    if (err) {
      console.error(err);
      return res.status(500).send("Failed to send email.");
    }
    res.send("Reset email sent.");
  });
});

// POST /api/reset-password
app.post("/api/reset-password", (req, res) => {
  const { token, password } = req.body;
  if (token !== req.session.resetToken) {
    return res.status(400).send("Invalid or expired token.");
  }

  const user = users.find(u => u.email === req.session.resetEmail);
  if (!user) return res.status(400).send("User not found.");

  user.password = password; // Hash in production

  req.session.resetToken = null;
  req.session.resetEmail = null;

  res.send("Password successfully reset.");
});

app.listen(3000, () => console.log("Server running on port 3000"));




//     --------------------------    //  

const nodemailer = require("nodemailer");
const JWT = require("jsonwebtoken");
const UserData = require("./models/User"); // adjust the path as needed

const forgetPasswordApi = async (request, response) => {
  try {
    const { email } = request.body;
    console.log("Email", email);

    const findEmail = await UserData.findOne({ email });
    if (!findEmail) {
      return response.status(400).send({ message: "Email not found!" });
    }

    const jwtForgetToken = JWT.sign(
      { email },
      process.env.FORGET_TOKEN_SECRET_KEY,
      { expiresIn: "10m" }
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_SECRET_KEY,
        pass: process.env.PASSWORD_SECRET_KEY,
      },
    });

    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${jwtForgetToken}`;

    const mailOptions = {
      from: process.env.GMAIL_SECRET_KEY,
      to: email,
      subject: "Password Reset Request",
      text: `You requested to reset your password. Click the link below to proceed:\n\n${resetLink}\n\nThis link will expire in 10 minutes.`,
    };

    transporter.sendMail(mailOptions)
      .then(() => {
        return response.status(200).send({ message: "Reset link sent to your email" });
      })
      .catch(err => {
        console.error("Email sending failed:", err);
        return response.status(500).send({ message: "Failed to send email" });
      });

  } catch (error) {
    console.error("Server error:", error);
    return response.status(500).send({ message: "Something went wrong!" });
  }
};




import React, { useState } from "react";
import axios from "axios";

const HeaderForm = () => {
  const [formData, setFormData] = useState({
    section: "",
    title: "",
    description: ""
  });

  const [headerTopBar, setHeaderTopBar] = useState([]); // Stores multiple sections

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSection = () => {
    setHeaderTopBar([...headerTopBar, { section: formData.section, item: [{ title: formData.title, description: formData.description }] }]);
    setFormData({ section: "", title: "", description: "" }); // Reset form
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { headerTopBar };

    try {
      const response = await axios.post("http://localhost:5000/add-header", payload, {
        headers: { "Content-Type": "application/json" }
      });

      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="section" placeholder="Section Name" value={formData.section} onChange={handleChange} required />
      <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
      <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />

      <button type="button" onClick={handleAddSection}>Add Section</button>
      <button type="submit">Submit Header</button>
    </form>
  );
};

export default HeaderForm;
