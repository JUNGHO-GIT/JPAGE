// userMiddleware.js

// 1. percent ------------------------------------------------------------------------------------->
export const percent = async (object) => {

  if (!object) {
    return [];
  }

  const diffFood = (plan, real) => {
    const percent = ((real - plan) / plan) * 100;
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
  };

  const diffMoney = (plan, real, extra) => {
    let percent = 0;
    if (extra === "in") {
      percent = ((plan - real) / plan) * 100;
      // 1. ~ 1%
      if (percent <= 1) {
        return 1;
      }
      // 2. 1% ~ 10%
      else if (percent > 1 && percent <= 10) {
        return 2;
      }
      // 3. 10% ~ 50%
      else if (percent > 10 && percent <= 30) {
        return 3;
      }
      // 4. 50% ~
      else {
        return 4;
      }
    }
    else if (extra === "out") {
      percent = ((real - plan) / plan) * 100;
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
    else {
      return 0;
    }
  };

  const diffSleep = (plan, real, extra) => {
    const planDate = new Date(`1970-01-01T${plan}Z`);
    const realDate = new Date(`1970-01-01T${real}Z`);
    let diff = 0;
    if (realDate < planDate) {
      diff = planDate.getTime() - realDate.getTime();
    }
    else {
      diff = realDate.getTime() - planDate.getTime();
    }
    // 1. 10분이내
    if (0 <= diff && diff <= 600000) {
      return 3;
    }
    // 2. 10분 ~ 20분
    else if (600000 < diff && diff <= 1200000) {
      return 2;
    }
    // 3. 20분 ~
    else if (1200000 < diff) {
      return 1;
    }
    else {
      return 4;
    }
  };

  const diffWork = (plan, real, extra) => {
    const percent = ((real - plan) / plan) * 100;
    const planDate = new Date(`1970-01-01T${plan}Z`);
    const realDate = new Date(`1970-01-01T${real}Z`);
    if (extra === "volume") {
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
    else {
      let diff = 0;
      if (realDate < planDate) {
        diff = planDate.getTime() - realDate.getTime();
      }
      else {
        diff = realDate.getTime() - planDate.getTime();
      }
      // 1. 10분이내
      if (0 <= diff && diff <= 600000) {
        return 3;
      }
      // 2. 10분 ~ 20분
      else if (600000 < diff && diff <= 1200000) {
        return 2;
      }
      // 3. 20분 ~
      else if (1200000 < diff) {
        return 1;
      }
      else {
        return 4;
      }
    }
  };

  const food = {
    diff_kcal: diffFood(object.foodPlan.food_plan_kcal, object.foodReal.food_total_kcal),
    diff_carb: diffFood(object.foodPlan.food_plan_carb, object.foodReal.food_total_carb),
    diff_protein: diffFood(object.foodPlan.food_plan_protein, object.foodReal.food_total_protein),
    diff_fat: diffFood(object.foodPlan.food_plan_fat, object.foodReal.food_total_fat),
  };
  const money = {
    diff_in: diffMoney(object.moneyPlan.money_plan_in, object.moneyReal.money_total_in, "in"),
    diff_out: diffMoney(object.moneyPlan.money_plan_out, object.moneyReal.money_total_out, "out"),
  };
  const sleep = {
    diff_night: diffSleep(object.sleepPlan.sleep_plan_night, object.sleepReal.sleep_night),
    diff_morning: diffSleep(object.sleepPlan.sleep_plan_morning, object.sleepReal.sleep_morning),
    diff_time: diffSleep(object.sleepPlan.sleep_plan_time, object.sleepReal.sleep_time),
  };
  const work = {
    diff_count: diffWork(object.workPlan.work_plan_count, object.workReal.work_total_count, ""),
    diff_volume: diffWork(object.workPlan.work_plan_volume, object.workReal.work_total_volume, "volume"),
    diff_cardio: diffWork(object.workPlan.work_plan_cardio, object.workReal.work_total_cardio, "time"),
    diff_weight:  diffWork(object.workPlan.work_plan_weight, object.workReal.work_body_weight, ""),
  };

  function calcAvg(object) {
    let sum = 0;
    for (let key in object) {
      sum += object[key];
    }
    let value = sum / Object.keys(object).length;
    let color = "";
    if (value >= 1 && value <= 2) {
      color = "text-danger";
    }
    else if (value > 2 && value <= 3) {
      color = "text-warning";
    }
    else if (value > 3 && value <= 4) {
      color = "text-success";
    }
    else {
      color = "text-primary";
    }
    return {
      value: value,
      color: color,
    };
  }

  // 각 항목의 합
  const newObject = {
    food: calcAvg(food),
    money: calcAvg(money),
    sleep: calcAvg(sleep),
    work: calcAvg(work),
  };

  return newObject;
};
