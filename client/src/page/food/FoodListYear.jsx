// FoodListYear.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {DayPicker, MonthChangeEventHandler} from "react-day-picker";
import {differenceInDays} from "date-fns";
import {ko} from "date-fns/locale";
import {parseISO} from "date-fns";
import moment from "moment-timezone";
import axios from "axios";
import {useStorage} from "../../assets/js/useStorage.jsx";
import {useDeveloperMode} from "../../assets/js/useDeveloperMode.jsx";

// ------------------------------------------------------------------------------------------------>
export const FoodListYear = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const TITLE = "Food List Year";
  const URL_FOOD = process.env.REACT_APP_URL_FOOD;
  const koreanDate = new Date(moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString());
  const navParam = useNavigate();
  const location = useLocation();
  const user_id = window.sessionStorage.getItem("user_id");
  const {log} = useDeveloperMode();

  // 2-1. useStorage ------------------------------------------------------------------------------>
  const {val:FOOD_LIST, setVal:setFOOD_LIST} = useStorage(
    "foodList(YEAR)", []
  );
  const {val:FOOD_TOTAL, setVal:setFOOD_TOTAL} = useStorage(
    "foodTotal(YEAR)", []
  );
  const {val:FOOD_AVERAGE, setVal:setFOOD_AVERAGE} = useStorage(
    "foodAvg(YEAR)", []
  );
  const {val:foodYear, setVal:setFoodYear} = useStorage(
    "foodYear(YEAR)", koreanDate
  );
  const {val:foodResVal, setVal:setFoodResVal} = useStorage(
    "foodResVal(YEAR)", undefined
  );
  const {val:foodResDur, setVal:setFoodResDur} = useStorage(
    "foodResDur(YEAR)", "0000-00-00 ~ 0000-00-00"
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [foodType, setFoodType] = useState("list");
  const [foodCategory, setFoodCategory] = useState("all");

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {

    // 1. list
    const fetchFoodList = async () => {
      try {
        const response = await axios.get (`${URL_FOOD}/list`, {
          params: {
            user_id : user_id,
            food_dur : foodResDur,
            food_category : foodCategory
          },
        });
        setFOOD_LIST(response.data);
        log("FOOD_LIST : " + JSON.stringify(response.data));
      }
      catch (e) {
        setFOOD_LIST([]);
        alert(`Error fetching food data: ${e.message}`);
      }
    };
    fetchFoodList();

    // 2. total
    const fetchFoodTotal = async () => {
      try {
        const response = await axios.get (`${URL_FOOD}/foodTotal`, {
          params: {
            user_id : user_id,
            food_dur : foodResDur,
            food_category : foodCategory
          },
        });
        setFOOD_TOTAL(response.data);
        log("FOOD_TOTAL : " + JSON.stringify(response.data));
      }
      catch (e) {
        setFOOD_TOTAL([]);
        alert(`Error fetching food data: ${e.message}`);
      }
    };
    fetchFoodTotal();

    // 3. average
    const fetchFoodAvg = async () => {
      try {
        const response = await axios.get (`${URL_FOOD}/foodAvg`, {
          params: {
            user_id : user_id,
            food_dur : foodResDur,
            food_category : foodCategory
          },
        });
        setFOOD_AVERAGE(response.data);
        log("FOOD_AVERAGE : " + JSON.stringify(response.data));
      }
      catch (e) {
        setFOOD_AVERAGE([]);
        alert(`Error fetching food data: ${e.message}`);
      }
    };
    fetchFoodAvg();
  }, [user_id, foodResDur, foodCategory]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    if (foodYear) {
      setFoodResVal (
        parseISO (`${foodYear.getFullYear()}`)
      );
      setFoodResDur (
        `${foodYear.getFullYear()}-01-01 ~ ${foodYear.getFullYear()}-12-31`
      );
    }
    else {
      setFoodResVal (undefined);
    }
  }, [foodYear]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowYearChange: MonthChangeEventHandler = (day) => {
    const yearDate = new Date(day.getFullYear(), 0, 1);
    const monthDate = new Date(day.getFullYear(), day.getMonth(), 1);
    const nextMonth = differenceInDays(new Date(day.getFullYear() + 1, 0, 1), monthDate) / 30;
    const prevMonth = differenceInDays(monthDate, yearDate) / 30;

    if (nextMonth > prevMonth) {
      setFoodYear(new Date(day.getFullYear() + 1, 0, 1));
    }
    else {
      setFoodYear(new Date(day.getFullYear(), 0, 1));
    }
  };

  // 4-1. view ----------------------------------------------------------------------------------->
  const viewFoodYear = () => {
    return (
      <DayPicker
        mode="default"
        showOutsideDays
        locale={ko}
        weekStartsOn={1}
        month={foodYear}
        onMonthChange={flowYearChange}
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
  const tableFoodList = () => {
    return (
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>분류</th>
            <th>음식명</th>
            <th>브랜드</th>
            <th>서빙</th>
            <th>칼로리</th>
            <th>탄수화물</th>
            <th>단백질</th>
            <th>지방</th>
          </tr>
        </thead>
        <tbody>
          {FOOD_LIST.map((index, i) => (
            <tr key={i}>
              <td>{index.food_category}</td>
              <td>{index.food_title}</td>
              <td>{index.food_brand}</td>
              <td>{index.food_serving}</td>
              <td>{index.food_calories}</td>
              <td>{index.food_carb}</td>
              <td>{index.food_protein}</td>
              <td>{index.food_fat}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // 5-2. table ----------------------------------------------------------------------------------->
  const tableFoodTotal = () => {
    return (
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>칼로리</th>
            <th>탄수화물</th>
            <th>단백질</th>
            <th>지방</th>
          </tr>
        </thead>
        <tbody>
          {FOOD_TOTAL.map((index, i) => (
            <tr key={i}>
              <td>{index.totalCalories}</td>
              <td>{index.totalCarb}</td>
              <td>{index.totalProtein}</td>
              <td>{index.totalFat}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // 5-3. table ----------------------------------------------------------------------------------->
  const tableFoodAvg = () => {
    return (
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>칼로리</th>
            <th>탄수화물</th>
            <th>단백질</th>
            <th>지방</th>
          </tr>
        </thead>
        <tbody>
          {FOOD_AVERAGE.map((index, i) => (
            <tr key={i}>
              <td>{index.food_calories}</td>
              <td>{index.food_carb}</td>
              <td>{index.food_protein}</td>
              <td>{index.food_fat}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonFoodToday = () => {
    return (
      <button type="button" className="btn btn-sm btn-success me-2" onClick={() => {
        setFoodYear(koreanDate);
        localStorage.removeItem("foodList(YEAR)");
        localStorage.removeItem("foodTotal(YEAR)");
        localStorage.removeItem("foodAvg(YEAR)");
        localStorage.removeItem("foodYear(YEAR)");
      }}>
        Today
      </button>
    );
  };
  const buttonFoodReset = () => {
    return (
      <button type="button" className="btn btn-sm btn-primary me-2" onClick={() => {
        setFoodYear(undefined);
        localStorage.removeItem("foodList(YEAR)");
        localStorage.removeItem("foodTotal(YEAR)");
        localStorage.removeItem("foodAvg(YEAR)");
        localStorage.removeItem("foodYear(YEAR)");
      }}>
        Reset
      </button>
    );
  };

  // 6-2. select  --------------------------------------------------------------------------------->
  const selectFoodList = () => {
    const currentPath = location.pathname || "";
    return (
      <div className="mb-3">
        <select className="form-select" id="foodListYear" value={currentPath}
        onChange={(e) => {
          navParam(e.target.value);
        }}>
          <option value="/foodListDay">Day</option>
          <option value="/foodListWeek">Week</option>
          <option value="/foodListMonth">Month</option>
          <option value="/foodListYear">Year</option>
          <option value="/foodListSelect">Select</option>
        </select>
      </div>
    );
  };
  const selectFoodType = () => {
    return (
      <div className="mb-3">
        <select className="form-select" id="foodType" onChange={(e) => {
          if (e.target.value === "list") {
            setFoodType("list");
          }
          else if (e.target.value === "total") {
            setFoodType("total");
          }
          else if (e.target.value === "avg") {
            setFoodType("avg");
          }
        }}>
          <option value="list">List</option>
          <option value="total">Total</option>
          <option value="avg">Avg</option>
        </select>
      </div>
    );
  };
  const selectFoodCategory = () => {
    return (
      <div className="mb-3">
        <select className="form-select" id="foodCategory" onChange={(e) => {
          if (e.target.value === "all") {
            setFoodCategory("all");
          }
          else if (e.target.value === "morning") {
            setFoodCategory("morning");
          }
          else if (e.target.value === "lunch") {
            setFoodCategory("lunch");
          }
          else if (e.target.value === "dinner") {
            setFoodCategory("dinner");
          }
          else if (e.target.value === "snack") {
            setFoodCategory("snack");
          }
        }}>
          <option value="all">All</option>
          <option value="morning">Morning</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snack">Snack</option>
        </select>
      </div>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className="root-wrapper">
      <div className="container-wrapper">
      <div className="row d-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-7">{TITLE}</h1>
          <h2 className="mb-3 fw-7">년별로 조회</h2>
        </div>
      </div>
      <div className="row d-center mt-3">
        <div className="col-3">
          {selectFoodList()}
        </div>
        <div className="col-3">
          {selectFoodType()}
        </div>
        <div className="col-3">
          {selectFoodCategory()}
        </div>
      </div>
      <div className="row d-center mt-3">
        <div className="col-md-6 col-12 d-center">
          {viewFoodYear()}
        </div>
        <div className="col-md-6 col-12">
          {foodType === "list" && tableFoodList()}
          {foodType === "total" && tableFoodTotal()}
          {foodType === "avg" && tableFoodAvg()}
        </div>
      </div>
      <div className="row mb-20">
        <div className="col-12 d-center">
          {buttonFoodToday()}
          {buttonFoodReset()}
        </div>
        </div>
      </div>
    </div>
  );
};
