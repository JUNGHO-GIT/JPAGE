// SleepDashAvg.tsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {axios} from "../../../import/ImportLibs.jsx";
import {useTranslate} from "../../../import/ImportHooks.jsx";
import {handlerY} from "../../../import/ImportLogics";
import {Loading} from "../../../import/ImportLayouts.jsx";
import {PopUp, Div, Img, Br20} from "../../../import/ImportComponents.jsx";
import {Paper, Card} from "../../../import/ImportMuis.jsx";
import {MenuItem, TextField} from "../../../import/ImportMuis.jsx";
import {FormGroup, FormControlLabel, Switch} from "../../../import/ImportMuis.jsx";
import {ComposedChart, Bar} from "recharts";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import {common3_1} from "../../../import/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const SleepDashAvg = () => {

  // 1. common -------------------------------------------------------------------------------------
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_SLEEP || "";
  const URL_OBJECT = URL + SUBFIX;
  const {translate} = useTranslate();
  const array = ["bedTime", "wakeTime", "sleepTime"];

  // 2-2. useState ---------------------------------------------------------------------------------
  const sessionId = sessionStorage.getItem("sessionId");
  const [LOADING, setLOADING] = useState(true);
  const [SECTION, setSECTION] = useState("month");
  const [PART, setPART] = useState(array);
  const COLORS = [
    "#0088FE", "#00C49F", "#FFBB28", "#FF5733", "#6F42C1",
    "#0EA5E9", "#22C55E", "#D97706", "#EF4444", "#9333EA",
  ];

  // 2-2. useState ---------------------------------------------------------------------------------
  const OBJECT_MONTH_DEF = [
    {name:"", day: "", bedTime: 0, wakeTime: 0, sleepTime: 0}
  ];
  const OBJECT_YEAR_DEF = [
    {name:"", day: "", bedTime: 0, wakeTime: 0, sleepTime: 0}
  ];
  const [OBJECT_MONTH, setOBJECT_MONTH] = useState(OBJECT_MONTH_DEF);
  const [OBJECT_YEAR, setOBJECT_YEAR] = useState(OBJECT_YEAR_DEF);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {(async () => {
    setLOADING(true);
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
    setOBJECT_MONTH(
      resMonth.data.result.length > 0 ? resMonth.data.result : OBJECT_MONTH_DEF
    );
    setOBJECT_YEAR(
      resYear.data.result.length > 0 ? resYear.data.result : OBJECT_YEAR_DEF
    );
    setLOADING(false);
  })()}, [sessionId]);

  // 5-1. chart ------------------------------------------------------------------------------------
  const chartMonth = () => {
    const {domain, ticks, formatterY} = handlerY(OBJECT_MONTH, array, "sleep");
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
            tickFormatter={(value) => (
              translate(value)
            )}
          />
          <YAxis
            width={30}
            type={"number"}
            domain={domain}
            tickLine={false}
            axisLine={false}
            ticks={ticks}
            tick={{fill:"#666", fontSize:14}}
            tickFormatter={formatterY}
          />
          {PART.includes("bedTime") && (
            <Bar dataKey={"bedTime"} fill={COLORS[4]} radius={[10, 10, 0, 0]} minPointSize={1}
            />
          )}
          {PART.includes("wakeTime") && (
            <Bar dataKey={"wakeTime"} fill={COLORS[1]} radius={[10, 10, 0, 0]} minPointSize={1}
            />
          )}
          {PART.includes("sleepTime") && (
            <Bar dataKey={"sleepTime"} fill={COLORS[2]} radius={[10, 10, 0, 0]} minPointSize={1}
            />
          )}
          <Tooltip
            labelFormatter={(label, payload) => {
              const date = payload.length > 0 ? payload[0].payload.date : '';
              return `${date}`;
            }}
            formatter={(value, name, props) => {
              const customName = translate(name);
              return [`${Number(value).toLocaleString()}`, customName];
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
            formatter={(value) => {
              return translate(value);
            }}
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

  // 5-2. chart ------------------------------------------------------------------------------------
  const chartYear = () => {
    const {domain, ticks, formatterY} = handlerY(OBJECT_YEAR, array, "sleep");
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <ComposedChart data={OBJECT_YEAR} margin={{top: 20, right: 20, bottom: 20, left: 20}}
        barGap={8} barCategoryGap={"20%"}>
          <CartesianGrid strokeDasharray={"3 3"} stroke={"#f5f5f5"}/>
          <XAxis
            type={"category"}
            dataKey={"name"}
            tickLine={false}
            axisLine={false}
            tick={{fill:"#666", fontSize:14}}
            tickFormatter={(value) => (
              translate(value)
            )}
          />
          <YAxis
            width={30}
            type={"number"}
            domain={domain}
            tickLine={false}
            axisLine={false}
            ticks={ticks}
            tick={{fill:"#666", fontSize:14}}
            tickFormatter={formatterY}
          />
          {PART.includes("bedTime") && (
            <Bar dataKey={"bedTime"} fill={COLORS[4]} radius={[10, 10, 0, 0]} minPointSize={1}
            />
          )}
          {PART.includes("wakeTime") && (
            <Bar dataKey={"wakeTime"} fill={COLORS[1]} radius={[10, 10, 0, 0]} minPointSize={1}
            />
          )}
          {PART.includes("sleepTime") && (
            <Bar dataKey={"sleepTime"} fill={COLORS[2]} radius={[10, 10, 0, 0]} minPointSize={1}
            />
          )}
          <Tooltip
            labelFormatter={(label, payload) => {
              const date = payload.length > 0 ? payload[0].payload.date : '';
              return `${date}`;
            }}
            formatter={(value, name, props) => {
              const customName = translate(name);
              return [`${Number(value).toLocaleString()}`, customName];
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
            formatter={(value) => {
              return translate(value);
            }}
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

  // 7. dash ---------------------------------------------------------------------------------------
  const dashNode = () => {
    // 7-5. title
    const titleSection = () => (
      <Div className={"d-center fs-0-9rem"}>
        {translate("dashAvg")}
      </Div>
    );
    // 7-4. delete
    const deleteSection1 = () => (
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
          <MenuItem value={"month"}>{translate("month")}</MenuItem>
          <MenuItem value={"year"}>{translate("year")}</MenuItem>
        </TextField>
      </Div>
    );
    // 7-4. delete
    const deleteSection2 = () => (
      <Div className={"d-center"}>
      <PopUp
        type={"dash"}
        position={"bottom"}
        direction={"center"}
        contents={({closePopup}) => (
        ["bedTime", "wakeTime", "sleepTime"]?.map((key, index) => (
          <FormGroup key={index}>
            <FormControlLabel
              control={<Switch checked={PART.includes(key)} onChange={() => {
                if (PART.includes(key)) {
                  if(PART.length > 1) {
                    setPART(PART?.filter((item) => (item !== key)));
                  }
                  else {
                    return;
                  }
                }
                else {
                  setPART([...PART, key]);
                }
            }}/>} label={translate(key)} labelPlacement={"start"}>
            </FormControlLabel>
          </FormGroup>
        )))}>
        {(popTrigger={}) => (
          <Img src={common3_1} className={"w-24 h-24 pointer"} onClick={(e) => {
            popTrigger.openPopup(e.currentTarget)
          }}/>
        )}
      </PopUp>
    </Div>
    );
    // 7-7. fragment
    const dashFragment1 = (i) => (
      <Card className={"p-10"} key={i}>
        {chartMonth()}
      </Card>
    );
    // 7-7. fragment
    const dashFragment2 = (i) => (
      <Card className={"p-10"} key={i}>
        {chartYear()}
      </Card>
    );
    // 7-8. dash
    const dashSection = () => {
      if (SECTION === "month") {
        return LOADING ? loadingFragment() : dashFragment1(0);
      }
      else if (SECTION === "year") {
        return LOADING ? loadingFragment() : dashFragment2(0);
      }
    }
    // 7-9. first
    const firstSection = () => (
      <Div className={"d-center mt-n10"}>
        <Div className={"ms-0"}>{deleteSection1()}</Div>
        <Div className={"ms-auto"}>{titleSection()}</Div>
        <Div className={"ms-auto me-0"}>{deleteSection2()}</Div>
      </Div>
    );
    // 7-9. third
    const thirdSection = () => (
      dashSection()
    );
    // 7-10. return
    return (
      <Paper className={"content-wrapper radius border shadow-none"}>
        <Div className={"block-wrapper h-min40vh"}>
          {firstSection()}
          <Br20/>
          {thirdSection()}
        </Div>
      </Paper>
    );
  };

  // 8. loading ------------------------------------------------------------------------------------
  const loadingFragment = () => (
    <Loading
      LOADING={LOADING}
      setLOADING={setLOADING}
    />
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {dashNode()}
    </>
  );
};