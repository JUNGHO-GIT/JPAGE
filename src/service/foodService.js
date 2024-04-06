// foodService.js

import mongoose from "mongoose";
import moment from "moment";
import {JSDOM} from "jsdom";
import axios from "axios";
import {Food} from "../schema/Food.js";

// 1-0. search ------------------------------------------------------------------------------------>
export const search = async (
  user_id_param,
  filter_param
) => {

  const URL_SEARCH = encodeURI(`http://www.fatsecret.kr/칼로리-영양소/search`);
  const query = filter_param.query;
  const page = filter_param.page;
  let finalResult = [];
  let pageCount = 0;
  let serv, gram;
  let servArray = [
    "개", "회", "알", "통", "봉", "컵", "팩", "줄", "장",
    "마리", "인분", "봉지", "한컵", "대접", "접시",
    "소접시", "테이블스푼"
  ];

  function getSearchResult () {
    return new Promise((resolve, reject) => {
      axios.get(URL_SEARCH, {
        params: {
          q: query,
          pg: page,
        },
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
    });
  };

  const searchResult = await getSearchResult();
  const document = new JSDOM(searchResult).window.document;
  const tables = document.querySelectorAll(`table.generic.searchResult`);

  function calcServ(param) {
    const regex = /(\s*)(\d+\s*.*\n*)(\s*당\s*-\s*)(\s*칼\s*로\s*리\s*[:]\s*)(\d+\s*.*\n*)(kcal)(\s*[|]\s*)(\s*지\s*방\s*[:]\s*)(\d+\s*.*\n*)(g)(\s*[|]\s*)(\s*탄\s*수\s*화\s*물\s*[:]\s*)(\d+\s*.*\n*)(g)(\s*[|]\s*)(\s*단\s*백\s*질\s*[:]\s*)(\d+\s*.*\n*)(g)/;
    const matches = param.match(regex);

    if (matches) {
      let found = false;
      // 1. servArray에 포함된 단어가 있는 경우
      servArray.forEach((el) => {
        if (matches[2].includes(el)) {
          const idx = matches[2].indexOf(el);
          const gramMatch = matches[2].slice(idx + el.length).trim().match(/(\d+)\s*g/);
          serv = matches[2].slice(0, idx + el.length).replace(/(\d+)\s+(.+)/, "$1$2").trim();
          gram  = gramMatch ? gramMatch[1] : "-";
          found = true;
        }
      });

      // 2. servArray에 포함된 단어가 없는 경우, gram 정보 직접 확인
      if (!found) {
        const gramDirectMatch = param.trim().match(/(\d+)\s*g/);
        if (gramDirectMatch) {
          serv = "1회";
          gram = gramDirectMatch[1];
        }
        else {
          const gramMatch = matches[2].trim().match(/(\d+)\s*g/);
          serv = matches ? matches[2].replace(/(\d+)\s+(.+)/, "$1$2").trim() : "1회";
          gram = gramMatch ? gramMatch[1] : "-";
        }
      }
    }
    return {
      serv: serv,
      gram: gram,
      kcal: matches ? matches[5] : "-",
      fat: matches ? matches[9] : "-",
      carb: matches ? matches[13] : "-",
      protein: matches ? matches[17] : "-",
    };
  };

  tables.forEach((param) => {
    const rows = param.querySelectorAll("tr");
    Array.from(rows).forEach((prev) => {
      const titleElement = prev.querySelector("a.prominent")?.textContent?.trim();
      const brandElement = prev.querySelector("a.brand")?.textContent?.trim();
      const nutritionElement = calcServ(prev.querySelector("div.smallText.greyText.greyLink")?.textContent?.trim());

      finalResult.push({
        title: titleElement,
        brand: brandElement,
        serv: nutritionElement.serv,
        gram: nutritionElement.gram,
        kcal: nutritionElement.kcal,
        fat: nutritionElement.fat,
        carb: nutritionElement.carb,
        protein: nutritionElement.protein,
      });

      const count = document.querySelector(".searchResultSummary")?.textContent;
      pageCount = count ? Math.ceil(parseInt(count.split("중")[0].trim(), 10) / 10) : 0;
    });
  });

  return {
    pageCount: pageCount,
    result: finalResult,
  };
};

// 1-1. list -------------------------------------------------------------------------------------->
export const list = async (
  user_id_param,
  food_dur_param,
  filter_param
) => {

  const [startDay, endDay] = food_dur_param.split(` ~ `);

  const filter = filter_param.order;
  const page = filter_param.page === 0 ? 1 : filter_param.page;
  const limit = filter_param.limit === 0 ? 5 : filter_param.limit;
  const sort = filter === "asc" ? 1 : -1;

  const findResult = Food.find({
    user_id: user_id_param,
    food_date: {
      $gte: startDay,
      $lte: endDay,
    }
  })

  const finalResult = await findResult
  .sort({food_date: sort})
  .skip((page - 1) * limit)
  .limit(limit);

  const totalCount = await Food.countDocuments(findResult);

  return {
    totalCount: totalCount,
    result: finalResult,
  };
};

// 2. detail -------------------------------------------------------------------------------------->
export const detail = async (
  _id_param,
  user_id_param,
  food_dur_param,
  planYn_param
) => {

  const [startDay, endDay] = food_dur_param.split(` ~ `);

  const finalResult = await Food.findOne({
    _id: _id_param === "" ? {$exists: true} : _id_param,
    user_id: user_id_param,
    food_date: {
      $gte: startDay,
      $lte: endDay,
    },
  });

  const realCount = finalResult?.food_real?.food_section.length || 0;
  const planCount = finalResult?.food_plan?.food_section.length || 0;

  return {
    realCount: realCount,
    planCount: planCount,
    result: finalResult,
  };
};

// 3. save ---------------------------------------------------------------------------------------->
export const save = async (
  user_id_param,
  FOOD_param,
  food_dur_param,
  planYn_param
) => {

  const [startDay, endDay] = food_dur_param.split(` ~ `);

  const findResult = await Food.findOne({
    user_id: user_id_param,
    food_date: {
      $gte: startDay,
      $lte: endDay,
    },
  });

  let finalResult;
  if (!findResult) {
    const createQuery = {
      _id: new mongoose.Types.ObjectId(),
      user_id: user_id_param,
      food_date: startDay,
      food_real: FOOD_param.food_real,
      food_plan: FOOD_param.food_plan,
      food_regdate: moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss"),
      food_update: "",
    };
    finalResult = await Food.create(createQuery);
  }
  else {
    const updateQuery = {
      _id: findResult._id
    };
    const updateAction = planYn_param === "Y"
    ? {$set: {
      food_plan: FOOD_param.food_plan,
      food_update: moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss"),
    }}
    : {$set: {
      food_real: FOOD_param.food_real,
      food_update: moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss"),
    }}

    finalResult = await Food.updateOne(updateQuery, updateAction);
  }

  return {
    result: finalResult,
  };
};

// 4. deletes ------------------------------------------------------------------------------------->
export const deletes = async (
  _id_param,
  user_id_param,
  food_dur_param,
  planYn_param
) => {

  const [startDay, endDay] = food_dur_param.split(` ~ `);

  const updateResult = await Food.updateOne(
    {
      user_id: user_id_param,
      food_date: {
        $gte: startDay,
        $lte: endDay,
      },
    },
    {
      $pull: {
        [`food_${planYn_param === "Y" ? "plan" : "real"}.food_section`]: {
          _id: _id_param
        },
      },
      $set: {
        food_update: moment().tz("Asia/Seoul").format("YYYY-MM-DD / HH:mm:ss"),
      },
    },
    {
      arrayFilters: [{
        "elem._id": _id_param
      }],
    }
  );

  let finalResult;
  if (updateResult.modifiedCount > 0) {
    const doc = await Food.findOne({
      user_id: user_id_param,
      food_date: {
        $gte: startDay,
        $lte: endDay,
      },
    });

    if (
      doc
      && (!doc.food_plan?.food_section || doc.food_plan?.food_section.length === 0)
      && (!doc.food_real?.food_section || doc.food_real?.food_section.length === 0)
    ) {
      finalResult = await Food.deleteOne({
        _id: doc._id
      });
    }
  }

  return {
    result: finalResult
  };
};
