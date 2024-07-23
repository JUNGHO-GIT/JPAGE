// foodChartService.js

import * as repository from "../../repository/food/foodChartRepository.js";
import {log} from "../../assets/js/utils.js";
import {intFormat, koreanDate} from "../../assets/js/date.js";
import {curWeekStart, curWeekEnd} from "../../assets/js/date.js";
import {curMonthStart, curMonthEnd} from "../../assets/js/date.js";
import {curYearStart, curYearEnd} from "../../assets/js/date.js";

// 1-1. chart (bar - today) -------------------------------------------------------------------------
export const barToday = async (
  user_id_param
) => {

  const dateStart = koreanDate;
  const dateEnd = koreanDate;

  let findGoal = [];
  let findReal = [];
  let finalResultKcal = [];
  let finalResultNut = [];

  findGoal = await repository.barToday.listGoal(
    user_id_param, dateStart, dateEnd
  );
  findReal = await repository.barToday.list(
    user_id_param, dateStart, dateEnd
  );

  // kcal
  finalResultKcal = [
    {
      name: "kcal",
      date: dateStart,
      goal: intFormat(findGoal?.[0]?.food_goal_kcal),
      real: intFormat(findReal?.[0]?.food_total_kcal)
    }
  ];

  // nut
  finalResultNut = [
    {
      name: "carb",
      date: dateStart,
      goal: intFormat(findGoal?.[0]?.food_goal_carb),
      real: intFormat(findReal?.[0]?.food_total_carb)
    },
    {
      name: "protein",
      date: dateStart,
      goal: intFormat(findGoal?.[0]?.food_goal_protein),
      real: intFormat(findReal?.[0]?.food_total_protein)
    },
    {
      name: "fat",
      date: dateStart,
      goal: intFormat(findGoal?.[0]?.food_goal_fat),
      real: intFormat(findReal?.[0]?.food_total_fat)
    }
  ];

  return  {
    kcal: finalResultKcal,
    nut: finalResultNut
  };
};

// 2-1. chart (pie - today) -------------------------------------------------------------------------
export const pieToday = async (
  user_id_param
) => {

  const dateStart = koreanDate;
  const dateEnd = koreanDate;

  let findResultKcal = [];
  let findResultNut = [];
  let finalResultKcal = [];
  let finalResultNut = [];

  // kcal
  findResultKcal = await repository.pieToday.listKcal(
    user_id_param, dateStart, dateEnd
  );
  // nut
  findResultNut = await repository.pieToday.listNut(
    user_id_param, dateStart, dateEnd
  );

  // kcal
  finalResultKcal = findResultKcal?.map((item) => ({
    name: item._id,
    value: intFormat(item.value)
  }));
  // nut
  finalResultNut = findResultNut.map((item) => [
    {name: "carb", value: intFormat(item.food_total_carb)},
    {name: "protein", value: intFormat(item.food_total_protein)},
    {name: "fat", value: intFormat(item.food_total_fat)}
  ]).flat();

  return {
    kcal: finalResultKcal,
    nut: finalResultNut,
    date: `${dateStart} ~ ${dateEnd}`
  };
};

// 2-2. chart (pie - week) --------------------------------------------------------------------------
export const pieWeek = async (
  user_id_param
) => {

  const dateStart = curWeekStart.format("YYYY-MM-DD");
  const dateEnd = curWeekEnd.format("YYYY-MM-DD");

  let findResultKcal = [];
  let findResultNut = [];
  let finalResultKcal = [];
  let finalResultNut = [];

  // kcal
  findResultKcal = await repository.pieWeek.listKcal(
    user_id_param, dateStart, dateEnd
  );
  // nut
  findResultNut = await repository.pieWeek.listNut(
    user_id_param, dateStart, dateEnd
  );

  // kcal
  finalResultKcal = findResultKcal?.map((item) => ({
    name: item._id,
    value: intFormat(item.value)
  }));
  // nut
  finalResultNut = findResultNut.map((item) => [
    {name: "carb", value: intFormat(item.food_total_carb)},
    {name: "protein", value: intFormat(item.food_total_protein)},
    {name: "fat", value: intFormat(item.food_total_fat)}
  ]).flat();

  return {
    kcal: finalResultKcal,
    nut: finalResultNut,
    date: `${dateStart} ~ ${dateEnd}`
  };
};

// 2-3. chart (pie - month) -------------------------------------------------------------------------
export const pieMonth = async (
  user_id_param
) => {

  const dateStart = curMonthStart.format("YYYY-MM-DD");
  const dateEnd = curMonthEnd.format("YYYY-MM-DD");

  let findResultKcal = [];
  let findResultNut = [];
  let finalResultKcal = [];
  let finalResultNut = [];

  // kcal
  findResultKcal = await repository.pieMonth.listKcal(
    user_id_param, dateStart, dateEnd
  );
  // nut
  findResultNut = await repository.pieMonth.listNut(
    user_id_param, dateStart, dateEnd
  );

  // kcal
  finalResultKcal = findResultKcal?.map((item) => ({
    name: item._id,
    value: intFormat(item.value)
  }));
  // nut
  finalResultNut = findResultNut.map((item) => [
    {name: "carb", value: intFormat(item.food_total_carb)},
    {name: "protein", value: intFormat(item.food_total_protein)},
    {name: "fat", value: intFormat(item.food_total_fat)}
  ]).flat();

  return {
    kcal: finalResultKcal,
    nut: finalResultNut,
    date: `${dateStart} ~ ${dateEnd}`
  };
};

