// UserUpdate.tsx

import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {useDeveloperMode} from "../../assets/ts/useDeveloperMode";

// ------------------------------------------------------------------------------------------------>
export const UserUpdate = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const TITLE = "User Update";
  const URL_USER = process.env.REACT_APP_URL_USER;
  const navParam = useNavigate();
  const user_id = window.sessionStorage.getItem("user_id");
  const {log} = useDeveloperMode();

  // 2-1. useStorage ------------------------------------------------------------------------------>

  // 2-2. useState -------------------------------------------------------------------------------->
  const [USER, setUSER] = useState ({});

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchUserUpdate = async () => {
      try {
        const response = await axios.post (`${URL_USER}/userDetail`, {
          user_id: user_id,
        });
        setUSER(response.data);
        log("USER : " + JSON.stringify(response.data));
      }
      catch (error) {
        alert(`Error fetching user data: ${error.message}`);
      }
    };
    fetchUserUpdate();
  }, []);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowUserUpdate = async () => {
    try {
      if (USER.user_pw === "") {
        alert("Please enter your password");
        return;
      }
      else {
        const response = await axios.post (`${URL_USER}/userCheckIdPw`, {
          user_id : user_id,
          user_pw : USER.user_pw,
        });
        if (response.data === "fail") {
          alert("Incorrect password");
          return;
        }
        else if (response.data === "success") {
          const updatePw = prompt("Please enter a new password");
          const response = await axios.put(`${URL_USER}/userUpdate`, {
            user_id : user_id,
            user_pw : updatePw
          });
          if (response.data === "success") {
            alert("User Update success");
            navParam("/");
          }
          else if (response.data === "fail") {
            alert("User Update fail");
          }
          else {
            alert("Error Ocurred in User Update");
          }
        }
      }
    }
    catch (error) {
      alert(`Error fetching user data: ${error.message}`);
    }
  };

  // 4. view -------------------------------------------------------------------------------------->

  // 5. table ------------------------------------------------------------------------------------->
  const tableUserUpdate = () => {
    return (
      <div>
        <div className="form-floating">
          <input type="text"
            className="form-control"
            id="user_id"
            placeholder="User ID"
            value={user_id ? user_id : undefined}
            onChange={(e:any) => {
              setUSER({...USER, user_id: e.target.value});
            }}
            readOnly
          />
          <label htmlFor="user_id">User ID</label>
        </div>
        <div className="form-floating">
          <input type="text"
            className="form-control"
            id="user_pw"
            placeholder="User PW"
            value={USER.user_pw}
            onChange={(e:any) => {
              setUSER({...USER, user_pw: e.target.value});
            }}
          />
          <label htmlFor="user_pw">User PW</label>
        </div>
      </div>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonUserUpdate = () => {
    return (
      <button type="button" className="btn btn-sm btn-primary ms-2" onClick={flowUserUpdate}>
        User Update
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
              {tableUserUpdate()}
              <br/>
              {buttonUserUpdate()}
              {buttonRefreshPage()}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};