// User.js

import mongoose from "mongoose";
import moment from "moment-timezone";
import {incrementSeq} from "./Counter.js";

// 1. schema -------------------------------------------------------------------------------------->
const schema = new mongoose.Schema({

  // 1. id
  _id : {
    type : mongoose.Schema.Types.ObjectId,
    required : false
  },
  user_number : {
    type : Number,
    unique : true
  },
  user_id : {
    type : String,
    required : false
  },
  user_pw : {
    type : String,
    required : false
  },

  // 3. date
  user_regdate : {
    type : String,
    default : () => {
      return moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss");
    },
    required : false
  },
  user_update : {
    type : String,
    default : () => {
      return moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss");
    },
    required : false
  }
});

// 2. counter ------------------------------------------------------------------------------------->
schema.pre("save", async function(next) {
  if (this.isNew) {
    this.user_number = await incrementSeq("user_number", "User");
  }
  next();
});

// 3. model --------------------------------------------------------------------------------------->
export const User = mongoose.model(
  "User", schema
);