// 3-1. chart (line - week) -------------------------------------------------------------------------
export const lineWeek = async (
  user_id_param
) => {

  const dateStart = curWeekStart.format("YYYY-MM-DD");
  const dateEnd = curWeekEnd.format("YYYY-MM-DD");

  // ex mon, tue
  const name = [
    "mon", "tue", "wed", "thu", "fri", "sat", "sun"
  ];

  // ex. 00-00
  const date = Array.from({ length: 7 }, (_, i) => {
    return curWeekStart.clone().add(i, 'days').format("MM-DD");
  });

  let findResultKcal = [];
  let findResultNut = [];
  let finalResultKcal = [];
  let finalResultNut = [];

  // kcal
  findResultKcal = await repository.lineWeek.listKcal(
    user_id_param, dateStart, dateEnd
  );
  // nut
  findResultNut = await repository.lineWeek.listNut(
    user_id_param, dateStart, dateEnd
  );

  // week = getDay() + 1
  // month = getDate()
  name.forEach((data, index) => {
    const findIndexKcal = findResultKcal.findIndex((item) => (
      new Date(item.food_dateStart).getDay() === index + 1
    ));
    const findIndexNut = findResultNut.findIndex((item) => (
      new Date(item.food_dateStart).getDay() === index + 1
    ));
    finalResultKcal.push({
      name: data,
      date: date[index],
      kcal: findIndexKcal !== -1 ? intFormat(findResultKcal[findIndexKcal]?.food_total_kcal) : 0
    });
    finalResultNut.push({
      name: data,
      date: date[index],
      carb: findIndexNut !== -1 ? intFormat(findResultNut[findIndexNut]?.food_total_carb) : 0,
      protein: findIndexNut !== -1 ? intFormat(findResultNut[findIndexNut]?.food_total_protein) : 0,
      fat: findIndexNut !== -1 ? intFormat(findResultNut[findIndexNut]?.food_total_fat) : 0
    });
  });

  return {
    kcal: finalResultKcal,
    nut: finalResultNut
  };
};

// 3-2. chart (line - month) ------------------------------------------------------------------------
export const lineMonth = async (
  user_id_param
) => {

  const dateStart = curMonthStart.format("YYYY-MM-DD");
  const dateEnd = curMonthEnd.format("YYYY-MM-DD");

  // ex. 00일
  const name = Array.from({ length: curMonthEnd.date() }, (_, i) => {
    return `${i + 1}`;
  });

  // ex. 00-00
  const date = Array.from({ length: curMonthEnd.date() }, (_, i) => {
    return curMonthStart.clone().add(i, 'days').format("MM-DD");
  });

  let findResultKcal = [];
  let findResultNut = [];
  let finalResultKcal = [];
  let finalResultNut = [];

  // kcal
  findResultKcal = await repository.lineMonth.listKcal(
    user_id_param, dateStart, dateEnd
  );
  // nut
  findResultNut = await repository.lineMonth.listNut(
    user_id_param, dateStart, dateEnd
  );

  // week = getDay() + 1
  // month = getDate()
  name.forEach((data, index) => {
    const findIndexKcal = findResultKcal.findIndex((item) => (
      new Date(item.food_dateStart).getDate() === index
    ));
    const findIndexNut = findResultNut.findIndex((item) => (
      new Date(item.food_dateStart).getDate() === index
    ));
    finalResultKcal.push({
      name: data,
      date: date[index],
      kcal: findIndexKcal !== -1 ? intFormat(findResultKcal[findIndexKcal]?.food_total_kcal) : 0
    });
    finalResultNut.push({
      name: data,
      date: date[index],
      carb: findIndexNut !== -1 ? intFormat(findResultNut[findIndexNut]?.food_total_carb) : 0,
      protein: findIndexNut !== -1 ? intFormat(findResultNut[findIndexNut]?.food_total_protein) : 0,
      fat: findIndexNut !== -1 ? intFormat(findResultNut[findIndexNut]?.food_total_fat) : 0
    });
  });

  return {
    kcal: finalResultKcal,
    nut: finalResultNut
  };
};

