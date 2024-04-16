// FoodPlan.js

import mongoose from "mongoose";
import {incrementSeq} from "./CounterPlan.js";

// 1. schema -------------------------------------------------------------------------------------->
const schema = new mongoose.Schema({
  user_id: {
    type: String,
    default: "",
    required: true
  },
  food_plan_number: {
    type : Number,
    unique : true
  },

  food_plan_startDt: {
    type: String,
    default: "",
    required: false
  },
  food_plan_endDt: {
    type: String,
    default: "",
    required: false
  },

  food_plan_kcal: {
    type: Number,
    default: 0,
    required: false
  },
  food_plan_carb: {
    type: Number,
    default: 0,
    required: false
  },
  food_plan_protein: {
    type: Number,
    default: 0,
    required: false
  },
  food_plan_fat: {
    type: Number,
    default: 0,
    required: false
  },

  food_plan_regdate: {
    type: String,
    default: "",
    required: false
  },
  food_plan_update: {
    type: String,
    default: "",
    required: false
  }
});

// 3. counter ------------------------------------------------------------------------------------->
// @ts-ignore
schema.pre("save", async function(next) {
  if (this.isNew) {
    this.food_plan_number = await incrementSeq("food_plan_number", "FoodPlan");
  }
  next();
});

// 5. model --------------------------------------------------------------------------------------->
export const FoodPlan = mongoose.model(
  "FoodPlan", schema, "foodPlan"
);