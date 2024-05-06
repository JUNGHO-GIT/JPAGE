// FoodDashAvg.tsx

import axios from "axios";
import React, {useEffect, useState} from "react";
import {Loading} from "../../../fragments/Loading.jsx";
import {handlerY} from "../../../assets/js/handlerY.js";
import {ComposedChart, Bar} from "recharts";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import Grid2 from '@mui/material/Unstable_Grid2';
import {Container, Card, Box, Paper} from "@mui/material";
import {MenuItem, FormControl, Select} from "@mui/material";
import {FormGroup, FormControlLabel, Switch} from "@mui/material";
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import {IconButton, Menu} from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';

// ------------------------------------------------------------------------------------------------>
export const FoodDashAvg = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_FOOD || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id");
  const array = ["칼로리", "탄수화물", "단백질", "지방"];

  // 2-1. useState -------------------------------------------------------------------------------->
  const [LOADING, setLOADING] = useState(true);
  const [SECTION, setSECTION] = useState("month");
  const [LINE, setLINE] = useState("kcal");

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_KCAL_MONTH_DEF = [
    {name:"", 칼로리: 0},
  ];
  const OBJECT_NUT_MONTH_DEF = [
    {name:"", 탄수화물: 0, 단백질: 0, 지방: 0},
  ];
  const OBJECT_KCAL_YEAR_DEF = [
    {name:"", 칼로리: 0},
  ];
  const OBJECT_NUT_YEAR_DEF = [
    {name:"", 탄수화물: 0, 단백질: 0, 지방: 0},
  ];
  const [OBJECT_KCAL_MONTH, setOBJECT_KCAL_MONTH] = useState(OBJECT_KCAL_MONTH_DEF);
  const [OBJECT_NUT_MONTH, setOBJECT_NUT_MONTH] = useState(OBJECT_NUT_MONTH_DEF);
  const [OBJECT_KCAL_YEAR, setOBJECT_KCAL_YEAR] = useState(OBJECT_KCAL_YEAR_DEF);
  const [OBJECT_NUT_YEAR, setOBJECT_NUT_YEAR] = useState(OBJECT_NUT_YEAR_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const resMonth = await axios.get(`${URL_OBJECT}/dash/avg/month`, {
      params: {
        user_id: user_id
      },
    });
    const resYear = await axios.get(`${URL_OBJECT}/dash/avg/year`, {
      params: {
        user_id: user_id
      },
    });
    setOBJECT_KCAL_MONTH(
      resMonth.data.result.kcal.length > 0 ? resMonth.data.result.kcal : OBJECT_KCAL_MONTH_DEF
    );
    setOBJECT_NUT_MONTH(
      resMonth.data.result.nut.length > 0 ? resMonth.data.result.nut : OBJECT_NUT_MONTH_DEF
    );
    setOBJECT_KCAL_YEAR(
      resYear.data.result.kcal.length > 0 ? resYear.data.result.kcal : OBJECT_KCAL_YEAR_DEF
    );
    setOBJECT_NUT_YEAR(
      resYear.data.result.nut.length > 0 ? resYear.data.result.nut : OBJECT_NUT_YEAR_DEF
    );
    setLOADING(false);
  })()}, [user_id]);

  // 5-1. chart ----------------------------------------------------------------------------------->
  const chartKcalMonth = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_KCAL_MONTH, array, "food");
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={350}>
          <ComposedChart data={OBJECT_KCAL_MONTH} margin={{top: 60, right: 20, bottom: 20, left: -20}}
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
              domain={domain}
              ticks={ticks}
              tickFormatter={tickFormatter}
              tickLine={false}
              axisLine={{stroke:"#e0e0e0"}}
              tick={{fill:"#666", fontSize:14}}
            ></YAxis>
            <Bar dataKey={"칼로리"} fill="#8884d8" radius={[10, 10, 0, 0]} minPointSize={1}>
            </Bar>
            <Tooltip
              formatter={(value) => (`${Number(value).toLocaleString()}kcal`)}
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
          </ComposedChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 5-2. chart ----------------------------------------------------------------------------------->
  const chartNutMonth = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_NUT_MONTH, array, "food");
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={350}>
          <ComposedChart data={OBJECT_NUT_MONTH} margin={{top: 60, right: 20, bottom: 20, left: -20}}
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
              domain={domain}
              ticks={ticks}
              tickFormatter={tickFormatter}
              tickLine={false}
              axisLine={{stroke:"#e0e0e0"}}
              tick={{fill:"#666", fontSize:14}}
            ></YAxis>
            <Bar dataKey={"탄수화물"} fill="#ffc658" radius={[10, 10, 0, 0]} minPointSize={1}>
            </Bar>
            <Bar dataKey={"단백질"} fill="#82ca9d" radius={[10, 10, 0, 0]} minPointSize={1}>
            </Bar>
            <Bar dataKey={"지방"} fill="#ff7300" radius={[10, 10, 0, 0]} minPointSize={1}>
            </Bar>
            <Tooltip
              formatter={(value) => (`${Number(value).toLocaleString()}g`)}
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
          </ComposedChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 5-3. chart ----------------------------------------------------------------------------------->
  const chartKcalYear = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_KCAL_YEAR, array, "food");
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={350}>
          <ComposedChart data={OBJECT_KCAL_YEAR} margin={{top: 60, right: 20, bottom: 20, left: -20}}
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
              domain={domain}
              ticks={ticks}
              tickFormatter={tickFormatter}
              tickLine={false}
              axisLine={{stroke:"#e0e0e0"}}
              tick={{fill:"#666", fontSize:14}}
            ></YAxis>
            <Bar dataKey={"칼로리"} fill="#8884d8" radius={[10, 10, 0, 0]} minPointSize={1}>
            </Bar>
            <Tooltip
              formatter={(value) => (`${Number(value).toLocaleString()}kcal`)}
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
          </ComposedChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 5-4. chart ----------------------------------------------------------------------------------->
  const chartNutYear = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_NUT_YEAR, array, "food");
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={350}>
          <ComposedChart data={OBJECT_NUT_YEAR} margin={{top: 60, right: 20, bottom: 20, left: -20}}
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
              domain={domain}
              ticks={ticks}
              tickFormatter={tickFormatter}
              tickLine={false}
              axisLine={{stroke:"#e0e0e0"}}
              tick={{fill:"#666", fontSize:14}}
            ></YAxis>
            <Bar dataKey={"탄수화물"} fill="#ffc658" radius={[10, 10, 0, 0]} minPointSize={1}>
            </Bar>
            <Bar dataKey={"단백질"} fill="#82ca9d" radius={[10, 10, 0, 0]} minPointSize={1}>
            </Bar>
            <Bar dataKey={"지방"} fill="#ff7300" radius={[10, 10, 0, 0]} minPointSize={1}>
            </Bar>
            <Tooltip
              formatter={(value) => (`${Number(value).toLocaleString()}g`)}
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
          </ComposedChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 7-1. dropdown -------------------------------------------------------------------------------->
  const dropdownSection1 = () => (
    <FormControl size={"small"} variant={"outlined"}>
      <Select id={"section"} value={SECTION} className={"form-select"}
      onChange={(e) => (
        setSECTION(e.target.value)
      )}>
        <MenuItem value={"month"}>월간</MenuItem>
        <MenuItem value={"year"}>연간</MenuItem>
      </Select>
    </FormControl>
  );

  // 7-3. dropdown -------------------------------------------------------------------------------->
  const dropdownSection3 = () => (
    <PopupState variant={"popover"} popupId={"popup"}>
      {(popupState) => (
        <React.Fragment>
          <IconButton {...bindTrigger(popupState)}>
            <MoreVertIcon fontSize={"small"} color={"action"}></MoreVertIcon>
          </IconButton>
          <Menu {...bindMenu(popupState)}>
            {["kcal", "nut"]?.map((key, index) => (
              <FormGroup key={index} className={"p-5 pe-10"}>
                <FormControlLabel control={<Switch checked={LINE === key} onChange={() => {
                  if (LINE === key) {
                    setLINE("");
                  }
                  else {
                    setLINE(key);
                  }
                }}/>} label={key} labelPlacement={"start"}>
                </FormControlLabel>
              </FormGroup>
            ))}
          </Menu>
        </React.Fragment>
      )}
    </PopupState>
  );

  // 8. loading ----------------------------------------------------------------------------------->
  const loadingNode = () => (
    <Loading LOADING={LOADING} setLOADING={setLOADING}
    />
  );

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <Paper className={"content-wrapper"} variant={"outlined"}>
        <Container className={"p-0"}>
          <Grid2 container spacing={3}>
            <Grid2 xl={3} lg={3} md={3} sm={3} xs={3} className={"text-center"}>
              {dropdownSection1()}
            </Grid2>
            <Grid2 xl={6} lg={6} md={6} sm={6} xs={6} className={"d-center"}>
              <span className={"dash-title"}>칼로리/영양소 평균</span>
            </Grid2>
            <Grid2 xl={3} lg={3} md={3} sm={3} xs={3} className={"d-right"}>
              {dropdownSection3()}
            </Grid2>
          </Grid2>
          <Grid2 container spacing={3}>
            <Grid2 xl={12} lg={12} md={12} sm={12} xs={12}>
              {SECTION === "month" && LINE === "kcal" && (LOADING ? loadingNode() : chartKcalMonth())}
              {SECTION === "month" && LINE === "nut" && (LOADING ? loadingNode() : chartNutMonth())}
              {SECTION === "year" && LINE === "kcal" && (LOADING ? loadingNode() : chartKcalYear())}
              {SECTION === "year" && LINE === "nut" && (LOADING ? loadingNode() : chartNutYear())}
            </Grid2>
          </Grid2>
        </Container>
      </Paper>
    </React.Fragment>
  );
};