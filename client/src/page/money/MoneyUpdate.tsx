// MoneyUpdate.tsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import axios from "axios";
import moment from "moment-timezone";
import {useDeveloperMode} from "../../assets/ts/useDeveloperMode";

// ------------------------------------------------------------------------------------------------>
export const MoneyUpdate = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const TITLE = "Money Update";
  const URL_MONEY = process.env.REACT_APP_URL_MONEY;
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString();
  const navParam = useNavigate();
  const location = useLocation();
  const _id = location.state._id;
  const user_id = window.sessionStorage.getItem("user_id");
  const {log} = useDeveloperMode();

  // 2-1. useStorage ------------------------------------------------------------------------------>

  // 2-2. useState -------------------------------------------------------------------------------->
  const [MONEY, setMONEY] = useState ({});

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchMoneyDetail = async () => {
      try {
        const response = await axios.get(`${URL_MONEY}/moneyDetail`, {
          params: {
            _id : _id,
          },
        });
        setMONEY(response.data);
        log("MONEY : " + JSON.stringify(response.data));
      }
      catch (error:any) {
        alert(`Error fetching money data: ${error.message}`);
        setMONEY([]);
      }
    };
    fetchMoneyDetail();
  }, [_id]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowMoneyUpdate = async () => {
    try {
      const response = await axios.put (`${URL_MONEY}/moneyUpdate`, {
        _id : MONEY._id,
        MONEY : MONEY
      });
      if (response.data === "success") {
        alert("Update success");
        navParam("/moneyListDay");
      }
      else {
        alert("Update failed");
      }
    }
    catch (error:any) {
      alert(`Error fetching money data: ${error.message}`);
    }
  };

  // 4. view -------------------------------------------------------------------------------------->

  // 5. table ------------------------------------------------------------------------------------->
  const tableMoneyUpdate = () => {
    return (
      <div>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            id="user_id"
            placeholder="User ID"
            value={MONEY.user_id ? MONEY.user_id : ""}
            readOnly
          />
          <label htmlFor="user_id">User ID</label>
        </div>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            id="money_amount"
            value={MONEY.money_amount ? MONEY.money_amount : ""}
            placeholder="Amount"
            onChange={(e:any) => {
              setMONEY({
                ...MONEY,
                money_amount: e.target.value,
              });
            }}
          />
          <label htmlFor="money_amount">Amount</label>
        </div>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            id="money_content"
            value={MONEY.money_content ? MONEY.money_content : ""}
            placeholder="Content"
            onChange={(e:any) => {
              setMONEY({
                ...MONEY,
                money_content: e.target.value,
              });
            }}
          />
          <label htmlFor="money_content">Content</label>
        </div>
      </div>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonMoneyUpdate = () => {
    return (
      <button className="btn btn-sm btn-primary ms-2" type="button" onClick={flowMoneyUpdate}>
        Update
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
          <form className="form-inline">
            {tableMoneyUpdate()}
            <br/>
            {buttonMoneyUpdate()}
            {buttonRefreshPage()}
          </form>
        </div>
        </div>
      </div>
    </div>
  );
};