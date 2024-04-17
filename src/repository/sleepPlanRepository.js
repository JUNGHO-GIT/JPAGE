// sleepPlanRepository.js

import mongoose from "mongoose";
import {Sleep} from "../schema/Sleep.js";
import {SleepPlan} from "../schema/SleepPlan.js";
import {fmtDate} from "../assets/common/Common.js";

// 0-1. totalCnt ---------------------------------------------------------------------------------->
export const totalCnt = async (
  user_id_param,
  startDt_param,
  endDt_param
) => {

  const finalResult = await SleepPlan.countDocuments({
    user_id: user_id_param,
    sleep_plan_startDt: {
      $lte: endDt_param,
    },
    sleep_plan_endDt: {
      $gte: startDt_param,
    },
  });

  return finalResult;
};

// 1. list ---------------------------------------------------------------------------------------->
export const list = {
  findPlan: async (
    user_id_param,
    sort_param,
    limit_param,
    page_param,
    startDt_param,
    endDt_param,
  ) => {
    const finalResult = await SleepPlan.aggregate([
      {$match: {
        user_id: user_id_param,
        sleep_plan_startDt: {
          $lte: endDt_param,
        },
        sleep_plan_endDt: {
          $gte: startDt_param,
        }
      }},
      {$sort: {
        sleep_plan_startDt: sort_param,
        sleep_plan_endDt: sort_param
      }},
      {$skip: Number(page_param - 1) * Number(limit_param)},
      {$limit: Number(limit_param)},
    ]);
    return finalResult;
  },
  findReal: async (
    user_id_param,
    startDt_param,
    endDt_param,
  ) => {
    const finalResult = await Sleep.aggregate([
      {$match: {
        user_id: user_id_param,
        sleep_startDt: {
          $lte: endDt_param,
        },
        sleep_endDt: {
          $gte: startDt_param,
        },
      }},
      {$unwind: "$sleep_section"
      },
      {$project: {
        _id: 1,
        sleep_startDt: 1,
        sleep_endDt: 1,
        sleep_night: "$sleep_section.sleep_night",
        sleep_morning: "$sleep_section.sleep_morning",
        sleep_time: "$sleep_section.sleep_time",
      }}
    ]);

    return finalResult;
  },
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = {
  detail: async (
    _id_param,
    user_id_param,
    startDt_param,
    endDt_param
  ) => {
    const finalResult = await SleepPlan.findOne({
      _id: _id_param === "" ? {$exists:true} : _id_param,
      user_id: user_id_param,
      sleep_plan_startDt: startDt_param,
      sleep_plan_endDt: endDt_param,
    })
    .lean();

    return finalResult;
  }
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = {
  detail: async (
    _id_param,
    user_id_param,
    startDt_param,
    endDt_param
  ) => {
    const finalResult = await SleepPlan.findOne({
      _id: _id_param === "" ? {$exists:true} : _id_param,
      user_id: user_id_param,
      sleep_plan_startDt: startDt_param,
      sleep_plan_endDt: endDt_param,
    })
    .lean();

    return finalResult;
  },
  create: async (
    user_id_param,
    SLEEP_PLAN_param,
    startDt_param,
    endDt_param
  ) => {
    const finalResult = await SleepPlan.create({
      _id: new mongoose.Types.ObjectId(),
      user_id: user_id_param,
      sleep_plan_startDt: startDt_param,
      sleep_plan_endDt: endDt_param,
      sleep_plan_night: SLEEP_PLAN_param.sleep_plan_night,
      sleep_plan_morning: SLEEP_PLAN_param.sleep_plan_morning,
      sleep_plan_time: SLEEP_PLAN_param.sleep_plan_time,
      sleep_plan_regDt: fmtDate,
      sleep_plan_upDt: "",
    });

    return finalResult;
  },
  update: async (
    _id_param,
    SLEEP_PLAN_param
  ) => {
    const finalResult = await SleepPlan.findOneAndUpdate(
      {_id: _id_param
      },
      {$set: {
        ...SLEEP_PLAN_param,
        sleep_plan_upDt: fmtDate,
      }},
      {upsert: true,
        new: true
      }
    )
    .lean();

    return finalResult;
  }
};

// 4. delete -------------------------------------------------------------------------------------->
export const deletes = {
  deletes: async (
    _id_param,
    user_id_param,
    startDt_param,
    endDt_param
  ) => {
    const updateResult = await SleepPlan.updateOne(
      {_id: _id_param,
        user_id: user_id_param,
        sleep_plan_startDt: startDt_param,
        sleep_plan_endDt: endDt_param,
      },
      {$set: {
        sleep_plan_upDt: fmtDate,
      }},
      {arrayFilters: [{
        "elem._id": _id_param
      }]}
    )
    .lean();

    let finalResult;

    if (updateResult.modifiedCount > 0) {
      const doc = await SleepPlan.findOne({
        user_id: user_id_param,
        sleep_plan_startDt: startDt_param,
        sleep_plan_endDt: endDt_param,
      })
      .lean();

      if (doc) {
        finalResult = await SleepPlan.deleteOne({
          _id: doc._id
        })
        .lean();
      }
    }
    return finalResult;
  }
};