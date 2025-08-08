const express = require("express");

const profileRouter = express.Router();

const { userAuth } = require("../Middleware/Auth");

const bcrypt = require("bcrypt");

const { signupValidation } = require("../utils/Validations");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).send(user);
  } catch (err) {
    res.status(404).send(err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const validproperties = [
      "firstName",
      "lastName",
      "age",
      "gender",
      "about",
      "phoneNo",
      "skills",
      "photoUrl"
    ];
    const isValid = Object.keys(req.body).every((key) =>
      validproperties.includes(key)
    );
    if (!isValid) {
      throw new Error("Cannot modify senstive data");
    }
    const loggedInuser = req.user;
    Object.keys(req.body).every((key) => (loggedInuser[key] = req.body[key]));
    await loggedInuser.save();
    res
      .status(200)
      .json({ message: "profile edited successfully", data: loggedInuser });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const loggedInuser = req.user;

    signupValidation(req);
    const hashpassword = await bcrypt.hash(req.body.password, 10);
    loggedInuser.password = hashpassword;
    await loggedInuser.save();
    res.status(200).send("password changed successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = profileRouter; 
