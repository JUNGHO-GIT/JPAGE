// WorkPlan.js

import mongoose from "mongoose";
import {incrementSeq} from "./CounterPlan.js";

// 1. schema -------------------------------------------------------------------------------------->
const schema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true
  },
  work_plan_number: {
    type : Number,
    unique : true
  },

  work_plan_startDt: {
    type: String,
    required: false
  },
  work_plan_endDt: {
    type: String,
    required: false
  },

  work_plan_total_count: {
    type: Number,
    required: false
  },
  work_plan_cardio_time: {
    type: String,
    required: false
  },
  work_plan_total_volume: {
    type: Number,
    required: false
  },
  work_plan_body_weight: {
    type: Number,
    required: false
  },

  work_plan_regdate: {
    type: String,
    required: false
  },
  work_plan_update: {
    type: String,
    required: false
  }
});

// 3. counter ------------------------------------------------------------------------------------->
// @ts-ignore
schema.pre("save", async function(next) {
  if (this.isNew) {
    this.work_plan_number = await incrementSeq("work_plan_number", "WorkPlan");
  }
  next();
});

// 5. model --------------------------------------------------------------------------------------->
export const WorkPlan = mongoose.model(
  "WorkPlan", schema, "workPlan"
);