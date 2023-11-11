// SleepListMonth.tsx
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import { DayPicker, MonthChangeEventHandler } from "react-day-picker";
import { ko } from "date-fns/locale";
import moment from "moment-timezone";
import axios from "axios";
import { parseISO } from "date-fns";
import {useStorage} from "../../assets/ts/useStorage";

// 1. main ---------------------------------------------------------------------------------------->
export const SleepListMonth = () => {

  // title
  const TITLE = "Sleep List Month";
  // url
  const URL_SLEEP = process.env.REACT_APP_URL_SLEEP;
  // date
  const koreanDate = new Date(moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString());
  // hook
  const navParam = useNavigate();
  const location = useLocation();
  // val
  const user_id = window.sessionStorage.getItem("user_id");

  // 2-1. useState -------------------------------------------------------------------------------->
  const [sleepType, setSleepType] = useState<string> ("list");

  // 2-2. useStorage ------------------------------------------------------------------------------>
  const {val:SLEEP_LIST, setVal:setSLEEP_LIST} = useStorage<any> (
    "sleepListMonth", []
  );
  const {val:resVal, setVal:setResVal} = useStorage<Date | undefined> (
    "resValMonth", undefined
  );
  const {val:resDur, setVal:setResDur} = useStorage<string> (
    "resDurMonth", "0000-00-00 ~ 0000-00-00"
  );
  const {val:avgSleepTime, setVal:setAvgSleepTime} = useStorage<string> (
    "avgSleepTimeMonth", "00:00"
  );
  const {val:avgSleepNight, setVal:setAvgSleepNight} = useStorage<string> (
    "avgSleepNightMonth", "00:00"
  );
  const {val:avgSleepMorning, setVal:setAvgSleepMorning} = useStorage<string> (
    "avgSleepMorningMonth", "00:00"
  );
  const {val:sleepMonth, setVal:setSleepMonth} = useStorage<Date | undefined> (
    "sleepMonth", koreanDate
  );

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchSleepList = async () => {
      try {
        const response = await axios.get(`${URL_SLEEP}/sleepList`, {
          params: {
            user_id: user_id,
            sleep_dur: resDur,
          },
        });
        setSLEEP_LIST(response.data);
      }
      catch (error:any) {
        alert(`Error fetching sleep data: ${error.message}`);
        setSLEEP_LIST([]);
      }
    };
    fetchSleepList();
  }, [user_id, resDur]);

  // 2-4. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchSleepAvg = async () => {
      try {
        const response = await axios.get(`${URL_SLEEP}/sleepAvg`, {
          params: {
            user_id: user_id,
            sleep_dur: resDur,
          },
        });

        const isValidTime = (str: string) => {
          return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(str);
        };
        setAvgSleepTime (
          isValidTime(response.data.avgSleepTime)
          ? response.data.avgSleepTime
          : "00:00"
        );
        setAvgSleepNight (
          isValidTime(response.data.avgSleepNight)
          ? response.data.avgSleepNight
          : "00:00"
        );
        setAvgSleepMorning (
          isValidTime(response.data.avgSleepMorning)
          ? response.data.avgSleepMorning
          : "00:00"
        );
      }
      catch (error:any) {
        alert(`Error fetching sleep data: ${error.message}`);
        setAvgSleepTime("00:00");
        setAvgSleepNight("00:00");
        setAvgSleepMorning("00:00");
      }
    };
    fetchSleepAvg();
  }, [user_id, resDur]);

  // 2-5. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const formatVal = (value: number): string => {
      return value < 10 ? `0${value}` : `${value}`;
    };
    if (sleepMonth) {
      setResVal (
        parseISO (
          `${sleepMonth.getFullYear()}-${formatVal(sleepMonth.getMonth() + 1)}`
        )
      );
      setResDur (
        `${sleepMonth.getFullYear()}-${formatVal(sleepMonth.getMonth() + 1)}-01 ~ ${sleepMonth.getFullYear()}-${formatVal(sleepMonth.getMonth() + 1)}-31`
      );
    }
    else {
      setResVal (undefined);
    }
  }, [sleepMonth]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowMonthChange: MonthChangeEventHandler = (day) => {
    const monthDate = new Date(day.getFullYear(), day.getMonth(), 1);
    setSleepMonth(monthDate);
  };

  // 4-1. logic ----------------------------------------------------------------------------------->
  const viewSleepMonth = () => {
    return (
      <DayPicker
        mode="default"
        showOutsideDays
        locale={ko}
        weekStartsOn={1}
        month={sleepMonth}
        onMonthChange={flowMonthChange}
        modifiersClassNames={{
          selected: "selected",
          disabled: "disabled",
          outside: "outside",
          inside: "inside",
        }}
      />
    );
  };

  // 5-1. table ----------------------------------------------------------------------------------->
  const tableSleepList = () => {
    return (
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>날짜</th>
            <th>기간</th>
            <th>취침</th>
            <th>기상</th>
            <th>수면</th>
          </tr>
        </thead>
        <tbody>
          {SLEEP_LIST.map((index:any) => (
            <tr key={index._id}>
              <td className="pointer" onClick={() => {
                navParam("/sleepDetail", {
                  state: {_id: index._id}
                }
              )}}>
                {index.sleepDay}
              </td>
              <td>{resDur}</td>
              <td>{index.sleep_night}</td>
              <td>{index.sleep_morning}</td>
              <td>{index.sleep_time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // 5-2. table ----------------------------------------------------------------------------------->
  const tableSleepAvg = () => {
    return (
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>취침 평균</th>
            <th>기상 평균</th>
            <th>수면 평균</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{avgSleepNight}</td>
            <td>{avgSleepMorning}</td>
            <td>{avgSleepTime}</td>
          </tr>
        </tbody>
      </table>
    );
  };

  // 6. button ------------------------------------------------------------------------------------>
  const buttonSleepToday = () => {
    return (
      <button className="btn btn-sm btn-success me-2" onClick={() => {
        setSleepMonth(koreanDate);
        localStorage.removeItem("sleepList");
        localStorage.removeItem("sleepMonth");
      }}>
        Today
      </button>
    );
  };
  const buttonSleepReset = () => {
    return (
      <button className="btn btn-sm btn-primary me-2" onClick={() => {
        setSleepMonth(undefined);
        localStorage.removeItem("sleepList");
        localStorage.removeItem("sleepMonth");
      }}>
        Reset
      </button>
    );
  };

  // 6-2. button ---------------------------------------------------------------------------------->
  const selectSleepList = () => {
    const currentPath = location.pathname || "";
    return (
      <div className="mb-3">
        <select className="form-select" id="sleepList" value={currentPath} onChange={(e:any) => {navParam(e.target.value);}}>
          <option value="/sleepListDay">Day</option>
          <option value="/sleepListWeek">Week</option>
          <option value="/sleepListMonth">Month</option>
          <option value="/sleepListYear">Year</option>
          <option value="/sleepListSelect">Select</option>
        </select>
      </div>
    );
  };
  const selectSleepType = () => {
    return (
      <div className="mb-3">
        <select className="form-select" id="sleepType" onChange={(e:any) => {
          if (e.target.value === "list") {
            setSleepType("list");
          }
          else if (e.target.value === "avg") {
            setSleepType("avg");
          }
        }}>
          <option value="list">List</option>
          <option value="avg">Avg</option>
        </select>
      </div>
    );
  };


  // 7. return ------------------------------------------------------------------------------------>
  return (
    <div className="container">
      <div className="row d-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-9">{TITLE}</h1>
          <h2 className="mb-3 fw-9">월별로 조회</h2>
        </div>
      </div>
      <div className="row d-center mt-3">
        <div className="col-3">{selectSleepList()}</div>
        <div className="col-3">{selectSleepType()}</div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-md-6 col-12 d-center">
          {viewSleepMonth()}
        </div>
        <div className="col-md-6 col-12">
          {sleepType === "list" && tableSleepList()}
          {sleepType === "avg" && tableSleepAvg()}
        </div>
      </div>
      <div className="row mb-20">
        <div className="col-12 d-center">
          {buttonSleepToday()}
          {buttonSleepReset()}
        </div>
      </div>
    </div>
  );
};