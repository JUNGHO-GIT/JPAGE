// FoodPlanDetail.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import {useDate} from "../../assets/hooks/useDate.jsx";
import axios from "axios";
import {ButtonNode} from "../../assets/fragments/ButtonNode.jsx";

// ------------------------------------------------------------------------------------------------>
export const FoodPlanDetail = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_FOOD_PLAN = process.env.REACT_APP_URL_FOOD_PLAN;
  const user_id = window.sessionStorage.getItem("user_id");
  const navParam = useNavigate();
  const location = useLocation();
  const location_id = location?.state?.id?.trim()?.toString();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:SEND, set:setSEND} = useStorage(
    `SEND(${PATH})`, {
      id: "",
      startDt: "",
      endDt: "",
      refresh: 0,
      toList:"/food/plan/list",
      toSave:"/food/plan/save"
    }
  );
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      startDt: location_startDt,
      endDt: location_endDt
    }
  );
  const {val:COUNT, set:setCOUNT} = useStorage(
    `COUNT(${PATH})`, {
      totalCnt: 0,
      sectionCnt: 0
    }
  );
  const {val:CALENDAR, set:setCALENDAR} = useStorage(
    `CALENDAR(${PATH})`, {
      calStartOpen: false,
      calEndOpen: false,
      calOpen: false,
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const FOOD_PLAN_DEFAULT = {
    _id: "",
    food_plan_number: 0,
    food_plan_startDt: "",
    food_plan_endDt: "",
    food_plan_kcal: 0,
    food_plan_carb: 0,
    food_plan_protein: 0,
    food_plan_fat: 0,
  };
  const [FOOD_PLAN, setFOOD_PLAN] = useState(FOOD_PLAN_DEFAULT);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_FOOD_PLAN}/detail`, {
      params: {
        _id: location_id,
        user_id: user_id,
        food_plan_dur: `${DATE.startDt} ~ ${DATE.endDt}`
      },
    });
    setFOOD_PLAN(response.data.result || FOOD_PLAN_DEFAULT);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: response.data.totalCnt || 0,
      sectionCnt: response.data.sectionCnt || 0
    }));
  })()}, [location_id, user_id, DATE.startDt, DATE.endDt]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowDelete = async (id) => {
    const response = await axios.delete(`${URL_FOOD_PLAN}/delete`, {
      params: {
        _id: id,
        user_id: user_id,
        food_plan_dur: `${DATE.startDt} ~ ${DATE.endDt}`
      },
    });
    if (response.data.status === "success") {
      const upDtdData = await axios.get(`${URL_FOOD_PLAN}/detail`, {
        params: {
          _id: location_id,
          user_id: user_id,
          food_plan_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
        },
      });
      alert(response.data.msg);
      setFOOD_PLAN(upDtdData.data.result || FOOD_PLAN_DEFAULT);
      upDtdData.data.result === null && navParam(SEND.toList);
    }
    else {
      alert(response.data.msg);
    }
  };

  // 5. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    return (
      <table className={"table bg-white table-hover"}>
        <thead className={"table-primary"}>
          <tr>
            <th>시작일</th>
            <th>종료일</th>
            <th>칼로리</th>
            <th>탄수화물</th>
            <th>단백질</th>
            <th>지방</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          <tr className={"fs-20 pt-20"}>
            <td>
              {FOOD_PLAN?.food_plan_startDt}
            </td>
            <td>
              {FOOD_PLAN?.food_plan_endDt}
            </td>
            <td>
              {FOOD_PLAN?.food_plan_kcal}
            </td>
            <td>
              {FOOD_PLAN?.food_plan_carb}
            </td>
            <td>
              {FOOD_PLAN?.food_plan_protein}
            </td>
            <td>
              {FOOD_PLAN?.food_plan_fat}
            </td>
            <td>
              <button className={"btn btn-sm btn-danger"} onClick={() => {
                flowDelete(FOOD_PLAN?._id);
              }}>
                X
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    return (
      <ButtonNode CALENDAR={CALENDAR} setCALENDAR={setCALENDAR} DATE={DATE} setDATE={setDATE}
        SEND={SEND} flowSave={""} navParam={navParam}
        part={"food"} plan={"plan"} type={"detail"}
      />
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className={"root-wrapper"}>
      <div className={"container-wrapper"}>
        <div className={"row d-center"}>
          <div className={"col-12 mb-20"}>
            <h1>Detail</h1>
          </div>
          <div className={"col-12 mb-20"}>
            {tableNode()}
          </div>
          <div className={"col-12 mb-20"}>
            {buttonNode()}
          </div>
        </div>
      </div>
    </div>
  );
};