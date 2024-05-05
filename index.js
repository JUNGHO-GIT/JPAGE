// index.js

import path from "path";
import cors from "cors";
import util from "util";
import mongoose from "mongoose";
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import {fileURLToPath} from "url";

import {router as exerciseDashRouter} from "./src/router/exerciseDashRouter.js";
import {router as foodDashRouter} from "./src/router/foodDashRouter.js";
import {router as moneyDashRouter} from "./src/router/moneyDashRouter.js";
import {router as sleepDashRouter} from "./src/router/sleepDashRouter.js";

import {router as userPlanRouter} from "./src/router/userPlanRouter.js";
import {router as exercisePlanRouter} from "./src/router/exercisePlanRouter.js";
import {router as foodPlanRouter} from "./src/router/foodPlanRouter.js";
import {router as moneyPlanRouter} from "./src/router/moneyPlanRouter.js";
import {router as sleepPlanRouter} from "./src/router/sleepPlanRouter.js";

import {router as userRouter} from "./src/router/userRouter.js";
import {router as calendarRouter} from "./src/router/calendarRouter.js";
import {router as exerciseRouter} from "./src/router/exerciseRouter.js";
import {router as foodRouter} from "./src/router/foodRouter.js";
import {router as moneyRouter} from "./src/router/moneyRouter.js";
import {router as sleepRouter} from "./src/router/sleepRouter.js";

import {router as tweakRouter} from "./src/router/tweakRouter.js";

// ------------------------------------------------------------------------------------------------>
dotenv.config();
const id = "eric4757";
const pw = "M7m7m7m7m7!";
const host = "34.75.165.209";
const port = "27017";
const db = "LIFECHANGE";
/* mongoose.connect("mongodb://eric4757:M7m7m7m7m7!@34.75.165.209:27017/LIFECHANGE"); */

// ------------------------------------------------------------------------------------------------>
const customLogger = (collectionName, method, query, doc) => {
  const message = util.format(
    "\n======================= \n-schema: \"%s\" \n-method: \"%s\" \n-query: %s \n-doc: %s",
    collectionName,
    method,
    JSON.stringify(query, null, 3),
    JSON.stringify(doc, null, 3)
  );
  console.log(message);
};

// ------------------------------------------------------------------------------------------------>
mongoose.connect(`mongodb://${id}:${pw}@${host}:${port}/${db}`);
// mongoose.set("debug", customLogger);
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ------------------------------------------------------------------------------------------------>
const appPort = Number(process.env.PORT);
try {
  app.set("port", appPort);
  console.log(`서버가 포트 ${appPort}에서 실행 중입니다.`);
}
catch (error) {
  if (error.code === "EADDRINUSE") {
    console.log(`${appPort} 포트가 이미 사용 중입니다. 다른 포트로 변경합니다.`);
    app.set("port", appPort + 1);
  } else {
    console.error(`서버 실행 중 오류 발생: ${error}`);
  }
}

// ------------------------------------------------------------------------------------------------>
app.use(cors(), (req, res, next) => {
  res.set("Content-Type", "application/json; charset=utf-8");
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(path.join(__dirname, "client/build")));

app.use("/exercise/dash", exerciseDashRouter);
app.use("/food/dash", foodDashRouter);
app.use("/money/dash", moneyDashRouter);
app.use("/sleep/dash", sleepDashRouter);

app.use("/user/plan", userPlanRouter);
app.use("/exercise/plan", exercisePlanRouter);
app.use("/food/plan", foodPlanRouter);
app.use("/money/plan", moneyPlanRouter);
app.use("/sleep/plan", sleepPlanRouter);

app.use("/user", userRouter);
app.use("/calendar", calendarRouter);
app.use("/exercise", exerciseRouter);
app.use("/food", foodRouter);
app.use("/money", moneyRouter);
app.use("/sleep", sleepRouter);

app.use("/tweak", tweakRouter);

// ------------------------------------------------------------------------------------------------>
app.listen(app.get("port"), () => {
  console.log(`App is running at http://localhost:${app.get("port")} in ${app.get("env")} mode`);
});