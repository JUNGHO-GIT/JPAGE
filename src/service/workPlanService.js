// workPlanService.js

import * as repository from "../repository/workPlanRepository.js";
import {strToDecimal, decimalToStr, compareTime, compareCount} from "../assets/common/date.js";

// 1-1. list -------------------------------------------------------------------------------------->
export const list = async (
  user_id_param, duration_param, FILTER_param, PAGING_param
) => {

  const [startDtPlan, endDtPlan] = duration_param.split(` ~ `);

  const sort = FILTER_param.order === "asc" ? 1 : -1;
  const limit = FILTER_param.limit === 0 ? 5 : FILTER_param.limit;
  const page = PAGING_param.page === 0 ? 1 : PAGING_param.page;

  const totalCnt = await repository.totalCnt(
    user_id_param, startDtPlan, endDtPlan
  );
  const findPlan = await repository.list.findPlan(
    user_id_param, sort, limit, page, startDtPlan, endDtPlan
  );

  const finalResult = await Promise.all(findPlan.map(async (plan) => {
    const startDt = plan.work_plan_startDt;
    const endDt = plan.work_plan_endDt;

    const findReal = await repository.list.findReal(
      user_id_param, startDt, endDt
    );

    const workTotalCount = findReal.reduce((acc, curr) => (
      acc + (curr?.work_total_volume !== 1 ? 1 : 0)
    ), 0);
    const workTotalVolume = findReal.reduce((acc, curr) => (
      acc + (curr?.work_total_volume ?? 0)
    ), 0);
    const workTotalCardio = findReal.reduce((acc, curr) => (
      acc + strToDecimal(curr?.work_total_cardio ?? "00:00")
    ), 0);
    const workLessWeight = findReal.reduce((acc, curr) => (
      (curr.work_body_weight !== null && (acc === null || curr.work_body_weight < acc)) ? curr.work_body_weight : acc
    ), null);

    return {
      ...plan,
      work_total_count: workTotalCount,
      work_total_volume: workTotalVolume,
      work_total_cardio: decimalToStr(workTotalCardio),
      work_body_weight: workLessWeight
    };
  }));

  return {
    totalCnt: totalCnt,
    result: finalResult
  }
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = async (
  _id_param, user_id_param, duration_param
) => {

  const [startDt, endDt] = duration_param.split(` ~ `);

  const finalResult = await repository.detail.detail(
    _id_param, user_id_param, startDt, endDt
  );

  return finalResult
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (
  user_id_param, OBJECT_param, duration_param
) => {

  const [startDt, endDt] = duration_param.split(` ~ `);

  const findPlan = await repository.save.find(
    "", user_id_param, startDt, endDt
  );

  let finalResult;
  if (!findPlan) {
    finalResult = await repository.save.create(
      user_id_param, OBJECT_param, startDt, endDt
    );
  }
  else {
    finalResult = await repository.save.update(
      findPlan._id, OBJECT_param
    );
  }

  return finalResult
};

// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = async (
  _id_param, user_id_param, duration_param
) => {

  const [startDt, endDt] = duration_param.split(` ~ `);

  const findResult = await repository.deletes.detail(
    _id_param, user_id_param, startDt, endDt
  );

  if (!findResult) {
    return null;
  }
  else {
    await repository.deletes.deletes(
      _id_param
    );
    return "deleted";
  }
}