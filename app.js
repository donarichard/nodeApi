const express = require("express");

const app = express();

const mongoose = require("mongoose");

const dotenv = require("dotenv");

const authRoute = require("./routes/auth");

const useraccount = require("./routes/useraccount");

const question = require("./routes/question");

const group = require("./routes/group");

const reportRouter = require("./routes/report");

const cors = require("cors");

const morgan = require("morgan");

dotenv.config();

// mongoose.connect(process.env.DB_CONNECT,

//     {useUnifiedTopology: true,
//         useNewUrlParser: true
//        })
mongoose.connect(
  process.env.DB_CONNECT,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true
  },
  error => {
    if (error) {
      console.error(
        "Please make sure your MongoDB configuration is correct and that service is running"
      );
      throw error;
    }
  }
);

var corsMiddleware = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "192.168.0.146"); //replace localhost with actual host
  res.header(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, PUT, PATCH, POST, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, X-Requested-With, Authorization"
  );
  next();
};
const publicVapidKey =
  "BCK92jXOIOeXZY8EvOwoo1GLES4lVlpqwVcz5dfDllijON-4vte3-CSD-8bUXAQRqVMN9lVqk_Eul8OujsBxq04";
const privateVapidKey = "o2Xf5DdVWsTjTJTkUVcvb4ez0D2fYVS70ZF0ynHK0TE";

app.use(corsMiddleware);
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use("/api/user", authRoute);
app.use("/api/useraccount", useraccount);
app.use("/api/question", question);
app.use("/api/user/group", group);

app.use("/api/user/report", reportRouter);

app.listen(8000);
