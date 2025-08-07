const express = require("express");

const requestsRouter = express.Router();
const { userAuth } = require("../Middleware/Auth");
const ConnectionRequest = require("../models/ConnectionRequests");
const {connectionValidation,reviewValidation} = require("../utils/Validations")
requestsRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      await connectionValidation(req);
      const user = req.user;
      const fromUserId = user._id;
      const { status, toUserId } = req.params;
      const connectionUser = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionUser.save();
      res.status(201).json({message:`${status} connection made`,data})
    } catch (err) {
      res.status(400).send(err.message);
    }
  }
);


requestsRouter.post("/request/review/:status/:requestId",userAuth, async(req,res)=>{
  try{
    const connection = await reviewValidation(req);
    connection.status = req.params.status;
    const data = await connection.save();
    res.status(200).json({meaasge:"connection request "+req.params.status,data});
    
  }
  catch(err){
    res.status(400).send(err.message);
  }

})

module.exports = requestsRouter;