// 4-1. chart (avg - month) -------------------------------------------------------------------------
export const avgMonth = async (
  user_id_param
) => {

  const dateStart = curMonthStart.format("YYYY-MM-DD");
  const dateEnd = curMonthEnd.format("YYYY-MM-DD");

  // ex. 00주차
  const name = Array.from({ length: 5 }, (_, i) => {
    return `week${i + 1}`;
  });

  // ex. 00-00 ~ 00-00
  const date = Array.from({ length: 5 }, (_, i) => {
    return `${curMonthStart.clone().add(i * 7, 'days').format("MM-DD")} ~ ${curMonthStart.clone().add(i * 7 + 6, 'days').format("MM-DD")}`;
  });

  let sumKcal = Array(5).fill(0);
  let sumCarb = Array(5).fill(0);
  let sumProtein = Array(5).fill(0);
  let sumFat = Array(5).fill(0);
  let countRecords = Array(5).fill(0);

  let findResultKcal = [];
  let findResultNut = [];
  let finalResultKcal = [];
  let finalResultNut = [];

  // kcal
  findResultKcal = await repository.avgMonth.listKcal(
    user_id_param, dateStart, dateEnd
  );
  // nut
  findResultNut = await repository.avgMonth.listNut(
    user_id_param, dateStart, dateEnd
  );

  // kcal
  findResultKcal.forEach((item) => {
    const foodDate = new Date(item.food_dateStart);
    const diffTime = Math.abs(foodDate.getTime() - curWeekStart.toDate().getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const weekNum = Math.floor(diffDays / 7);
    if (weekNum >= 0 && weekNum < 5) {
      sumKcal[weekNum] += intFormat(item.food_total_kcal);
      countRecords[weekNum]++;
    }
  });

  // nut
  findResultNut.forEach((item) => {
    const foodDate = new Date(item.food_dateStart);
    const diffTime = Math.abs(foodDate.getTime() - curWeekStart.toDate().getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const weekNum = Math.floor(diffDays / 7);
    if (weekNum >= 0 && weekNum < 5) {
      sumCarb[weekNum] += intFormat(item.food_total_carb);
      sumProtein[weekNum] += intFormat(item.food_total_protein);
      sumFat[weekNum] += intFormat(item.food_total_fat);
      countRecords[weekNum]++;
    }
  });

  // week = getDay() + 1
  // month = getDate()
  name.forEach((data, index) => {
    finalResultKcal.push({
      name: data,
      date: date[index],
      kcal: intFormat(sumKcal[index] / countRecords[index])
    });
    finalResultNut.push({
      name: data,
      date: date[index],
      carb: intFormat(sumCarb[index] / countRecords[index]),
      protein: intFormat(sumProtein[index] / countRecords[index]),
      fat: intFormat(sumFat[index] / countRecords[index])
    });
  });

  return {
    kcal: finalResultKcal,
    nut: finalResultNut
  };
};

// 4-2. chart (avg-year) ----------------------------------------------------------------------------
export const avgYear = async (
  user_id_param
) => {

  const dateStart = curYearStart.format("YYYY-MM-DD");
  const dateEnd = curYearEnd.format("YYYY-MM-DD");

  // ex. 00월
  const name = Array.from({ length: 12 }, (_, i) => {
    return `month${i + 1}`;
  });

  // ex. 00-00 ~ 00-00
  const date = Array.from({ length: 12 }, (_, i) => {
    return `${curMonthStart.clone().add(i, 'months').format("MM-DD")} ~ ${curMonthEnd.clone().add(i, 'months').format("MM-DD")}`;
  });

  let sumKcal = Array(12).fill(0);
  let sumCarb = Array(12).fill(0);
  let sumProtein = Array(12).fill(0);
  let sumFat = Array(12).fill(0);
  let countRecords = Array(12).fill(0);

  let findResultKcal = [];
  let findResultNut = [];
  let finalResultKcal = [];
  let finalResultNut = [];

  // kcal
  findResultKcal = await repository.avgYear.listKcal(
    user_id_param, dateStart, dateEnd
  );
  // nut
  findResultNut = await repository.avgYear.listNut(
    user_id_param, dateStart, dateEnd
  );

  // kcal
  findResultKcal.forEach((item) => {
    const foodDate = new Date(item.food_dateStart);
    const monthNum = foodDate.getMonth();
    sumKcal[monthNum] += intFormat(item.food_total_kcal);
    countRecords[monthNum]++;
  });
  // nut
  findResultNut.forEach((item) => {
    const foodDate = new Date(item.food_dateStart);
    const monthNum = foodDate.getMonth();
    sumCarb[monthNum] += intFormat(item.food_total_carb);
    sumProtein[monthNum] += intFormat(item.food_total_protein);
    sumFat[monthNum] += intFormat(item.food_total_fat);
    countRecords[monthNum]++;
  });

  // week = getDay() + 1
  // month = getDate()
  name.forEach((data, index) => {
    finalResultKcal.push({
      name: data,
      date: date[index],
      kcal: intFormat(sumKcal[index] / countRecords[index])
    });
    finalResultNut.push({
      name: data,
      date: date[index],
      carb: intFormat(sumCarb[index] / countRecords[index]),
      protein: intFormat(sumProtein[index] / countRecords[index]),
      fat: intFormat(sumFat[index] / countRecords[index])
    });
  });

  return {
    kcal: finalResultKcal,
    nut: finalResultNut
  };
};