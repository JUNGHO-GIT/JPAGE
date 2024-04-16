// Header.jsx

import React, {useState, useEffect} from "react";
import moment from "moment-timezone";
import {Collapse} from "react-bootstrap";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../assets/hooks/useStorage.jsx";
import {useDeveloperMode} from "../assets/hooks/useDeveloperMode.jsx";
import {dataArray} from "../assets/data/DataArray.jsx";

// ------------------------------------------------------------------------------------------------>
export const Header = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD");
  const navParam = useNavigate();
  const location = useLocation();
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useStorage ------------------------------------------------------------------------------>
  const {isDeveloperMode, toggleDeveloperMode} = useDeveloperMode();
  const {val:SEND, set:setSEND} = useStorage (
    `SEND(${PATH})`, {
      id: "",
      date: koreanDate,
      refresh: 0,
      toLogin: "/user/login",
      toSignup: "/user/signup",
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [isSidebar, setIsSidebar] = useState(true);
  const [isActive, setIsActive] = useState(PATH);
  const [isExpended, setIsExpended] = useState({});

  // 3-1. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setIsActive(location.pathname);
  }, [location.pathname]);

  const toggleExpand = (menuLabel) => {
    setIsExpended(isExpended === menuLabel ? null : menuLabel);
  };

  // 4. sideBar ----------------------------------------------------------------------------------->
  const sideBarNode = () => {

    let preFix;
    let lowFix;

    dataArray.forEach((menu) => {
      if (isActive.includes(menu.label.toLowerCase())) {
        preFix = menu.label;
        lowFix = preFix.toLowerCase()
      }
    });

    function sidBarItem (label, items) {
      return (
        <li className={"text-start pointer mt-30 ps-20"}>
          <div className={`${isActive === label ? "highlight" : ""}`} onClick={() => (
            toggleExpand(label)
          )}>
            {label}
          </div>
          <Collapse in={isExpended === label}>
            <ul>
              {items?.map(({ to, label }) => (
                <li key={to} className={`fs-14 fw-400 ${isActive === to ? "highlight" : ""}`}>
                  <div className={"pointer"} onClick={() => {
                    SEND.startDt = koreanDate;
                    SEND.endDt = koreanDate;
                    navParam(to, {
                      state: SEND
                    });
                    setIsSidebar(false)
                    setIsActive(to);
                  }}>
                    {label}
                  </div>
                </li>
              ))}
            </ul>
          </Collapse>
        </li>
      );
    };

    return (
      <div className={`sidebar ${isSidebar ? "sidebar-open" : "sidebar-closed"} bg-white rounded box-right`}>
        <div className={"d-flex justify-content-between align-items-center text-dark pointer p-10"}>
          <h3 className={"ps-20"}>Changer</h3>
          <p className={"pt-10 pe-10"} onClick={() => setIsSidebar(!isSidebar)}>X</p>
        </div>
        <div className={"d-flex flex-column p-3"}>
          <ul className={"nav nav-pills flex-column mb-auto fs-20 fw-500 text-dark"}>
            {dataArray?.map((menu) => (
              sidBarItem(menu.label, menu.items)
            ))}
          </ul>
        </div>
      </div>
    );
  };

  // 4-3. view ------------------------------------------------------------------------------------>
  const navBarNode = () => {

    let preFix;
    let subFix = isActive.split("/")[1];
    let lowFix;

    dataArray.forEach((menu) => {
      if (isActive.includes(menu.label.toLowerCase())) {
        preFix = menu.label;
        lowFix = preFix.toLowerCase()
      }
    });

    function buttonClear () {
      return (
        <p className={"btn btn-sm btn-danger me-2 pointer"} onClick={() => {
          localStorage.clear();
        }}>
          Clear
        </p>
      );
    };

    return (
      <div className={"d-flex justify-content-between align-items-center"}>
        <div className={"text-start"}>
          <h1 className={"fs-30 fw-500 ps-30"}>{preFix} / {subFix}</h1>
        </div>
        <div className={"text-end d-flex"}>
          {buttonClear()}
        </div>
      </div>
    );
  };

  // 6-1. button ---------------------------------------------------------------------------------->
  const loginNode = () => {
    function btnDevMode () {
      const buttonClass = isDeveloperMode ? "btn btn-sm btn-secondary ms-2" : "btn btn-sm ms-2";
      return (
        <button type={"button"} className={buttonClass} onClick={() => {
          toggleDeveloperMode();
        }}>
          Dev
        </button>
      );
    };
    function btnLogIn () {
      return (
        <button type={"button"} className={"btn btn-sm ms-2"} onClick={() => {
          navParam("/user/login");
        }}>
          Login
        </button>
      );
    };
    function btnSignUp () {
      return (
        <button type={"button"} className={"btn btn-sm ms-2"} onClick={() => {
          navParam("/user/signup");
        }}>
          Signup
        </button>
      );
    };
    function btnLogOut () {
      return (
        <button type={"button"} className={"btn btn-sm ms-2"} onClick={() => {
          sessionStorage.setItem("user_id", "false");
          window.location.reload();
        }}>
          Logout
        </button>
      );
    };
    return (
      (!user_id || user_id === "false") ? (
        <div>
          {btnDevMode()}
          {btnLogIn()}
          {btnSignUp()}
        </div>
      ) : (
        <div>
          {btnDevMode()}
          {btnLogOut()}
        </div>
      )
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div>
      <div className={"container-fluid bg-white box-bottom"}>
        <div className={"row d-center pt-15 pb-15"}>
          <div className={"col-1"}>
            {sideBarNode()}
            <button type={"button"} className={"btn btn-sm ms-2"} onClick={() => {
              setIsSidebar(!isSidebar);
            }}>
              Sidebar
            </button>
          </div>
          <div className={"col-7"}></div>
          <div className={"col-3"}>
            {loginNode()}
          </div>
        </div>
      </div>
      <div className={"root-wrapper"}>
        <div className={"container-fluid"}>
          <div className={"row d-center pt-15 pb-15"}>
            <div className={"col-12"}>
              {navBarNode()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};