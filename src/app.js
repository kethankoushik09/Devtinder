const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const { connectDB } = require("./config/database.js");

require("dotenv").config();


app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
  
}));
app.use(express.json());
app.use(cookieParser());


const userRouter = require("./routes/user.js");
const authRouter = require("./routes/auth.js");
const profileRouter = require("./routes/profile.js");
const requestsRouter = require("./routes/requests.js");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestsRouter);
app.use("/", userRouter);

app.get("/",(req,res)=>{
  res.send("hello world");
})
// app.get("/user", async (req, res) => {
//   try {
//     const user = await User.find();
//     if (user) {
//       res.send(user);
//     } else {
//       res.status(404).send("not found user");
//     }
//   } catch (err) {
//     console.log("Error:" + err.message);
//     res.status(404).send("not found user");
//   }
// });

// app.delete("/user", async (req, res) => {
//   try {
//     await User.findByIdAndDelete(req.body.userId);
//     res.status(200).send("User deleted");
//   } catch (err) {
//     console.log("Error: " + err.message);
//   }
// });

// app.patch("/user/:id", async (req, res) => {
//   try {
//     const apllicable = [
//       "firstName",
//       "lastname",
//       "age",
//       "gender",
//       "about",
//       "image",
//     ];
//     const mofi = Object.keys(req.body).every((item) =>
//       apllicable.includes(item)
//     );
//     console.log(mofi);

//     if (!mofi) {
//       throw new Error("can't modify senstive data");
//     }

//     const user = await User.findByIdAndUpdate(req.params.id, req.body, {
//       new: false,
//     });
//     console.log(user);
//     res.status(200).send("updated succesfully!");
//   } catch (err) {
//     console.log("Error: " + err.message);
//     res.status(400).send(err.message);
//   }
// });
// app.get("/feed", async (req, res) => {
//   try {
//     const users = await User.find();
//     console.log(users);
//     res.status(200).send(users);
//   } catch (err) {
//     console.log("Error: " + err.message);
//   }
// });
connectDB()
  .then(() => {
    console.log("database connetion established");
    app.listen(4000, () => {
      console.log("server isListening at 4000");
    });
  })
  .catch((err) => {
    console.log("database can't be connected");
  });
