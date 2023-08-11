import * as path from "path";
import * as mongoose from "mongoose";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import secretKeysRouter from "./src/router/secretKeysRouter";
import userRouter from "./src/router/userRouter";
import adminRouter from "./src/router/adminRouter";
import boardRouter from "./src/router/boardRouter";
/* import foodRouter from "./src/router/foodRouter"; */
import nutritionRouter from "./src/router/nutritionRouter";

const app = express();

app.set("port", process.env.PORT || 4000);

app.use(cors(), (req, res, next) => {
  res.set("Content-Type", "application/json; charset=utf-8");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

/* mongoose.connect("mongodb://127.0.0.1:27017"); */
app.use(express.static(path.join(__dirname, "client/build")));

app.use("/secretKeys", secretKeysRouter);
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/board", boardRouter);
/* app.use("/food", foodRouter); */
app.use("/nutrition", nutritionRouter);

app.listen(app.get("port"), () => {
  console.log("App is running at http://127.0.0.1:%d in %s mode", app.get("port"), app.get("env"));
});
