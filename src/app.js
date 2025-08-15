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

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://dev-tinder-web-kk.vercel.app"
        : "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

const userRouter = require("./routes/user.js");
const authRouter = require("./routes/auth.js");
const profileRouter = require("./routes/profile.js");
const requestsRouter = require("./routes/requests.js");
const chatRouter = require("./routes/chat.js");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestsRouter);
app.use("/", userRouter);
app.use("/", chatRouter);

app.get("/", (req, res) => {
  res.send("kethan Gaikwad");
});

const server = http.createServer(app);

intializeSocket(server);
connectDB()
  .then(() => {
    console.log("database connetion established");
    server.listen(process.env.PORT || 3000, () => {
      console.log("server is Listening");
    });
  })
  .catch((err) => {
    console.log("database can't be connected");
  });
