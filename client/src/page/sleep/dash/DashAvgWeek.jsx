// DashAvgWeek.tsx

import axios from "axios";
import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {useStorage} from "../../../assets/hooks/useStorage.jsx";
import {BarChart, Bar} from "recharts";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import {Container, Table, FormGroup, FormLabel, FormCheck, Form, ButtonGroup, Button, CardGroup, Card, Row, Col} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const DashAvgWeek = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_SLEEP = process.env.REACT_APP_URL_SLEEP;
  const location = useLocation();
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:LINE, set:setLINE} = useStorage(
    `LINE (avg-week) (${PATH})`, ["취침", "수면", "기상"]
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const DASH_DEFAULT = [
    {name:"", 취침: 0, 수면: 0, 기상: 0}
  ];
  const [DASH, setDASH] = useState(DASH_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const responseWeek = await axios.get(`${URL_SLEEP}/dash/avg/week`, {
      params: {
        user_id: user_id
      },
    });
    setDASH(responseWeek.data.result || DASH_DEFAULT);
  })()}, [user_id]);

  // 5-1. chart ----------------------------------------------------------------------------------->
  const chartNode = () => {
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={350}>
          <BarChart data={DASH} margin={{top: 10, right: 30, bottom: 20, left: 20}}
          barGap={8} barCategoryGap={"20%"}>
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
              domain={[0, 30]}
              ticks={[0, 6, 12, 18, 24, 30]}
              tickFormatter={(tick) => {
                return tick > 24 ? tick -= 24 : tick;
              }}
              tickLine={false}
              axisLine={{stroke:"#e0e0e0"}}
              tick={{fill:"#666", fontSize:14}}
            ></YAxis>
            {LINE.includes("취침") && (
              <Bar dataKey={"취침"} fill="#8884d8" radius={[10, 10, 0, 0]} minPointSize={1}
                onMouseEnter={(data, index) => {
                  data.payload.opacity = 0.5;
                }}
                onMouseLeave={(data, index) => {
                  data.payload.opacity = 1.0;
                }}>
              </Bar>
            )}
            {LINE.includes("기상") && (
              <Bar dataKey={"기상"} fill="#82ca9d" radius={[10, 10, 0, 0]} minPointSize={1}
                onMouseEnter={(data, index) => {
                  data.payload.opacity = 0.5;
                }}
                onMouseLeave={(data, index) => {
                  data.payload.opacity = 1.0;
                }}>
              </Bar>
            )}
            {LINE.includes("수면") && (
              <Bar dataKey={"수면"} fill="#ffc658" radius={[10, 10, 0, 0]} minPointSize={1}
                onMouseEnter={(data, index) => {
                  data.payload.opacity = 0.5;
                }}
                onMouseLeave={(data, index) => {
                  data.payload.opacity = 1.0;
                }}>
              </Bar>
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
              verticalAlign={"bottom"}
              align={"center"}
              wrapperStyle={{lineHeight:"40px", paddingTop:'10px'}}
              iconType={"circle"}
            ></Legend>
          </BarChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 6-1. table ----------------------------------------------------------------------------------->
  const tableNode = () => {
    return (
      <React.Fragment>
        <FormGroup className={"mt-20 ms-30 text-start"}>
          {["취침", "수면", "기상"]?.map((key, index) => (
            <Form key={index} className={"fw-bold mb-10"}>
              <FormCheck
                inline
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
            </Form>
          ))}
        </FormGroup>
      </React.Fragment>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <CardGroup className={"root-wrapper"}>
        <Card className={"container-wrapper"} border={"light"}>
          <Container>
            <Row className={"d-center"}>
            <Col xs={9}>
              <FormLabel className={"fs-20"}>주간 수면 평균</FormLabel>
              {chartNode()}
            </Col>
            <Col xs={3}>
              {tableNode()}
            </Col>
            </Row>
          </Container>
        </Card>
      </CardGroup>
    </React.Fragment>
  );
};