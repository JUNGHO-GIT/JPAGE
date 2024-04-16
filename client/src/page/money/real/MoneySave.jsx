// MoneySave.jsx

import React, {useState, useEffect, forwardRef} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../../assets/hooks/useStorage.jsx";
import {useDate} from "../../../assets/hooks/useDate.jsx";
import axios from "axios";
import {DateNode} from "../../../assets/fragments/DateNode.jsx";
import {ButtonNode} from "../../../assets/fragments/ButtonNode.jsx";

// ------------------------------------------------------------------------------------------------>
export const MoneySave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_MONEY = process.env.REACT_APP_URL_MONEY;
  const user_id = window.sessionStorage.getItem("user_id");
  const session = window.sessionStorage.getItem("dataset") || "";
  const moneyArray = JSON.parse(session)?.money || [];
  const navParam = useNavigate();
  const location = useLocation();
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
      toList:"/money/list"
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
  const MONEY_DEFAULT = {
    _id: "",
    money_number: 0,
    money_startDt: "",
    money_endDt: "",
    money_total_in: 0,
    money_total_out: 0,
    money_section: [{
      money_part_idx: 0,
      money_part_val: "",
      money_title_idx: 0,
      money_title_val: "",
      money_amount: 0,
      money_content: "",
    }]
  };
  const [MONEY, setMONEY] = useState(MONEY_DEFAULT);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_MONEY}/detail`, {
      params: {
        _id: "",
        user_id: user_id,
        money_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    setMONEY(response.data.result || MONEY_DEFAULT);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: response.data.totalCnt || 0,
      sectionCnt: response.data.sectionCnt || 0
    }));
  })()}, [user_id, DATE.startDt, DATE.endDt]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    // money_part_val 가 수입인경우, 지출인 경우
    const totals = MONEY?.money_section.reduce((acc, cur) => {
      return {
        totalIn: acc.totalIn + (cur.money_part_val === "수입" ? cur.money_amount : 0),
        totalOut: acc.totalOut + (cur.money_part_val === "지출" ? cur.money_amount : 0)
      };
    }, {totalIn: 0, totalOut: 0});

    setMONEY((prev) => ({
      ...prev,
      money_total_in: Math.round(totals.totalIn),
      money_total_out: Math.round(totals.totalOut)
    }));

  }, [MONEY?.money_section]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const response = await axios.post(`${URL_MONEY}/save`, {
      user_id: user_id,
      MONEY: MONEY,
      money_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
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
      <DateNode DATE={DATE} setDATE={setDATE} part={"money"} plan={""} type={"save"} />
    );
  };

  // 5. handler ----------------------------------------------------------------------------------->
  const handlerSectionCount = () => {
    function handlerCount(e) {
      let newCount = parseInt(e, 10);
      let defaultSection = {
        money_part_idx: 0,
        money_part_val: "전체",
        money_title_idx: 0,
        money_title_val: "전체",
        money_amount: 0,
        money_content: ""
      };

      setCOUNT((prev) => ({
        ...prev,
        sectionCnt: newCount
      }));

      if (newCount > 0) {
        let updatedSections = Array(newCount).fill(null).map((_, idx) =>
          idx < MONEY.money_section.length ? MONEY.money_section[idx] : defaultSection
        );
        setMONEY((prev) => ({
          ...prev,
          money_section: updatedSections
        }));
      }
      else {
        setMONEY((prev) => ({
          ...prev,
          money_section: []
        }));
      }
    };

    function inputFragment () {
      return (
        <div className={"row d-center"}>
          <div className={"col-4"}>
            <input
              type={"number"}
              value={COUNT.sectionCnt}
              min={0}
              className={"form-control mb-30"}
              onChange={(e) => (
                handlerCount(e.target.value)
              )}
            />
          </div>
        </div>
      );
    };
    return (
      <React.Fragment>
        {inputFragment()}
      </React.Fragment>
    );
  };

  // 5. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    function tableSection (i) {
      return (
        <div key={i} className={"mb-20"}>
          <div className={"row d-center"}>
            <div className={"col-6"}>
              <div className={"input-group"}>
                <span className={"input-group-text"}>파트</span>
                <select
                  className={"form-control"}
                  id={`money_part_idx-${i}`}
                  value={MONEY?.money_section[i]?.money_part_idx}
                  onChange={(e) => {
                    const newIndex = parseInt(e.target.value);
                    setMONEY((prev) => {
                      let updated = {...prev};
                      let updatedSection = [...updated.money_section];
                      updatedSection[i] = {
                        ...updatedSection[i],
                        money_part_idx: newIndex,
                        money_part_val: moneyArray[newIndex].money_part,
                        money_title_idx: 0,
                        money_title_val: moneyArray[newIndex].money_title[0],
                      };
                      updated.money_section = updatedSection;
                      return updated;
                    });
                  }}
                >
                  {moneyArray?.map((item, idx) => (
                    <option key={idx} value={idx}>
                      {item.money_part}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className={"col-6"}>
              <div className={"input-group"}>
                <span className={"input-group-text"}>타이틀</span>
                <select
                  className={"form-control"}
                  id={`money_title_idx-${i}`}
                  value={MONEY?.money_section[i]?.money_title_idx}
                  onChange={(e) => {
                    const newTitleIdx = parseInt(e.target.value);
                    const newTitleVal = moneyArray[MONEY?.money_section[i]?.money_part_idx]?.money_title[newTitleIdx];
                    if (newTitleIdx >= 0 && newTitleVal) {
                      setMONEY((prev) => {
                        let updated = {...prev};
                        let updatedSection = [...updated.money_section];
                        updatedSection[i] = {
                          ...updatedSection[i],
                          money_title_idx: newTitleIdx,
                          money_title_val: newTitleVal,
                        };
                        updated.money_section = updatedSection;
                        return updated;
                      });
                    }
                  }}
                >
                  {moneyArray[MONEY?.money_section[i]?.money_part_idx]?.money_title?.map((title, idx) => (
                    <option key={idx} value={idx}>
                      {title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className={"row d-center"}>
            <div className={"col-6"}>
              <div className={"input-group"}>
                <span className={"input-group-text"}>금액</span>
                <input
                  type={"number"}
                  className={"form-control"}
                  value={MONEY?.money_section[i]?.money_amount}
                  onChange={(e) => {
                    const newAmount = parseInt(e.target.value, 10);
                    setMONEY((prev) => {
                      let updated = {...prev};
                      let updatedSection = [...updated.money_section];
                      updatedSection[i].money_amount = isNaN(newAmount) ? 0 : newAmount;
                      updated.money_section = updatedSection;
                      return updated;
                    });
                  }}
                />
              </div>
            </div>
            <div className={"col-6"}>
              <div className={"input-group"}>
                <span className={"input-group-text"}>메모</span>
                <input
                  type={"text"}
                  className={"form-control"}
                  value={MONEY?.money_section[i]?.money_content}
                  onChange={(e) => {
                    const newContent = e.target.value;
                    setMONEY((prev) => {
                      let updated = {...prev};
                      let updatedSection = [...updated.money_section];
                      updatedSection[i].money_content = newContent;
                      return updated;
                    });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      );
    };
    function tableFragment () {
      return (
        <div className={"row d-center"}>
          <div className={"col-12"}>
            {Array.from({ length: COUNT.sectionCnt }, (_, i) => tableSection(i))}
          </div>
        </div>
      );
    };
    function tableRemain () {
      return (
        <div className={"row d-center"}>
          <div className={"col-6"}>
            <div className={"input-group"}>
              <span className={"input-group-text"}>총수입</span>
              <input
                type={"number"}
                className={"form-control"}
                value={MONEY?.money_total_in}
                disabled
                readOnly
              />
            </div>
          </div>
          <div className={"col-6"}>
            <div className={"input-group"}>
              <span className={"input-group-text"}>총지출</span>
              <input
                type={"number"}
                className={"form-control"}
                value={MONEY?.money_total_out}
                disabled
                readOnly
              />
            </div>
          </div>
        </div>
      );
    };
    return (
      <React.Fragment>
        {tableFragment()}
        {tableRemain()}
      </React.Fragment>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    return (
      <ButtonNode CALENDAR={CALENDAR} setCALENDAR={setCALENDAR} DATE={DATE} setDATE={setDATE}
        SEND={SEND} flowSave={flowSave} navParam={navParam}
        part={"money"} plan={""} type={"save"}
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
            {handlerSectionCount()}
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
