const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const { connectDB } = require("./config/database.js");
const http = require("http");
require("./utils/Nodecron.js");
const intializeSocket = require("./utils/socket.js");

dotenv.config();




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

const server = http.createServer(app);

intializeSocket(server);
connectDB()
  .then(() => {
    console.log("database connetion established");
    server.listen(4000, () => {
      console.log("server isListening at 4000");
    });
  })
  .catch((err) => {
    console.log("database can't be connected");
  });
