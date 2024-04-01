// sleepService.js

import mongoose from "mongoose";
import moment from "moment";
import {Sleep} from "../schema/Sleep.js";

// 1. dash ---------------------------------------------------------------------------------------->
export const dash = async (
  user_id_param,
  sleep_dur_param
) => {

  const startDay = sleep_dur_param.split(` ~ `)[0];
  const endDay = sleep_dur_param.split(` ~ `)[1];

  const findQuery = {
    user_id: user_id_param,
    sleep_day: startDay,
  };

  const findResult = await Sleep.find(findQuery);

  return {
    result: findResult,
  };
};

// 1. list ---------------------------------------------------------------------------------------->
export const list = async (
  user_id_param,
  sleep_dur_param,
  filter_param
) => {

  const startDay = sleep_dur_param.split(` ~ `)[0];
  const endDay = sleep_dur_param.split(` ~ `)[1];

  const filterOrder = filter_param.order;
  const page = filter_param.page === 0 ? 1 : filter_param.page;
  const limit = filter_param.limit === 0 ? 5 : filter_param.limit;

  const findQuery = {
    user_id: user_id_param,
    sleep_day: {
      $gte: startDay,
      $lte: endDay,
    }
  };

  const sortOrder = filterOrder === "asc" ? 1 : -1;

  const totalCount = await Sleep.countDocuments(findQuery);
  const findResult = await Sleep.find(findQuery).sort({sleep_day: sortOrder}).skip((page - 1) * limit).limit(limit);

  return {
    totalCount: totalCount,
    result: findResult,
  };
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = async (
  user_id_param,
  sleep_dur_param
) => {

  const startDay = sleep_dur_param.split(` ~ `)[0];
  const endDay = sleep_dur_param.split(` ~ `)[1];

  const findQuery = {
    user_id: user_id_param,
    sleep_day: {
      $gte: startDay,
      $lte: endDay,
    }
  };

  const findResult = await Sleep.findOne(findQuery);

  return {
    result: findResult,
  };
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (
  user_id_param,
  SLEEP_param,
  sleep_dur_param,
  planYn_param
) => {

  const startDay = sleep_dur_param.split(` ~ `)[0];
  const endDay = sleep_dur_param.split(` ~ `)[1];

  let finalResult;

  const findQuery = {
    user_id: user_id_param,
    sleep_day: {
      $gte: startDay,
      $lte: endDay,
    },
  };
  const findResult = await Sleep.findOne(findQuery);

  if (!findResult) {
    const createQuery = {
      _id: new mongoose.Types.ObjectId(),
      user_id: SLEEP_param.user_id,
      sleep_day: startDay,
      sleep_real: SLEEP_param.sleep_real,
      sleep_plan: SLEEP_param.sleep_plan
    };
    const createResult = await Sleep.create(createQuery);
    finalResult = createResult;
  }
  else {
    const updateQuery = {_id: findResult._id};
    const updateAction = planYn_param === "N"
    ? {$set: {sleep_real: SLEEP_param.sleep_real}}
    : {$set: {sleep_plan: SLEEP_param.sleep_plan}}

    const updateResult = await Sleep.updateOne(updateQuery, updateAction);
    finalResult = updateResult;
  }

  return {
    result: finalResult,
  };
};

// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = async (
  user_id_param,
  sleep_dur_param
) => {

  const startDay = sleep_dur_param.split(` ~ `)[0];
  const endDay = sleep_dur_param.split(` ~ `)[1];

  const deleteQuery = {
    user_id: user_id_param,
    sleep_day: {
      $gte: startDay,
      $lte: endDay,
    },
  };

  const deleteResult = await Sleep.deleteMany(deleteQuery);

  return {
    result: deleteResult,
  };
};