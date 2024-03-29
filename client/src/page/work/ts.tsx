// WorkInsert.tsx

import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import moment from "moment-timezone";
import {workPartArray, workTitleArray} from "../work/WorkArray";
import {useStorage} from "../../assets/ts/useStorage";
import {useDeveloperMode} from "../../assets/ts/useDeveloperMode";

// ------------------------------------------------------------------------------------------------>
export const WorkInsert = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const TITLE = "Work Insert";
  const URL_WORK = process.env.REACT_APP_URL_WORK;
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString();
  const navParam = useNavigate();
  const user_id = window.sessionStorage.getItem("user_id");
  const {log} = useDeveloperMode();

  // 2-1. useStorage ------------------------------------------------------------------------------>
  const {val:workDay, setVal:setWorkDay} = useStorage (
    "workDay", new Date(koreanDate)
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [WORK, setWORK] = useState({});
  const [workCount, setWorkCount] = useState(1);
  const [work_section, setWorkSection] = useState<any[]>([{
    work_part_idx: 0,
    work_part_val: "전체",
    work_title_idx: 0,
    work_title_val: "전체",
  }]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setWORK ({
      ...WORK,
      workDay: moment(workDay).format("YYYY-MM-DD"),
      work_section : work_section,
    });
  }, [workDay, work_section]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    if (WORK.work_start && WORK.work_end) {
      const work_start = moment(WORK.work_start, "HH:mm");
      const work_end = moment(WORK.work_end, "HH:mm");
      let work_time_minutes = work_end.diff(work_start, "minutes");

      if (work_time_minutes < 0) {
        work_time_minutes = Math.abs(work_time_minutes);
      }

      const hours = Math.floor(work_time_minutes / 60);
      const minutes = work_time_minutes % 60;

      const work_time_formatted = `${String(hours).padStart(2, "0")} : ${String (
        minutes
      ).padStart(2, "0")}`;

      setWORK({ ...WORK, work_time: work_time_formatted });
    }
  }, [WORK.work_start, WORK.work_end]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowWorkInsert = async () => {
    try {
      if (!user_id) {
        alert("Input a ID");
        return;
      }
      if (!workDay) {
        alert("Input a Day");
        return;
      }
      if (!WORK.work_start) {
        alert("Input a Start");
        return;
      }
      if (!WORK.work_end) {
        alert("Input a End");
        return;
      }
      if (!WORK.work_time) {
        alert("Input a Time");
        return;
      }

      const response = await axios.post (`${URL_WORK}/workInsert`, {
        user_id : user_id,
        WORK : WORK,
      });
      log("WORK : " + JSON.stringify(response.data));

      if (response.data === "success") {
        alert("Insert a work successfully");
        navParam("/workListDay");
      }
      else {
        alert("Insert a work failure");
      }
    }
    catch (error:any) {
      alert(`Error inserting a work data: ${error.message}`);
    }
  };

  // 4-1. handler --------------------------------------------------------------------------------->
  const handleWorkPartChange = (i, e) => {
    const newIndex = parseInt(e.target.value);
    setWorkSection((prev[]) => {
      const updatedSection = [...prev];
      updatedSection[i] = {
        ...updatedSection[i],
        work_part_idx: newIndex,
        work_part_val: workPartArray[newIndex].work_part[0],
        work_title_idx: 0,
        work_title_val: workTitleArray[newIndex].work_title[0],
      };
      return updatedSection;
    });
  };

  // 4-2. handler --------------------------------------------------------------------------------->
  const handleWorkTitleChange = (i, e) => {
    let newTitle = e.target.value;
    setWorkSection((prev[]) => {
      let updatedSection = [...prev];
      updatedSection[i].work_title_val = newTitle;
      return updatedSection;
    });
  };

  // 4-3. handler --------------------------------------------------------------------------------->
  const handleWorkCountChange = () => {
    return (
      <div>
        <div className="row d-center">
          <div className="col-4">
            <input type="number" value={workCount} min="1" className="form-control mb-30"
            onChange={(e:any) => {
              let defaultSection = {
                work_part_idx: 0,
                work_part_val: "전체",
                work_title_idx: 0,
                work_title_val: "전체",
              };
              let newCount = parseInt(e.target.value);

              // count 값이 증가했을 때 새로운 섹션들만 추가
              if (newCount > workCount) {
                let additionalSections = Array(newCount - workCount).fill(defaultSection);
                setWorkSection(prev => [...prev, ...additionalSections]);
              }
              // count 값이 감소했을 때 마지막 섹션부터 제거
              else if (newCount < workCount) {
                setWorkSection(prev => prev.slice(0, newCount));
              }
              // workCount 값 업데이트
              setWorkCount(newCount);
            }}/>
          </div>
        </div>
        <div className="row d-center">
          <div className="col-12">
            {Array.from({length: workCount}, (_, i) => tableWorkSection(i))}
          </div>
        </div>
      </div>
    );
  };

  // 4. view -------------------------------------------------------------------------------------->
  const viewWorkDay = () => {
    const calcDate = (days) => {
      setWorkDay((prevDate) => {
        const newDate = prevDate ? new Date(prevDate) : new Date();
        newDate.setDate(newDate.getDate() + days);
        return newDate;
      });
    };
    return (
      <div className="d-inline-flex">
        <div className="black mt-4 me-5 pointer" onClick={() => calcDate(-1)}>
          &#8592;
        </div>
        <DatePicker
          dateFormat="yyyy-MM-dd"
          popperPlacement="bottom"
          selected={workDay}
          onChange={(date) => {
            setWorkDay(date);
          }}
        />
        <div className="black mt-4 ms-5 pointer" onClick={() => calcDate(1)}>
          &#8594;
        </div>
      </div>
    );
  };

  // 5-1. table ----------------------------------------------------------------------------------->
  const tableWorkInsert = () => {
    return (
      <div>
        <div className="row d-center">
          <div className="col-5">
            <div className="input-group">
              <span className="input-group-text">ID</span>
              <input
                type="text"
                className="form-control"
                id="user_id"
                name="user_id"
                placeholder="ID"
                value={user_id ? user_id : ""}
                readOnly
                onChange={(e:any) => {
                  setWORK({ ...WORK, user_id: e.target.value });
                }}
              />
            </div>
          </div>
          <div className="col-5">
            <div className="input-group">
              <span className="input-group-text">Day</span>
              <input
                readOnly
                type="text"
                className="form-control"
                id="workDay"
                name="workDay"
                placeholder="Day"
                value={WORK?.workDay}
                onChange={(e:any) => {
                  setWorkDay(e.target.value);
                }}
              />
            </div>
          </div>
        </div>
        <div className="row d-center">
          <div className="col-5">
            <div className="input-group">
              <span className="input-group-text">Start</span>
              <TimePicker
                id="work_start"
                name="work_start"
                className="form-control"
                value={WORK?.work_start}
                disableClock={false}
                clockIcon={null}
                format="HH:mm"
                locale="ko"
                onChange={(e:any) => {
                  setWORK({ ...WORK, work_start: e });
                }}
              />
            </div>
          </div>
          <div className="col-5">
            <div className="input-group">
              <span className="input-group-text">End</span>
              <TimePicker
                id="work_end"
                name="work_end"
                className="form-control"
                value={WORK?.work_end}
                disableClock={false}
                clockIcon={null}
                format="HH:mm"
                locale="ko"
                onChange={(e:any) => {
                  setWORK({ ...WORK, work_end : e });
                }}
              />
            </div>
          </div>
        </div>
        <div className="row d-center">
          <div className="col-12">
            <div className="input-group">
              <span className="input-group-text">Time</span>
              <input
                readOnly
                type="text"
                className="form-control"
                id="work_time"
                name="work_time"
                placeholder="Time"
                value={WORK.work_time ? WORK.work_time : ""}
                onChange={(e:any) => {
                  setWORK({ ...WORK, work_time : e.target.value });
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 5-2. table ----------------------------------------------------------------------------------->
  const tableWorkSection = (i) => {

    const updateWorkArray
    = work_section[i] && workTitleArray[work_section[i].work_part_idx]
    ? workTitleArray[work_section[i].work_part_idx]?.work_title
   : [];

    return (
      <div key={i} className="mb-20">
        <div className="row d-center">
          <div className="col-5">
            <div className="input-group">
              <span className="input-group-text">파트</span>
              <select
                className="form-control"
                id={`work_part_idx-${i}`}
                onChange={(e:any) => handleWorkPartChange(i, e)}>
                {workPartArray.flatMap((key, index) => (
                  <option key={index} value={index}>
                    {key.work_part[0]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-5">
            <div className="input-group">
              <span className="input-group-text">종목</span>
              <select
                className="form-control"
                id={`work_title_val-${i}`}
                onChange={(e:any) => handleWorkTitleChange(i, e)}>
                {updateWorkArray.flatMap((title, index) => (
                  <option key={index} value={title}>
                    {title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="row d-center">
          <div className="col-5">
            <div className="input-group">
              <span className="input-group-text">Set</span>
              <input
                type="number"
                min="0"
                className="form-control"
                id={`work_set-${i}`}
                placeholder="Set"
                value={work_section[i]?.work_set}
                onChange={(e:any) => {
                  setWorkSection((prev[]) => {
                    const updatedSection = [...prev];
                    updatedSection[i].work_set = parseInt(e.target.value);
                    return updatedSection;
                  });
                }}
              />
            </div>
          </div>
          <div className="col-5">
            <div className="input-group">
              <span className="input-group-text">Count</span>
              <input
                type="number"
                min="0"
                className="form-control"
                id={`work_count-${i}`}
                placeholder="Count"
                value={work_section[i]?.work_count}
                onChange={(e:any) => {
                  setWorkSection((prev[]) => {
                    const updatedSection = [...prev];
                    updatedSection[i].work_count = parseInt(e.target.value);
                    return updatedSection;
                  });
                }}
              />
            </div>
          </div>
        </div>
        <div className="row d-center">
          <div className="col-5">
            <div className="input-group">
              <span className="input-group-text">Kg</span>
              <input
                type="number"
                min="0"
                className="form-control"
                id={`work_kg-${i}`}
                placeholder="Kg"
                value={work_section[i]?.work_kg}
                onChange={(e:any) => {
                  setWorkSection((prev[]) => {
                    const updatedSection = [...prev];
                    updatedSection[i].work_kg = parseInt(e.target.value);
                    return updatedSection;
                  });
                }}
              />
            </div>
          </div>
          <div className="col-5">
            <div className="input-group">
              <span className="input-group-text">Rest</span>
              <input
                type="number"
                min="0"
                className="form-control"
                id={`work_rest-${i}`}
                placeholder="Rest"
                value={work_section[i]?.work_rest}
                onChange={(e:any) => {
                  setWorkSection((prev[]) => {
                    const updatedSection = [...prev];
                    updatedSection[i].work_rest = parseInt(e.target.value);
                    return updatedSection;
                  });
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonWorkInsert = () => {
    return (
      <button type="button" className="btn btn-sm btn-primary" onClick={flowWorkInsert}>
        Insert
      </button>
    );
  };
  const buttonRefreshPage = () => {
    return (
      <button type="button" className="btn btn-sm btn-success ms-2" onClick={() => {
        navParam(0);
      }}>
        Refresh
      </button>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className="root-wrapper">
      <div className="container-wrapper">
      <div className="row d-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-7">{TITLE}</h1>
        </div>
      </div>
      <div className="row d-center mt-5 mb-5">
        <div className="col-12">
          <h1 className="mb-3 fw-5">
            <span>{viewWorkDay()}</span>
          </h1>
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-12">
          {handleWorkCountChange()}
        </div>
      </div>
      <div className="row d-center mt-5 mb-20">
        <div className="col-12">
          {tableWorkInsert()}
          <br />
          {buttonWorkInsert()}
          {buttonRefreshPage()}
        </div>
        </div>
      </div>
    </div>
  );
};