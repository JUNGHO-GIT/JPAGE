// workMiddleware.js

import {strToDecimal, decimalToStr} from "../assets/common/date.js";

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (object) => {

  console.log("==========================================================");
  console.log(JSON.stringify(object));

  if (object === "deleted") {
    return {};
  }
  else {
    let totalVolume = 0;
    let totalTime = 0.0;

    object?.work_section?.map((item) => {
      totalVolume += item.work_set * item.work_rep * item.work_kg;
      totalTime += strToDecimal(item.work_cardio);
    });

    object.work_total_volume = totalVolume;
    object.work_total_time = decimalToStr(totalTime);

    return object;
  }
};