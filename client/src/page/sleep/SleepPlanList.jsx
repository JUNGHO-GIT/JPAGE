// SleepPlanList.jsx

import axios from "axios";
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import {CalendarNode} from "../../fragments/CalendarNode.jsx";
import {PagingNode} from "../../fragments/PagingNode.jsx";
import {FilterNode} from "../../fragments/FilterNode.jsx";
import {ButtonNode} from "../../fragments/ButtonNode.jsx";
import {Container, Row, Col, Card, Table} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const SleepPlanList = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_SLEEP || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const customer_id = sessionStorage.getItem("customer_id");
  const navParam = useNavigate();
  const location = useLocation();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location?.pathname.trim().toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:SEND, set:setSEND} = useStorage(
    `SEND(${PATH})`, {
      id: "",
      refresh: 0,
      startDt: "0000-00-00",
      endDt: "0000-00-00",
      toDetail:"/sleep/plan/detail"
    }
  );
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      startDt: location_startDt,
      endDt: location_endDt
    }
  );
  const {val:FILTER, set:setFILTER} = useStorage(
    `FILTER(${PATH})`, {
      order: "asc",
      type: "day",
      limit: 5,
      partIdx: 0,
      part: "전체",
      titleIdx: 0,
      title: "전체"
    }
  );
  const {val:PAGING, set:setPAGING} = useStorage(
    `PAGING(${PATH})`, {
      page: 1,
      limit: 5
    }
  );
  const {val:COUNT, set:setCOUNT} = useStorage(
    `COUNT(${PATH})`, {
      totalCnt: 0,
      sectionCnt: 0
    }
  );
  const {val:CALENDAR, set:setCALENDAR} = useStorage(
    `CALENDAR(${PATH})`, {
      calStartOpen: false,
      calEndOpen: false,
      calOpen: false,
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_DEFAULT = [{
    sleep_startDt: "0000-00-00",
    sleep_endDt: "0000-00-00",
    sleep_plan_startDt: "0000-00-00",
    sleep_plan_endDt: "0000-00-00",
    sleep_night: "00:00",
    sleep_morning: "00:00",
    sleep_time: "00:00",
    sleep_plan_night: "00:00",
    sleep_plan_morning: "00:00",
    sleep_plan_time: "00:00",
    sleep_diff_night: "00:00",
    sleep_diff_morning: "00:00",
    sleep_diff_time: "00:00",
    sleep_diff_night_color: "",
    sleep_diff_morning_color: "",
    sleep_diff_time_color: ""
  }];
  const [OBJECT, setOBJECT] = useState(OBJECT_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_OBJECT}/plan/list`, {
      params: {
        customer_id: customer_id,
        duration: `${DATE.startDt} ~ ${DATE.endDt}`,
        FILTER: FILTER,
        PAGING: PAGING
      },
    });
    setOBJECT(response.data.result || OBJECT_DEFAULT);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: response.data.totalCnt || 0,
      sectionCnt: response.data.sectionCnt || 0
    }));
  })()}, [customer_id, DATE.startDt, DATE.endDt, FILTER, PAGING]);

  // 5. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    function tableFragment () {
      return (
        <Table hover responsive border={1}>
          <thead>
            <tr>
              <th className={"table-thead"}>날짜</th>
              <th className={"table-thead"}>분류</th>
              <th className={"table-thead"}>목표</th>
              <th className={"table-thead"}>실제</th>
              <th className={"table-thead"}>비교</th>
            </tr>
          </thead>
          <tbody>
            {OBJECT?.map((item, index) => (
              <React.Fragment key={item._id}>
                <tr>
                  <td rowSpan={4} className={"pointer"} onClick={() => {
                    SEND.id = item._id;
                    SEND.startDt = item.sleep_plan_startDt;
                    SEND.endDt = item.sleep_plan_endDt;
                    navParam(SEND.toDetail, {
                      state: SEND
                    });
                  }}>
                    {item.sleep_plan_startDt}
                  </td>
                </tr>
                <tr>
                  <td>취침</td>
                  <td>{item.sleep_plan_night}</td>
                  <td>{item.sleep_night}</td>
                  <td className={item.sleep_diff_night_color}>{item.sleep_diff_night}</td>
                </tr>
                <tr>
                  <td>기상</td>
                  <td>{item.sleep_plan_morning}</td>
                  <td>{item.sleep_morning}</td>
                  <td className={item.sleep_diff_morning_color}>{item.sleep_diff_morning}</td>
                </tr>
                <tr>
                  <td>수면</td>
                  <td>{item.sleep_plan_time}</td>
                  <td>{item.sleep_time}</td>
                  <td className={item.sleep_diff_time_color}>{item.sleep_diff_time}</td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      );
    };
    return (
      <React.Fragment>
        {tableFragment()}
      </React.Fragment>
    );
  };

  // 6. calendar ---------------------------------------------------------------------------------->
  const calendarNode = () => {
    return (
      <CalendarNode FILTER={FILTER} setFILTER={setFILTER} DATE={DATE} setDATE={setDATE}
        CALENDAR={CALENDAR} setCALENDAR={setCALENDAR}
      />
    );
  };

  // 7. paging ------------------------------------------------------------------------------------>
  const pagingNode = () => {
    return (
      <PagingNode PAGING={PAGING} setPAGING={setPAGING} COUNT={COUNT} setCOUNT={setCOUNT}
        part={"sleep"} plan={"plan"} type={"list"}
      />
    );
  };

  // 8. filter ------------------------------------------------------------------------------------>
  const filterNode = () => {
    return (
      <FilterNode FILTER={FILTER} setFILTER={setFILTER} PAGING={PAGING} setPAGING={setPAGING}
        part={"sleep"} plan={"plan"} type={"list"}
      />
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    return (
      <ButtonNode CALENDAR={CALENDAR} setCALENDAR={setCALENDAR} DATE={DATE} setDATE={setDATE}
        SEND={SEND} FILTER={FILTER} setFILTER={setFILTER} PAGING={PAGING} setPAGING={setPAGING}
        flowSave={""} navParam={navParam} part={"sleep"} plan={"plan"} type={"list"}
      />
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <div className={"root-wrapper"}>
        <Card className={"container-wrapper"}>
          <Container>
            <Row>
              <Col lg={12} md={12} sm={12} xs={12} className={"text-center mb-20"}>
                {calendarNode()}
                {tableNode()}
              </Col>
              <Col lg={12} md={12} sm={12} xs={12} className={"text-center mb-20"}>
                {filterNode()}
              </Col>
              <Col lg={12} md={12} sm={12} xs={12} className={"text-center mb-20"}>
                {pagingNode()}
              </Col>
              <Col lg={12} md={12} sm={12} xs={12} className={"text-center mb-20"}>
                {buttonNode()}
              </Col>
            </Row>
          </Container>
        </Card>
      </div>
    </React.Fragment>
  );
};