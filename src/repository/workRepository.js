// workPlanRepository.js

import mongoose from "mongoose";
import {Work} from "../schema/Work.js";
import {fmtDate} from "../assets/common/common.js";

// 0-1. totalCnt ---------------------------------------------------------------------------------->
export const totalCnt = async (
  user_id_param,
  part_param,
  title_param,
  startDt_param,
  endDt_param
) => {

  const finalResult = await Work.countDocuments({
    user_id: user_id_param,
    work_startDt: {
      $gte: startDt_param,
    },
    work_endDt: {
      $lte: endDt_param,
    },
    ...(part_param !== "전체" && {
      "work_section.work_part_val": part_param
    }),
    ...(title_param !== "전체" && {
      "work_section.work_title_val": title_param
    }),
  });

  return finalResult;
};

// 1. list ---------------------------------------------------------------------------------------->
export const list = {
  find: async (
    user_id_param,
    part_param,
    title_param,
    sort_param,
    limit_param,
    page_param,
    startDt_param,
    endDt_param
  ) => {
    const finalResult = await Work.aggregate([
      {$match: {
        user_id: user_id_param,
        work_startDt: {
          $gte: startDt_param,
          $lte: endDt_param
        },
        work_endDt: {
          $gte: startDt_param,
          $lte: endDt_param
        },
        ...(part_param !== "전체" && {
          "work_section.work_part_val": part_param
        }),
        ...(title_param !== "전체" && {
          "work_section.work_title_val": title_param
        }),
      }},
      {$project: {
        work_startDt: 1,
        work_endDt: 1,
        work_start: 1,
        work_end: 1,
        work_time: 1,
        work_total_volume: 1,
        work_total_cardio: 1,
        work_body_weight: 1,
        work_section: {
          $filter: {
            input: "$work_section",
            as: "section",
            cond: {
              $and: [
                part_param === "전체"
                ? {$ne: ["$$section.work_part_val", null]}
                : {$eq: ["$$section.work_part_val", part_param]},
                title_param === "전체"
                ? {$ne: ["$$section.work_title_val", null]}
                : {$eq: ["$$section.work_title_val", title_param]}
              ]
            }
          }
        }
      }},
      {$sort: {work_startDt: sort_param}},
      {$skip: (Number(page_param) - 1) * Number(limit_param)},
      {$limit: Number(limit_param)}
    ]);

    return finalResult;
  },
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = {
  detail: async (
    _id_param,
    user_id_param,
    startDt_param,
    endDt_param
  ) => {
    const finalResult = await Work.findOne({
      _id: _id_param === "" ? {$exists:true} : _id_param,
      user_id: user_id_param,
      work_startDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
      work_endDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      }
    })
    .lean();

    return finalResult;
  },
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = {
  detail: async (
    _id_param,
    user_id_param,
    startDt_param,
    endDt_param
  ) => {
    const finalResult = await Work.findOne({
      _id: _id_param === "" ? {$exists:true} : _id_param,
      user_id: user_id_param,
      work_startDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      },
      work_endDt: {
        $gte: startDt_param,
        $lte: endDt_param,
      }
    })
    .lean();

    return finalResult;
  },
  create: async (
    user_id_param,
    WORK_param,
    startDt_param,
    endDt_param
  ) => {

    const finalResult = await Work.create({
      _id: new mongoose.Types.ObjectId(),
      user_id: user_id_param,
      work_startDt: startDt_param,
      work_endDt: endDt_param,
      work_start: WORK_param.work_start,
      work_end: WORK_param.work_end,
      work_time: WORK_param.work_time,
      work_total_volume: WORK_param.work_total_volume,
      work_total_cardio: WORK_param.work_total_cardio,
      work_body_weight: WORK_param.work_body_weight,
      work_section: WORK_param.work_section,
      work_regDt: fmtDate,
      work_upDt: "",
    });

    return finalResult;
  },
  update: async (
    _id_param, WORK_param
  ) => {
    const finalResult = await Work.findOneAndUpdate(
      {_id: _id_param
      },
      {$set: {
        ...WORK_param,
        work_plan_upDt: fmtDate,
      }},
      {upsert: true,
        new: true
      }
    )
    .lean();
    return finalResult;
  }
};


// 4. delete -------------------------------------------------------------------------------------->
export const deletes = {
  deletes: async (
    _id_param, user_id_param, startDt_param, endDt_param
  ) => {
    const updateResult = await Work.updateOne(
      {user_id: user_id_param,
        work_startDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
        work_endDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
      },
      {$pull: {
        work_section: {
          _id: _id_param
        },
      },
      $set: {
        work_upDt: fmtDate,
      }},
      {arrayFilters: [{
        "elem._id": _id_param
      }]}
    )
    .lean();

    let finalResult;

    if (updateResult.modifiedCount > 0) {
      const doc = await Work.findOne({
        user_id: user_id_param,
        work_startDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
        work_endDt: {
          $gte: startDt_param,
          $lte: endDt_param,
        },
      })
      .lean();

      if ((doc) && (!doc.work_section || doc.work_section.length === 0)) {
        finalResult = await Work.deleteOne({
          _id: doc._id
        })
        .lean();
      }
    };

    return finalResult;
  }
};