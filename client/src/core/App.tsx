// react ------------------------------------------------------------------------------------------>
import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

// plugins ---------------------------------------------------------------------------------------->
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// css -------------------------------------------------------------------------------------------->
import "./App.css";
import "../assets/css/Custom.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "aos/dist/aos.css";
import "boxicons/css/boxicons.min.css";

// components1 ------------------------------------------------------------------------------------>
import Resize from "../components/Resize";
import Loader from "../components/Loader";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import Hover from "../components/Hover";

// components2 ------------------------------------------------------------------------------------>
import Main from "../page/Main";
import Login from "../page/Login";
import SecretKey from "../assets/ts/SecretKey";
import MyPage from "../page/MyPage";

// ------------------------------------------------------------------------------------------------>
const App = () => {

  Hover();

  return (
    <div className="App">
      <Loader />
      <Resize />
      <Header />
        <Router>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SecretKey />} />
            <Route path="/myPage" element={<MyPage />} />
          </Routes>
        </Router>
      <Footer />
    </div>
  );
};

export default App;