// ExerciseDashPieMonth.jsx

import axios from "axios";
import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {useStorage} from "../../../assets/hooks/useStorage.jsx";
import {PieChart, Pie, Cell, ResponsiveContainer, Tooltip} from "recharts";
import {Container, Row, Col, Card} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const ExerciseDashPieMonth = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_EXERCISE || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const location = useLocation();
  const customer_id = sessionStorage.getItem("customer_id");
  const PATH = location.pathname?.trim()?.toString();

  // pie
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
  document.body.appendChild(svg);
  svg.appendChild(textElement);

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:LINE, set:setLINE} = useStorage(
    `LINE (pie-month) (${PATH})`, "part"
  );
  const {val:radius, set:setRadius} = useStorage(
    `RADIUS (pie-month) (${PATH})`, 120
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_PART_DEFAULT = [
    {name:"", value: 100}
  ];
  const OBJECT_TITLE_DEFAULT = [
    {name:"", value: 100}
  ];
  const [OBJECT_PART, setOBJECT_PART] = useState(OBJECT_PART_DEFAULT);
  const [OBJECT_TITLE, setOBJECT_TITLE] = useState(OBJECT_TITLE_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const updateRadius = () => {
      // lg
      if (window.innerWidth >= 1200) {
        setRadius(120);
      }
      // md
      else if (window.innerWidth >= 992) {
        setRadius(110);
      }
      // sm
      else if (window.innerWidth >= 768) {
        setRadius(100);
      }
      // xs
      else {
        setRadius(90);
      }
    };

    window.addEventListener('resize', updateRadius);
    updateRadius();

    return () => {
      window.removeEventListener('resize', updateRadius);
    }
  }, []);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_OBJECT}/dash/pie/month`, {
      params: {
        customer_id: customer_id
      },
    });
    setOBJECT_PART(response.data.result.part || OBJECT_PART_DEFAULT);
    setOBJECT_TITLE(response.data.result.title || OBJECT_TITLE_DEFAULT);
  })()}, [customer_id]);

  // 4-1. renderPart ------------------------------------------------------------------------------>
  const renderPart = ({
    cx, cy, midAngle, innerRadius, outerRadius, value, index
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={"middle"} dominantBaseline={"central"}
      className={"dash-pie-text"}>
        {`${OBJECT_PART[index]?.name.substring(0, 5)} ${Number(value).toLocaleString()}%`}
      </text>
    );
  };

  // 4-2. renderTitle ----------------------------------------------------------------------------->
  const renderTitle = ({
    cx, cy, midAngle, innerRadius, outerRadius, value, index
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={"middle"} dominantBaseline={"central"}
      className={"dash-pie-text"}>
        {`${OBJECT_TITLE[index]?.name.substring(0, 5)} ${Number(value).toLocaleString()}%`}
      </text>
    );
  };

  // 5-1. chart ----------------------------------------------------------------------------------->
  const chartNodePart = () => {
    const COLORS_PART = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={350}>
          <PieChart margin={{top: 20, right: 20, bottom: 20, left: 20}}>
            <Pie
              data={OBJECT_PART}
              cx={"50%"}
              cy={"50%"}
              label={renderPart}
              labelLine={false}
              outerRadius={radius}
              fill={"#8884d8"}
              dataKey={"value"}
              minAngle={15}
            >
              {OBJECT_PART?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS_PART[index % COLORS_PART.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => (`${Number(value).toLocaleString()}%`)}
              contentStyle={{
                backgroundColor:"rgba(255, 255, 255, 0.8)",
                border:"none",
                borderRadius:"10px"
              }}
            ></Tooltip>
          </PieChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 5-2. chart ----------------------------------------------------------------------------------->
  const chartNodeTitle = () => {
    const COLORS_TITLE = ["#FF8042", "#FFBB28", "#00C49F", "#0088FE"];
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={350}>
          <PieChart margin={{top: 20, right: 20, bottom: 20, left: 20}}>
            <Pie
              data={OBJECT_TITLE}
              cx={"50%"}
              cy={"50%"}
              label={renderTitle}
              labelLine={false}
              outerRadius={radius}
              fill={"#8884d8"}
              dataKey={"value"}
              minAngle={15}
            >
              {OBJECT_TITLE?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS_TITLE[index % COLORS_TITLE.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => (`${Number(value).toLocaleString()}%`)}
              contentStyle={{
                backgroundColor:"rgba(255, 255, 255, 0.8)",
                border:"none",
                borderRadius:"10px"
              }}
            ></Tooltip>
          </PieChart>
        </ResponsiveContainer>
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
              <Col lg={8} md={8} sm={6} xs={6}>
                <span className={"dash-title"}>월간 부위/운동 비율</span>
              </Col>
              <Col lg={4} md={4} sm={6} xs={6}>
                <div className={"text-end"}>
                  <span className={`${LINE === "part" ? "text-primary" : "text-outline-primary"} dash-title-sub`} onClick={() => (setLINE("part"))}>
                    부위
                  </span>
                  <span className={`${LINE === "title" ? "text-primary" : "text-outline-primary"} dash-title-sub`} onClick={() => (setLINE("title"))}>
                    운동
                  </span>
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={12} sm={12} xs={12}>
                {LINE === "part" ? chartNodePart() : chartNodeTitle()}
              </Col>
            </Row>
          </Container>
        </Card>
      </div>
    </React.Fragment>
  );
};
