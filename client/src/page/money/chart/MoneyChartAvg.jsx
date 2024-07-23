// MoneyChartAvg.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {axios} from "../../../import/ImportLibs.jsx";
import {useTranslate} from "../../../import/ImportHooks.jsx";
import {handlerY} from "../../../import/ImportUtils";
import {Loading} from "../../../import/ImportLayouts.jsx";
import {PopUp, Div, Img, Br20} from "../../../import/ImportComponents.jsx";
import {Paper, Card, MenuItem, TextField} from "../../../import/ImportMuis.jsx";
import {FormGroup, FormControlLabel, Switch} from "../../../import/ImportMuis.jsx";
import {ComposedChart, Bar} from "recharts";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import {common3_1} from "../../../import/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const MoneyChartAvg = () => {

  // 1. common -------------------------------------------------------------------------------------
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_MONEY || "";
  const URL_OBJECT = URL + SUBFIX;
  const {translate} = useTranslate();
  const array = ["income", "expense"];

  // 2-2. useState ---------------------------------------------------------------------------------
  const sessionId = sessionStorage.getItem("sessionId");
  const [LOADING, setLOADING] = useState(true);
  const [SECTION, setSECTION] = useState("month");
  const [LINE, setLINE] = useState(array);
  const COLORS = [
    "#0088FE", "#00C49F", "#FFBB28", "#FF5733", "#6F42C1",
    "#0EA5E9", "#22C55E", "#D97706", "#EF4444", "#9333EA",
  ];

  // 2-2. useState ---------------------------------------------------------------------------------
  const OBJECT_MONTH_DEF = [
    {name:"", day: "", income: 0, expense: 0},
  ];
  const OBJECT_YEAR_DEF = [
    {name:"", day: "", income: 0, expense: 0},
  ];
  const [OBJECT_MONTH, setOBJECT_MONTH] = useState(OBJECT_MONTH_DEF);
  const [OBJECT_YEAR, setOBJECT_YEAR] = useState(OBJECT_YEAR_DEF);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {(async () => {
    setLOADING(true);
    const resMonth = await axios.get(`${URL_OBJECT}/chart/avg/month`, {
      params: {
        user_id: sessionId
      },
    });
    const resYear = await axios.get(`${URL_OBJECT}/chart/avg/year`, {
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

  // 5-1. chart ------------------------------------------------------------------------------------
  const chartMonth = () => {
    const {domain, ticks, formatterY} = handlerY(OBJECT_MONTH, array, "money");
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
          {LINE.includes("income") && (
            <Bar dataKey={"income"} fill={COLORS[0]} radius={[10, 10, 0, 0]} minPointSize={1} />
          )}
          {LINE.includes("expense") && (
            <Bar dataKey={"expense"} fill={COLORS[3]} radius={[10, 10, 0, 0]} minPointSize={1} />
          )}
          <Tooltip
            labelFormatter={(label, payload) => {
              const date = payload.length > 0 ? payload[0]?.payload.date : '';
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

  // 5-3. chart ------------------------------------------------------------------------------------
  const chartYear = () => {
    const {domain, ticks, formatterY} = handlerY(OBJECT_YEAR, array, "money");
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
          {LINE.includes("income") && (
            <Bar dataKey={"income"} fill={COLORS[0]} radius={[10, 10, 0, 0]} minPointSize={1} />
          )}
          {LINE.includes("expense") && (
            <Bar dataKey={"expense"} fill={COLORS[3]} radius={[10, 10, 0, 0]} minPointSize={1} />
          )}
          <Tooltip
            labelFormatter={(label, payload) => {
              const date = payload.length > 0 ? payload[0]?.payload.date : '';
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

  // 7. chart ---------------------------------------------------------------------------------------
  const chartNode = () => {
    // 7-1. head
    const headSection = () => {
      const titleSection = () => (
        <Div className={"d-center fs-0-9rem"}>
          {translate("chartAvg")}
        </Div>
      );
      const selectSection1 = () => (
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
      const selectSection2 = () => (
        <PopUp
          type={"chart"}
          position={"bottom"}
          direction={"center"}
          contents={({closePopup}) => (
          ["income", "expense"]?.map((key, index) => (
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
      );
      return (
        <Div className={"d-center mt-n10"}>
          <Div className={"ms-0"}>{selectSection1()}</Div>
          <Div className={"ms-auto"}>{titleSection()}</Div>
          <Div className={"ms-auto me-0"}>{selectSection2()}</Div>
        </Div>
      );
    };
    // 7-2. chart
    const chartSection = () => {
      const loadingFragment = () => (
        <Loading
          LOADING={LOADING}
          setLOADING={setLOADING}
        />
      );
      const chartFragment1 = (i) => (
        <Card className={"border radius shadow-none p-20"} key={i}>
          {chartMonth()}
        </Card>
      );
      const chartFragment2 = (i) => (
        <Card className={"border radius shadow-none p-20"} key={i}>
          {chartYear()}
        </Card>
      );
      if (SECTION === "month") {
        return LOADING ? loadingFragment() : chartFragment1(0);
      }
      else if (SECTION === "year") {
        return LOADING ? loadingFragment() : chartFragment2(0);
      }
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper radius border shadow-none pb-50"}>
        <Div className={"block-wrapper h-min40vh"}>
          {headSection()}
          <Br20/>
          {chartSection()}
        </Div>
      </Paper>
    );
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {chartNode()}
    </>
  );
};