// userPlanService.js

import mongoose from "mongoose";
import moment from "moment";
import {UserPlan} from "../schema/UserPlan.js";

// 1. list ---------------------------------------------------------------------------------------->
export const list = async (
  user_id_param,
  user_plan_dur_param,
  FILTER_param,
  PAGING_param
) => {

  const [startDay, endDay] = user_plan_dur_param.split(` ~ `);

  const sort = FILTER_param.order === "asc" ? 1 : -1;
  const limit = FILTER_param.limit === 0 ? 5 : FILTER_param.limit;
  const page = PAGING_param.page === 0 ? 1 : PAGING_param.page;

  const totalCnt = await UserPlan.countDocuments({
    user_id: user_id_param,
    user_plan_start: {
      $lte: endDay,
    },
    user_plan_end: {
      $gte: startDay,
    },
  });

  const findResult = await UserPlan.find({
    user_id: user_id_param,
    user_plan_start: {
      $lte: endDay,
    },
    user_plan_end: {
      $gte: startDay,
    },
  })
  .sort({user_plan_start: sort})
  .skip((page - 1) * limit)
  .limit(limit)
  .lean();

  return {
    totalCnt: totalCnt,
    result: findResult,
  };
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = async (
  _id_param,
  user_id_param,
  user_plan_dur_param,
  FILTER_param,
) => {

  const [startDay, endDay] = user_plan_dur_param.split(` ~ `);

  const finalResult = await UserPlan.findOne({
    _id: _id_param === "" ? {$exists:true} : _id_param,
    user_id: user_id_param,
    user_plan_start: {
      $lte: endDay,
    },
    user_plan_end: {
      $gte: startDay,
    }
  })
  .lean();

  return {
    result: finalResult,
  };
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (
  user_id_param,
  USER_PLAN_param,
  user_plan_dur_param,
  FILTER_param,
) => {

  const [startDay, endDay] = user_plan_dur_param.split(` ~ `);

  let finalResult;
  let schema;

  if (FILTER_param.schema === "food") {
    schema = {
      plan_food: {
        plan_kcal: USER_PLAN_param.plan_food.plan_kcal
      },
    };
  }

  if (FILTER_param.schema === "money") {
    schema = {
      plan_money: {
        plan_in: USER_PLAN_param.plan_money.plan_in,
        plan_out: USER_PLAN_param.plan_money.plan_out,
      },
    };
  }

  if (FILTER_param.schema === "sleep") {
    schema = {
      plan_sleep: {
        plan_night: USER_PLAN_param.plan_sleep.plan_night,
        plan_morning: USER_PLAN_param.plan_sleep.plan_morning,
        plan_time: USER_PLAN_param.plan_sleep.plan_time,
      },
    };
  }

  if (FILTER_param.schema === "work") {
    schema = {
      plan_work: {
        plan_count_total: USER_PLAN_param.plan_work.plan_count_total,
        plan_cardio_time: USER_PLAN_param.plan_work.plan_cardio_time,
        plan_score_name: USER_PLAN_param.plan_work.plan_score_name,
        plan_score_kg: USER_PLAN_param.plan_work.plan_score_kg,
        plan_score_rep: USER_PLAN_param.plan_work.plan_score_rep,
      },
    };
  }

  const findResult = await UserPlan.findOne({
    user_id: user_id_param,
    user_plan_start: {
      $lte: endDay,
    },
    user_plan_end: {
      $gte: startDay,
    }
  })
  .lean();

  if (!findResult) {
    const createQuery = {
      _id: new mongoose.Types.ObjectId(),
      user_id: user_id_param,
      user_plan_start: startDay,
      user_plan_end: endDay,
      ...schema,
      plan_regdate: moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss"),
      plan_update: ""
    };
    finalResult = await UserPlan.create(createQuery);
  }
  else {
    const updateQuery = {
      _id: findResult._id
    };
    const updateAction = {
      $set: {
        ...schema,
        plan_update: moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss"),
      },
    };
    finalResult = await UserPlan.updateOne(updateQuery, updateAction).lean();
  }

  return {
    result: finalResult,
  };
};

// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = async (
  _id_param,
  user_id_param,
  user_plan_dur_param,
  FILTER_param,
) => {

  const [startDay, endDay] = user_plan_dur_param.split(` ~ `);

  const updateResult = await UserPlan.updateOne(
    {
      _id: _id_param,
      user_id: user_id_param,
      user_plan_start: {
        $lte: endDay,
      },
      user_plan_end: {
        $gte: startDay,
      },
    },
    {
      $set: {
        plan_update: moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss"),
      },
    },
    {
      arrayFilters: [{
        "elem._id": _id_param
      }],
    }
  )
  .lean();

  let finalResult;
  if (updateResult.modifiedCount > 0) {
    const doc = await UserPlan.findOne({
      _id: _id_param,
      user_id: user_id_param
    })
    .lean();

    if (doc) {
      finalResult = await UserPlan.deleteOne({
        _id: doc._id
      })
      .lean();
    }
  }

  return {
    result: finalResult
  };
};