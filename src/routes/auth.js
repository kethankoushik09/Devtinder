const express = require("express");
const bcrypt = require("bcrypt");

const authRouter = express.Router();
const { User } = require("../models/User");
const { signupValidation } = require("../utils/Validations");

authRouter.post("/signup", async (req, res) => {
  try {
    signupValidation(req);
    const hashpassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      emailId: req.body.emailId,
      password: hashpassword,
      phoneNo: req.body.phoneNo,
      age: req.body.age,
      photoUrl: req.body.photoUrl,
    });

    const Saveduser = await user.save();
    const token = await Saveduser.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true on Vercel
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    res.json({ data: Saveduser });
  } catch (err) {
    res.status(400).send("Validation Error: " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await user.validatePasword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const token = await user.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      httpOnly: true,
    });

    res.status(200).send(user);
  } catch (err) {
    console.error(err);
    res.status(400).send({ message: err.message });
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("user logout");
});
module.exports = authRouter;
