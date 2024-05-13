// SleepDiff.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../../import/ImportReacts.jsx";
import {moment, axios} from "../../../import/ImportLibs.jsx";
import {useStorage, useDate} from "../../../import/ImportHooks.jsx";
import {Header, NavBar, Loading, Footer} from "../../../import/ImportLayouts.jsx";
import {Adornment, Icons, PopAlert, PopUp, PopDown} from "../../../import/ImportComponents.jsx";
import {Div, Hr10, Br10, Paging, Filter, Btn} from "../../../import/ImportComponents.jsx";
import {Paper} from "../../../import/ImportMuis.jsx";
import {TableContainer, Table} from "../../../import/ImportMuis.jsx";
import {TableHead, TableBody, TableRow, TableCell} from "../../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const SleepDiff = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_SLEEP || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id") || "{}";
  const navParam = useNavigate();
  const location = useLocation();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location?.pathname.trim().toString();
  const partStr = PATH?.split("/")[1] ? PATH?.split("/")[1] : "";
  const typeStr = PATH?.split("/")[2] ? PATH?.split("/")[2] : "";
  const planStr = PATH?.split("/")[3] ? "plan" : "";

  // 2-1. useStorage ------------------------------------------------------------------------------>
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      startDt: location_startDt,
      endDt: location_endDt
    }
  );
  const {val:FILTER, set:setFILTER} = useStorage(
    `FILTER(${PATH})`, {
      order: "asc",
      type: "day",
      partIdx: 0,
      part: "전체",
      titleIdx: 0,
      title: "전체"
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [LOADING, setLOADING] = useState(true);
  const [SEND, setSEND] = useState({
    id: "",
    startDt: "0000-00-00",
    endDt: "0000-00-00",
    toDetail:"/sleep/detail/plan"
  });
  const [PAGING, setPAGING] = useState({
    page: 1,
    limit: 5
  });
  const [COUNT, setCOUNT] = useState({
    totalCnt: 0,
    sectionCnt: 0
  });
  const [DAYPICKER, setDAYPICKER] = useState({
    dayStartOpen: false,
    dayEndOpen: false,
    dayOpen: false,
  });

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_DEF = [{
    sleep_startDt: "0000-00-00",
    sleep_endDt: "0000-00-00",
    sleep_night: "00:00",
    sleep_morning: "00:00",
    sleep_time: "00:00",
    sleep_plan_startDt: "0000-00-00",
    sleep_plan_endDt: "0000-00-00",
    sleep_plan_night: "00:00",
    sleep_plan_morning: "00:00",
    sleep_plan_time: "00:00",
    sleep_diff_night: "00:00",
    sleep_diff_morning: "00:00",
    sleep_diff_time: "00:00",
    sleep_diff_night_color: "",
    sleep_diff_morning_color: "",
    sleep_diff_time_color: ""
  }];
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE, FILTER, setFILTER);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const res = await axios.get(`${URL_OBJECT}/diff`, {
      params: {
        user_id: user_id,
        FILTER: FILTER,
        PAGING: PAGING,
        duration: `${DATE.startDt} ~ ${DATE.endDt}`
      },
    });
    setOBJECT(res.data.result || OBJECT_DEF);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: res.data.totalCnt || 0,
      sectionCnt: res.data.sectionCnt || 0
    }));
    setLOADING(false);
  })()}, [
    user_id,
    FILTER.order, FILTER.partIdx, FILTER.titleIdx,
    PAGING.page, PAGING.limit,
    DATE.startDt, DATE.endDt
  ]);

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    // 7-6. table
    const tableFragment = (i) => (
      <TableContainer key={i}>
        <Table className={"border"}>
          <TableHead>
            <TableRow className={"table-thead-tr"}>
              <TableCell>날짜</TableCell>
              <TableCell>분류</TableCell>
              <TableCell>취침</TableCell>
              <TableCell>기상</TableCell>
              <TableCell>수면</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={"table-tbody-tr"}>
            {OBJECT?.map((item, index) => (
              <>
              <TableRow className={"table-tbody-tr"} key={`date-${index}`}>
                <TableCell rowSpan={4} className={"pointer"} onClick={() => {
                  SEND.id = item._id;
                  SEND.startDt = item.sleep_plan_startDt;
                  SEND.endDt = item.sleep_plan_endDt;
                  navParam(SEND.toDetail, {
                    state: SEND
                  });
                }}>
                  <p>{item.sleep_plan_startDt?.substring(5, 10)}</p>
                  <p>~</p>
                  <p>{item.sleep_plan_endDt?.substring(5, 10)}</p>
                </TableCell>
              </TableRow>
              <TableRow className={"table-tbody-tr"} key={`plan-${index}`}>
                <TableCell>
                  목표
                </TableCell>
                <TableCell>
                  {item.sleep_plan_night}
                </TableCell>
                <TableCell>
                  {item.sleep_plan_morning}
                </TableCell>
                <TableCell>
                  {item.sleep_plan_time}
                </TableCell>
              </TableRow>
              <TableRow className={"table-tbody-tr"} key={`real-${index}`}>
                <TableCell>
                  실제
                </TableCell>
                <TableCell>
                  {item.sleep_night}
                </TableCell>
                <TableCell>
                  {item.sleep_morning}
                </TableCell>
                <TableCell>
                  {item.sleep_time}
                </TableCell>
              </TableRow>
              <TableRow className={"table-tbody-tr"} key={`diff-${index}`}>
                <TableCell>
                  비교
                </TableCell>
                <TableCell className={item.sleep_diff_night_color}>
                  {item.sleep_diff_night}
                </TableCell>
                <TableCell className={item.sleep_diff_morning_color}>
                  {item.sleep_diff_morning}
                </TableCell>
                <TableCell className={item.sleep_diff_time_color}>
                  {item.sleep_diff_time}
                </TableCell>
              </TableRow>
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
    // 7-7. table
    const tableSection = () => (
      <Div className={"block-wrapper h-min500"}>
        <Div className={"d-column"}>
          {tableFragment(0)}
        </Div>
      </Div>
    );
    // 7-8. return
    return (
      <Paper className={"content-wrapper"} variant={"outlined"}>
        {tableSection()}
      </Paper>
    );
  };

  // 14. loading ---------------------------------------------------------------------------------->
  const loadingNode = () => (
    <Loading
      LOADING={LOADING}
      setLOADING={setLOADING}
    />
  );

  // 14. footer ----------------------------------------------------------------------------------->
  const footerNode = () => (
    <Footer
      strings={{
        part: partStr,
        type: typeStr,
        plan: planStr,
      }}
      objects={{
        DATE, FILTER, SEND, PAGING, COUNT, DAYPICKER
      }}
      functions={{
        setDATE, setFILTER, setSEND, setPAGING, setCOUNT, setDAYPICKER
      }}
      handlers={{
        navParam
      }}
    />
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <>
      {Header()}
      {NavBar()}
      {LOADING ? loadingNode() : tableNode()}
      {footerNode()}
    </>
  );
};