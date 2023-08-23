import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

import "bootstrap/dist/js/bootstrap.bundle.min.js";

import "./App.css";
import "../assets/css/Custom.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "aos/dist/aos.css";
import "boxicons/css/boxicons.min.css";

import Resize from "../components/Resize";
import Loader from "../components/Loader";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import Hover from "../components/Hover";

import SecretKeys from "../assets/ts/SecretKeys";
import Main from "../page/common/Main";

import Login from "../page/user/Login";
import UserInfo from "../page/user/UserInfo";
import UserUpdate from "../page/user/UserUpdate";
import UserDelete from "../page/user/UserDelete";
import UserList from "../page/admin/UserList";

import BoardList from "../page/board/BoardList";
import BoardWrite from "../page/board/BoardWrite";
import BoardDetail from "../page/board/BoardDetail";
import BoardUpdate from "../page/board/BoardUpdate";

import CalendarList from "../page/calendar/CalendarList";
import FoodList from "../page/food/FoodList";
import FoodDetail from "../page/food/FoodDetail";

// ------------------------------------------------------------------------------------------------>
const App = () => {

  // ---------------------------------------------------------------------------------------------->
  return (
    <div className="App">
      <Loader />
      <Resize />
      <Hover />
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SecretKeys />} />
          <Route path="/userInfo" element={<UserInfo />} />
          <Route path="/userList" element={<UserList />} />
          <Route path="/userUpdate" element={<UserUpdate />} />
          <Route path="/userDelete" element={<UserDelete />} />
          <Route path="/boardList" element={<BoardList />} />
          <Route path="/boardWrite" element={<BoardWrite />} />
          <Route path="/boardDetail/:_id" element={<BoardDetail />} />
          <Route path="/boardUpdate/:_id" element={<BoardUpdate />} />
          <Route path="/calendarList" element={<CalendarList />} />
          <Route path="/foodList" element={<FoodList />} />
          <Route path="/foodDetail" element={<FoodDetail />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
