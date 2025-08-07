const validator = require("validator");
const { User } = require("../models/User");

const ConnectionRequest = require("../models/ConnectionRequests");


const signupValidation = (req) => {
  const { password } = req.body;
  if (!validator.isStrongPassword(password)) {
    throw new Error("not valid password");
  }
};
const connectionValidation = async (req) => {
  const validStatus = ["intrested", "ignore"];
  const loogeduser = req.user;
  const fromUserId = loogeduser._id;
  const { status, toUserId } = req.params;
  if (!validStatus.includes(status)) {
    throw new Error("invalid status");
  }
  const user = await User.findOne({ _id: toUserId });
  if (!user) {
    throw new Error("invalid user");
  }
  const isValidconnection = await ConnectionRequest.findOne({
    $or: [
      { fromUserId, toUserId },
      { fromUserId: toUserId, toUserId: fromUserId },
    ],
  });
  if (isValidconnection) {
    throw new Error("this are already exsits");
  }
};

const reviewValidation = async (req) =>{
    const loggedInUser = req.user;
    const {status, requestId} = req.params;
    const allowedStatus = ["accepted","rejected"];
    const isStatusValid = allowedStatus.includes(status);
   
    if(!isStatusValid){
        throw new Error("invalid status");
    }
    const connectionValid = await  ConnectionRequest.findOne({
        _id:requestId,
        toUserId: loggedInUser._id,
        status:"intrested"
    });
    if(!connectionValid){
        throw new Error("connection invalid ");
    }
    return connectionValid;

}

module.exports = { signupValidation ,connectionValidation,reviewValidation};
