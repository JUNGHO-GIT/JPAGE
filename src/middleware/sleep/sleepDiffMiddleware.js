// sleepDiffMiddleware.js

import {differenceInMinutes} from "date-fns";

// 1. list (리스트는 gte lte) --------------------------------------------------------------------->
export const list = async (object) => {

  if (!object) {
    return [];
  }

  // ex. 22:00 - 04:00 = 06:00
  // ex. 22:00 - 22:30 = 00:30
  const compareTime = (goal, real, extra) => {
    if (extra === "bedTime" || extra === "wakeTime") {
      const goalDate = new Date(`1970-01-01T${goal}Z`);
      const realDate = new Date(`1970-01-01T${real}Z`);

      // 밤을 넘어가는 시간 처리
      let diff = differenceInMinutes(realDate, goalDate);

      // 24시간을 분으로 환산
      if (diff < 0) {
        diff += 1440;
      }

      // HH:mm 형식으로 결과 반환
      const hours = Math.floor(diff / 60);
      const minutes = diff % 60;
      const diffTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      return diffTime;
    }
    else if (extra === "time") {
      const hoursGoal = parseInt(goal?.split(":")[0], 10);
      const minutesGoal = parseInt(goal?.split(":")[1], 10);

      const hoursReal = parseInt(real?.split(":")[0], 10);
      const minutesReal = parseInt(real?.split(":")[1], 10);

      const hours = Math.abs(hoursGoal - hoursReal);
      const minutes = Math.abs(minutesGoal - minutesReal);

      const diffTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
      return diffTime;
    };
  };

  const makeColor = (goal, real, extra) => {
    if (extra === "bedTime" || extra === "wakeTime") {
      const goalDate = new Date(`1970-01-01T${goal}Z`);
      const realDate = new Date(`1970-01-01T${real}Z`);
      let diffVal = 0;
      if (realDate < goalDate) {
        diffVal = goalDate.getTime() - realDate.getTime();
      }
      else {
        diffVal = realDate.getTime() - goalDate.getTime();
      }
      // 1. 10분이내
      if (0 <= diffVal && diffVal <= 600000) {
        return "danger";
      }
      // 2. 10분 ~ 20분
      else if (600000 < diffVal && diffVal <= 1200000) {
        return "warning";
      }
      // 3. 20분 ~ 30분
      else if (1200000 < diffVal && diffVal <= 1800000) {
        return "secondary";
      }
      // 4. 30분 ~ 50분
      else if (1800000 < diffVal && diffVal <= 3000000) {
        return "success";
      }
      // 5. 50분 ~
      else {
        return "primary";
      }
    }
    else if (extra === "time") {
      const hoursGoal = parseInt(goal?.split(":")[0], 10);
      const minutesGoal = parseInt(goal?.split(":")[1], 10);

      const hoursReal = parseInt(real?.split(":")[0], 10);
      const minutesReal = parseInt(real?.split(":")[1], 10);

      const hours = Math.abs(hoursGoal - hoursReal);
      const minutes = Math.abs(minutesGoal - minutesReal);

      const diffVal = (hours * 60) + minutes;

      // 1. ~ 10분
      if (0 <= diffVal && diffVal <= 10) {
        return "danger";
      }
      // 2. 10분 ~ 20분
      else if (10 < diffVal && diffVal <= 20) {
        return "warning";
      }
      // 3. 20분 ~ 30분
      else if (20 < diffVal && diffVal <= 30) {
        return "secondary";
      }
      // 4. 30분 ~ 50분
      else if (30 < diffVal && diffVal <= 50) {
        return "success";
      }
      // 5. 50분 ~
      else {
        return "primary";
      }
    }
  };

  object?.result?.map((item) => {
    Object.assign((item), {
      sleep_diff_bedTime: compareTime(
        item?.sleep_goal_bedTime, item?.sleep_bedTime, "bedTime"
      ),
      sleep_diff_wakeTime: compareTime(
        item?.sleep_goal_wakeTime, item?.sleep_wakeTime, "wakeTime"
      ),
      sleep_diff_time: compareTime(
        item?.sleep_goal_sleepTime, item?.sleep_sleepTime, "time"
      ),
      sleep_diff_bedTime_color: makeColor(
        item?.sleep_goal_bedTime, item?.sleep_bedTime, "bedTime"
      ),
      sleep_diff_wakeTime_color: makeColor(
        item?.sleep_goal_wakeTime, item?.sleep_wakeTime, "wakeTime"
      ),
      sleep_diff_time_color: makeColor(
        item?.sleep_goal_sleepTime, item?.sleep_sleepTime, "time"
      ),
    });
  });

  return object;
};