// Board.ts
import mongoose from "mongoose";
import moment from "moment-timezone";

const BoardScheme = new mongoose.Schema ({
  _id : {
    type : mongoose.Schema.Types.ObjectId,
    required : true
  },
  user_id : {
    type :String,
    required : true
  },
  board_title : {
    type : String,
    required : true
  },
  board_content :{
    type : String,
    required : true
  },
  board_regdate : {
    type : String,
    default : () => {
      return moment().tz("Asia/Seoul").format("YYYY-MM-DD");
    },
    required : true
  },
  board_update : {
    type : String,
    default : () => {
      return moment().tz("Asia/Seoul").format("YYYY-MM-DD");
    },
    required : true
  }
});

export default mongoose.model("Board", BoardScheme);