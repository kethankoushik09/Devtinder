const mongoose = require("mongoose");

const connectionrequestSchema = mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref :"User",
      required : true
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"User",
      required : true
    },
    status: {
      type: String,
      required : true,
      enum: ["accepted", "rejected","intrested","ignore"],
    },
  },
  {
    timestamps: true,
  }
);
connectionrequestSchema.pre("save",function(next){
    const request = this;
    if(request.fromUserId.equals(request.toUserId)){
        throw new Error("cannot send request by your self")
    }
    next();
})

const ConnectionRequest = mongoose.model("ConnectionRequest",connectionrequestSchema);

module.exports = ConnectionRequest;