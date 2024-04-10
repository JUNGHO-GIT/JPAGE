// SleepSaveReal.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import moment from "moment-timezone";
import {BiCaretLeft, BiCaretRight} from "react-icons/bi";

// ------------------------------------------------------------------------------------------------>
export const SleepSaveReal = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_SLEEP = process.env.REACT_APP_URL_SLEEP;
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD");
  const navParam = useNavigate();
  const location = useLocation();
  const location_date = location?.state?.date;
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname;
  const STATE = {
    refresh:0,
    toList:"/sleep/list/real",
    id: "",
    date: ""
  };

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:sectionCount, set:setSectionCount} = useStorage(
    `sectionCount(${PATH})`, 0
  );

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:strStartDate, set:setStrStartDate} = useStorage(
    `strStartDate(${PATH})`, koreanDate
  );
  const {val:strEndDate, set:setStrEndDate} = useStorage(
    `strEndDate(${PATH})`, koreanDate
  );
  const {val:strDate, set:setStrDate} = useStorage(
    `strDate(${PATH})`, location_date
  );
  const {val:strDur, set:setStrDur} = useStorage(
    `strDur(${PATH})`, `${location_date} ~ ${location_date}`
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [SLEEP_DEFAULT, setSLEEP_DEFAULT] = useState({
    _id: "",
    sleep_number: 0,
    sleep_date: "",
    sleep_real : {
      sleep_section: [{
        sleep_night: "",
        sleep_morning: "",
        sleep_time: "",
      }],
    }
  });
  const [SLEEP, setSLEEP] = useState({
    _id: "",
    sleep_number: 0,
    sleep_date: "",
    sleep_real : {
      sleep_section: [{
        sleep_night: "",
        sleep_morning: "",
        sleep_time: "",
      }],
    }
  });

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setStrDate(location_date);
    setStrDur(`${location_date} ~ ${location_date}`);
  }, [location_date]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setStrDur(`${strDate} ~ ${strDate}`);
    setSLEEP((prev) => ({
      ...prev,
      sleep_date: strDur
    }));
  }, [strDate]);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_SLEEP}/detail`, {
      params: {
        _id: "",
        user_id: user_id,
        sleep_dur: strDur,
        planYn: "N",
      },
    });

    setSectionCount(response.data.sectionCount === 0 ? 1 : response.data.sectionCount);
    setSLEEP(response.data.result ? response.data.result : SLEEP_DEFAULT);

  })()}, [strDur]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const startTime = SLEEP.sleep_real?.sleep_section.map((item) => item?.sleep_night)?.toString();
    const endTime = SLEEP.sleep_real?.sleep_section.map((item) => item?.sleep_morning)?.toString();

    if (startTime && endTime) {
      const startDate = new Date(`${strDate}T${startTime}`);
      const endDate = new Date(`${strDate}T${endTime}`);

      // 종료 시간이 시작 시간보다 이전이면, 다음 날로 설정
      if (endDate < startDate) {
        endDate.setDate(endDate.getDate() + 1);
      }

      // 차이 계산
      const diff = endDate.getTime() - startDate.getTime();
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const time = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

      setSLEEP((prev) => ({
        ...prev,
        sleep_real: {
          sleep_section: [{
            ...prev?.sleep_real?.sleep_section[0],
            sleep_time: time,
          }]
        },
      }));
    }
  }, [strStartDate, strEndDate]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {

    const response = await axios.post(`${URL_SLEEP}/save`, {
      user_id: user_id,
      SLEEP: SLEEP,
      sleep_dur: strDur,
      planYn: "N",
    });
    if (response.data === "success") {
      alert("Save a work successfully");
      navParam(STATE.toList);
    }
    else {
      alert(`${response.data}error`);
    }
  };

  // 4. view -------------------------------------------------------------------------------------->
  const viewNode = () => {

    const calcDate = (days) => {
      const date = new Date(strDate);
      date.setDate(date.getDate() + days);
      setStrDate(moment(date).tz("Asia/Seoul").format("YYYY-MM-DD"));
    };

    return (
      <div className="d-inline-flex">
        <div onClick={() => calcDate(-1)}>
          <BiCaretLeft className="me-10 mt-10 fs-20 pointer" />
        </div>
        <DatePicker
          dateFormat="yyyy-MM-dd"
          popperPlacement="bottom"
          selected={new Date(strDate)}
          onChange={(date) => {
            setStrDate(moment(date).tz("Asia/Seoul").format("YYYY-MM-DD"));
          }}
        />
        <div onClick={() => calcDate(1)}>
          <BiCaretRight className="ms-10 mt-10 fs-20 pointer" />
        </div>
      </div>
    );
  };

  // 6. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    return (
      <div>
        <div className="row d-center">
          <div className="col-6">
            <div className="input-group">
              <span className="input-group-text">취침시간</span>
              <TimePicker
                id="sleep_night"
                name="sleep_night"
                className="form-control"
                disableClock={false}
                clockIcon={null}
                format="HH:mm"
                locale="ko"
                value={(SLEEP.sleep_real.sleep_section)?.map((item) => item.sleep_night)}
                onChange={(e) => {
                  setStrStartDate(e);
                  setSLEEP((prev) => ({
                    ...prev,
                    sleep_real: {
                      sleep_section: [{
                        ...prev.sleep_real.sleep_section[0],
                        sleep_night: e ? e.toString() : "",
                      }]
                    },
                  }));
                }}
              />
            </div>
          </div>
        </div>
        <div className="row d-center mt-3">
          <div className="col-6">
            <div className="input-group">
              <span className="input-group-text">기상시간</span>
              <TimePicker
                id="sleep_morning"
                name="sleep_morning"
                className="form-control"
                disableClock={false}
                clockIcon={null}
                format="HH:mm"
                locale="ko"
                value={(SLEEP.sleep_real.sleep_section)?.map((item) => item.sleep_morning)}
                onChange={(e) => {
                  setStrEndDate(e);
                  setSLEEP((prev) => ({
                    ...prev,
                    sleep_real: {
                      sleep_section: [{
                        ...prev.sleep_real.sleep_section[0],
                        sleep_morning: e ? e.toString() : "",
                      }]
                    },
                  }));
                }}
              />
            </div>
          </div>
        </div>
        <div className="row d-center mt-3">
          <div className="col-6">
            <div className="input-group">
              <span className="input-group-text">수면시간</span>
              <TimePicker
                id="sleep_time"
                name="sleep_time"
                className="form-control"
                disableClock={false}
                disabled={true}
                clockIcon={null}
                format="HH:mm"
                locale="ko"
                value={(SLEEP.sleep_real.sleep_section)?.map((item) => item.sleep_time)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    function buttonSave () {
      return (
        <button
          type="button"
          className="btn btn-sm btn-primary me-2"
          onClick={() => {
            flowSave();
          }}
        >
          Save
        </button>
      );
    };
    function buttonReset () {
      return (
        <button
          type="button"
          className="btn btn-sm btn-success me-2"
          onClick={() => {
            navParam(STATE.refresh);
          }}
        >
          Refresh
        </button>
      );
    };
    function buttonList () {
      return (
        <button
          type="button"
          className="btn btn-sm btn-secondary me-2"
          onClick={() => {
            navParam(STATE.toList);
          }}
        >
          List
        </button>
      );
    };
    return (
      <div className="d-inline-flex">
        {buttonSave()}
        {buttonReset()}
        {buttonList()}
      </div>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className="root-wrapper">
      <div className="container-wrapper">
        <div className="row mb-20 d-center">
          <div className="col-12">
            <h1>Save (List)</h1>
          </div>
        </div>
        <div className="row d-center mb-20">
          <div className="col-12">
            {viewNode()}
          </div>
        </div>
        <div className="row d-center mt-5 mb-20">
          <div className="col-12">
            {tableNode()}
          </div>
        </div>
        <div className="row d-center">
          <div className="col-12">
            {buttonNode()}
          </div>
        </div>
      </div>
    </div>
  );
};
