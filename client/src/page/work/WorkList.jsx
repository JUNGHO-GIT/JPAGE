// WorkList.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/js/useStorage.jsx";
import {DayPicker} from "react-day-picker";
import Draggable from "react-draggable";
import {ko} from "date-fns/locale";
import moment from "moment-timezone";
import axios from "axios";
import { differenceInDays } from "date-fns";

// ------------------------------------------------------------------------------------------------>
export const WorkList = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_WORK = process.env.REACT_APP_URL_WORK;
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD");
  const navParam = useNavigate();
  const location = useLocation();
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname;

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:calendarOpen, set:setCalendarOpen} = useStorage(
    `calendarOpen(${PATH})`, false
  );
  const {val:totalCount, set:setTotalCount} = useStorage(
    `totalCount(${PATH})`, 0
  );
  const {val:type, set:setType} = useStorage(
    `type(${PATH})`, "day"
  );
  const {val:filter, set:setFilter} = useStorage(
    `filter(${PATH})`, {order: "asc", page: 1, limit: 5}
  );

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:strStartDate, set:setStrStartDate} = useStorage(
    `strStartDate(${PATH})`, koreanDate
  );
  const {val:strEndDate, set:setStrEndDate} = useStorage(
    `strEndDate(${PATH})`, koreanDate
  );
  const {val:strDate, set:setStrDate} = useStorage(
    `strDate(${PATH})`, koreanDate
  );
  const {val:strDur, set:setStrDur} = useStorage(
    `strDur(${PATH})`, `${koreanDate} ~ ${koreanDate}`
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [WORK_DEFAULT, setWORK_DEFAULT] = useState([{
    _id: "",
    work_number: 0,
    work_date: "",
    work_real : {
      work_start: "",
      work_end: "",
      work_time: "",
      work_section: [{
        work_part_idx: 0,
        work_part_val: "전체",
        work_title_idx: 0,
        work_title_val: "전체",
        work_set: 0,
        work_count: 0,
        work_kg: 0,
        work_rest: 0,
      }],
    },
    work_plan : {
      work_start: "",
      work_end: "",
      work_time: "",
      work_section: [{
        work_part_idx: 0,
        work_part_val: "전체",
        work_title_idx: 0,
        work_title_val: "전체",
        work_set: 0,
        work_count: 0,
        work_kg: 0,
        work_rest: 0,
      }],
    }
  }]);
  const [WORK, setWORK] = useState([{
    _id: "",
    work_number: 0,
    work_date: "",
    work_real : {
      work_start: "",
      work_end: "",
      work_time: "",
      work_section: [{
        work_part_idx: 0,
        work_part_val: "전체",
        work_title_idx: 0,
        work_title_val: "전체",
        work_set: 0,
        work_count: 0,
        work_kg: 0,
        work_rest: 0,
      }],
    },
    work_plan : {
      work_start: "",
      work_end: "",
      work_time: "",
      work_section: [{
        work_part_idx: 0,
        work_part_val: "전체",
        work_title_idx: 0,
        work_title_val: "전체",
        work_set: 0,
        work_count: 0,
        work_kg: 0,
        work_rest: 0,
      }],
    }
  }]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {

    const response = await axios.get(`${URL_WORK}/list`, {
      params: {
        user_id: user_id,
        work_dur: strDur,
        filter: filter
      },
    });

    setTotalCount(response.data.totalCount ? response.data.totalCount : 0);
    setWORK(response.data.result ? response.data.result : WORK_DEFAULT);

  })()}, [strDur, filter]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    if (type === "day") {
      setStrDur(`${strDate} ~ ${strDate}`);
    }
    else if (type === "week") {
      setStrDur(`${strStartDate} ~ ${strEndDate}`);
    }
    else if (type === "month") {
      setStrDur(`${moment(strDate).startOf("month").format("YYYY-MM-DD")} ~ ${moment(strDate).endOf("month").format("YYYY-MM-DD")}`);
    }
    else if (type === "year") {
      setStrDur(`${moment(strDate).startOf("year").format("YYYY-MM-DD")} ~ ${moment(strDate).endOf("year").format("YYYY-MM-DD")}`);
    }
    else if (type === "select") {
      setStrDur(`${strStartDate} ~ ${strEndDate}`);
    }
  }, [type, strDate, strStartDate, strEndDate]);

  // 4-1. view ----------------------------------------------------------------------------------->
  const viewWorkList = () => {
    let dayPicker;
    if (type === "day") {
      dayPicker = (
        <DayPicker
          weekStartsOn={1}
          showOutsideDays={true}
          locale={ko}
          modifiersClassNames={{
            selected: "selected", disabled: "disabled", outside: "outside", inside: "inside",
          }}
          mode="single"
          selected={new Date(strDate)}
          onDayClick={(day) => {
            setStrDate(moment(day).format("YYYY-MM-DD"));
          }}
          onMonthChange={(month) => {
            setStrDate(moment(month).format("YYYY-MM-DD"));
          }}
        />
      );
    };
    if (type === "week") {
      dayPicker = (
        <DayPicker
          weekStartsOn={1}
          showOutsideDays={true}
          locale={ko}
          modifiersClassNames={{
            selected: "selected", disabled: "disabled", outside: "outside", inside: "inside",
          }}
          mode="range"
          selected={strStartDate && strEndDate && {from: new Date(strStartDate), to: new Date(strEndDate)}}
          month={strStartDate && strEndDate && new Date(strStartDate)}
          onDayClick={(day) => {
            const selectedDate = moment(day);
            const startOfWeek = selectedDate.clone().startOf("week").add(1, "days");
            const endOfWeek = startOfWeek.clone().add(6, "days");
            setStrStartDate(moment(startOfWeek).format("YYYY-MM-DD"));
            setStrEndDate(moment(endOfWeek).format("YYYY-MM-DD"));
          }}
          onMonthChange={(month) => {
            setStrStartDate(month);
            setStrEndDate(undefined);
          }}
        />
      );
    }
    if (type === "month") {
      dayPicker = (
        <DayPicker
          weekStartsOn={1}
          showOutsideDays={true}
          locale={ko}
          modifiersClassNames={{
            selected: "selected", disabled: "disabled", outside: "outside", inside: "inside",
          }}
          mode="default"
          month={new Date(strDur.split(" ~ ")[0])}
          onMonthChange={(month) => {
            const startOfMonth = moment(month).startOf("month").format("YYYY-MM-DD");
            const endOfMonth = moment(month).endOf("month").format("YYYY-MM-DD");
            setStrDur(`${startOfMonth} ~ ${endOfMonth}`);
          }}
        />
      );
    }
    if (type === "year") {
      dayPicker = (
        <DayPicker
          weekStartsOn={1}
          showOutsideDays={true}
          locale={ko}
          modifiersClassNames={{
            selected: "selected", disabled: "disabled", outside: "outside", inside: "inside",
          }}
          mode="default"
          month={new Date(strDur.split(" ~ ")[0])}
          onMonthChange={(year) => {
            const yearDate = new Date(year.getFullYear(), 0, 1);
            const monthDate = new Date(year.getFullYear(), year.getMonth(), 1);
            const nextMonth = differenceInDays(new Date(year.getFullYear() + 1, 0, 1), monthDate) / 30;
            const prevMonth = differenceInDays(monthDate, yearDate) / 30;
            if (nextMonth > prevMonth) {
              setStrDur(`${year.getFullYear() + 1}-01-01 ~ ${year.getFullYear() + 1}-12-31`);
            }
            else {
              setStrDur(`${year.getFullYear()}-01-01 ~ ${year.getFullYear()}-12-31`);
            }
          }}
        />
      );
    };
    if (type === "select") {
      dayPicker = (
        <DayPicker
          weekStartsOn={1}
          showOutsideDays={true}
          locale={ko}
          modifiersClassNames={{
            selected: "selected", disabled: "disabled", outside: "outside", inside: "inside",
          }}
          mode="range"
          selected={strStartDate && strEndDate && {from: strStartDate, to: strEndDate}}
          month={strStartDate}
          onDayClick= {(day) => {
            const selectedDay = new Date(day);
            const fmtDate = moment(selectedDay).format("YYYY-MM-DD");
            if (strStartDate && strEndDate) {
              if (selectedDay < new Date(strStartDate)) {
                setStrStartDate(fmtDate);
                setStrEndDate(fmtDate);
              }
              else if (selectedDay > new Date(strEndDate)) {
                setStrEndDate(fmtDate);
              }
              else {
                setStrStartDate(fmtDate);
                setStrEndDate(fmtDate);
              }
            }
            else if (strStartDate) {
              if (selectedDay < new Date(strStartDate)) {
                setStrEndDate(strStartDate);
                setStrStartDate(fmtDate);
              }
              else if (selectedDay > new Date(strStartDate)) {
                setStrEndDate(fmtDate);
              }
              else {
                setStrStartDate(undefined);
                setStrEndDate(undefined);
              }
            }
            else {
              setStrStartDate(fmtDate);
            }
          }}
          onMonthChange={(month) => {
            setStrStartDate(new Date(month.getFullYear(), month.getMonth(), 1));
            setStrEndDate(undefined);
          }}
        />
      );
    };
    return (
      <Draggable>
        <div className={`dayPicker-container ${calendarOpen ? "" : "d-none"}`}>
          <span
            className="d-right fw-700 pointer"
            onClick={() => setCalendarOpen(false)}
            style={{position: "absolute", right: "15px", top: "10px"}}
          >
            X
          </span>
          <div className="h-2"></div>
          {dayPicker}
        </div>
      </Draggable>
    );
  };

  // 5-1. table ----------------------------------------------------------------------------------->
  const tableWorkList = () => {
    return (
      <table className="table bg-white table-hover">
        <thead className="table-primary">
          <tr>
            <th>날짜</th>
            <th>분류</th>
            <th>목표</th>
            <th>실제</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {WORK.map((item) => (
            <React.Fragment key={item.work_date}>
              <tr>
                <td rowSpan={6} className="pointer" onClick={() => {
                  navParam("/work/detail", {
                    state: {
                      id: item._id,
                      date: item.work_date,
                    },
                  });
                }}>
                  {item.work_date}
                </td>
                <td>시작</td>
                <td>{item.work_plan.work_start}</td>
                <td>{item.work_real.work_start}</td>
                <td></td>
              </tr>
              <tr>
                <td>끝</td>
                <td>{item.work_plan.work_end}</td>
                <td>{item.work_real.work_end}</td>
                <td></td>
              </tr>
              <tr>
                <td>시간</td>
                <td>{item.work_plan.work_time}</td>
                <td>{item.work_real.work_time}</td>
                <td></td>
              </tr>
              {item.work_plan.work_section?.map((section2, index2) => (
                <tr key={index2}>
                  <td></td>
                  <td>
                    {section2.work_part_val || ""} {section2.work_title_val || ""} {section2.work_kg || ""} x {section2.work_set || ""} x {section2.work_count || ""}
                  </td>
                  <td></td>
                  <td></td>
                </tr>
              ))}
              {item.work_real.work_section?.map((section1, index1) => (
                <tr key={index1}>
                  <td></td>
                  <td></td>
                  <td>
                    {section1.work_part_val || ""} {section1.work_title_val || ""} {section1.work_kg || ""} x {section1.work_set || ""} x {section1.work_count || ""}
                  </td>
                  <td></td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    );
  };

  // 5-2. filter ---------------------------------------------------------------------------------->
  const filterBox = () => {
    const pageNumber = () => {
      const pages = [];
      const totalPages = Math.ceil(totalCount / filter.limit);
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <button
            key={i}
            className={`btn btn-sm ${filter.page === i ? "btn-secondary" : "btn-primary"} me-2`}
            onClick={() => setFilter({
              ...filter, page: i
            })}
          >
            {i}
          </button>
        );
      }
      return pages;
    };
    const prevNumber = () => {
      return (
        <button
          className="btn btn-sm btn-primary ms-10 me-10"
          onClick={() => setFilter({
            ...filter, page: Math.max(1, filter.page - 1) }
          )}
        >
          이전
        </button>
      );
    }
    const nextNumber = () => {
      return (
        <button
          className="btn btn-sm btn-primary ms-10 me-10"
          onClick={() => setFilter({
            ...filter, page: Math.min(Math.ceil(totalCount / filter.limit), filter.page + 1) }
          )}
        >
          다음
        </button>
      );
    }
    return (
      <div className="d-inline-flex">
        {prevNumber()}
        {pageNumber()}
        {nextNumber()}
      </div>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonCalendar = () => {
    return (
      <button
        type="button"
        className={`btn btn-sm ${calendarOpen ? "btn-danger" : "btn-primary"} m-5`}
        onClick={() => setCalendarOpen(!calendarOpen)}
      >
        {calendarOpen ? "x" : "o"}
      </button>
    );
  };
  const buttonWorkToday = () => {
    return (
      <button type="button" className="btn btn-sm btn-success me-2" onClick={() => {
        setStrDate(koreanDate);
        localStorage.removeItem(`strStartDate(${PATH})`);
        localStorage.removeItem(`strEndDate(${PATH})`);
      }}>
        Today
      </button>
    );
  };
  const buttonWorkReset = () => {
    return (
      <button type="button" className="btn btn-sm btn-primary me-2" onClick={() => {
        setStrDate(koreanDate);
        localStorage.removeItem(`strStartDate(${PATH})`);
        localStorage.removeItem(`strEndDate(${PATH})`);
      }}>
        Reset
      </button>
    );
  };

  // 6-2. select ---------------------------------------------------------------------------------->
  const selectWorkType = () => {
    return (
      <div className="mb-3">
        <select className="form-select" id="type" onChange={(e) => setType(e.target.value)}>
          {["day", "week", "month", "year", "select"].map((item) => (
            <option key={item} value={item} selected={type === item}>{item}</option>
          ))}
        </select>
      </div>
    );
  };

  // 6-3. select ---------------------------------------------------------------------------------->
  const selectFilterSub = () => {
    return (
      <div className="mb-3">
        <select className="form-select" id="workListSortOrder" onChange={(e) => {
          setFilter({...filter, order: e.target.value});
        }}>
          <option value="asc" selected>오름차순</option>
          <option value="desc">내림차순</option>
        </select>
      </div>
    );
  };
  const selectFilterPage = () => {
    return (
      <div className="mb-3">
        <select className="form-select" id="workListLimit" onChange={(e) => {
          setFilter({...filter, limit: Number(e.target.value)});
        }}>
          <option value="5" selected>5</option>
          <option value="10">10</option>
        </select>
      </div>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className="root-wrapper">
      <div className="container-wrapper">
        <div className="row mb-20">
          <div className="col-1">
            {viewWorkList()}
          </div>
          <div className="col-2">
            {selectWorkType()}
          </div>
          <div className="col-2">
            {selectFilterSub()}
          </div>
          <div className="col-2">
            {selectFilterPage()}
          </div>
        </div>
        <div className="row mb-20">
          <div className="col-12 d-center">
            {tableWorkList()}
          </div>
        </div>
        <div className="row mb-20">
          <div className="col-12 d-center">
            {filterBox()}
          </div>
        </div>
        <div className="row mb-20">
          <div className="col-12 d-center">
            {buttonCalendar()}
            {buttonWorkToday()}
            {buttonWorkReset()}
          </div>
        </div>
      </div>
    </div>
  );
};
