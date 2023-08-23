import React from "react";
import { Link } from "react-router-dom";
import "../assets/css/Custom.css";
import {createGlobalStyle} from "styled-components";
import Sidebar from "./Sidebar";

// ------------------------------------------------------------------------------------------------>
const HeaderStyle = createGlobalStyle`
  .header {
    width: 100%;
    background-color: #343a40;
    color: #fff;
  }

  .nav {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    text-align: center;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
    padding: 0px 0px 30px 0px;
  }

  .form-control-dark {
    border-color: var(--bs-gray);
  }

  .form-control-dark:focus {
    border-color: #fff;
    box-shadow: 0 0 0 .25rem rgba(255, 255, 255, .25);
  }

  .dropdown-toggle {
    outline: 0;
  }
`;

// ------------------------------------------------------------------------------------------------>
const Header = () => {
  const userId = sessionStorage.getItem("userId");

  // ---------------------------------------------------------------------------------------------->
  return (
    <>
      <HeaderStyle />
      <header className="header">
        <div className="row custom-flex-center">
          <div className="d-lg-none d-md-block col-5 custom-flex-left mt-6 ps-10">
            <Sidebar />
          </div>
          <div className="d-lg-block d-none col-6 custom-flex-center mt-6 ps-10">
            <ul className="nav">
              <li>
                <Link to="/" className="nav-link text-hover ms-2 text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/userInfo" className="nav-link text-hover ms-2 text-white">
                  User
                </Link>
              </li>
              <li>
                <Link to="/boardList" className="nav-link text-hover ms-2 text-white">
                  Board
                </Link>
              </li>
              <li>
                <Link to="/calendarList" className="nav-link text-hover ms-2 text-white">
                  Calendar
                </Link>
              </li>
              <li>
                <Link to="/foodList" className="nav-link text-hover ms-2 text-white">
                  Food
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-lg-6 col-7 custom-flex-right pe-10">
            <form className="form-group custom-flex-center">
              {userId !== "false" ? (
                <button
                  type="button"
                  className="btn btn-outline-light ms-2"
                  onClick={() => {
                    sessionStorage.setItem("userId", "false");
                    window.location.reload();
                  }}>
                  Logout
                </button>
              ) : (
                <>
                  <button type="button" className="btn btn-outline-light ms-2" onClick={() => (window.location.href = "/login")}>
                    Login
                  </button>
                  <button type="button" className="btn btn-outline-light ms-2" onClick={() => (window.location.href = "/signup")}>
                    Signup
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
