// foodPlanService.js

import * as repository from "../repository/foodPlanRepository.js";
import {compareCount, compareTime, strToDecimal, decimalToStr} from "../assets/js/date.js";

// 1-1. list -------------------------------------------------------------------------------------->
export const list = async (
  user_id_param, FILTER_param, PAGING_param, duration_param
) => {

  const [startDtPlan, endDtPlan] = duration_param.split(` ~ `);

  const sort = FILTER_param.order === "asc" ? 1 : -1;
  const limit = PAGING_param.limit === 0 ? 5 : PAGING_param.limit;
  const page = PAGING_param.page === 0 ? 1 : PAGING_param.page;

  const totalCnt = await repository.list.cnt(
    user_id_param, startDtPlan, endDtPlan
  );
  const listPlan = await repository.list.listPlan(
    user_id_param, sort, limit, page, startDtPlan, endDtPlan
  );

  const finalResult = await Promise.all(listPlan.map(async (plan) => {
    const startDt = plan.food_plan_startDt;
    const endDt = plan.food_plan_endDt;

    const listReal = await repository.list.list (
      user_id_param, startDt, endDt
    );

    const foodTotalKcal = listReal.reduce((acc, curr) => (
      acc + (curr?.food_total_kcal ?? 0)
    ), 0);
    const foodTotalCarb = listReal.reduce((acc, curr) => (
      acc + (curr?.food_total_carb ?? 0)
    ), 0);
    const foodTotalProtein = listReal.reduce((acc, curr) => (
      acc + (curr?.food_total_protein ?? 0)
    ), 0);
    const foodTotalFat = listReal.reduce((acc, curr) => (
      acc + (curr?.food_total_fat ?? 0)
    ), 0);

    return {
      ...plan,
      food_total_kcal: foodTotalKcal,
      food_total_carb: foodTotalCarb,
      food_total_protein: foodTotalProtein,
      food_total_fat: foodTotalFat
    };
  }));

  return {
    totalCnt: totalCnt,
    result: finalResult
  };
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = async (
  user_id_param, _id_param, duration_param
) => {

  const [startDt_param, endDt_param] = duration_param.split(` ~ `);

  const finalResult = await repository.detail.detail(
    user_id_param, _id_param, startDt_param, endDt_param
  );

  return finalResult
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (
  user_id_param, OBJECT_param, duration_param
) => {

  const [startDt_param, endDt_param] = duration_param.split(` ~ `);

  const findResult = await repository.save.detail(
    user_id_param, "", startDt_param, endDt_param
  );

  let finalResult;
  if (!findResult) {
    finalResult = await repository.save.create(
      user_id_param, OBJECT_param, startDt_param, endDt_param
    );
  }
  else {
    finalResult = await repository.save.update(
      user_id_param, findResult._id, OBJECT_param, startDt_param, endDt_param
    );
  }

  return finalResult
};

// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = async (
  user_id_param, _id_param, duration_param
) => {

  const [startDt_param, endDt_param] = duration_param.split(` ~ `);

  const findResult = await repository.deletes.detail(
    user_id_param, _id_param, startDt_param, endDt_param
  );

  if (!findResult) {
    return null;
  }
  else {
    await repository.deletes.deletes(
      user_id_param, _id_param
    );
    return "deleted";
  }
}