// date.js

import moment from "moment-timezone";

// 1. common -------------------------------------------------------------------------------------->
export const newDate = moment().tz("Asia/Seoul");
export const koreanDate = moment().tz("Asia/Seoul").format("YYYY-MM-DD");
export const curWeekStart = moment().tz("Asia/Seoul").startOf("isoWeek");
export const curWeekEnd = moment().tz("Asia/Seoul").endOf("isoWeek");
export const curMonthStart = moment().tz("Asia/Seoul").startOf("month");
export const curMonthEnd = moment().tz("Asia/Seoul").endOf("month");
export const curYearStart = moment().tz("Asia/Seoul").startOf("year");
export const curYearEnd = moment().tz("Asia/Seoul").endOf("year");

// 1-1. format ------------------------------------------------------------------------------------>
export const intFormat = (data) => {
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

// 1-2. format ------------------------------------------------------------------------------------>
export const timeFormat = (data) => {
  if (!data) {
    return 0;
  }
  else if (typeof data === "string") {
    const time = data.split(":");
    if (time.length === 2) {
      const hours = parseInt(time[0], 10);
      const minutes = parseInt(time[1], 10) / 60;
      return parseFloat((hours + minutes).toFixed(1));
    }
    else {
      return 0;
    }
  }
  else {
    return parseFloat(data.toFixed(1));
  }
};

// 1-2. convert ----------------------------------------------------------------------------------->
export const strToDecimal = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours + minutes / 60;
};

// 1-2. convert ----------------------------------------------------------------------------------->
export const decimalToStr = (time) => {
  const hours = Math.floor(time);
  const minutes = Math.round((time - hours) * 60);
  const returnTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

  return returnTime;
};