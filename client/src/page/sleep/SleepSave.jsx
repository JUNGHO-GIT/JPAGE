// SleepSave.jsx

import axios from "axios";
import React, {useState, useEffect} from "react";
import InputMask from "react-input-mask";
import {useNavigate, useLocation} from "react-router-dom";
import {TimePicker} from "react-time-picker";
import {percent} from "../../assets/js/percent.js";
import {useStorage} from "../../hooks/useStorage.jsx";
import {useTime} from "../../hooks/useTime.jsx";
import {useDate} from "../../hooks/useDate.jsx";
import {DateNode} from "../../fragments/DateNode.jsx";
import {ButtonNode} from "../../fragments/ButtonNode.jsx";
import {LoadingNode} from "../../fragments/LoadingNode.jsx";
import {Container, Row, Col, Card} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const SleepSave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_SLEEP || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id");
  const navParam = useNavigate();
  const location = useLocation();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location?.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const [LOADING, setLOADING] = useState(true);
  const [SEND, setSEND] = useState({
    id: "",
    refresh: 0,
    startDt: "0000-00-00",
    endDt: "0000-00-00",
    toList:"/sleep/list"
  });
  const [COUNT, setCOUNT] = useState({
    totalCnt: 0,
    sectionCnt: 0
  });
  const [DAYPICKER, setDAYPICKER] = useState({
    dayStartOpen: false,
    dayEndOpen: false,
    dayOpen: false,
  });

  // 2-2. useState -------------------------------------------------------------------------------->
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      startDt: location_startDt,
      endDt: location_endDt
    }
  );

  // 2-3. useState -------------------------------------------------------------------------------->
  const OBJECT_DEF = {
    _id: "",
    sleep_number: 0,
    sleep_demo: false,
    sleep_startDt: "0000-00-00",
    sleep_endDt: "0000-00-00",
    sleep_section: [{
      sleep_night: "00:00",
      sleep_morning: "00:00",
      sleep_time: "00:00",
    }],
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);
  useTime(OBJECT, setOBJECT, PATH, "real");

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const res = await axios.get(`${URL_OBJECT}/detail`, {
      params: {
        user_id: user_id,
        _id: "",
        duration: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    setOBJECT(res.data.result || OBJECT_DEF);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: res.data.totalCnt || 0,
      sectionCnt: res.data.sectionCnt || 0
    }));
    setLOADING(false);
  })()}, [user_id, DATE.startDt, DATE.endDt]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const res = await axios.post(`${URL_OBJECT}/save`, {
      user_id: user_id,
      OBJECT: OBJECT,
      duration: `${DATE.startDt} ~ ${DATE.endDt}`,
    });
    if (res.data.status === "success") {
      alert(res.data.msg);
      percent();
      SEND.startDt = DATE.startDt;
      SEND.endDt = DATE.endDt;
      navParam(SEND.toList, {
        state: SEND
      });
    }
    else {
      alert(res.data.msg);
    }
  };

  // 4. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    const tableSection = () => (
      <React.Fragment>
        <Row className={"d-center"}>
          <Col lg={12} md={12} sm={12} xs={12}>
            <div className={"input-group"}>
              <span className={"input-group-text"}>취침</span>
              <TimePicker
                locale={"ko"}
                format={"HH:mm"}
                id={"sleep_night"}
                name={"sleep_night"}
                className={"form-control"}
                clockIcon={null}
                disabled={false}
                disableClock={false}
                value={OBJECT?.sleep_section[0]?.sleep_night}
                onChange={(e) => {
                  setOBJECT((prev) => ({
                    ...prev,
                    sleep_section: [{
                      ...prev?.sleep_section[0],
                      sleep_night: e ? e.toString() : "",
                    }],
                  }));
                }}
              ></TimePicker>
            </div>
          </Col>
          <Col lg={12} md={12} sm={12} xs={12}>
            <div className={"input-group"}>
              <span className={"input-group-text"}>기상</span>
              <TimePicker
                locale={"ko"}
                format={"HH:mm"}
                id={"sleep_morning"}
                name={"sleep_morning"}
                className={"form-control"}
                clockIcon={null}
                disabled={false}
                disableClock={false}
                value={OBJECT?.sleep_section[0]?.sleep_morning}
                onChange={(e) => {
                  setOBJECT((prev) => ({
                    ...prev,
                    sleep_section: [{
                      ...prev?.sleep_section[0],
                      sleep_morning: e ? e.toString() : "",
                    }],
                  }));
                }}
              ></TimePicker>
            </div>
          </Col>
          <Col lg={12} md={12} sm={12} xs={12}>
            <div className={"input-group"}>
              <span className={"input-group-text"}>수면</span>
              <TimePicker
                locale={"ko"}
                format={"HH:mm"}
                id={"sleep_time"}
                name={"sleep_time"}
                className={"form-control"}
                disabled={true}
                clockIcon={null}
                disableClock={false}
                value={OBJECT?.sleep_section[0]?.sleep_time}
              ></TimePicker>
            </div>
          </Col>
        </Row>
      </React.Fragment>
    );
    return (
      <React.Fragment>
        <div className={"save-wrapper"}>
          {tableSection()}
        </div>
      </React.Fragment>
    );
  };

  // 6. loading ----------------------------------------------------------------------------------->
  const loadingNode = () => (
    <LoadingNode LOADING={LOADING} setLOADING={setLOADING}
    />
  );

  // 7. date -------------------------------------------------------------------------------------->
  const dateNode = () => (
    <DateNode DATE={DATE} setDATE={setDATE} DAYPICKER={DAYPICKER} setDAYPICKER={setDAYPICKER}
      part={"sleep"} plan={""} type={"save"}
    />
  );

  // 11. button ----------------------------------------------------------------------------------->
  const buttonNode = () => (
    <ButtonNode DAYPICKER={DAYPICKER} setDAYPICKER={setDAYPICKER} DATE={DATE} setDATE={setDATE}
      SEND={SEND}  FILTER={""} setFILTER={""} PAGING={""} setPAGING={""}
      flowSave={flowSave} navParam={navParam} part={"sleep"} plan={""} type={"save"}
    />
  );

  // 12. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <div className={"content-wrapper"}>
        <Card className={"card-wrapper"}>
          <Container fluid={true}>
            <Row>
              <Col lg={12} md={12} sm={12} xs={12} className={"d-center"}>
                {dateNode()}
              </Col>
            </Row>
          </Container>
        </Card>
      </div>
      <div className={"content-wrapper"}>
        <Card className={"card-wrapper"}>
          <Container fluid={true}>
            <Row>
              <Col lg={12} md={12} sm={12} xs={12} className={"text-center"}>
                {LOADING ? loadingNode() : tableNode()}
              </Col>
            </Row>
          </Container>
        </Card>
      </div>
      <div className={"content-wrapper"}>
        <Card className={"card-wrapper"}>
          <Container fluid={true}>
            <Row>
              <Col lg={12} md={12} sm={12} xs={12} className={"d-center"}>
                {buttonNode()}
              </Col>
            </Row>
          </Container>
        </Card>
      </div>
    </React.Fragment>
  );
};
