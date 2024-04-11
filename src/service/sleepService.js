// sleepService.js

import mongoose from "mongoose";
import moment from "moment";
import {Sleep} from "../schema/Sleep.js";
import {Plan} from "../schema/Plan.js"

// 0-1. dash (bar) -------------------------------------------------------------------------------->
export const dashBar = async (
  user_id_param
) => {

  const koreanDate = moment().tz("Asia/Seoul").format("YYYY-MM-DD");

  const dataFields = {
    "취침": { plan: "plan_night", real: "sleep_night" },
    "기상": { plan: "plan_morning", real: "sleep_morning" },
    "수면": { plan: "plan_time", real: "sleep_time" }
  };

  const fmtData = (data) => {
    if (!data) {
      return 0;
    }
    else {
      const time = data.split(":");
      return parseFloat((parseInt(time[0], 10) + parseInt(time[1], 10) / 60).toFixed(1));
    }
  };

  let finalResult = [];
  for (let key in dataFields) {
    const findResultPlan = await Plan.findOne({
      user_id: user_id_param,
      plan_schema: "sleep",
      plan_start: { $lte: koreanDate },
      plan_end: { $gte: koreanDate }
    })
    .lean();
    const findResultReal = await Sleep.findOne({
      user_id: user_id_param,
      sleep_date: koreanDate
    })
    .lean();

    finalResult.push({
      name: key,
      목표: fmtData(
        findResultPlan?.plan_sleep?.[dataFields[key].plan]
      ),
      실제: fmtData(
        findResultReal?.sleep_section?.map((item) => (
          item[dataFields[key].real]
        ))
        .join(":")
      ),
    });
  };

  return {
    result: finalResult,
  };
};

// 0-2. dash (line) ------------------------------------------------------------------------------->
export const dashLine = async (
  user_id_param
) => {

  const names = [
    "월", "화", "수", "목", "금", "토", "일"
  ];

  const fmtData = (data) => {
    if (!data) {
      return 0;
    }
    else {
      const time = data.split(":");
      return parseFloat((parseInt(time[0], 10) + parseInt(time[1], 10) / 60).toFixed(1));
    }
  };

  let finalResult = [];
  for (let i in names) {
    const date = moment().tz("Asia/Seoul").startOf("isoWeek").add(i, "days");
    const findResult = await Sleep.findOne({
      user_id: user_id_param,
      sleep_date: date.format("YYYY-MM-DD"),
    })
    .lean();

    finalResult.push({
      name: `${names[i]} ${date.format("MM/DD")}`,
      취침: fmtData(
        findResult?.sleep_section?.map((item) => (item.sleep_night)).join(":")
      ),
      기상: fmtData(
        findResult?.sleep_section?.map((item) => (item.sleep_morning)).join(":")
      ),
      수면: fmtData(
        findResult?.sleep_section?.map((item) => (item.sleep_time)).join(":")
      ),
    });
  };

  return {
    result: finalResult,
  };
};

// 0-3. dash (avg-week) --------------------------------------------------------------------------->
export const dashAvgWeek = async (
  user_id_param
) => {

  let sumSleepStart = Array(5).fill(0);
  let sumSleepEnd = Array(5).fill(0);
  let sumSleepTime = Array(5).fill(0);
  let countRecords = Array(5).fill(0);

  const names = [
    "1주차", "2주차", "3주차", "4주차", "5주차"
  ];

  const fmtData = (data) => {
    if (!data) {
      return 0;
    }
    else {
      const time = data.split(":");
      return parseFloat((parseInt(time[0], 10) + parseInt(time[1], 10) / 60).toFixed(1));
    }
  };

  for (let i in names) {
    const findResult = await Sleep.findOne({
      user_id: user_id_param,
      sleep_date: moment().tz("Asia/Seoul").startOf("isoWeek").add(i, "days").format("YYYY-MM-DD"),
    })
    .lean();

    if (findResult) {
      const weekNum = Math.max(moment(findResult.sleep_date).week() - moment(findResult.sleep_date).startOf("month").week() + 1);
      sumSleepStart[weekNum - 1] += fmtData(
        findResult?.sleep_section?.map((item) => (item.sleep_night)).join(":")
      );
      sumSleepEnd[weekNum - 1] += fmtData(
        findResult?.sleep_section?.map((item) => (item.sleep_morning)).join(":")
      );
      sumSleepTime[weekNum - 1] += fmtData(
        findResult?.sleep_section?.map((item) => (item.sleep_time)).join(":")
      );
      countRecords[weekNum - 1]++;
    }
  };

  let finalResult = [];
  for (let i = 0; i < 5; i++) {
    finalResult.push({
      name: names[i],
      취침: countRecords[i] > 0 ? (sumSleepStart[i] / countRecords[i]).toFixed(1) : "0",
      기상: countRecords[i] > 0 ? (sumSleepEnd[i] / countRecords[i]).toFixed(1) : "0",
      수면: countRecords[i] > 0 ? (sumSleepTime[i] / countRecords[i]).toFixed(1) : "0",
    });
  };

  return {
    result: finalResult,
  };
};

