// MoneyDashLineWeek.jsx

import axios from "axios";
import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {useStorage} from "../../../assets/hooks/useStorage.jsx";
import {Line, LineChart} from "recharts";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import {Container, Row, Col, Card, FormCheck} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const MoneyDashLineWeek = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_MONEY || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const location = useLocation();
  const customer_id = sessionStorage.getItem("customer_id");
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:LINE, set:setLINE} = useStorage(
    `LINE (line-week) (${PATH})`, ["수입", "지출"]
  );

  // 2-1. useState -------------------------------------------------------------------------------->
  const OBJECT_DEFAULT = [
    {name:"", 수입: 0, 지출: 0},
  ];
  const [OBJECT, setOBJECT] = useState(OBJECT_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_OBJECT}/dash/line/week`, {
      params: {
        customer_id: customer_id
      },
    });
    setOBJECT(response.data.result || OBJECT_DEFAULT);
  })()}, [customer_id]);

  // 4. handler ----------------------------------------------------------------------------------->
  const handlerCalcY = (value) => {
    const ticks = [];
    const maxValue = Math.max(...value?.map((item) => Math.max(item?.수입, item?.지출)));
    let topValue = Math.ceil(maxValue / 100) * 100;

    // topValue에 따른 동적 틱 간격 설정
    let tickInterval = 10;
    if (topValue > 50) {
      tickInterval = 50;
    }
    else if (topValue > 100) {
      tickInterval = 100;
    }
    else if (topValue > 500) {
      tickInterval = 500;
    }
    else if (topValue > 1000) {
      tickInterval = 1000;
    }
    else if (topValue > 5000) {
      tickInterval = 5000;
    }
    else if (topValue > 10000) {
      tickInterval = 10000;
    }
    for (let i = 0; i <= topValue; i += tickInterval) {
      ticks.push(i);
    }
    return {
      domain: [0, topValue],
      ticks: ticks,
      tickFormatter: (tick) => (`${Number(tick).toLocaleString()}`)
    };
  };

  // 5-2. chart ----------------------------------------------------------------------------------->
  const chartNode = () => {
    const {domain, ticks, tickFormatter} = handlerCalcY(OBJECT);
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={350}>
          <LineChart data={OBJECT} margin={{top: 60, right: 20, bottom: 20, left: -20}}>
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
            {LINE.includes("수입") && (
              <Line dataKey={"수입"} type={"monotone"} stroke={"#82ca9d"} activeDot={{r:8}}
              strokeWidth={2}></Line>
            )}
            {LINE.includes("지출") && (
              <Line dataKey={"지출"} type={"monotone"} stroke={"#ff7300"} activeDot={{r:8}}
              strokeWidth={2}></Line>
            )}
            <Tooltip
              formatter={(value) => (`₩ ${Number(value).toLocaleString()}`)}
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
        {["수입", "지출"]?.map((key, index) => (
          <div key={index} className={"dash-checkbox flex-column mb-20"}>
            <FormCheck
              inline
              key={index}
              type={"switch"}
              checked={LINE.includes(key)}
              onChange={() => {
                if (LINE.includes(key)) {
                  setLINE(LINE?.filter((item) => (item !== key)));
                }
                else {
                  setLINE([...LINE, key]);
                }
              }}
            ></FormCheck>
            <span>{key}</span>
          </div>
        ))}
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
              <Col lg={12} md={12} sm={12} xs={12}>
                <span className={"dash-title"}>주간 지출/수입 추이</span>
              </Col>
            </Row>
            <Row>
              <Col lg={10} md={10} sm={10} xs={10}>
                {chartNode()}
              </Col>
              <Col lg={2} md={2} sm={2} xs={2} style={{alignSelf:"center"}}>
                {tableNode()}
              </Col>
            </Row>
          </Container>
        </Card>
      </div>
    </React.Fragment>
  );
};
