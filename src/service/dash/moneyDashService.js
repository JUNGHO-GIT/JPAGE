// moneyDashService.js

import moment from "moment";
import * as repo from "../../repository/dash/moneyDashRepo.js";

// 0. common -------------------------------------------------------------------------------------->
const koreanDate = moment().tz("Asia/Seoul").format("YYYY-MM-DD");
const curWeekStart = moment().tz("Asia/Seoul").startOf("isoWeek");
const curWeekEnd = moment().tz("Asia/Seoul").endOf("isoWeek");
const curMonthStart = moment().tz("Asia/Seoul").startOf("month");
const curMonthEnd = moment().tz("Asia/Seoul").endOf("month");

// 0-2. format ------------------------------------------------------------------------------------>
const intFormat = (data) => {
  if (!data) {
    return 0;
  }
  else if (typeof data === "string") {
    const toInt = parseInt(data, 10);
    return Math.round(toInt);
  }
  else {
    return Math.round(data);
  }
};

// 0-1. dash (bar) -------------------------------------------------------------------------------->
export const dashBar = async (
  user_id_param
) => {

  const dataInOut = {
    "수입": {
      plan: "money_plan_in",
      real: "money_total_in"
    },
    "지출": {
      plan: "money_plan_out",
      real: "money_total_out"
    }
  };

  let finalResult = [];

  for (let key in dataInOut) {
    const findResultPlan = await repo.detailPlan(
      "", user_id_param, koreanDate, koreanDate
    );
    const findResultReal = await repo.detailReal(
      "", user_id_param, koreanDate, koreanDate
    );

    finalResult.push({
      name: key,
      목표: intFormat(findResultPlan?.[dataInOut[key].plan] || 0),
      실제: intFormat(findResultReal?.[dataInOut[key].real] || 0),
    });
  };

  return {
    result: finalResult,
  };
};

// 0-2. dash (pie) -------------------------------------------------------------------------------->
export const dashPie = async (
  user_id_param
) => {

  // in
  const findResultIn = await repo.aggregateIn(
    user_id_param, koreanDate, koreanDate
  );
  const finalResultIn = findResultIn?.map((item) => ({
    name: item._id,
    value: intFormat(item.value)
  }));

  // out
  const findResultOut = await repo.aggregateOut(
    user_id_param, koreanDate, koreanDate
  );
  const finalResultOut = findResultOut?.map((item) => ({
    name: item._id,
    value: intFormat(item.value)
  }));

  return {
    result: {
      in: finalResultIn,
      out: finalResultOut
    }
  };
};

// 0-3. dash (line) ------------------------------------------------------------------------------->
export const dashLine = async (
  user_id_param
) => {

  const names = [
    "월", "화", "수", "목", "금", "토", "일"
  ];

  let finalResult = [];

  for (let i in names) {
    const dayNum = curWeekStart.clone().day(i);
    const findResult = await repo.detailReal(
      "", user_id_param, dayNum.format("YYYY-MM-DD"), dayNum.format("YYYY-MM-DD")
    );

    finalResult.push({
      name: `${names[i]} ${dayNum.format("MM/DD")}`,
      수입: intFormat(findResult?.money_total_in || 0),
      지출: intFormat(findResult?.money_total_out || 0),
    });
  };

  return {
    result: finalResult,
  };
};

// 0-4. dash (avg-week) --------------------------------------------------------------------------->
export const dashAvgWeek = async (
  user_id_param
) => {

  let sumMoneyIn = Array(5).fill(0);
  let sumMoneyOut = Array(5).fill(0);
  let countRecords = Array(5).fill(0);

  const names = [
    "1주차", "2주차", "3주차", "4주차", "5주차"
  ];

  let finalResult = [];

  for (
    let week = curMonthStart.clone();
    week.isBefore(curMonthEnd);
    week.add(1, "days")
  ) {
    const weekNum = week.week() - curMonthStart.week() + 1;

    if (weekNum >= 1 && weekNum <= 5) {
      const findResult = await repo.detailReal(
        "", user_id_param, week.format("YYYY-MM-DD"), week.format("YYYY-MM-DD")
      );

      if (findResult) {
        sumMoneyIn[weekNum - 1] += intFormat(findResult?.money_total_in || 0);
        sumMoneyOut[weekNum - 1] += intFormat(findResult?.money_total_out || 0);
        countRecords[weekNum - 1]++;
      }
    }
  };

  for (let i = 0; i < 5; i++) {
    finalResult.push({
      name: `${names[i]}`,
      수입: intFormat(sumMoneyIn[i] / countRecords[i]),
      지출: intFormat(sumMoneyOut[i] / countRecords[i]),
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

  let sumMoneyIn = Array(12).fill(0);
  let sumMoneyOut = Array(12).fill(0);
  let countRecords = Array(12).fill(0);

  const names = [
    "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"
  ];

  let finalResult = [];

  for (
    let month = curMonthStart.clone();
    month.isBefore(curMonthEnd);
    month.add(1, "days")
  ) {
    const monthNum = month.month();

    const findResult = await repo.detailReal(
      "", user_id_param, month.format("YYYY-MM-DD"), month.format("YYYY-MM-DD")
    );

    if (findResult) {
      sumMoneyIn[monthNum] += intFormat(findResult?.money_total_in || 0);
      sumMoneyOut[monthNum] += intFormat(findResult?.money_total_out || 0);
      countRecords[monthNum]++;
    }
  };

  for (let i = 0; i < 12; i++) {
    finalResult.push({
      name: names[i],
      수입: intFormat(sumMoneyIn[i] / countRecords[i]),
      지출: intFormat(sumMoneyOut[i] / countRecords[i]),
    });
  };

  return {
    result: finalResult,
  };
};