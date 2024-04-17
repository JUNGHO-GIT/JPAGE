// WorkPlanSave.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import {useDate} from "../../assets/hooks/useDate.jsx";
import axios from "axios";
import {DateNode} from "../../assets/fragments/DateNode.jsx";
import {ButtonNode} from "../../assets/fragments/ButtonNode.jsx";

// ------------------------------------------------------------------------------------------------>
export const WorkPlanSave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_WORK_PLAN = process.env.REACT_APP_URL_WORK_PLAN;
  const user_id = window.sessionStorage.getItem("user_id");
  const navParam = useNavigate();
  const location = useLocation();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location?.pathname.trim().toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:SEND, set:setSEND} = useStorage(
    `SEND(${PATH})`, {
      id: "",
      startDt: "",
      endDt: "",
      refresh:0,
      toList:"/work/plan/list"
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
  const WORK_PLAN_DEFAULT = {
    _id: "",
    work_plan_number: 0,
    work_plan_startDt: "",
    work_plan_endDt: "",
    work_plan_total_count: "",
    work_plan_total_cardio: "",
    work_plan_total_volume: "",
    work_plan_body_weight: "",
    work_plan_regDt: "",
    work_plan_upDt: "",
  };
  const [WORK_PLAN, setWORK_PLAN] = useState(WORK_PLAN_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_WORK_PLAN}/detail`, {
      params: {
        _id: "",
        user_id: user_id,
        work_plan_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    setWORK_PLAN(response.data.result || WORK_PLAN_DEFAULT);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: response.data.totalCnt || 0,
      sectionCnt: response.data.sectionCnt || 0,
    }));
  })()}, [user_id, DATE.startDt, DATE.endDt]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const response = await axios.post(`${URL_WORK_PLAN}/save`, {
      user_id: user_id,
      WORK_PLAN: WORK_PLAN,
      work_plan_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
    });
    if (response.data.status === "success") {
      alert(response.data.msg);
      SEND.startDt = DATE.startDt;
      SEND.endDt = DATE.endDt;
      navParam(SEND.toList, {
        state: SEND
      });
    }
    else {
      alert(response.data.msg);
    }
  };

  // 4. date -------------------------------------------------------------------------------------->
  const dateNode = () => {
    return (
      <DateNode DATE={DATE} setDATE={setDATE} part={"work"} plan={"plan"} type={"save"} />
    );
  };

  // 5. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    return (
      <div className={"row d-center mb-20"}>
        <div className={"col-12"}>
          <div className={"input-group"}>
            <span className={"input-group-text"}>목표 운동 횟수</span>
            <input type={"text"} className={"form-control"}
              value={WORK_PLAN?.work_plan_total_count}
              onChange={(e) => {
                setWORK_PLAN((prev) => ({
                  ...prev,
                  work_plan_total_count: e.target.value
                }));
              }}
            />
          </div>
        </div>
        <div className={"col-12"}>
          <div className={"input-group"}>
            <span className={"input-group-text"}>목표 유산소 시간</span>
            <input type={"text"} className={"form-control"}
              value={WORK_PLAN?.work_plan_total_cardio}
              onChange={(e) => {
                setWORK_PLAN((prev) => ({
                  ...prev,
                  work_plan_total_cardio: e.target.value
                }));
              }}
            />
          </div>
        </div>
        <div className={"col-12"}>
          <div className={"input-group"}>
            <span className={"input-group-text"}>목표 총 볼륨</span>
            <input type={"text"} className={"form-control"}
              value={WORK_PLAN?.work_plan_total_volume}
              onChange={(e) => {
                setWORK_PLAN((prev) => ({
                  ...prev,
                  work_plan_total_volume: e.target.value
                }));
              }}
            />
          </div>
        </div>
        <div className={"col-12"}>
          <div className={"input-group"}>
            <span className={"input-group-text"}>목표 체중</span>
            <input type={"text"} className={"form-control"}
              value={WORK_PLAN?.work_plan_body_weight}
              onChange={(e) => {
                setWORK_PLAN((prev) => ({
                  ...prev,
                  work_plan_body_weight: e.target.value
                }));
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    return (
      <ButtonNode CALENDAR={CALENDAR} setCALENDAR={setCALENDAR} DATE={DATE} setDATE={setDATE}
        SEND={SEND} flowSave={flowSave} navParam={navParam}
        part={"work"} plan={"plan"} type={"save"}
      />
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className={"root-wrapper"}>
      <div className={"container-wrapper"}>
        <div className={"row d-center"}>
          <div className={"col-12 mb-20"}>
            <h1>Save</h1>
          </div>
          <div className={"col-12 mb-20"}>
            {dateNode()}
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