// SleepDashLine.jsx

import axios from "axios";
import React, {useEffect, useState} from "react";

import {Header} from "../../../layout/Header.jsx";
import {NavBar} from "../../../layout/NavBar.jsx";
import {Loading} from "../../../fragments/Loading.jsx";
import {handlerY} from "../../../assets/js/handlerY.js";
import {Line, LineChart} from "recharts";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import {Container, Row, Col, Card, FormCheck} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const SleepDashLine = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_SLEEP || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id");
  const array = ["취침", "수면", "기상"];

  // 2-1. useState -------------------------------------------------------------------------------->
  const [LOADING, setLOADING] = useState(true);
  const [SECTION, setSECTION] = useState("month");
  const [PART, setPART] = useState(array);

  // 2-1. useState -------------------------------------------------------------------------------->
  const OBJECT_WEEK_DEF = [
    {name:"", 취침: 0, 기상: 0, 수면: 0},
  ];
  const OBJECT_MONTH_DEF = [
    {name:"", 취침: 0, 기상: 0, 수면: 0},
  ];
  const [OBJECT_WEEK, setOBJECT_WEEK] = useState(OBJECT_WEEK_DEF);
  const [OBJECT_MONTH, setOBJECT_MONTH] = useState(OBJECT_MONTH_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const resWeek = await axios.get(`${URL_OBJECT}/dash/line/week`, {
      params: {
        user_id: user_id
      },
    });
    const resMonth = await axios.get(`${URL_OBJECT}/dash/line/month`, {
      params: {
        user_id: user_id
      },
    });
    setOBJECT_WEEK(
      resWeek.data.result.length > 0 ? resWeek.data.result : OBJECT_WEEK_DEF
    );
    setOBJECT_MONTH(
      resMonth.data.result.length > 0 ? resMonth.data.result : OBJECT_MONTH_DEF
    );
    setLOADING(false);
  })()}, [user_id]);

  // 5-1. chart ----------------------------------------------------------------------------------->
  const chartWeek = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_WEEK, array, "sleep");
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={350}>
          <LineChart data={OBJECT_WEEK} margin={{top: 60, right: 20, bottom: 20, left: -20}}>
            <CartesianGrid strokeDasharray={"3 3"} stroke={"#f5f5f5"}></CartesianGrid>
            <XAxis
              type={"category"}
              dataKey={"name"}
              tickLine={false}
              axisLine={{stroke:"#e0e0e0"}}
              tick={{fill:"#666", fontSize:14}}
            ></XAxis>
            <YAxis
              type={"number"}
              domain={domain}
              ticks={ticks}
              tickFormatter={tickFormatter}
              tickLine={false}
              axisLine={{stroke:"#e0e0e0"}}
              tick={{fill:"#666", fontSize:14}}
            ></YAxis>
            {PART.includes("취침") && (
              <Line dataKey={"취침"} type={"monotone"} stroke={"#8884d8"} activeDot={{r:8}}
              strokeWidth={2}></Line>
            )}
            {PART.includes("기상") && (
              <Line dataKey={"기상"} type={"monotone"} stroke={"#ffc658"} activeDot={{r:8}}
              strokeWidth={2}></Line>
            )}
            {PART.includes("수면") && (
              <Line dataKey={"수면"} type={"monotone"} stroke={"#82ca9d"} activeDot={{r:8}}
              strokeWidth={2}></Line>
            )}
            <Tooltip
              formatter={(value) => (`${Number(value).toLocaleString()}`)}
              cursor={{fill:"rgba(0, 0, 0, 0.1)"}}
              contentStyle={{
                borderRadius:"10px",
                boxShadow:"0 2px 4px 0 rgba(0, 0, 0, 0.1)",
                padding:"10px",
                border:"none",
                background:"#fff",
                color:"#666"
              }}
            ></Tooltip>
            <Legend
              iconType={"circle"}
              verticalAlign={"bottom"}
              align={"center"}
              wrapperStyle={{
                lineHeight:"40px", paddingTop:"10px", fontSize:"12px", marginLeft:"20px"
              }}
            ></Legend>
          </LineChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 5-2. chart ----------------------------------------------------------------------------------->
  const chartMonth = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_MONTH, array, "sleep");
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={350}>
          <LineChart data={OBJECT_MONTH} margin={{top: 60, right: 20, bottom: 20, left: -20}}>
            <CartesianGrid strokeDasharray={"3 3"} stroke={"#f5f5f5"}></CartesianGrid>
            <XAxis
              type={"category"}
              dataKey={"name"}
              tickLine={false}
              axisLine={{stroke:"#e0e0e0"}}
              tick={{fill:"#666", fontSize:14}}
            ></XAxis>
            <YAxis
              type={"number"}
              domain={domain}
              ticks={ticks}
              tickFormatter={tickFormatter}
              tickLine={false}
              axisLine={{stroke:"#e0e0e0"}}
              tick={{fill:"#666", fontSize:14}}
            ></YAxis>
            {PART.includes("취침") && (
              <Line dataKey={"취침"} type={"monotone"} stroke={"#8884d8"} activeDot={{r:8}}
              strokeWidth={2}></Line>
            )}
            {PART.includes("기상") && (
              <Line dataKey={"기상"} type={"monotone"} stroke={"#ffc658"} activeDot={{r:8}}
              strokeWidth={2}></Line>
            )}
            {PART.includes("수면") && (
              <Line dataKey={"수면"} type={"monotone"} stroke={"#82ca9d"} activeDot={{r:8}}
              strokeWidth={2}></Line>
            )}
            <Tooltip
              formatter={(value) => (`${Number(value).toLocaleString()}`)}
              cursor={{fill:"rgba(0, 0, 0, 0.1)"}}
              contentStyle={{
                borderRadius:"10px",
                boxShadow:"0 2px 4px 0 rgba(0, 0, 0, 0.1)",
                padding:"10px",
                border:"none",
                background:"#fff",
                color:"#666"
              }}
            ></Tooltip>
            <Legend
              iconType={"circle"}
              verticalAlign={"bottom"}
              align={"center"}
              wrapperStyle={{
                lineHeight:"40px", paddingTop:"10px", fontSize:"12px", marginLeft:"20px"
              }}
            ></Legend>
          </LineChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 5-3. table ----------------------------------------------------------------------------------->
  const tableNode = () => {
    return (
      <React.Fragment>
        {["취침", "기상", "수면"]?.map((key, index) => (
          <div key={index} className={"dash-checkbox flex-column mb-10"}>
            <FormCheck
              inline
              type={"switch"}
              checked={PART.includes(key)}
              onChange={() => {
                if (PART.includes(key)) {
                  setPART(PART?.filter((item) => (item !== key)));
                }
                else {
                  setPART([...PART, key]);
                }
              }}
            ></FormCheck>
            <span>{key}</span>
          </div>
        ))}
      </React.Fragment>
    );
  };

  // 8. loading ----------------------------------------------------------------------------------->
  const loadingNode = () => (
    <Loading LOADING={LOADING} setLOADING={setLOADING}
    />
  );

  // 9. header ------------------------------------------------------------------------------------>
  const headerNode = () => (
    <Header />
  );

  // 10. navBar ----------------------------------------------------------------------------------->
  const navBarNode = () => (
    <NavBar />
  );

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <div className={"content-wrapper"}>
        <Card className={"card-wrapper"}>
          <Container>
            <Row>
              <Col lg={3} md={3} sm={3} xs={3} className={"text-center"}>
                <select className={"form-select form-select-sm"}
                  onChange={(e) => (setSECTION(e.target.value))}
                  value={SECTION}
                >
                  <option value={"week"}>주간</option>
                  <option value={"month"}>월간</option>
                </select>
              </Col>
              <Col lg={6} md={6} sm={6} xs={6} className={"text-center"}>
                <span className={"dash-title"}>수면 추이</span>
              </Col>
              <Col lg={3} md={3} sm={3} xs={3}>
                <span></span>
              </Col>
            </Row>
            <Row>
              <Col lg={10} md={10} sm={10} xs={10}>
                {SECTION === "week" && (LOADING ? loadingNode() : chartWeek())}
                {SECTION === "month" && (LOADING ? loadingNode() : chartMonth())}
              </Col>
              <Col lg={2} md={2} sm={2} xs={2} style={{alignSelf:"center"}}>
                {LOADING ? "" : tableNode()}
              </Col>
            </Row>
          </Container>
        </Card>
      </div>
    </React.Fragment>
  );
};
