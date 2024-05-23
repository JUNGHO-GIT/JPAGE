// moneyDashService.js

import * as repository from "../../repository/money/moneyDashRepository.js";
import {log} from "../../assets/js/utils.js";
import {intFormat, koreanDate} from "../../assets/js/date.js";
import {curWeekStart, curWeekEnd} from "../../assets/js/date.js";
import {curMonthStart, curMonthEnd} from "../../assets/js/date.js";
import {curYearStart, curYearEnd} from "../../assets/js/date.js";

// 1-1. dash (bar - today) ------------------------------------------------------------------------>
export const barToday = async (
  user_id_param
) => {

  const dateStart = koreanDate;
  const dateEnd = koreanDate;

  let findPlan = [];
  let findReal = [];
  let finalResult = [];

  findPlan = await repository.barToday.listPlan(
    user_id_param, dateStart, dateEnd
  );
  findReal = await repository.barToday.list(
    user_id_param, dateStart, dateEnd
  );

  finalResult = [
    {
      name: "수입",
      date: dateStart,
      목표: intFormat(findPlan?.[0]?.money_plan_in),
      실제: intFormat(findReal?.[0]?.money_total_in)
    },
    {
      name: "지출",
      date: dateStart,
      목표: intFormat(findPlan?.[0]?.money_plan_out),
      실제: intFormat(findReal?.[0]?.money_total_out)
    }
  ];

  return finalResult;
};

// 2-1. dash (pie - today) ------------------------------------------------------------------------>
export const pieToday = async (
  user_id_param
) => {

  const dateStart = koreanDate;
  const dateEnd = koreanDate;

  let findResultIn = [];
  let findResultOut = [];
  let finalResultIn = [];
  let finalResultOut = [];

  // in
  findResultIn = await repository.pieToday.listIn(
    user_id_param, dateStart, dateEnd
  );
  // out
  findResultOut = await repository.pieToday.listOut(
    user_id_param, dateStart, dateEnd
  );

  // in
  finalResultIn = findResultIn?.map((item) => ({
    name: item._id,
    value: intFormat(item.value)
  }));
  // out
  finalResultOut = findResultOut?.map((item) => ({
    name: item._id,
    value: intFormat(item.value)
  }));

  return {
    in: finalResultIn,
    out: finalResultOut,
    date: `${dateStart} ~ ${dateEnd}`
  };
};

// 2-2. dash (pie - week) ------------------------------------------------------------------------->
export const pieWeek = async (
  user_id_param
) => {

  const dateStart = curWeekStart.format("YYYY-MM-DD");
  const dateEnd = curWeekEnd.format("YYYY-MM-DD");

  let findResultIn = [];
  let findResultOut = [];
  let finalResultIn = [];
  let finalResultOut = [];

  // in
  findResultIn = await repository.pieWeek.listIn(
    user_id_param, dateStart, dateEnd
  );
  // out
  findResultOut = await repository.pieWeek.listOut(
    user_id_param, dateStart, dateEnd
  );

  // in
  finalResultIn = findResultIn?.map((item) => ({
    name: item._id,
    value: intFormat(item.value)
  }));
  // out
  finalResultOut = findResultOut?.map((item) => ({
    name: item._id,
    value: intFormat(item.value)
  }));

  return {
    in: finalResultIn,
    out: finalResultOut,
    date: `${dateStart} ~ ${dateEnd}`
  };
};

// 2-3. dash (pie - month) ------------------------------------------------------------------------>
export const pieMonth = async (
  user_id_param
) => {

  const dateStart = curMonthStart.format("YYYY-MM-DD");
  const dateEnd = curMonthEnd.format("YYYY-MM-DD");

  let findResultIn = [];
  let findResultOut = [];
  let finalResultIn = [];
  let finalResultOut = [];

  // in
  findResultIn = await repository.pieMonth.listIn(
    user_id_param, dateStart, dateEnd
  );
  // out
  findResultOut = await repository.pieMonth.listOut(
    user_id_param, dateStart, dateEnd
  );

  // in
  finalResultIn = findResultIn?.map((item) => ({
    name: item._id,
    value: intFormat(item.value)
  }));
  // out
  finalResultOut = findResultOut?.map((item) => ({
    name: item._id,
    value: intFormat(item.value)
  }));

  return {
    in: finalResultIn,
    out: finalResultOut,
    date: `${dateStart} ~ ${dateEnd}`
  };
};

// 3-1. dash (line - week) ------------------------------------------------------------------------>
export const lineWeek = async (
  user_id_param
) => {

  const dateStart = curWeekStart.format("YYYY-MM-DD");
  const dateEnd = curWeekEnd.format("YYYY-MM-DD");

  // ex 월
  const name = [
    "월", "화", "수", "목", "금", "토", "일"
  ];

  // ex. 00-00
  const date = Array.from({ length: 7 }, (_, i) => {
    return curWeekStart.clone().add(i, 'days').format("MM-DD");
  });

  let findResult = [];
  let finalResult = [];

  findResult = await repository.lineWeek.list(
    user_id_param, dateStart, dateEnd
  );

  name.forEach((data, index) => {
    const findIndex = findResult.findIndex((item) => (
      new Date(item.money_dateStart).getDay() === index
    ));
    finalResult.push({
      name: data,
      date: date[index],
      수입: findIndex !== -1 ? intFormat(findResult[findIndex]?.money_total_in) : 0,
      지출: findIndex !== -1 ? intFormat(findResult[findIndex]?.money_total_out) : 0
    });
  });

  return finalResult;
};

