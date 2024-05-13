// FoodSavePlan.jsx

import {React, useState, useEffect, useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {moment, axios, numeral} from "../../import/ImportLibs.jsx";
import {useDate, useStorage} from "../../import/ImportHooks.jsx";
import {percent} from "../../import/ImportLogics";
import {Header, NavBar, Loading, Footer} from "../../import/ImportLayouts.jsx";
import {Adornment, Icons, PopUp} from "../../import/ImportComponents.jsx";
import {Div, Hr10, Br10} from "../../import/ImportComponents.jsx";
import {Card, Paper} from "../../import/ImportMuis.jsx";
import {Badge, Menu, MenuItem} from "../../import/ImportMuis.jsx";
import {TextField, Button, DateCalendar, DigitalClock} from "../../import/ImportMuis.jsx";
import {AdapterMoment, LocalizationProvider} from "../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const FoodSavePlan = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_FOOD || "";
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

  // 2-2. useState -------------------------------------------------------------------------------->
  const [LOADING, setLOADING] = useState(true);
  const [SEND, setSEND] = useState({
    id: "",
    startDt: "0000-00-00",
    endDt: "0000-00-00",
    toList:"/food/list/plan"
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
  const OBJECT_DEF = {
    _id: "",
    food_plan_number: 0,
    food_plan_demo: false,
    food_plan_startDt: "0000-00-00",
    food_plan_endDt: "0000-00-00",
    food_plan_kcal: 0,
    food_plan_carb: 0,
    food_plan_protein: 0,
    food_plan_fat: 0,
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const res = await axios.get(`${URL_OBJECT}/detail/plan`, {
      params: {
        user_id: user_id,
        _id: "",
        duration: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    setOBJECT(res.data.result || OBJECT_DEF);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: res.data.totalCnt || 0,
      sectionCnt: res.data.sectionCnt || 0,
    }));
    setLOADING(false);
  })()}, [user_id, DATE.startDt, DATE.endDt]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const res = await axios.post(`${URL_OBJECT}/save/plan`, {
      user_id: user_id,
      OBJECT: OBJECT,
      duration: `${DATE.startDt} ~ ${DATE.endDt}`,
    });
    if (res.data.status === "success") {
      alert(res.data.msg);
      percent();
      SEND.startDt = DATE.startDt;
      SEND.endDt = DATE.endDt;
      navParam(SEND.toList, {
        state: SEND
      });
    }
    else {
      alert(res.data.msg);
    }
  };

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    // 7-1. date
    const dateSection = () => (
      <>
      <PopUp
        type={"calendar"}
        elementId={"popover"}
        className={"w-90p"}
        position={"bottom"}
        direction={"center"}
        contents={
          <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
            <DateCalendar
              timezone={"Asia/Seoul"}
              views={["day"]}
              className={"ms-n5"}
              readOnly={false}
              value={moment(DATE.startDt)}
              sx={{
                width: "280px",
                height: "330px"
              }}
              onChange={(date) => {
                setDATE((prev) => ({
                  ...prev,
                  startDt: moment(date).format("YYYY-MM-DD")
                }));
              }}
            />
          </LocalizationProvider>
        }>
        {(popTrigger) => (
          <TextField
            select={false}
            label={"시작일"}
            size={"small"}
            value={DATE.startDt}
            variant={"outlined"}
            className={"w-90p"}
            onClick={(e) => {
              popTrigger.openPopup(e.currentTarget);
            }}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Adornment name={"TbTextPlus"} className={"w-16 h-16 dark"} position={"start"} />
              )
            }}
          />
        )}
      </PopUp>
      <PopUp
        type={"calendar"}
        elementId={"popover"}
        className={"w-90p"}
        position={"bottom"}
        direction={"center"}
        contents={
          <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
            <DateCalendar
              timezone={"Asia/Seoul"}
              views={["day"]}
              className={"ms-n5"}
              readOnly={false}
              value={moment(DATE.endDt)}
              sx={{
                width: "280px",
                height: "330px"
              }}
              onChange={(date) => {
                setDATE((prev) => ({
                  ...prev,
                  endDt: moment(date).format("YYYY-MM-DD")
                }));
              }}
            />
          </LocalizationProvider>
        }>
        {(popTrigger) => (
          <TextField
            select={false}
            label={"종료일"}
            size={"small"}
            value={DATE.endDt}
            variant={"outlined"}
            className={"w-90p"}
            onClick={(e) => {
              popTrigger.openPopup(e.currentTarget);
            }}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Adornment name={"TbTextPlus"} className={"w-16 h-16 dark"} position={"start"} />
              )
            }}
          />
        )}
      </PopUp>
      </>
    );
    // 7-5. dropdown
    const dropdownSection = (id, sectionId, index) => (
      <>
      <Div className={"d-center"}>
        <Badge
          badgeContent={index + 1}
          color={"primary"}
          showZero={true}
        />
      </Div>
      <PopUp
        elementId={`popover-${index}`}
        type={"dropdown"}
        className={""}
        position={"bottom"}
        direction={"left"}
        contents={
          <>
        <Div className={"d-row align-center"}>
          <Icons name={"MdOutlineContentCopy"} className={"w-24 h-24 dark"} />
          <p className={"fs-14"}>복사</p>
        </Div>
        <Div className={"d-row align-center"}>
          <Icons name={"MdOutlineContentCopy"} className={"w-24 h-24 dark"} />
          <p className={"fs-14"}>복사</p>
        </Div>
        </>
      }>
        {(popTrigger) => (
          <Icons name={"BiDotsHorizontalRounded"} className={"w-24 h-24 dark me-n10"}
            onClick={(e) => {
              popTrigger.openPopup(e.currentTarget)
            }}
          />
        )}
      </PopUp>
      </>
    );
    // 7-6. table
    const tableFragment = (i) => (
      <Card variant={"outlined"} className={"p-20"} key={i}>
        <Div className={"d-between mt-n15 mb-20"}>
          {dropdownSection(OBJECT?._id, "", 0)}
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            type={"text"}
            size={"small"}
            label={"목표 칼로리"}
            id={`food_plan_kcal-${i}`}
            name={`food_plan_kcal-${i}`}
            variant={"outlined"}
            className={"w-90p"}
            value={`${numeral(OBJECT?.food_plan_kcal).format("0,0")} Kcal`}
            InputProps={{
              readOnly: false,
              startAdornment: (
                <Adornment name={"TbCalculator"} className={"w-16 h-16 dark"} position={"start"} />
              )
            }}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/,/g, "");
              const limitedValue = Math.min(99999, parseInt(rawValue));
              setOBJECT((prev) => ({
                ...prev,
                food_plan_kcal: limitedValue
              }));
            }}
          />
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            type={"text"}
            size={"small"}
            label={"목표 탄수화물"}
            id={`food_plan_carb-${i}`}
            name={`food_plan_carb-${i}`}
            variant={"outlined"}
            className={"w-90p"}
            value={`${numeral(OBJECT?.food_plan_carb).format("0,0")} g`}
            InputProps={{
              readOnly: false,
              startAdornment: (
                <Adornment name={"TbBowl"} className={"w-16 h-16 dark"} position={"start"} />
              )
            }}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/,/g, "");
              const limitedValue = Math.min(99999, parseInt(rawValue));
              setOBJECT((prev) => ({
                ...prev,
                food_plan_carb: limitedValue
              }));
            }}
          />
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            type={"text"}
            size={"small"}
            label={"목표 단백질"}
            id={`food_plan_protein-${i}`}
            name={`food_plan_protein-${i}`}
            variant={"outlined"}
            className={"w-90p"}
            value={`${numeral(OBJECT?.food_plan_protein).format("0,0")} g`}
            InputProps={{
              readOnly: false,
              startAdornment: (
                <Adornment name={"TbMilk"} className={"w-16 h-16 dark"} position={"start"} />
              )
            }}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/,/g, "");
              const limitedValue = Math.min(99999, parseInt(rawValue));
              setOBJECT((prev) => ({
                ...prev,
                food_plan_protein: limitedValue
              }));
            }}
          />
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            type={"text"}
            size={"small"}
            label={"목표 지방"}
            id={`food_plan_fat-${i}`}
            name={`food_plan_fat-${i}`}
            variant={"outlined"}
            className={"w-90p"}
            value={`${numeral(OBJECT?.food_plan_fat).format("0,0")} g`}
            InputProps={{
              readOnly: false,
              startAdornment: (
                <Adornment name={"TbMeat"} className={"w-16 h-16 dark"} position={"start"} />
              )
            }}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/,/g, "");
              const limitedValue = Math.min(99999, parseInt(rawValue));
              setOBJECT((prev) => ({
                ...prev,
                food_plan_fat: limitedValue
              }));
            }}
          />
        </Div>
      </Card>
    );
    // 7-7. table
    const tableSection = () => (
      <Div className={"block-wrapper h-min500"}>
        <Div className={"d-center mb-20"}>
          {dateSection()}
        </Div>
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

  // 8. loading ----------------------------------------------------------------------------------->
  const loadingNode = () => (
    <Loading
      LOADING={LOADING}
      setLOADING={setLOADING}
    />
  );

  // 9. footer ------------------------------------------------------------------------------------>
  const footerNode = () => (
    <Footer
      strings={{
        part: partStr,
        type: typeStr,
        plan: planStr,
      }}
      objects={{
        DATE, SEND, COUNT, DAYPICKER
      }}
      functions={{
        setDATE, setSEND, setCOUNT, setDAYPICKER
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
