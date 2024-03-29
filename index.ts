// index.ts

import * as path from "path";
import * as mongoose from "mongoose";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import userRouter from "./src/router/userRouter";
import boardRouter from "./src/router/boardRouter";
import foodRouter from "./src/router/foodRouter";
import calendarRouter from "./src/router/calendarRouter";
import workRouter from "./src/router/workRouter";
import sleepRouter from "./src/router/sleepRouter";
import moneyRouter from "./src/router/moneyRouter";
import planRouter from "./src/router/planRouter";

mongoose.connect("mongodb://127.0.0.1:27017");
const app = express();
app.set("port", process.env.PORT || 4000);
app.use(cors(), (req, res, next) => {
  res.set("Content-Type", "application/json; charset=utf-8");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "client/build")));

app.use("/user", userRouter);
app.use("/board", boardRouter);
app.use("/food", foodRouter);
app.use("/calendar", calendarRouter);
app.use("/work", workRouter);
app.use("/sleep", sleepRouter);
app.use("/money", moneyRouter);
app.use("/plan", planRouter);

app.listen(app.get("port"), () => {
  console.log("App is running at http://127.0.0.1:%d in %s mode", app.get("port"), app.get("env"));
});
