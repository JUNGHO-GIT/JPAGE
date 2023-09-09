// SleepListSelect.tsx
import React, {useState, useEffect} from "react";
import {Link, useNavigate, useLocation} from "react-router-dom";
import { DateRange, DayPicker } from "react-day-picker";
import { ko } from "date-fns/locale";
import moment from "moment";
import axios from "axios";

// 1. main ---------------------------------------------------------------------------------------->
export const SleepListSelect = () => {

  // title
  const TITLE = "Sleep List Select";
  // url
  const URL_SLEEP = process.env.REACT_APP_URL_SLEEP;
  // date
  const koreanDate = new Date(moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString());
  // hook
  const navParam = useNavigate();
  const location = useLocation();
  // val
  const user_id = window.sessionStorage.getItem("user_id");
  // state 1
  const [resultValue, setResultValue] = useState<string>();
  const [resultDuration, setResultDuration] = useState<string>("0000-00-00 ~ 0000-00-00");
  // state 2
  const [averageSleepTime, setAverageSleepTime] = useState<string>();
  const [averageSleepNight, setAverageSleepNight] = useState<string>();
  const [averageSleepMorning, setAverageSleepMorning] = useState<string>();
  // state 3
  const [range, setRange] = useState<DateRange | undefined>();
  const [currentMonth, setCurrentMonth] = useState<Date>(koreanDate);
  // state 4
  const [selectedStartYear, setSelectedStartYear] = useState<number>();
  const [selectedStartMonth, setSelectedStartMonth] = useState<number>();
  const [selectedStartDay, setSelectedStartDay] = useState<number>();
  const [selectedEndYear, setSelectedEndYear] = useState<number>();
  const [selectedEndMonth, setSelectedEndMonth] = useState<number>();
  const [selectedEndDay, setSelectedEndDay] = useState<number>();

  // 2-1. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchSleepList = async () => {
      try {
        const response = await axios.get(`${URL_SLEEP}/sleepList`, {
          params: {
            user_id : user_id,
            sleep_duration : resultDuration,
          },
        });

        const isValidTime = (str: string) => {
          return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(str);
        };
        setAverageSleepTime (
          isValidTime(response.data.averageSleepTime)
          ? response.data.averageSleepTime
          : "00:00"
        );
        setAverageSleepNight (
          isValidTime(response.data.averageSleepNight)
          ? response.data.averageSleepNight
          : "00:00"
        );
        setAverageSleepMorning (
          isValidTime(response.data.averageSleepMorning)
          ? response.data.averageSleepMorning
          : "00:00"
        );
      }
      catch (error: any) {
        alert(`Error fetching sleep data: ${error.message}`);
        setAverageSleepTime("00:00");
        setAverageSleepNight("00:00");
        setAverageSleepMorning("00:00");
      }
    };
    fetchSleepList();
  }, [user_id, resultDuration]);


  // 2-2. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const formatValue = (value: number): string => {
      return value < 10 ? `0${value}` : `${value}`;
    };
    if (
      selectedStartYear && selectedStartMonth && selectedStartDay &&
      selectedEndYear && selectedEndMonth && selectedEndDay
    ) {
      setResultValue (
        `${selectedStartYear}-${formatValue(selectedStartMonth)}-${formatValue(selectedStartDay)} ~ ${selectedEndYear}-${formatValue(selectedEndMonth)}-${formatValue(selectedEndDay)}`
      );

      setResultDuration (
        `${selectedStartYear}-${formatValue(selectedStartMonth)}-${formatValue(selectedStartDay)} ~ ${selectedEndYear}-${formatValue(selectedEndMonth)}-${formatValue(selectedEndDay)}`
      );
    }
    else {
      setResultValue ("선택된 날짜가 없습니다.");
      setResultDuration ("0000-00-00 ~ 0000-00-00");
      setAverageSleepTime("00:00");
      setAverageSleepNight("00:00");
      setAverageSleepMorning("00:00");
    }
  }, [
    selectedStartYear, selectedStartMonth, selectedStartDay,
    selectedEndYear, selectedEndMonth, selectedEndDay,
  ]);

  // 3. flow -------------------------------------------------------------------------------------->

  // 4-1. logic ----------------------------------------------------------------------------------->
  const handleDayRangeClick = (selectedRange: DateRange) => {
    setRange(selectedRange);
    if (selectedRange?.from) {
      setSelectedStartYear(selectedRange.from.getFullYear());
      setSelectedStartMonth(selectedRange.from.getMonth() + 1);
      setSelectedStartDay(selectedRange.from.getDate());
    }
    if (selectedRange?.to) {
      setSelectedEndYear(selectedRange.to.getFullYear());
      setSelectedEndMonth(selectedRange.to.getMonth() + 1);
      setSelectedEndDay(selectedRange.to.getDate());
    }
  };
  const handleDayClick = (day: Date) => {
    if (!range || !range.from) {
      setRange({ from: day, to: undefined });
    }
    else if (!range.to) {
      const newRange = day > range.from
      ? { from: range.from, to: day }
      : { from: day, to: range.from };
      handleDayRangeClick(newRange);
    }
    else {
      setRange({ from: day, to: undefined });
    }
  };

  // 4-2. logic ----------------------------------------------------------------------------------->
  const viewSleepDay = () => {
    return (
      <DayPicker
        mode="range"
        showOutsideDays
        selected={range}
        month={currentMonth}
        onDayClick={handleDayClick}
        locale={ko}
        weekStartsOn={1}
        onMonthChange={(date) => {
          setCurrentMonth(date);
        }}
        modifiersClassNames={{
          koreanDate: "koreanDate",
          selected: "selected",
          disabled: "disabled",
          outside: "outside",
          inside: "inside",
        }}
        footer={footer()}
      />
    );
  };

  // 5. table ------------------------------------------------------------------------------------->

  // 6. button ------------------------------------------------------------------------------------>
  const buttonSleepToday = () => {
    return (
      <button className="btn btn-success me-2" onClick={() => {
        setCurrentMonth(koreanDate);
        setSelectedStartYear(undefined);
        setSelectedStartMonth(undefined);
        setSelectedStartDay(undefined);
        setSelectedEndYear(undefined);
        setSelectedEndMonth(undefined);
        setSelectedEndDay(undefined);
        setRange(undefined);
      }}>
        Today
      </button>
    );
  };
  const buttonSleepReset = () => {
    return (
      <button className="btn btn-primary me-2" onClick={() => {
        setCurrentMonth(koreanDate);
        setSelectedStartYear(undefined);
        setSelectedStartMonth(undefined);
        setSelectedStartDay(undefined);
        setSelectedEndYear(undefined);
        setSelectedEndMonth(undefined);
        setSelectedEndDay(undefined);
        setRange(undefined);
      }}>
        Reset
      </button>
    );
  };
  const footer = () => {
    return (
      <div>
        <hr />
        <p>{resultValue}</p>
        <p>{resultDuration}</p>
        <p>평균 취침 시간: {averageSleepNight}</p>
        <p>평균 기상 시간: {averageSleepMorning}</p>
        <p>평균 수면 시간: {averageSleepTime}</p>
        <hr />
        {buttonSleepToday()}
        {buttonSleepReset()}
      </div>
    );
  };

  // 7. return ------------------------------------------------------------------------------------>
  return (
    <div className="container">
      <div className="row d-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-9">{TITLE}</h1>
        </div>
      </div>
      <div className="row d-center mt-5 mb-20">
        <div className="col-12">
          {viewSleepDay()}
        </div>
      </div>
    </div>
  );
};