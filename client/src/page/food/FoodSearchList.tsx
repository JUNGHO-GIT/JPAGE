// FoodSearchList.tsx

import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import DatePicker from "react-datepicker";
import axios from "axios";
import moment from "moment-timezone";
import {useDeveloperMode} from "../../assets/ts/useDeveloperMode";

// ------------------------------------------------------------------------------------------------>
export const FoodSearchList = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const TITLE = "Food Search";
  const URL_FOOD_API = process.env.REACT_APP_URL_FOOD_API;
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString();
  const navParam = useNavigate();
  const lang = "ko";
  const user_id = window.sessionStorage.getItem("user_id");
  const {log} = useDeveloperMode();

  // 2-1. useStorage ------------------------------------------------------------------------------>

  // 2-2. useState -------------------------------------------------------------------------------->
  const [FOOD_SEARCH, setFOOD_SEARCH] = useState ([]);
  const [foodDay, setFoodDay] = useState(koreanDate);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);

  // 2-1. useEffect (localStorage) ---------------------------------------------------------------->
  useEffect(() => {
    // 로컬 스토리지에서 값을 가져옴
    const savedFoodSearch = localStorage.getItem("FoodSearchList");
    const savedQuery = localStorage.getItem("FoodQuery");
    const savedPage = localStorage.getItem("FoodPage");

    if (savedFoodSearch) {
      setFOOD_SEARCH(JSON.parse(savedFoodSearch));
    }
    if (savedQuery) {
      setQuery(savedQuery);
    }
    if (savedPage) {
      setPage(JSON.parse(savedPage));
    }
  }, []);
  useEffect(() => {
    // 상태 값이 변경될 때마다 로컬 스토리지에 저장
    localStorage.setItem("FoodSearchList", JSON.stringify(FOOD_SEARCH));
    localStorage.setItem("FoodQuery", query);
    localStorage.setItem("FoodPage", JSON.stringify(page));

  }, [FOOD_SEARCH, query, page]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowFoodSearch = () => {
    const url = `${URL_FOOD_API}/${lang}/search?query=${query}&page=${page}`;
    axios.get(url)
    .then((response) => {
      setFOOD_SEARCH(response.data.items);
      log("FOOD_SEARCH : " + JSON.stringify(response.data.items));
    })
    .catch((error:any) => {
      alert(`Error fetching food data: ${error.message}`);
      setFOOD_SEARCH([]);
    });
  };

  const flowSearchChange = (e:any) => {
    e.preventDefault();
    setQuery(e.target.value);
  };

  // 4. view -------------------------------------------------------------------------------------->
  const logicViewDate = () => {
    return (
      <DatePicker
        dateFormat="yyyy-MM-dd"
        selected={new Date(foodDay)}
        popperPlacement="bottom"
        onChange={(date:any) => {
          const formatDate = date.toISOString().split("T")[0];
          setFoodDay(formatDate);
        }}
        readOnly
      />
    );
  };

  // 5. table ------------------------------------------------------------------------------------->
  const tableFoodSearch = () => {
    return (
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>이름</th>
            <th>브랜드</th>
            <th>칼로리</th>
            <th>지방</th>
            <th>탄수화물</th>
            <th>단백질</th>
            <th>용량</th>
          </tr>
        </thead>
        <tbody>
          {FOOD_SEARCH.map((index) => (
            <tr>
              <td>
                {buttonFoodInsert (
                  index.title ? index.title : "x", index.brand ? index.brand : "x",
                  index.calories ? index.calories : 0, index.fat ? index.fat : 0,
                  index.carb ? index.carb : 0, index.protein ? index.protein : 0,
                  index.serving ? index.serving : 0
                )}
              </td>
              <td>{index.brand ? index.brand : "x"}</td>
              <td>{index.calories ? index.calories : 0}</td>
              <td>{index.fat ? index.fat : 0}</td>
              <td>{index.carb ? index.carb : 0}</td>
              <td>{index.protein ? index.protein : 0}</td>
              <td>{index.serving ? index.serving : 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonFoodInsert = (
    title: string, brand: string, calories: number, fat: number,
    carb: number, protein: number, serving: number
  ) => {
    return (
      <p onClick={() => {
        navParam(`/foodInsert`, {
          state: {
            title : title, brand : brand, calories : calories, fat : fat,
            carb : carb, protein : protein, serving : serving
          }
        });
      }}>
        {title}
      </p>
    );
  };
  const buttonPrevPage = () => {
    return (
      <button className="btn btn-sm btn-primary ms-2" type="button" onClick={(e:any) => {
        e.preventDefault();
        if (!query) {
          alert("검색어를 입력하세요");
          return false;
        }
        else {
          setPage((prevPage) => prevPage + 1);
          flowFoodSearch();
        }
      }}>
        이전
      </button>
    );
  };
  const buttonNextPage = () => {
    return (
      <button className="btn btn-sm btn-primary ms-2" type="button" onClick={(e:any) => {
        e.preventDefault();
        if (!query) {
          alert("검색어를 입력하세요");
          return false;
        }
        else {
          setPage((prevPage) => Math.max(prevPage - 1, 1));
          flowFoodSearch();
        }
      }}>
        다음
      </button>
    );
  };
  const buttonFoodSearch = () => {
    return (
      <button className="btn btn-sm btn-primary ms-2" type="button" onClick={(e:any) => {
        e.preventDefault();
        if (!query) {
          alert("검색어를 입력하세요");
          return false;
        }
        else {
          setPage(0);
          flowFoodSearch();
        }
      }}>
        검색
      </button>
    );
  };
  const buttonFoodList = () => {
    return (
      <button className="btn btn-sm btn-primary ms-2" type="button" onClick={(e:any) => {
        e.preventDefault();
        navParam(`/foodList`, {
          state: {
            user_id : user_id,
            foodDur : foodDay
          }
        });
      }}>
        총합
      </button>
    );
  };
  const buttonFoodMorning = () => {
    return (
      <button className="btn btn-sm btn-primary ms-2" type="button" onClick={(e:any) => {
        e.preventDefault();
        navParam(`/foodSearchResult`, {
          state: {
            user_id : user_id,
            foodDur : foodDay,
            food_category : "morning"
          }
        });
      }}>
        아침
      </button>
    );
  };
  const buttonFoodLunch = () => {
    return (
      <button className="btn btn-sm btn-primary ms-2" type="button" onClick={(e:any) => {
        e.preventDefault();
        navParam(`/foodSearchResult`, {
          state: {
            user_id : user_id,
            foodDur : foodDay,
            food_category : "lunch"
          }
        });
      }}>
        점심
      </button>
    );
  };
  const buttonFoodDinner = () => {
    return (
      <button className="btn btn-sm btn-primary ms-2" type="button" onClick={(e:any) => {
        e.preventDefault();
        navParam(`/foodSearchResult`, {
          state: {
            user_id : user_id,
            foodDur : foodDay,
            food_category : "dinner"
          }
        });
      }}>
        저녁
      </button>
    );
  };
  const buttonFoodSnack = () => {
    return (
      <button className="btn btn-sm btn-primary ms-2" type="button" onClick={(e:any) => {
        e.preventDefault();
        navParam(`/foodSearchResult`, {
          state: {
            user_id : user_id,
            foodDur : foodDay,
            food_category : "snack"
          }
        });
      }}>
        간식
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
        <div className="row d-center mt-5">
          <div className="col-12">
            <h1 className="mb-3 fw-5">
              <span className="ms-4">
                {logicViewDate()}
              </span>
            </h1>
          </div>
        </div>
        <div className="row d-center mt-5">
          <div className="col-12">
            {tableFoodSearch()}
          </div>
        </div>
        <div className="row d-center mt-5">
          <div className="col-4">
            <div className="btn-group mb-3">
              {buttonPrevPage()}
              {buttonNextPage()}
            </div>
          </div>
          <div className="col-4">
            <div className="input-group">
              <input type="text" className="form-control" value={query} onChange={flowSearchChange} />
              {buttonFoodSearch()}
            </div>
          </div>
        </div>
        <div className="row d-center mt-5">
          <div className="col-12">
            <div className="btn-group">
              {buttonFoodList()}
              {buttonFoodMorning()}
              {buttonFoodLunch()}
              {buttonFoodDinner()}
              {buttonFoodSnack()}
              {buttonRefreshPage()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};