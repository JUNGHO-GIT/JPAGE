// userMiddleware.js

// 1. percent ------------------------------------------------------------------------------------->
export const percent = async (object) => {

  if (!object) {
    return [];
  }

  // 1. exercise
  const diffExercise = (plan, real, extra) => {
    const percent = ((real - plan) / plan) * 100;
    const planDate = new Date(`1970-01-01T${plan}Z`);
    const realDate = new Date(`1970-01-01T${real}Z`);

    if (plan === 0 || plan === "00:00" || real === 0 || real === "00:00") {
      return 1;
    }
    else if (extra === "count" || extra === "volume" || extra === "weight") {
      // 1. ~ 1%
      if (percent <= 1) {
        return 4;
      }
      // 2. 1% ~ 10%
      else if (percent > 1 && percent <= 10) {
        return 3;
      }
      // 3. 10% ~ 50%
      else if (percent > 10 && percent <= 30) {
        return 2;
      }
      // 4. 50% ~
      else {
        return 1;
      }
    }
    else if (extra === "time") {
      let diff = 0;
      if (realDate < planDate) {
        diff = planDate.getTime() - realDate.getTime();
      }
      else {
        diff = realDate.getTime() - planDate.getTime();
      }
      // 1. 10분이내
      if (0 <= diff && diff <= 600000) {
        return 4;
      }
      // 2. 10분 ~ 20분
      else if (600000 < diff && diff <= 1200000) {
        return 3;
      }
      // 3. 20분 ~ 30분
      else if (1200000 < diff && diff <= 1800000) {
        return 2;
      }
      // 4. 30분 ~
      else {
        return 1;
      }
    }
  };

  // 2. food
  const diffFood = (plan, real, extra) => {
    const percent = ((real - plan) / plan) * 100;
    if (plan === 0 || plan === "00:00" || real === 0 || real === "00:00") {
      return 1;
    }
    // 1. ~ 1%
    else if (percent <= 1) {
      return 4;
    }
    // 2. 1% ~ 10%
    else if (percent > 1 && percent <= 10) {
      return 3;
    }
    // 3. 10% ~ 50%
    else if (percent > 10 && percent <= 30) {
      return 2;
    }
    // 4. 50% ~
    else {
      return 1;
    }
  };

  // 3. money
  const diffMoney = (plan, real, extra) => {
    if (plan === 0 || plan === "00:00" || real === 0 || real === "00:00") {
      return 1;
    }
    else if (extra === "in") {
      let percent = (Math.abs(real - plan) / plan) * 100;
      if (plan > real) {
        if (percent > 0 && percent <= 1) {
          return 4;
        }
        // 2. 1% ~ 10%
        else if (percent > 1 && percent <= 10) {
          return 3;
        }
        // 3. 10% ~ 50%
        else if (percent > 10 && percent <= 50) {
          return 2;
        }
        // 4. 50% ~
        else {
          return 1;
        }
      }
      else {
        // 1. 0% ~ 1%
        if (percent > 0 && percent <= 1) {
          return 1;
        }
        // 2. 1% ~ 10%
        else if (percent > 1 && percent <= 10) {
          return 2;
        }
        // 3. 10% ~ 50%
        else if (percent > 10 && percent <= 50) {
          return 3;
        }
        // 4. 50% ~
        else {
          return 4;
        }
      }
    }
    else if (extra === "out") {
      let percent = (Math.abs(real - plan) / plan) * 100;
      if (plan > real) {
        // 1. 0% ~ 1%
        if (percent > 0 && percent <= 1) {
          return 1;
        }
        // 2. 1% ~ 10%
        else if (percent > 1 && percent <= 10) {
          return 2;
        }
        // 3. 10% ~ 50%
        else if (percent > 10 && percent <= 50) {
          return 3;
        }
        // 4. 50% ~
        else {
          return 4;
        }
      }
      else {
        // 1. 0% ~ 1%
        if (percent > 0 && percent <= 1) {
          return 4;
        }
        // 2. 1% ~ 10%
        else if (percent > 1 && percent <= 10) {
          return 3;
        }
        // 3. 10% ~ 50%
        else if (percent > 10 && percent <= 50) {
          return 2;
        }
        // 4. 50% ~
        else {
          return 1;
        }
      }
    }
  };

  // 4. sleep
  const diffSleep = (plan, real, extra) => {
    const planDate = new Date(`1970-01-01T${plan}Z`);
    const realDate = new Date(`1970-01-01T${real}Z`);
    let diff = 0;
    realDate < planDate ? diff = planDate.getTime() - realDate.getTime() : diff = realDate.getTime() - planDate.getTime();

    if (plan === 0 || plan === "00:00" || real === 0 || real === "00:00") {
      return 1;
    }
    // 1. 10분이내
    else if (0 <= diff && diff <= 600000) {
      return 4;
    }
    // 2. 10분 ~ 20분
    else if (600000 < diff && diff <= 1200000) {
      return 3;
    }
    // 3. 20분 ~ 30분
    else if (1200000 < diff && diff <= 1800000) {
      return 2;
    }
    else {
      return 1;
    }
  };

  const calcAvg = (object) => {
    let sum = 0;
    for (let key in object) {
      sum += object[key];
    }
    return Number((sum / Object.keys(object).length).toFixed(1));
  }

  const exercise = {
    diff_count: diffExercise(
      object?.exercisePlan?.exercise_plan_count,
      object?.exercise?.exercise_total_count,
      "count"
    ),
    diff_volume: diffExercise(
      object?.exercisePlan?.exercise_plan_volume,
      object?.exercise?.exercise_total_volume,
      "volume"
    ),
    diff_cardio: diffExercise(
      object?.exercisePlan?.exercise_plan_cardio,
      object?.exercise?.exercise_total_cardio,
      "time"
    ),
    diff_weight:diffExercise(
      object?.exercisePlan?.exercise_plan_weight,
      object?.exercise?.exercise_body_weight,
      "weight"
    ),
  };

  const food = {
    diff_kcal: diffFood(
      object?.foodPlan?.food_plan_kcal,
      object?.food?.food_total_kcal,
      "kcal"
    ),
    diff_carb: diffFood(
      object?.foodPlan?.food_plan_carb,
      object?.food?.food_total_carb,
      "carb"
    ),
    diff_protein: diffFood(
      object?.foodPlan?.food_plan_protein,
      object?.food?.food_total_protein,
      "protein"
    ),
    diff_fat: diffFood(
      object?.foodPlan?.food_plan_fat,
      object?.food?.food_total_fat,
      "fat"
    ),
  };

  const money = {
    diff_in: diffMoney(
      object?.moneyPlan?.money_plan_in,
      object?.money?.money_total_in,
      "in"
    ),
    diff_out: diffMoney(
      object?.moneyPlan?.money_plan_out,
      object?.money?.money_total_out,
      "out"
    ),
  };

  const sleep = {
    diff_night: diffSleep(
      object?.sleepPlan?.sleep_plan_night,
      object?.sleep?.sleep_night,
      "night"
    ),
    diff_morning: diffSleep(
      object?.sleepPlan?.sleep_plan_morning,
      object?.sleep?.sleep_morning,
      "morning"
    ),
    diff_time: diffSleep(
      object?.sleepPlan?.sleep_plan_time,
      object?.sleep?.sleep_time,
      "time"
    ),
  };

  const newObject = {
    exercise: calcAvg(exercise),
    food: calcAvg(food),
    money: calcAvg(money),
    sleep: calcAvg(sleep),
    total: calcAvg({...exercise, ...food, ...money, ...sleep}),
  };

  return newObject;
};