// 3-2. dash (line - month) ----------------------------------------------------------------------->
export const lineMonth = async (
  user_id_param
) => {

  const dateStart = curMonthStart.format("YYYY-MM-DD");
  const dateEnd = curMonthEnd.format("YYYY-MM-DD");

  // ex. 00일
  const name = Array.from({ length: curMonthEnd.date() }, (_, i) => {
    return `${i + 1}일`;
  });

  // ex. 00-00
  const date = Array.from({ length: curMonthEnd.date() }, (_, i) => {
    return curMonthStart.clone().add(i, 'days').format("MM-DD");
  });

  let findResult = [];
  let finalResult = [];

  findResult = await repository.lineMonth.list(
    user_id_param, dateStart, dateEnd
  );

  name.forEach((data, index) => {
    const findIndex = findResult.findIndex((item) => (
      new Date(item.money_dateStart).getDay() === index + 1
    ));
    finalResult.push({
      name: data,
      date: date[index],
      수입: findIndex !== -1 ? intFormat(findResult[findIndex]?.money_total_in) : 0,
      지출: findIndex !== -1 ? intFormat(findResult[findIndex]?.money_total_out) : 0
    });
  });

  return finalResult;
};

// 4-1. dash (avg - month) ------------------------------------------------------------------------>
export const avgMonth = async (
  user_id_param
) => {

  const dateStart = curMonthStart.format("YYYY-MM-DD");
  const dateEnd = curMonthEnd.format("YYYY-MM-DD");

  // ex. 00주차
  const name = Array.from({ length: 5 }, (_, i) => {
    return `${i + 1}주차`;
  });

  // ex. 00-00 ~ 00-00
  const date = Array.from({ length: 5 }, (_, i) => {
    return `${curMonthStart.clone().add(i * 7, 'days').format("MM-DD")} ~ ${curMonthStart.clone().add(i * 7 + 6, 'days').format("MM-DD")}`;
  });

  let sumIn = Array(5).fill(0);
  let sumOut = Array(5).fill(0);
  let countRecords = Array(5).fill(0);

  let findResult = [];
  let finalResult = [];

  findResult = await repository.avgMonth.list(
    user_id_param, dateStart, dateEnd
  );

  findResult.forEach((item) => {
    const moneyDate = new Date(item.money_dateStart);
    const diffTime = Math.abs(moneyDate.getTime() - curWeekStart.toDate().getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const weekNum = Math.floor(diffDays / 7);
    if (weekNum >= 0 && weekNum < 5) {
      sumIn[weekNum] += intFormat(item.money_total_in);
      sumOut[weekNum] += intFormat(item.money_total_out);
      countRecords[weekNum]++;
    }
  });

  name.forEach((data, index) => {
    finalResult.push({
      name: data,
      date: date[index],
      수입: intFormat(sumIn[index] / countRecords[index]),
      지출: intFormat(sumOut[index] / countRecords[index])
    });
  });

  return finalResult;
};

// 4-2. dash (avg - year) ------------------------------------------------------------------------>
export const avgYear = async (
  user_id_param
) => {

  const dateStart = curYearStart.format("YYYY-MM-DD");
  const dateEnd = curYearEnd.format("YYYY-MM-DD");

  // ex. 00월
  const name = Array.from({ length: 12 }, (_, i) => {
    return `${i + 1}월`;
  });

  // ex. 00-00 ~ 00-00
  const date = Array.from({ length: 12 }, (_, i) => {
    return `${curMonthStart.clone().add(i, 'months').format("MM-DD")} ~ ${curMonthEnd.clone().add(i, 'months').format("MM-DD")}`;
  });

  let sumIn = Array(5).fill(0);
  let sumOut = Array(5).fill(0);
  let countRecords = Array(5).fill(0);

  let findResult = [];
  let finalResult = [];

  findResult = await repository.avgYear.list(
    user_id_param, dateStart, dateEnd
  );

  findResult.forEach((item) => {
    const moneyDate = new Date(item.money_dateStart);
    const monthNum = moneyDate.getMonth();
    sumIn[monthNum] += intFormat(item.money_total_in);
    sumOut[monthNum] += intFormat(item.money_total_out);
    countRecords[monthNum]++;
  });

  name.forEach((data, index) => {
    finalResult.push({
      name: data,
      date: date[index],
      수입: intFormat(sumIn[index] / countRecords[index]),
      지출: intFormat(sumOut[index] / countRecords[index])
    });
  });

  return finalResult;
};