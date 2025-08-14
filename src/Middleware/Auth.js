const jwt = require("jsonwebtoken");
const { User } = require("../models/User");

const userAuth = async (req, res, next) => {
  console.log("userAuth");
  

  try {
    console.log(req.cookies);
    
    const { token } = req.cookies;
    console.log(token);
    
    if (!token) {
      return res.status(401).send("please login");
    }
    console.log(typeof(process.env.JWT_SECRET));
    
    const decodeObj = jwt.verify(token, process.env.JWT_SECRET);
    

    const _id = decodeObj._id; // adjust if your payload key is different
    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(404).send(err.message);
  }
};

module.exports = { userAuth };
