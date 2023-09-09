// FoodUpdate.tsx
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import moment from "moment-timezone";

// 1. main ---------------------------------------------------------------------------------------->
export const FoodUpdate = () => {

  // title
  const TITLE = "Food Update";
  // url
  const URL_FOOD = process.env.REACT_APP_URL_FOOD;
  // date
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString();
  // hook
  const navParam = useNavigate();
  const location = useLocation();
  // val
  const user_id = window.sessionStorage.getItem("user_id");
  const _id = location.state._id;
  // state
  const [FOOD, setFOOD] = useState<any>({});

  // 2. useEffect --------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchFoodDetail = async () => {
      try {
        const response = await axios.get(`${URL_FOOD}/foodDetail`, {
          params: {
            _id : _id,
          },
        });
        setFOOD(response.data);
      }
      catch (error: any) {
        alert(`Error fetching food data: ${error.message}`);
        setFOOD([]);
      }
    };
    fetchFoodDetail();
  }, [_id]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowFoodUpdate = async () => {
    try {
      const response = await axios.put (`${URL_FOOD}/foodUpdate`, {
        _id : FOOD._id,
        FOOD : FOOD
      });
      if (response.data === "success") {
        alert("Update success");
        window.location.href = "/foodSearch";
      }
      else {
        alert("Update failed");
      }
    }
    catch (error: any) {
      alert(`Error fetching food data: ${error.message}`);
    }
  };

  // 4. logic ------------------------------------------------------------------------------------->

  // 5. table ------------------------------------------------------------------------------------->
  const tableFoodUpdate = () => {
    return (
      <div>
        <div className="form-floating">
          <input type="text" className="form-control"  placeholder="User ID"
          value={user_id || ""} readOnly />
        </div>
        <div className="form-floating">
          <input type="text" className="form-control" placeholder="Name" value={FOOD.food_name}
          onChange={(e) => setFOOD({...FOOD, food_name: e.target.value})} />
          <label htmlFor="floatingTitle">Title</label>
        </div>
        <div className="form-floating">
          <input type="text" className="form-control" placeholder="Brand" value={FOOD.food_brand}
          onChange={(e) => setFOOD({...FOOD, food_brand: e.target.value})} />
          <label htmlFor="floatingBrand">Brand</label>
        </div>
        <div className="form-floating">
          <input type="text" className="form-control" placeholder="Category" value={FOOD.food_category}
          onChange={(e) => setFOOD({...FOOD, food_category: e.target.value})} />
          <label htmlFor="floatingCategory">Category</label>
        </div>
        <div className="form-floating">
          <input type="text" className="form-control" placeholder="Serving" value={FOOD.food_serving}
          onChange={(e) => setFOOD({...FOOD, food_serving: e.target.value})} />
          <label htmlFor="floatingServing">Serving</label>
        </div>
        <div className="form-floating">
          <input type="text" className="form-control" placeholder="Calories" value={FOOD.food_calories}
          onChange={(e) => setFOOD({...FOOD, food_calories: e.target.value})} />
          <label htmlFor="floatingCalories">Calories</label>
        </div>
        <div className="form-floating">
          <input type="text" className="form-control" placeholder="Carb" value={FOOD.food_carb}
          onChange={(e) => setFOOD({...FOOD, food_carb: e.target.value})} />
          <label htmlFor="floatingCarb">Carb</label>
        </div>
        <div className="form-floating">
          <input type="text" className="form-control" placeholder="Protein" value={FOOD.food_protein}
          onChange={(e) => setFOOD({...FOOD, food_protein: e.target.value})} />
          <label htmlFor="floatingProtein">Protein</label>
        </div>
        <div className="form-floating">
          <input type="text" className="form-control" placeholder="Fat" value={FOOD.food_fat}
          onChange={(e) => setFOOD({...FOOD, food_fat: e.target.value})} />
          <label htmlFor="floatingFat">Fat</label>
        </div>
        <div className="form-floating">
          <input type="text" className="form-control" placeholder="Food Date"
          value={FOOD.food_regdate} readOnly />
          <label htmlFor="food_regdate">Food Date</label>
        </div>
      </div>
    );
  };

  // 6. button ------------------------------------------------------------------------------------>
  const buttonFoodUpdate = () => {
    return (
      <button className="btn btn-primary ms-2" type="button" onClick={flowFoodUpdate}>
        Update
      </button>
    );
  };
  const buttonRefreshPage = () => {
    return (
      <button type="button" className="btn btn-success ms-2" onClick={() => {
        window.location.reload();
      }}>
        Refresh
      </button>
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
      <div className="row d-center mt-5">
        <div className="col-10">
          <form className="form-inline">
            {tableFoodUpdate()}
            <br/>
            {buttonFoodUpdate()}
            {buttonRefreshPage()}
          </form>
        </div>
      </div>
    </div>
  );
};
