const mongoose = require("mongoose");
const { Schema } = mongoose;
const jwt = require("jsonwebtoken");


const bcrypt = require("bcrypt");


const validator = require("validator");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return validator.isEmail(v);
        },
        message: "emaild is not valid",
      },
      trim: true,
      unique: true,
    },
    photoUrl:{
      type:String,
      validate:{
        validator:function(val){
          return validator.isURL(val);
        },
        message:"url is not valid"

      }

    },
    password: {
      type: String,
      required: true,
      // select: false,
      validate: {
        validator: function (val) {
          return validator.isStrongPassword(val, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minSymbols: 1,
          });
        },
        message: "its not a valid password",
      },
    },
    age: {
      type: Number,
      min: 18,
      max: 65,
    },
    gender: {
      type: String,
      enum: ["male", "female", "others"],
    },
    about: {
      type: String,
      default: "default abou the user",
    },
    image: {
      type: String,
      validate: {
        validator: function (val) {
          return validator.isURL(val);
        },
        message: "its not a valid image",
      },
    },
    phoneNo: {
      type: String,
      validate: {
        validator: function (val) {
          return validator.isMobilePhone(val, "en-IN");
        },
        message: "its not a valid mobile number",
      },
    },
    skills: {
      type: [String],
    },
    createdAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);
userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign(
    { _id: user._id },
    "VDTvFCIcuddv5tu4zyxB26jXj8PESGfg",
    { expiresIn: "7d" }
  );
  return token;
};

userSchema.methods.validatePasword = async function(userInputPassword) {
  const user = this;
    const isPasswordValid = await bcrypt.compare(
      userInputPassword,
      user.password
    );
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }
    return isPasswordValid;
};

const User = mongoose.model("User", userSchema);
module.exports = { User };
