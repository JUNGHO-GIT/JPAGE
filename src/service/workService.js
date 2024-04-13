// workService.js

import mongoose from "mongoose";
import moment from "moment";
import {Work} from "../schema/Work.js";

// 1. list ---------------------------------------------------------------------------------------->
export const list = async (
  user_id_param,
  work_dur_param,
  FILTER_param,
  PAGING_param
) => {

  const [startDay, endDay] = work_dur_param.split(` ~ `);
  const part = FILTER_param.part || "전체";
  const sort = FILTER_param.order === "asc" ? 1 : -1;
  const limit = FILTER_param.limit === 0 ? 5 : FILTER_param.limit;
  const page = PAGING_param.page === 0 ? 1 : PAGING_param.page;

  const findResult = await Work.find({
    user_id: user_id_param,
    work_startDt: {
      $gte: startDay,
      $lte: endDay,
    },
    work_endDt: {
      $gte: startDay,
      $lte: endDay,
    },
  })
  .sort({work_startDt: sort})
  .lean();

  let totalCnt = 0;
  const finalResult = findResult.map((work) => {
    if (work && work.work_section) {
      let sections = work.work_section.filter((section) => (
        part === "전체" ? true : section.work_part_val === part
      ));

      // 배열 갯수 누적 계산
      totalCnt += sections.length;

      // section 배열에서 페이지에 맞는 항목만 선택합니다.
      const startIdx = (limit * page - 1) - (limit - 1);
      const endIdx = (limit * page);
      sections = sections.slice(startIdx, endIdx);

      work.work_section = sections;
    }
    return work;
  });

  return {
    totalCnt: totalCnt,
    result: finalResult,
  };
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = async (
  _id_param,
  user_id_param,
  work_dur_param
) => {

  const [startDay, endDay] = work_dur_param.split(` ~ `);

  const finalResult = await Work.findOne({
    _id: _id_param === "" ? {$exists: true} : _id_param,
    user_id: user_id_param,
    work_startDt: {
      $gte: startDay,
      $lte: endDay,
    },
    work_endDt: {
      $gte: startDay,
      $lte: endDay,
    },
  })
    .lean();

  const sectionCnt = finalResult?.work_section?.length || 0;

  return {
    sectionCnt: sectionCnt,
    result: finalResult,
  };
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (
  user_id_param,
  WORK_param,
  work_dur_param
) => {

  const [startDay, endDay] = work_dur_param.split(` ~ `);

  const findResult = await Work.findOne({
    user_id: user_id_param,
    work_startDt: {
      $gte: startDay,
      $lte: endDay,
    },
    work_endDt: {
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
      work_startDt: startDay,
      work_endDt: endDay,
      work_section: WORK_param.work_section,
      work_regdate: moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss"),
      work_update: "",
    };
    finalResult = await Work.create(createQuery);
  }
  else {
    const updateQuery = {
      _id: findResult._id
    };
    const updateAction = {
      $set: {
        work_section: WORK_param.work_section,
        work_update: moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss"),
      }
    };
    finalResult = await Work.updateOne(updateQuery, updateAction).lean();
  }

  return {
    result: finalResult,
  };
};

// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = async (
  _id_param,
  user_id_param,
  work_dur_param
) => {

  const [startDay, endDay] = work_dur_param.split(` ~ `);

  const updateResult = await Work.updateOne(
    {
      user_id: user_id_param,
      work_startDt: {
        $gte: startDay,
        $lte: endDay,
      },
      work_endDt: {
        $gte: startDay,
        $lte: endDay,
      },
    },
    {
      $pull: {
        work_section: {
          _id: _id_param
        },
      },
      $set: {
        work_update: moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss"),
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
    const doc = await Work.findOne({
      user_id: user_id_param,
      work_startDt: {
        $gte: startDay,
        $lte: endDay,
      },
      work_endDt: {
        $gte: startDay,
        $lte: endDay,
      },
    })
    .lean();

    if (
      (doc) &&
      (!doc.work_section || doc.work_section.length === 0)
    ) {
      finalResult = await Work.deleteOne({
        _id: doc._id
      })
      .lean();
    }
  }

  return {
    result: finalResult
  };
};