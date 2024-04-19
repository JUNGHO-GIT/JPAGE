// SideBar.jsx

import React, {useState, useEffect} from "react";
import moment from "moment-timezone";
import {useNavigate, useLocation} from "react-router-dom";
import {dataArray} from "../assets/data/DataArray.jsx";
import {useStorage} from "../assets/hooks/useStorage.jsx";
import {Container, Table, FormGroup, Form, FormLabel, ButtonGroup, Button, CardGroup, Card, Row, Col, Collapse} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const SideBar = ({ sidebar, onClose }) => {

  // 1. common ------------------------------------------------------------------------------------>
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD");
  const navParam = useNavigate();
  const location = useLocation();
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useStorage ------------------------------------------------------------------------------>
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
  const [isSidebar, setIsSidebar] = useState(sidebar);
  const [isActive, setIsActive] = useState(PATH);
  const [isExpended, setIsExpended] = useState({});

  // 3-1. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setIsSidebar(sidebar);
  }, [sidebar]);

  // 3-1. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setIsActive(location.pathname);
  }, [location.pathname]);

  // 4. toggle ------------------------------------------------------------------------------------>
  const toggleExpand = (menuLabel) => {
    setIsExpended(isExpended === menuLabel ? null : menuLabel);
  };

  let preFix;
  let lowFix;

  dataArray.forEach((menu) => {
    if (isActive.includes(menu.label.toLowerCase())) {
      preFix = menu.label;
      lowFix = preFix.toLowerCase()
    }
  });

  // 5. node -------------------------------------------------------------------------------------->
  const sidBarItem = (label, items) => {
    return (
      <li className={"text-start pointer mt-30 ps-20"}>
        <Form className={`${isActive === label ? "highlight" : ""}`} onClick={() => (
          toggleExpand(label)
        )}>
          {label}
        </Form>
        <Collapse in={isExpended === label}>
          <ul>
            {items?.map(({ to, label }) => (
              <li key={to} className={`fs-14 fw-400 ${isActive === to ? "highlight" : ""}`}>
                <Form className={"pointer"} onClick={() => {
                  SEND.startDt = koreanDate;
                  SEND.endDt = koreanDate;
                  navParam(to, {
                    state: SEND
                  });
                  setIsSidebar(false)
                  setIsActive(to);
                }}>
                  {label}
                </Form>
              </li>
            ))}
          </ul>
        </Collapse>
      </li>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <FormGroup className={`sidebar ${isSidebar ? "sidebar-open" : "sidebar-closed"} bg-white rounded box-right`}>
      <Form className={"d-flex justify-content-between align-items-center text-dark pointer p-10"}>
        <FormLabel className={"ps-20 fs-40"}>Changer</FormLabel>
        <FormLabel className={"pt-10 pe-10 fs-20 pointer"} onClick={onClose}>X</FormLabel>
      </Form>
      <Form className={"d-flex flex-column p-3"}>
        <ul className={"nav nav-pills flex-column mb-auto fs-20 fw-500 text-dark"}>
          {dataArray?.map((menu) => (
            sidBarItem(menu.label, menu.items))
          )}
        </ul>
      </Form>
    </FormGroup>
  );
};