// MoneyDashBar.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {axios, moment} from "../../../import/ImportLibs.jsx";
import {handlerY} from "../../../import/ImportLogics";
import {Loading} from "../../../import/ImportLayouts.jsx";
import {Adorn, Icons, PopUp, Div} from "../../../import/ImportComponents.jsx";
import {Grid2, Container, Card, Paper} from "../../../import/ImportMuis.jsx";
import {Badge, Menu, MenuItem, TextField} from "../../../import/ImportMuis.jsx";
import {FormGroup, FormControlLabel, Switch} from "../../../import/ImportMuis.jsx";
import {Bar, Line, ComposedChart} from "recharts";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";

// ------------------------------------------------------------------------------------------------>
export const MoneyDashBar = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_MONEY || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id") || "{}";
  const array = ["목표", "실제"];

  // 2-2. useState -------------------------------------------------------------------------------->
  const [LOADING, setLOADING] = useState(true);
  const [SECTION, setSECTION] = useState("today");
  const [LINE, setLINE] = useState("in");

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_IN_TODAY_DEF = [
    {name:"", 목표: 0, 실제: 0},
  ];
  const OBJECT_OUT_TODAY_DEF = [
    {name:"", 목표: 0, 실제: 0},
  ];
  const [OBJECT_IN_TODAY, setOBJECT_IN_TODAY] = useState(OBJECT_IN_TODAY_DEF);
  const [OBJECT_OUT_TODAY, setOBJECT_OUT_TODAY] = useState(OBJECT_OUT_TODAY_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const resToday = await axios.get(`${URL_OBJECT}/dash/bar/today`, {
      params: {
        user_id: user_id
      },
    });
    setOBJECT_IN_TODAY(
      resToday.data.result.in.length > 0 ? resToday.data.result.in : OBJECT_IN_TODAY_DEF
    );
    setOBJECT_OUT_TODAY(
      resToday.data.result.out.length > 0 ? resToday.data.result.out : OBJECT_OUT_TODAY_DEF
    );
    setLOADING(false);
  })()}, [user_id]);

  // 5-1. chart ----------------------------------------------------------------------------------->
  const chartInToday = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_IN_TODAY, array, "money");
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <ComposedChart data={OBJECT_IN_TODAY} margin={{top: 60, right: 60, bottom: 20, left: 20}}
        barGap={20} barCategoryGap={"20%"}>
          <CartesianGrid strokeDasharray={"3 3"} stroke={"#f5f5f5"}/>
          <XAxis
            type={"category"}
            dataKey={"name"}
            tickLine={false}
            axisLine={{stroke:"#e0e0e0"}}
            tick={{fill:"#666", fontSize:14}}
          />
          <YAxis
            type={"number"}
            domain={domain}
            ticks={ticks}
            tickFormatter={tickFormatter}
            tickLine={false}
            axisLine={{stroke:"#e0e0e0"}}
            tick={{fill:"#666", fontSize:14}}
          />
          <Line dataKey={"목표"} type={"monotone"} stroke={"#8884d8"} strokeWidth={2}
            activeDot={{r: 6}}
          />
          <Bar dataKey={"실제"} fill="#82ca9d" radius={[10, 10, 0, 0]} minPointSize={1}
            barSize={20}/>
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
          />
          <Legend
            iconType={"circle"}
            verticalAlign={"bottom"}
            align={"center"}
            wrapperStyle={{
              lineHeight:"40px", paddingTop:"10px", fontSize:"12px", marginLeft:"20px"
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    );
  };

  // 5-2. chart ----------------------------------------------------------------------------------->
  const chartOutToday = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_OUT_TODAY, array, "money");
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <ComposedChart data={OBJECT_OUT_TODAY} margin={{top: 60, right: 60, bottom: 20, left: 20}}
        barGap={20} barCategoryGap={"20%"}>
          <CartesianGrid strokeDasharray={"3 3"} stroke={"#f5f5f5"}/>
          <XAxis
            type={"category"}
            dataKey={"name"}
            tickLine={false}
            axisLine={{stroke:"#e0e0e0"}}
            tick={{fill:"#666", fontSize:14}}
          />
          <YAxis
            type={"number"}
            domain={domain}
            ticks={ticks}
            tickFormatter={tickFormatter}
            tickLine={false}
            axisLine={{stroke:"#e0e0e0"}}
            tick={{fill:"#666", fontSize:14}}
          />
          <Line dataKey={"목표"} type={"monotone"} stroke={"#8884d8"} strokeWidth={2}
            activeDot={{r: 6}}
          />
          <Bar dataKey={"실제"} fill="#82ca9d" radius={[10, 10, 0, 0]} minPointSize={1}
            barSize={20}/>
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
          />
          <Legend
            iconType={"circle"}
            verticalAlign={"bottom"}
            align={"center"}
            wrapperStyle={{
              lineHeight:"40px", paddingTop:"10px", fontSize:"12px", marginLeft:"20px"
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    );
  };

  // 7. dash -------------------------------------------------------------------------------------->
  const dashNode = () => {
    // 7-5-1. dropdown
    const dropdownSection1 = () => (
      <TextField
        select={true}
        type={"text"}
        size={"small"}
        className={"w-65 mt-5"}
        variant={"outlined"}
        value={SECTION}
        onChange={(e) => (
          setSECTION(e.target.value)
        )}
      >
        <MenuItem value={"today"}>오늘</MenuItem>
      </TextField>
    );
    // 7-5-2. dropdown
    const dropdownSection2 = () => (
      <PopUp
        elementId={"popover"}
        type={"dropdown"}
        position={"bottom"}
        direction={"left"}
        contents={({closePopup}) => (
        ["in", "out"]?.map((key, index) => (
          <FormGroup key={index} className={"p-5 pe-10"}>
            <FormControlLabel control={<Switch checked={LINE.includes(key)} onChange={() => {
              if (LINE === key) {
                setLINE("");
              }
              else {
                setLINE(key);
              }
            }}/>} label={key} labelPlacement={"start"}>
            </FormControlLabel>
          </FormGroup>
        ))
        )}>
        {(popTrigger={}) => (
          <Icons name={"TbDots"} className={"w-24 h-24 dark pointer"} onClick={(e) => {
            popTrigger.openPopup(e.currentTarget)
          }}/>
        )}
      </PopUp>
    );
    // 7-6. dash
    const dashSection = () => (
      <Div className={"block-wrapper h-min40vh"}>
        <Div className={"d-center"}>
          <Div className={"ms-0"}>{dropdownSection1()}</Div>
          <Div className={"m-auto fsr-1"}>수입/지출 목표</Div>
          <Div className={"ms-auto"}>{dropdownSection2()}</Div>
        </Div>
        <Div className={"d-column"}>
          {SECTION === "today" && LINE === "in" &&  (
            LOADING ? loadingNode() : chartInToday()
          )}
          {SECTION === "today" && LINE === "out" && (
            LOADING ? loadingNode() : chartOutToday()
          )}
        </Div>
      </Div>
    );
    // 7-7 return
    return (
      <Paper className={"content-wrapper border-bottom mt-5 mb-5"}>
        {dashSection()}
      </Paper>
    );
  };

  // 8. loading ----------------------------------------------------------------------------------->
  const loadingNode = () => (
    <Loading
      LOADING={LOADING}
      setLOADING={setLOADING}
    />
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <>
      {dashNode()}
    </>
  );
};