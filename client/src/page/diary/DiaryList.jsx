// DiaryList.jsx

import axios from "axios";
import Calendar from "react-calendar";
import React, {useState, useEffect} from "react";
import moment from "moment-timezone";
import {useLocation, useNavigate} from "react-router-dom";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import {Container, Row, Col, Card} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const DiaryList = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_DIARY || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const customer_id = window.sessionStorage.getItem("customer_id");
  const navParam = useNavigate();
  const location = useLocation();
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:SEND, set:setSEND} = useStorage(
    `SEND(${PATH})`, {
      id: "",
      refresh: 0,
      startDt: "0000-00-00",
      endDt: "0000-00-00",
      category: "",
      toDetail: "/diary/detail"
    }
  );
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      startDt: moment().startOf("month").format("YYYY-MM-DD"),
      endDt: moment().endOf("month").format("YYYY-MM-DD")
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_DEFAULT = [{
    customer_id: customer_id,
    diary_number: 0,
    diary_startDt: "0000-00-00",
    diary_endDt: "0000-00-00",
    diary_category: "",
    diary_color: "",
    diary_detail: ""
  }];
  const [OBJECT, setOBJECT] = useState(OBJECT_DEFAULT);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_OBJECT}/list`, {
      params: {
        customer_id: customer_id,
        duration: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    setOBJECT(response.data.result || OBJECT_DEFAULT);
  })()}, [customer_id, DATE.startDt, DATE.endDt]);

  // 5. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    const dateInRange = (date, startDt, endDt) => {
      const currDate = moment(date).format("YYYY-MM-DD");
      return currDate >= startDt && currDate <= endDt;
    };
    return (
      <React.Fragment>
        <Calendar
          locale={"ko"}
          value={new Date()}
          showNavigation={true}
          showNeighboringMonth={true}
          view={"month"}
          tileContent={({ date, view }) => {
            const diaryForDates = OBJECT?.filter((diary) => (
              dateInRange(date, diary.diary_startDt, diary.diary_endDt)
            ));
            return diaryForDates.length > 0 ? (
              diaryForDates?.map((diary) => (
                <div key={diary._id}>
                  <p className="calendar-filled"
                    style={{ backgroundColor: diary.diary_color }}
                    onClick={() => {
                      SEND.id = diary._id;
                      SEND.startDt = diary.diary_startDt;
                      SEND.endDt = diary.diary_endDt;
                      SEND.category = diary.diary_category;
                      navParam(SEND.toDetail, {
                        state: SEND
                      });
                    }}>
                  </p>
                </div>
              ))
            ) : (
              <React.Fragment>
                <span onClick={() => {
                  SEND.id = "";
                  SEND.startDt = moment(date).format("YYYY-MM-DD");
                  SEND.endDt = moment(date).format("YYYY-MM-DD");
                  SEND.category = "";
                  navParam(SEND.toDetail, {
                    state: SEND
                  });
                }}>
                  +
                </span>
                <div key={date.toISOString()}>
                  <p className="calendar-unfilled"></p>
                </div>
              </React.Fragment>
            );
          }}
        ></Calendar>
      </React.Fragment>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <div className={"root-wrapper"}>
        <Card className={"container-wrapper"} border={"light"}>
          <Container>
            <Row>
              <Col xs={12} className={"mb-20 text-center"}>
                {tableNode()}
              </Col>
            </Row>
          </Container>
        </Card>
      </div>
    </React.Fragment>
  );
}