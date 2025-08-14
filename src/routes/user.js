const express = require("express");

const userRouter = express.Router();
const { userAuth } = require("../Middleware/Auth");
const ConnectionRequest = require("../models/ConnectionRequests");
const { User } = require("../models/User");

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  
  try {
    const loggedInUser = req.user;
    const users = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "intrested",
    }).select("_id").populate("fromUserId");
    res.status(200).json({data:users});
  } catch (err) {
    res.status(400).send(err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const users = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("toUserId")
      .populate("fromUserId");
    const data = users.map((itm) => {
      if (itm.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return itm.toUserId;
      }
      return itm.fromUserId;
    });
    res.status(200).json({data});
  } catch (err) {
    res.status(400).send(err.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;  
    const page = parseInt(req.query.page) || 1;
    var limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    const ConnectionRequests =await ConnectionRequest.find({
      $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
    }).select("toUserId fromUserId");

    const notAllowedUsers = new Set();
    ConnectionRequests.forEach((itm) => {
      notAllowedUsers.add(itm.fromUserId);
      notAllowedUsers.add(itm.toUserId);
    });
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(notAllowedUsers) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .skip(skip)
      .limit(limit);
    res.send(users);
    
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = userRouter;
