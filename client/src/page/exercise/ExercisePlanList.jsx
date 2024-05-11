// ExercisePlanList.jsx

import {React, useState, useEffect, useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {moment, axios, numeral} from "../../import/ImportLibs.jsx";
import {useDate, useStorage, useTime} from "../../import/ImportHooks.jsx";
import {percent} from "../../import/ImportLogics";
import {Header, NavBar} from "../../import/ImportLayouts.jsx";
import {Paging, Filter, Btn, Loading, PopUp, PopDown} from "../../import/ImportComponents.jsx";
import {CustomIcons, CustomAdornment} from "../../import/ImportIcons.jsx";
import {Grid2, Container, Card, Paper} from "../../import/ImportMuis.jsx";
import {Box, Badge, Menu, MenuItem} from "../../import/ImportMuis.jsx";
import {TextField, Typography, IconButton, Button, Divider} from "../../import/ImportMuis.jsx";
import {TableContainer, Table} from "../../import/ImportMuis.jsx";
import {TableHead, TableBody, TableRow, TableCell} from "../../import/ImportMuis.jsx";
import {PopupState, bindTrigger, bindMenu} from "../../import/ImportMuis.jsx";
import {Popover, bindPopover} from "../../import/ImportMuis.jsx";
import {LocalizationProvider, AdapterMoment} from "../../import/ImportMuis.jsx";
import {DesktopDatePicker, DesktopTimePicker} from "../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const ExercisePlanList = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_EXERCISE || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id") || "{}";
  const navParam = useNavigate();
  const location = useLocation();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location?.pathname.trim().toString();

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
    toDetail: "/exercise/plan/detail",
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
    exercise_startDt: "0000-00-00",
    exercise_endDt: "0000-00-00",
    exercise_total_count: 0,
    exercise_total_volume: 0,
    exercise_body_weight: 0,
    exercise_total_cardio: "00:00",
    exercise_plan_startDt: "0000-00-00",
    exercise_plan_endDt: "0000-00-00",
    exercise_plan_count: 0,
    exercise_plan_volume: 0,
    exercise_plan_weight: 0,
    exercise_plan_cardio: "00:00",
    exercise_diff_count: 0,
    exercise_diff_cardio: "00:00",
    exercise_diff_volume: 0,
    exercise_diff_weight: 0,
    exercise_diff_count_color: "",
    exercise_diff_cardio_color: "",
    exercise_diff_volume_color: "",
    exercise_diff_weight_color: "",
  }];
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE, FILTER, setFILTER);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const res = await axios.get(`${URL_OBJECT}/plan/list`, {
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
      sectionCnt: res.data.sectionCnt || 0,
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
    // 7-1. title
    const titleSection = () => (
      <Typography variant={"h5"} fontWeight={500}>
        운동 계획 List
      </Typography>
    );
    // 7-6. table
    const tableFragment = (i) => (
      <TableContainer key={i}>
        <Table className={"border"}>
          <TableHead>
            <TableRow className={"table-thead-tr"}>
              <TableCell>날짜</TableCell>
              <TableCell>분류</TableCell>
              <TableCell>목표</TableCell>
              <TableCell>실제</TableCell>
              <TableCell>비교</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {OBJECT?.map((item, index) => (
              <>
              <TableRow className={"table-tbody-tr"}>
                <TableCell rowSpan={4} className={"pointer"} onClick={() => {
                  SEND.id = item._id;
                  SEND.startDt = item.exercise_plan_startDt;
                  SEND.endDt = item.exercise_plan_endDt;
                  navParam(SEND.toDetail, {
                    state: SEND
                  });
                }}>
                  {item.exercise_plan_startDt?.substring(5, 10)
                    + " ~ " +
                    item.exercise_plan_endDt?.substring(5, 10)
                  }
                </TableCell>
                <TableCell>
                  총 운동횟수
                </TableCell>
                <TableCell>
                  {`${numeral(item.exercise_plan_count).format("0,0")} 회`}
                </TableCell>
                <TableCell>
                  {`${numeral(item.exercise_total_count).format("0,0")} 회`}
                </TableCell>
                <TableCell className={item.exercise_diff_count_color}>
                  {`${numeral(item.exercise_diff_count).format("0,0")} 회`}
                </TableCell>
              </TableRow>
              <TableRow className={"table-tbody-tr"}>
                <TableCell>
                  총 볼륨
                </TableCell>
                <TableCell>
                  {`${numeral(item.exercise_plan_volume).format("0,0")} vol`}
                </TableCell>
                <TableCell>
                  {`${numeral(item.exercise_total_volume).format("0,0")} vol`}
                </TableCell>
                <TableCell className={item.exercise_diff_volume_color}>
                  {`${numeral(item.exercise_diff_volume).format("0,0")} vol`}
                </TableCell>
              </TableRow>
              <TableRow className={"table-tbody-tr"}>
                <TableCell>
                  유산소 시간
                </TableCell>
                <TableCell>
                  {item.exercise_plan_cardio}
                </TableCell>
                <TableCell>
                  {item.exercise_total_cardio}
                </TableCell>
                <TableCell className={item.exercise_diff_cardio_color}>
                  {item.exercise_diff_cardio}
                </TableCell>
              </TableRow>
              <TableRow className={"table-tbody-tr"}>
                <TableCell>
                  체중
                </TableCell>
                <TableCell>
                  {`${numeral(item.exercise_plan_weight).format("0,0")} kg`}
                </TableCell>
                <TableCell>
                  {`${numeral(item.exercise_body_weight).format("0,0")} kg`}
                </TableCell>
                <TableCell className={item.exercise_diff_weight_color}>
                  {`${numeral(item.exercise_diff_weight).format("0,0")} kg`}
                </TableCell>
              </TableRow>
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
    // 7-7. table
    // list 는 높이, 너비 지정
    const tableSection = () => (
      <Box className={"block-wrapper h-min75vh w-min120vw"}>
        <Box className={"d-column"}>
          {tableFragment(0)}
        </Box>
      </Box>
    );
    // 7-8. return
    return (
      <Paper className={"content-wrapper"} variant={"outlined"}>
        {tableSection()}
      </Paper>
    );
  };

  // 11. paging ----------------------------------------------------------------------------------->
  const pagingNode = () => (
    <Paging PAGING={PAGING} setPAGING={setPAGING} COUNT={COUNT} setCOUNT={setCOUNT}
      part={"exercise"} plan={"plan"} type={"list"}
    />
  );

  // 12. filter ----------------------------------------------------------------------------------->
  const filterNode = () => (
    <Filter FILTER={FILTER} setFILTER={setFILTER} PAGING={PAGING} setPAGING={setPAGING}
      PART={""} setPART={""} part={"exercise"} plan={"plan"} type={"list"}
    />
  );

  // 13. btn -------------------------------------------------------------------------------------->
  const btnNode = () => (
    <Btn DAYPICKER={DAYPICKER} setDAYPICKER={setDAYPICKER}
      DATE={DATE} setDATE={setDATE} SEND={SEND} FILTER={FILTER} setFILTER={setFILTER}
      PAGING={PAGING} setPAGING={setPAGING}
      flowSave={""} navParam={navParam}
      part={"sleep"} plan={"plan"} type={"list"}
    />
  );

  // 14. loading ---------------------------------------------------------------------------------->
  const loadingNode = () => (
    <Loading LOADING={LOADING} setLOADING={setLOADING} />
  );

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <>
      {Header()}
      {NavBar()}
      {LOADING ? loadingNode() : tableNode()}
      {pagingNode()}
      {filterNode()}
      {btnNode()}
    </>
  );
};