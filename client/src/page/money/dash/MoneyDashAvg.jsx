// MoneyDashAvg.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {axios} from "../../../import/ImportLibs.jsx";
import {useTranslate} from "../../../import/ImportHooks.jsx";
import {handlerY} from "../../../import/ImportLogics";
import {Loading} from "../../../import/ImportLayouts.jsx";
import {PopUp, Div, Img, Br20} from "../../../import/ImportComponents.jsx";
import {Paper, Card, MenuItem, TextField} from "../../../import/ImportMuis.jsx";
import {FormGroup, FormControlLabel, Switch} from "../../../import/ImportMuis.jsx";
import {ComposedChart, Bar} from "recharts";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import {common3_1} from "../../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const MoneyDashAvg = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_MONEY || "";
  const URL_OBJECT = URL + SUBFIX;
  const array = ["수입", "지출"];

  // 2-2. useState -------------------------------------------------------------------------------->
  const sessionId = sessionStorage.getItem("sessionId");
  const [LOADING, setLOADING] = useState(true);
  const [SECTION, setSECTION] = useState("month");
  const [LINE, setLINE] = useState(array);

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_MONTH_DEF = [
    {name:"", day: "", 수입: 0, 지출: 0},
  ];
  const OBJECT_YEAR_DEF = [
    {name:"", day: "", 수입: 0, 지출: 0},
  ];
  const [OBJECT_MONTH, setOBJECT_MONTH] = useState(OBJECT_MONTH_DEF);
  const [OBJECT_YEAR, setOBJECT_YEAR] = useState(OBJECT_YEAR_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const resMonth = await axios.get(`${URL_OBJECT}/dash/avg/month`, {
      params: {
        user_id: sessionId
      },
    });
    const resYear = await axios.get(`${URL_OBJECT}/dash/avg/year`, {
      params: {
        user_id: sessionId
      },
    });
    setOBJECT_MONTH (
      resMonth.data.result.length > 0 ? resMonth.data.result : OBJECT_MONTH_DEF
    );
    setOBJECT_YEAR (
      resYear.data.result.length > 0 ? resYear.data.result : OBJECT_YEAR_DEF
    );
    setLOADING(false);
  })()}, [sessionId]);

  // 5-1. chart ----------------------------------------------------------------------------------->
  const chartMonth = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_MONTH, array, "money");
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <ComposedChart data={OBJECT_MONTH} margin={{top: 20, right: 20, bottom: 20, left: 20}}
        barGap={8} barCategoryGap={"20%"}>
          <CartesianGrid strokeDasharray={"3 3"} stroke={"#f5f5f5"}/>
          <XAxis
            type={"category"}
            dataKey={"name"}
            tickLine={false}
            axisLine={false}
            tick={{fill:"#666", fontSize:14}}
          />
          <YAxis
            type={"number"}
            domain={domain}
            ticks={ticks}
            tickFormatter={tickFormatter}
            tickLine={false}
            axisLine={false}
            tick={{fill:"#666", fontSize:14}}
            width={30}
          />
          {LINE.includes("수입") && (
            <Bar dataKey={"수입"} fill="#8884d8" radius={[10, 10, 0, 0]} minPointSize={1} />
          )}
          {LINE.includes("지출") && (
            <Bar dataKey={"지출"} fill="#82ca9d" radius={[10, 10, 0, 0]} minPointSize={1} />
          )}
          <Tooltip
            labelFormatter={(label, payload) => {
              const date = payload.length > 0 ? payload[0].payload.date : '';
              return `${date}`;
            }}
            formatter={(value, name, props) => {
              return `${Number(value).toLocaleString()}`;
            }}
            cursor={{
              fill:"rgba(0, 0, 0, 0.1)"
            }}
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
              width:"95%",
              display:"flex",
              justifyContent:"center",
              alignItems:"center",
              fontSize: "0.8rem",
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    );
  };

  // 5-3. chart ----------------------------------------------------------------------------------->
  const chartYear = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_YEAR, array, "money");
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <ComposedChart data={OBJECT_YEAR} margin={{top: 30, right: 20, bottom: 20, left: 20}}
        barGap={8} barCategoryGap={"20%"}>
          <CartesianGrid strokeDasharray={"3 3"} stroke={"#f5f5f5"}/>
          <XAxis
            type={"category"}
            dataKey={"name"}
            tickLine={false}
            axisLine={false}
            tick={{fill:"#666", fontSize:14}}
          />
          <YAxis
            type={"number"}
            domain={domain}
            ticks={ticks}
            tickFormatter={tickFormatter}
            tickLine={false}
            axisLine={false}
            tick={{fill:"#666", fontSize:14}}
            width={30}
          />
          {LINE.includes("수입") && (
            <Bar dataKey={"수입"} fill="#8884d8" radius={[10, 10, 0, 0]} minPointSize={1} />
          )}
          {LINE.includes("지출") && (
            <Bar dataKey={"지출"} fill="#82ca9d" radius={[10, 10, 0, 0]} minPointSize={1} />
          )}
          <Tooltip
            labelFormatter={(label, payload) => {
              const date = payload.length > 0 ? payload[0].payload.date : '';
              return `${date}`;
            }}
            formatter={(value, name, props) => {
              return `${Number(value).toLocaleString()}`;
            }}
            cursor={{
              fill:"rgba(0, 0, 0, 0.1)"
            }}
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
              width:"95%",
              display:"flex",
              justifyContent:"center",
              alignItems:"center",
              fontSize: "0.8rem",
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    );
  };

  // 7. dash -------------------------------------------------------------------------------------->
  const dashNode = () => {
    // 7-5. title
    const titleSection = () => (
      <Div className={"d-center"}>수입/지출 평균</Div>
    );
    // 7-5. dropdown
    const dropdownSection1 = () => (
      <Div className={"d-center"}>
        <TextField
          select={true}
          type={"text"}
          size={"small"}
          variant={"outlined"}
          value={SECTION}
          onChange={(e) => (
            setSECTION(e.target.value)
          )}
        >
          <MenuItem value={"month"}>월간</MenuItem>
          <MenuItem value={"year"}>연간</MenuItem>
        </TextField>
      </Div>
    );
    // 7-5. dropdown
    const dropdownSection2 = () => (
      <PopUp
        type={"dash"}
        position={"bottom"}
        direction={"center"}
        contents={({closePopup}) => (
        ["수입", "지출"].map((key, index) => (
          <FormGroup key={index}>
            <FormControlLabel control={<Switch checked={LINE.includes(key)} onChange={() => {
                if (LINE.includes(key)) {
                  if(LINE.length > 1) {
                    setLINE(LINE?.filter((item) => (item !== key)));
                  }
                  else {
                    return;
                  }
                }
                else {
                  setLINE([...LINE, key]);
                }
            }}/>} label={key} labelPlacement={"start"}>
            </FormControlLabel>
          </FormGroup>
        )))}>
        {(popTrigger={}) => (
          <Img src={common3_1} className={"w-24 h-24 pointer"} onClick={(e) => {
            popTrigger.openPopup(e.currentTarget)
          }}/>
        )}
      </PopUp>
    );
    // 7-7. fragment
    const dashFragment1 = (i) => (
      <Card variant={"outlined"} className={"p-10"} key={i}>
        {chartMonth()}
      </Card>
    );
    // 7-7. fragment
    const dashFragment2 = (i) => (
      <Card variant={"outlined"} className={"p-10"} key={i}>
        {chartYear()}
      </Card>
    );
    // 7-8. dash
    const dashSection = () => {
      if (SECTION === "month") {
        return LOADING ? loadingNode() : dashFragment1(0);
      }
      else if (SECTION === "year") {
        return LOADING ? loadingNode() : dashFragment2(0);
      }
    };
    // 7-9. first
    const firstSection = () => (
      <Div className={"d-center mt-n10"}>
        <Div className={"ms-0"}>{dropdownSection1()}</Div>
        <Div className={"ms-auto me-auto"}>{titleSection()}</Div>
        <Div className={"me-0"}>{dropdownSection2()}</Div>
      </Div>
    );
    // 7-11. third
    const thirdSection = () => (
      dashSection()
    );
    // 7-12. return
    return (
      <Paper className={"content-wrapper border radius"}>
        <Div className={"block-wrapper h-min40vh"}>
          {firstSection()}
          <Br20/>
          {thirdSection()}
        </Div>
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