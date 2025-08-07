const jwt = require("jsonwebtoken");
const { User } = require("../models/User");

const userAuth = async(req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("please login");
    }
    const decodeObj = jwt.verify(token, "VDTvFCIcuddv5tu4zyxB26jXj8PESGfg");
    const { _id } = decodeObj;
    const user = await User.findById({_id});
    if (!user) {
      throw new Error("User not found ");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(404).send(err.message);
  }
};

module.exports = { userAuth };
