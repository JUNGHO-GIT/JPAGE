import React, {useState, useEffect} from "react";
import "../assets/css/Custom.css";
import {createGlobalStyle} from "styled-components";
import {Link} from "react-router-dom";

// ------------------------------------------------------------------------------------------------>
const SidebarStyle = createGlobalStyle`
  .sidebar {
    height: 100%;
    width: 0;
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    background-color: #2D3338;
    overflow: hidden;
    transition: 0.5s;
  }

  .sidebar a {
    text-decoration: none;
    font-size: 25px;
    color: #818181;
    display: block;
    transition: 0.3s;
  }

  .sidebar a:hover {
    color: #f1f1f1;
  }

  .sidebar.open {
    width: 150px;
    align-items: center;
    text-align: left;
    justify-content: center;
    z-index: 900;
    transition: 0.3s;
  }

  .sidebar.close {
    width: 0px;
    transition: 0.3s;
  }

  .sidebar .side-menu {
    padding: 30px 10px 10px 30px;
    font-size: 18px;
    color: #818181;
    display: block;
    transition: 0.3s;
  }

  .sidebar .closeBtn {
    position: absolute;
    top: 0;
    right: 25px;
    font-size: 36px;
    margin-left: 50px;
  }

  .openBtn {
    font-size: 30px;
    cursor: pointer;
    background-color: #343a40;
    color: white;
    padding: 0px 0px 30px 0px;
    border: none;
    margin: 0px 10px 0px 40px;
  }
`;

// ------------------------------------------------------------------------------------------------>
const Sidebar = () => {
  const [sidebar, sidebarOpen] = useState(false);

  let userId = sessionStorage.getItem("userId");
  if (userId !== null) {
    userId = JSON.parse(userId);
  }

  // ---------------------------------------------------------------------------------------------->
  useEffect(() => {

    // -------------------------------------------------------------------------------------------->
    const closeNav = (event: any) => {
      const sidebarElement = document.getElementById("sidebar");
      if (event.target !== sidebarElement && event.target.parentNode !== sidebarElement) {
        sidebarOpen(false);
      }
    };
    window.addEventListener("mouseup", closeNav);

    return () => {
      window.removeEventListener("mouseup", closeNav);
    };
  }, []);

  // ---------------------------------------------------------------------------------------------->
  return (
    <>
      <SidebarStyle />
      <button className="openBtn" onClick={() => sidebarOpen(true)}>
        ☰
      </button>
      <div id="sidebar" className={`sidebar ${sidebar ? "open" : "close"}`}>
        <a className="closeBtn" onClick={() => sidebarOpen(false)}>
          ×
        </a>
        <Link to="/" className="side-menu linkHover">
          Home
        </Link>
        {!userId ? (
          <div>
            <Link to="/login" className="side-menu linkHover">
              Login
            </Link>
            <Link to="/signup" className="side-menu linkHover">
              SignUp
            </Link>
          </div>
        ) : (
          <a onClick={() => {
              sessionStorage.setItem("userId", "false");
              window.location.href = "/login";
            }}
            className="side-menu linkHover">
            Logout
          </a>
        )}
        <Link to="/userInfo" className="side-menu linkHover">
          User
        </Link>
        <Link to="/boardList" className="side-menu linkHover">
          Board
        </Link>
        <Link to="/calendarList" className="side-menu linkHover">
          Calendar
        </Link>
        <Link to="/foodList" className="side-menu linkHover">
          Food
        </Link>
        <Link to="/nutritionList" className="side-menu linkHover">
          Nutrition
        </Link>
        <hr />
      </div>
      <div className={`${sidebar ? "margin-left" : ""}`}></div>
    </>
  );
};

export default Sidebar;
