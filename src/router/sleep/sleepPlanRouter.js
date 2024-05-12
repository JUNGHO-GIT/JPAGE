// router.js

import express from "express";
import * as service from "../../service/sleep/sleepPlanService.js";
import * as middleware from "../../middleware/sleep/sleepPlanMiddleware.js";
export const router = express.Router();

// 1-1. list -------------------------------------------------------------------------------------->
router.get("/list/plan", async (req, res) => {
  try {
    let result = await service.list (
      req.query.user_id,
      req.query.FILTER,
      req.query.PAGING,
      req.query.duration
    );
    if (result && result.result) {
      res.json({
        status: "success",
        msg: "조회 성공",
        totalCnt: result.totalCnt,
        result: result.result
      });
    }
    else {
      res.json({
        status: "fail",
        msg: "조회 실패",
        result: null
      });
    }
  }
  catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      error: err.toString()
    });
  }
});

// 2. detail -------------------------------------------------------------------------------------->
router.get("/detail/plan", async (req, res) => {
  try {
    let result = await service.detail (
      req.query.user_id,
      req.query._id,
      req.query.duration
    );
    if (result) {
      res.json({
        status: "success",
        msg: "조회 성공",
        sectionCnt: result.sectionCnt,
        result: result.result
      });
    }
    else {
      res.json({
        status: "fail",
        msg: "조회 실패",
        result: null
      });
    }
  }
  catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      error: err.toString()
    });
  }
});

// 3. save ---------------------------------------------------------------------------------------->
router.post("/save/plan", async (req, res) => {
  try {
    let result = await service.save(
      req.body.user_id,
      req.body.OBJECT,
      req.body.duration
    );
    if (result) {
      res.json({
        status: "success",
        msg: "저장 성공",
        result: result
      });
    }
    else {
      res.json({
        status: "fail",
        msg: "저장 실패",
        result: null
      });
    }
  }
  catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      error: err.toString()
    });
  }
});

// 4. deletes ------------------------------------------------------------------------------------->
router.delete("/delete/plan", async (req, res) => {
  try {
    let result = await service.deletes(
      req.query.user_id,
      req.query._id,
      req.query.duration
    );
    if (result) {
      res.json({
        status: "success",
        msg: "삭제 성공",
        result: result
      });
    }
    else {
      res.json({
        status: "fail",
        msg: "삭제 실패",
        result: null
      });
    }
  }
  catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      error: err.toString()
    });
  }
});