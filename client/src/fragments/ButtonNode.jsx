// ButtonNode.jsx

import React from "react";
import "moment/locale/ko";
import moment from "moment-timezone";
import {Button} from "@mui/material";

// 11. button ------------------------------------------------------------------------------------->
export const ButtonNode = ({
  DAYPICKER, setDAYPICKER, DATE, setDATE, SEND, FILTER, setFILTER, PAGING, setPAGING,
  flowSave, navParam, part, plan, type
}) => {

  // 1. common ------------------------------------------------------------------------------------>
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD");

  // 11. button ----------------------------------------------------------------------------------->
  const btnOpenCalendar = () => (
    <React.Fragment>
      <Button size={"small"} type={"button"} color={"primary"} variant={"contained"}
      className={"primary-btn"} onClick={() => {
        setDAYPICKER((prev) => ({
          ...prev,
          dayOpen: !prev.dayOpen,
        }));
      }}>
        달력
      </Button>
    </React.Fragment>
  );
  const btnGetToday = () => (
    <React.Fragment>
      <Button size={"small"} type={"button"} color={"success"} variant={"contained"}
      className={"success-btn"} onClick={() => {
        setFILTER((prev) => ({
          ...prev,
          type: "day",
        }));
        setPAGING((prev) => ({
          ...prev,
          page: 1,
        }));
        setDATE((prev) => ({
          ...prev,
          startDt: koreanDate,
          endDt: koreanDate,
        }));
      }}>
        Today
      </Button>
    </React.Fragment>
  );
  const btnToSave = () => (
    <React.Fragment>
      <Button size={"small"} type={"button"} color={"primary"} variant={"contained"}
      className={"primary-btn"} onClick={() => {
        flowSave();
      }}>
        Save
      </Button>
    </React.Fragment>
  );
  const btnToUpdate = () => (
    <React.Fragment>
      <Button size={"small"} type={"button"} color={"primary"} variant={"contained"}
      className={"primary-btn"} onClick={() => {
        SEND.startDt = DATE.startDt;
        SEND.endDt = DATE.endDt;
        navParam(SEND.toUpdate, {
          state: SEND,
        });
      }}>
        Update
      </Button>
    </React.Fragment>
  );
  const btnToList = () => (
    <React.Fragment>
      <Button size={"small"} type={"button"} color={"secondary"} variant={"contained"}
      className={"secondary-btn"} onClick={() => {
        SEND.startDt = DATE.startDt;
        SEND.endDt = DATE.endDt;
        navParam(SEND.toList, {
          state: SEND,
        });
      }}>
        List
      </Button>
    </React.Fragment>
  );
  const btnToSearch = () => (
    <React.Fragment>
      <Button size={"small"} type={"button"} color={"secondary"} variant={"contained"}
      className={"secondary-btn"} onClick={() => {
        SEND.startDt = DATE.startDt;
        SEND.endDt = DATE.endDt;
        navParam(SEND.toSearch, {
          state: SEND,
        });
      }}>
        Search
      </Button>
    </React.Fragment>
  );
  const btnLogin = () => (
    <React.Fragment>
      <Button size={"small"} type={"button"} color={"primary"} variant={"contained"}
      className={"primary-btn"} onClick={() => {
        flowSave();
      }}>
        Log In
      </Button>
    </React.Fragment>
  );
  const btnSignup = () => (
    <React.Fragment>
      <Button size={"small"} type={"button"} color={"primary"} variant={"contained"}
      className={"primary-btn"} onClick={() => {
        flowSave();
      }}>
        Sign Up
      </Button>
    </React.Fragment>
  );
  const btnRefresh = () => (
    <React.Fragment>
      <Button size={"small"} type={"button"} color={"success"} variant={"contained"}
      className={"success-btn"} onClick={() => {
        navParam(0);
      }}>
        Refresh
      </Button>
    </React.Fragment>
  );

  // 5. return ------------------------------------------------------------------------------------>
  return (
    <React.Fragment>
      <div className={"flex-wrapper h-4vh"}>
        {type === "list" ? (
          <React.Fragment>
            {btnOpenCalendar()}
            {btnGetToday()}
          </React.Fragment>
        ) : type === "detail" ? (
          <React.Fragment>
            {btnToUpdate()}
            {btnToList()}
          </React.Fragment>
        ) : type === "save" ? (
          <React.Fragment>
            {btnToSave()}
            {btnToList()}
          </React.Fragment>
        ) : type === "search" ? (
          <React.Fragment>
            {btnToSave()}
            {btnToSearch()}
          </React.Fragment>
        ) : type === "dataset" ? (
          <React.Fragment>
            {btnToSave()}
          </React.Fragment>
        ) : type === "login" ? (
          <React.Fragment>
            {btnLogin()}
            {btnRefresh()}
          </React.Fragment>
        ) : type === "signup" ? (
          <React.Fragment>
            {btnSignup()}
            {btnRefresh()}
          </React.Fragment>
        ) : null}
      </div>
    </React.Fragment>
  );
};