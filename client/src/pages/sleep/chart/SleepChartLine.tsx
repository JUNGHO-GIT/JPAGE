// SleepChartLine.tsx

import { useState, useEffect } from "@imports/ImportReacts";
import { useStorageLocal, useCommonValue, useCommonDate } from "@imports/ImportHooks";
import { useLanguageStore } from "@imports/ImportStores";
import { SleepLine } from "@imports/ImportSchemas";
import { axios, handleY } from "@imports/ImportUtils";
import { Loading } from "@imports/ImportLayouts";
import { Select, PopUp } from "@imports/ImportContainers";
import { Div, Img, Br } from "@imports/ImportComponents";
import { Paper,  MenuItem, Grid } from "@imports/ImportMuis";
import { FormGroup, FormControlLabel, Switch } from "@imports/ImportMuis";
import { Line, LineChart } from "recharts";
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// -------------------------------------------------------------------------------------------------
export const SleepChartLine = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_OBJECT, TITLE, PATH, sessionId, chartColors, sleepChartArray } = useCommonValue();
  const { getDayFmt, getWeekStartFmt, getWeekEndFmt } = useCommonDate();
  const { getMonthStartFmt, getMonthEndFmt, getYearStartFmt, getYearEndFmt } = useCommonDate();
  const { translate } = useLanguageStore();

  // 2-1. useStorageLocal --------------------------------------------------------------------------
  const [TYPE, setTYPE] = useStorageLocal(
    TITLE, PATH, "type_line", {
      section: "week",
      line: sleepChartArray,
    }
  );

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState<boolean>(true);
  const [DATE, setDATE] = useState<any>({
    dateType: "",
    dateStart: getDayFmt(),
    dateEnd: getDayFmt(),
    weekStartFmt: getWeekStartFmt(),
    weekEndFmt: getWeekEndFmt(),
    monthStartFmt: getMonthStartFmt(),
    monthEndFmt: getMonthEndFmt(),
    yearStartFmt: getYearStartFmt(),
    yearEndFmt: getYearEndFmt(),
  });

  // 2-2. useState ---------------------------------------------------------------------------------
  const [OBJECT_WEEK, setOBJECT_WEEK] = useState<any>([SleepLine]);
  const [OBJECT_MONTH, setOBJECT_MONTH] = useState<any>([SleepLine]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {(async () => {
    setLOADING(true);
    try {
      const params = {
        user_id: sessionId,
        DATE: DATE,
      };
      const [resWeek, resMonth] = await Promise.all([
        axios.get(`${URL_OBJECT}/chart/line/week`, {
          params: params,
        }),
        axios.get(`${URL_OBJECT}/chart/line/month`, {
          params: params,
        }),
      ]);
      setOBJECT_WEEK(
        resWeek.data.result.length > 0 ? resWeek.data.result : [SleepLine]
      );
      setOBJECT_MONTH(
        resMonth.data.result.length > 0 ? resMonth.data.result : [SleepLine]
      );
    }
    catch (err: any) {
      console.error(err);
    }
    finally {
      setLOADING(false);
    }
  })()}, [URL_OBJECT, DATE, sessionId]);

  // 5-1. chart ------------------------------------------------------------------------------------
  const chartWeek = () => {
    const {domain, ticks, formatterY} = handleY(OBJECT_WEEK, sleepChartArray, "sleep");
    return (
      <Grid container spacing={0} columns={12} className={"border-1 radius-1"}>
        <Grid size={12} className={"d-col-center"}>
          <ResponsiveContainer width={"100%"} height={350}>
            <LineChart
              data={OBJECT_WEEK}
              margin={{top: 20, right: 20, bottom: 20, left: 20}}
              barGap={20}
              barCategoryGap={"20%"}
            >
              <CartesianGrid
                strokeDasharray={"3 3"}
                stroke={"#f5f5f5"}
              />
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
                tick={{fill: "#666", fontSize: 14}}
                tickFormatter={formatterY}
              />
              {TYPE.line.includes("bedTime") && (
                <Line
                  dataKey={"bedTime"}
                  type={"monotone"}
                  stroke={chartColors[4]}
                  activeDot={{r:8}}
                  strokeWidth={2}
                />
              )}
              {TYPE.line.includes("wakeTime") && (
                <Line
                  dataKey={"wakeTime"}
                  type={"monotone"}
                  stroke={chartColors[1]}
                  activeDot={{r:8}}
                  strokeWidth={2}
                />
              )}
              {TYPE.line.includes("sleepTime") && (
                <Line
                  dataKey={"sleepTime"}
                  type={"monotone"}
                  stroke={chartColors[2]}
                  activeDot={{r:8}}
                  strokeWidth={2}
                />
              )}
              <Tooltip
                labelFormatter={(_label: any, payload: any) => {
                  const date = payload.length > 0 ? payload[0]?.payload.date : '';
                  return `${date}`;
                }}
                formatter={(value: any, name: any) => {
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
            </LineChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    );
  };

  // 5-2. chart ------------------------------------------------------------------------------------
  const chartMonth = () => {
    const {domain, ticks, formatterY} = handleY(OBJECT_MONTH, sleepChartArray, "sleep");
    return (
      <Grid container spacing={0} columns={12} className={"border-1 radius-1"}>
        <Grid size={12} className={"d-col-center"}>
          <ResponsiveContainer width={"100%"} height={350}>
            <LineChart
              data={OBJECT_MONTH}
              margin={{top: 20, right: 20, bottom: 20, left: 20}}
              barGap={20}
              barCategoryGap={"20%"}
            >
              <CartesianGrid
                strokeDasharray={"3 3"}
                stroke={"#f5f5f5"}
              />
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
                tick={{fill: "#666", fontSize: 14}}
                tickFormatter={formatterY}
              />
              {TYPE.line.includes("bedTime") && (
                <Line
                  dataKey={"bedTime"}
                  type={"monotone"}
                  stroke={chartColors[4]}
                  activeDot={{r:8}}
                  strokeWidth={2}
                />
              )}
              {TYPE.line.includes("wakeTime") && (
                <Line
                  dataKey={"wakeTime"}
                  type={"monotone"}
                  stroke={chartColors[1]}
                  activeDot={{r:8}}
                  strokeWidth={2}
                />
              )}
              {TYPE.line.includes("sleepTime") && (
                <Line
                  dataKey={"sleepTime"}
                  type={"monotone"}
                  stroke={chartColors[2]}
                  activeDot={{r:8}}
                  strokeWidth={2}
                />
              )}
              <Tooltip
                labelFormatter={(_label: any, payload: any) => {
                  const date = payload.length > 0 ? payload[0]?.payload.date : '';
                  return `${date}`;
                }}
                formatter={(value: any, name: any) => {
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
            </LineChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    );
  };

  // 7. chart --------------------------------------------------------------------------------------
  const chartNode = () => {
    // 7-1. head
    const headSection = () => {
      const titleFragment = () => (
        <Grid container spacing={0} columns={12}>
          <Grid size={12} className={"d-row-center"}>
            <Div className={"fs-1-0rem fw-600"}>
              {translate("chartLine")}
            </Div>
          </Grid>
        </Grid>
      );
      const selectFragment1 = () => (
        <Grid container spacing={0} columns={12}>
          <Grid size={12} className={"d-row-center"}>
            <Select
              value={TYPE.section}
              onChange={(e: any) => {
                setTYPE((prev: any) => ({
                  ...prev,
                  section: e.target.value,
                }));
              }}
            >
              <MenuItem value={"week"}>{translate("week")}</MenuItem>
              <MenuItem value={"month"}>{translate("month")}</MenuItem>
            </Select>
          </Grid>
        </Grid>
      );
      const selectFragment2 = () => (
        <PopUp
          type={"chart"}
          position={"bottom"}
          direction={"center"}
          contents={
            ["bedTime", "wakeTime", "sleepTime"]?.map((key: string, index: number) => (
              <FormGroup
                key={index}
                children={
                  <FormControlLabel
                    label={translate(key)}
                    labelPlacement={"start"}
                    control={
                      <Switch
                        checked={TYPE.line.includes(key)}
                        onChange={() => {
                          if (TYPE.line.includes(key)) {
                            if (TYPE.line.length > 1) {
                              setTYPE((prev: any) => ({
                                ...prev,
                                line: TYPE.line.filter((item: any) => item !== key),
                              }));
                            }
                            else {
                              return;
                            }
                          }
                          else {
                            setTYPE((prev: any) => ({
                              ...prev,
                              line: [...TYPE.line, key],
                            }));
                          }
                        }}
                      />
                    }
                  />
                }
              />
            ))
          }
        >
          {(popTrigger: any) => (
            <Img
              key={"common3_1"}
              src={"common3_1"}
              className={"w-24 h-24 pointer me-10"}
              onClick={(e: any) => {
                popTrigger.openPopup(e.currentTarget)
              }}
            />
          )}
        </PopUp>
      );
      return (
        <Grid container spacing={0} columns={12}>
          <Grid size={3} className={"d-row-left"}>
            {selectFragment1()}
          </Grid>
          <Grid size={6} className={"d-row-center"}>
            {titleFragment()}
          </Grid>
          <Grid size={3} className={"d-row-right"}>
            {selectFragment2()}
          </Grid>
        </Grid>
      );
    };
    // 7-2. chart
    const chartSection = () => (
      <Grid container spacing={0} columns={12}>
        <Grid size={12} className={"d-row-center"}>
          {LOADING ? <Loading /> : (
            <>
              {TYPE.section === "week" && chartWeek()}
              {TYPE.section === "month" && chartMonth()}
            </>
          )}
        </Grid>
      </Grid>
    );
    // 7-10. return
    return (
      <Paper className={"content-wrapper border-1 radius-1 shadow-1 h-min40vh"}>
        <Grid container spacing={0} columns={12}>
          <Grid size={12} className={"d-col-center"}>
            {headSection()}
            <Br px={20} />
            {chartSection()}
          </Grid>
        </Grid>
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