// 0-4. dash (avg-month) -------------------------------------------------------------------------->
export const dashAvgMonth = async (
  user_id_param
) => {

  let sumSleepStart = Array(12).fill(0);
  let sumSleepEnd = Array(12).fill(0);
  let sumSleepTime = Array(12).fill(0);
  let countRecords = Array(12).fill(0);

  const names = [
    "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"
  ];

  const fmtData = (data) => {
    if (!data) {
      return 0;
    }
    else {
      const time = data.split(":");
      return parseFloat((parseInt(time[0], 10) + parseInt(time[1], 10) / 60).toFixed(1));
    }
  };

  for (
    let m = moment(moment().tz("Asia/Seoul").startOf("year"));
    m.isBefore(moment().tz("Asia/Seoul").endOf("year"));
    m.add(1, "days")
  ) {
    const findResult = await Sleep.findOne({
      user_id: user_id_param,
      sleep_date: m.format("YYYY-MM-DD"),
    })
    .lean();

    if (findResult) {
      const monthNum = m.month();
      sumSleepStart[monthNum] += fmtData(
        findResult?.sleep_section?.map((item) => (item.sleep_night)).join(":")
      );
      sumSleepEnd[monthNum] += fmtData(
        findResult?.sleep_section?.map((item) => (item.sleep_morning)).join(":")
      );
      sumSleepTime[monthNum] += fmtData(
        findResult?.sleep_section?.map((item) => (item.sleep_time)).join(":")
      );
      countRecords[monthNum]++;
    }
  };

  let finalResult = [];
  for (let i = 0; i < 12; i++) {
    finalResult.push({
      name: names[i],
      취침: countRecords[i] > 0 ? (sumSleepStart[i] / countRecords[i]).toFixed(1) : "0",
      기상: countRecords[i] > 0 ? (sumSleepEnd[i] / countRecords[i]).toFixed(1) : "0",
      수면: countRecords[i] > 0 ? (sumSleepTime[i] / countRecords[i]).toFixed(1) : "0",
    });
  };

  return {
    result: finalResult,
  };
};

// 1. list ---------------------------------------------------------------------------------------->
export const list = async (
  user_id_param,
  sleep_dur_param,
  FILTER_param,
  PAGING_param
) => {

  const [startDay, endDay] = sleep_dur_param.split(` ~ `);

  const sort = FILTER_param.order === "asc" ? 1 : -1;
  const limit = FILTER_param.limit === 0 ? 5 : FILTER_param.limit;
  const page = PAGING_param.page === 0 ? 1 : PAGING_param.page;

  const totalCnt = await Sleep.countDocuments({
    user_id: user_id_param,
    sleep_date: {
      $gte: startDay,
      $lte: endDay,
    },
  });

  const findResult = await Sleep.find({
    user_id: user_id_param,
    sleep_date: {
      $gte: startDay,
      $lte: endDay,
    },
  })
  .sort({ sleep_date: sort })
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
  sleep_dur_param
) => {

  const [startDay, endDay] = sleep_dur_param.split(` ~ `);

  const finalResult = await Sleep.findOne({
    _id: _id_param === "" ? {$exists:true} : _id_param,
    user_id: user_id_param,
    sleep_date: {
      $gte: startDay,
      $lte: endDay,
    },
  })
  .lean();

  const sectionCnt = finalResult?.sleep_section?.length || 0;

  return {
    sectionCnt: sectionCnt,
    result: finalResult,
  };
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (
  user_id_param,
  SLEEP_param,
  sleep_dur_param
) => {

  const [startDay, endDay] = sleep_dur_param.split(` ~ `);

  const findResult = await Sleep.findOne({
    user_id: user_id_param,
    sleep_date: {
      $gte: startDay,
      $lte: endDay,
    },
  })
    .lean();

  let finalResult;
  if (!findResult) {
    const createQuery = {
      _id: new mongoose.Types.ObjectId(),
      user_id: user_id_param,
      sleep_date: startDay,
      sleep_section: SLEEP_param.sleep_section,
      sleep_regdate: moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss"),
      sleep_update: "",
    };
    finalResult = await Sleep.create(createQuery);
  }
  else {
    const updateQuery = {
      _id: findResult._id
    };
    const updateAction = {
      $set: {
        sleep_section: SLEEP_param.sleep_section,
        sleep_update: moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss"),
      }
    };
    finalResult = await Sleep.updateOne(updateQuery, updateAction).lean();
  }

  return {
    result: finalResult,
  };
};

// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = async (
  _id_param,
  user_id_param,
  sleep_dur_param
) => {

  const [startDay, endDay] = sleep_dur_param.split(` ~ `);

  const updateResult = await Sleep.updateOne(
    {
      user_id: user_id_param,
      sleep_date: {
        $gte: startDay,
        $lte: endDay,
      },
    },
    {
      $pull: {
        sleep_section: {
          _id: _id_param
        },
      },
      $set: {
        sleep_update: moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss"),
      },
    },
    {
      arrayFilters: [{
        "elem._id": _id_param
      }],
    }
  ).lean();

  let finalResult;
  if (updateResult.modifiedCount > 0) {
    const doc = await Sleep.findOne({
      user_id: user_id_param,
      sleep_date: {
        $gte: startDay,
        $lte: endDay,
      },
    })
    .lean();

    if (
      (doc) &&
      (!doc.sleep_section || doc.sleep_section.length === 0)
    ) {
      finalResult = await Sleep.deleteOne({
        _id: doc._id
      })
      .lean();
    }
  }

  return {
    result: finalResult
  };
};
