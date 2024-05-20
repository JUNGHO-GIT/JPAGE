// SleepSave.jsx

import {React, useState, useEffect, useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {moment, axios} from "../../import/ImportLibs.jsx";
import {useDate, useStorage, useTime, useTranslate} from "../../import/ImportHooks.jsx";
import {percent} from "../../import/ImportLogics";
import {Loading, Footer} from "../../import/ImportLayouts.jsx";
import {PopUp, Div, Icons, Br10, Br20} from "../../import/ImportComponents.jsx";
import {Card, Paper, Badge, TextField, MenuItem} from "../../import/ImportMuis.jsx";
import {DigitalClock, DateCalendar} from "../../import/ImportMuis.jsx";
import {AdapterMoment, LocalizationProvider} from "../../import/ImportMuis.jsx";
import {common1, common2, common3, common5, sleep2, sleep3, sleep4} from "../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const SleepSave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_SLEEP || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const session = sessionStorage.getItem("dataSet") || "{}";
  const sleepArray = JSON.parse(session)?.sleep || [];
  const navigate = useNavigate();
  const location = useLocation();
  const {translate} = useTranslate();
  const location_dateType = location?.state?.dateType?.trim()?.toString();
  const location_dateStart = location?.state?.dateStart?.trim()?.toString();
  const location_dateEnd = location?.state?.dateEnd?.trim()?.toString();
  const PATH = location?.pathname?.trim()?.toString();
  const firstStr = PATH?.split("/")[1] ? PATH?.split("/")[1] : "";
  const secondStr = PATH?.split("/")[2] ? PATH?.split("/")[2] : "";
  const thirdStr = PATH?.split("/")[3] ? PATH?.split("/")[3] : "";

  // 2-1. useStorage ------------------------------------------------------------------------------>
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      dateType: location_dateType || "day",
      dateStart: location_dateStart,
      dateEnd: location_dateEnd,
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const sessionId = sessionStorage.getItem("sessionId");
  const [LOADING, setLOADING] = useState(true);
  const [SEND, setSEND] = useState({
    id: "",
    dateStart: "0000-00-00",
    dateEnd: "0000-00-00",
    toList:"/sleep/list"
  });
  const [COUNT, setCOUNT] = useState({
    totalCnt: 0,
    sectionCnt: 0,
    newSectionCnt: 0
  });

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_DEF = {
    _id: "",
    sleep_number: 0,
    sleep_demo: false,
    sleep_dateType: "",
    sleep_dateStart: "0000-00-00",
    sleep_dateEnd: "0000-00-00",
    sleep_section: [{
      sleep_night: "00:00",
      sleep_morning: "00:00",
      sleep_time: "00:00",
    }],
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useDate(location_dateStart, location_dateEnd, DATE, setDATE);
  useTime(OBJECT, setOBJECT, PATH, "real");

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const res = await axios.get(`${URL_OBJECT}/detail`, {
      params: {
        user_id: sessionId,
        _id: "",
        DATE: DATE,
      },
    });
    setOBJECT(res.data.result || OBJECT_DEF);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: res.data.totalCnt || 0,
      sectionCnt: res.data.sectionCnt || 0,
      newSectionCnt: res.data.sectionCnt || 0
    }));
    setLOADING(false);
  })()}, [sessionId, DATE.dateStart, DATE.dateEnd]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const defaultSection = {
      sleep_night: "00:00",
      sleep_morning: "00:00",
      sleep_time: "00:00",
    };
    let updatedSection = Array(COUNT?.newSectionCnt).fill(null).map((_, idx) =>
      idx < OBJECT?.sleep_section.length ? OBJECT?.sleep_section[idx] : defaultSection
    );
    setOBJECT((prev) => ({
      ...prev,
      sleep_section: updatedSection
    }));

  },[COUNT?.newSectionCnt]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const res = await axios.post(`${URL_OBJECT}/save`, {
      user_id: sessionId,
      OBJECT: OBJECT,
      DATE: DATE,
    });
    if (res.data.status === "success") {
      alert(res.data.msg);
      percent();
      Object.assign(SEND, {
        dateStart: DATE.dateStart,
        dateEnd: DATE.dateEnd
      });
      navigate(SEND.toList, {
        state: SEND
      });
    }
    else {
      alert(res.data.msg);
    }
  };

  // 4-3. handler --------------------------------------------------------------------------------->
  const handlerDelete = (index) => {
    setOBJECT((prev) => ({
      ...prev,
      sleep_section: prev.sleep_section.filter((_, idx) => (idx !== index))
    }));
    setCOUNT((prev) => ({
      ...prev,
      newSectionCnt: prev.newSectionCnt - 1
    }));
  };

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    // 7-1. date
    const dateSection = () => (
      <Div className={"d-row"}>
        <Div className={"d-center"}>
          <TextField
            select={true}
            label={translate("common-dateType")}
            size={"small"}
            value={DATE.dateType || "day"}
            variant={"outlined"}
            className={"w-20vw me-3vw"}
            InputProps={{
              readOnly: true,
              className: "fw-bold",
              startAdornment: null,
              endAdornment: null
            }}
            onChange={(e) => {
              setDATE((prev) => ({
                ...prev,
                dateType: e.target.value
              }));
            }}>
            {["전체", "day", "week", "month", "year"].map((item) => (
              <MenuItem key={item} value={item} selected={item === DATE.dateType}>
                {item}
              </MenuItem>
            ))}
          </TextField>
        </Div>
        <Div className={"d-center"}>
          <PopUp
            type={"innerCenter"}
            position={"center"}
            direction={"center"}
            contents={({closePopup}) => (
              <Div className={"d-center w-max70vw"}>
                <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
                  <DateCalendar
                    timezone={"Asia/Seoul"}
                    views={["year", "day"]}
                    readOnly={false}
                    defaultValue={moment(DATE.dateStart)}
                    className={"radius border h-max50vh"}
                    onChange={(date) => {
                      setDATE((prev) => ({
                        ...prev,
                        dateStart: moment(date).format("YYYY-MM-DD"),
                        dateEnd: moment(date).format("YYYY-MM-DD")
                      }));
                    }}
                    sx={{
                      "& .MuiDateCalendar-root": {
                        width: "100%",
                        height: "100%",
                      },
                      "& .MuiYearCalendar-root": {
                        width: "100%",
                        height: "100%",
                      },
                      "& .MuiDayCalendar-slideTransition": {
                        minHeight: "0px",
                      },
                      "& .MuiDayCalendar-weekDayLabel": {
                        fontSize: "0.7rem",
                        width: "5vh",
                        height: "5vh",
                      },
                      '& .MuiPickersDay-root': {
                        fontSize: "0.7rem",
                        width: "5vh",
                        height: "5vh",
                      },
                    }}
                  />
                </LocalizationProvider>
              </Div>
            )}>
            {(popTrigger={}) => (
              <TextField
                type={"text"}
                size={"small"}
                label={"날짜"}
                variant={"outlined"}
                value={`${DATE.dateStart}`}
                className={"w-63vw"}
                InputProps={{
                  readOnly: true,
                  className: "fw-bold",
                  startAdornment: (
                    <img src={common1} className={"w-16 h-16 me-10"} alt={"common1"} />
                  ),
                  endAdornment: null
                }}
                onClick={(e) => {
                  popTrigger.openPopup(e.currentTarget);
                }}
              />
            )}
          </PopUp>
        </Div>
      </Div>
    );
    // 7-2. count
    const countSection = () => (
      <PopUp
        type={"alert"}
        position={"bottom"}
        direction={"center"}
        contents={({closePopup}) => (
          <Div className={"d-center"}>
            {`${COUNT.sectionCnt}개 이상 1개 이하로 입력해주세요.`}
          </Div>
        )}>
        {(popTrigger={}) => (
          <TextField
            type={"text"}
            label={translate("common-count")}
            variant={"outlined"}
            size={"small"}
            className={"w-86vw"}
            value={COUNT.newSectionCnt}
            InputProps={{
              readOnly: true,
              className: "fw-bold",
              startAdornment: (
                <img src={common2} className={"w-16 h-16 me-10"} alt={"common2"}/>
              ),
              endAdornment: (
                <Div className={"d-center me-n10"}>
                  <Icons
                    name={"TbMinus"}
                    className={"w-14 h-14 black"}
                    onClick={(e) => {
                      COUNT.newSectionCnt > COUNT.sectionCnt ? (
                        setCOUNT((prev) => ({
                          ...prev,
                          newSectionCnt: prev.newSectionCnt - 1
                        }))
                      ) : popTrigger.openPopup(e.currentTarget.closest('.MuiInputBase-root'))
                    }}
                  />
                  <Icons
                    name={"TbPlus"}
                    className={"w-14 h-14 black"}
                    onClick={(e) => {
                      COUNT.newSectionCnt < 1 ? (
                        setCOUNT((prev) => ({
                          ...prev,
                          newSectionCnt: prev.newSectionCnt + 1
                        }))
                      ) : popTrigger.openPopup(e.currentTarget.closest('.MuiInputBase-root'))
                    }}
                  />
                </Div>
              )
            }}
          />
        )}
      </PopUp>
    );
    // 7-3. total (x)
    // 7-4. badge
    const badgeSection = (index) => (
      <Badge
        badgeContent={index + 1}
        color={"primary"}
        showZero={true}
      />
    );
    // 7-5. dropdown
    const dropdownSection = (id, sectionId, index) => (
      <PopUp
        key={index}
        type={"dropdown"}
        position={"bottom"}
        direction={"center"}
        contents={({closePopup}) => (
          <Div className={"d-row"}>
            <img src={common5} className={"w-16 h-16 icon pointer"} alt={"common5"}
              onClick={() => {
                handlerDelete(index);
                closePopup();
              }}
            />
            <Div className={"fs-0-8rem"}>{translate("common-delete")}</Div>
          </Div>
        )}>
        {(popTrigger={}) => (
          <img src={common3} className={"w-24 h-24 mt-n10 me-n10 pointer"} alt={"common3"}
            onClick={(e) => {
              popTrigger.openPopup(e.currentTarget)
            }}
          />
        )}
      </PopUp>
    );
    // 7-6-1. table (detail, save 는 empty x)
    // 7-6-2. table
    const tableFragment = (i) => (
      <Card variant={"outlined"} className={"p-20"} key={i}>
        <Div className={"d-between mb-40"}>
          {badgeSection(i)}
          {dropdownSection(OBJECT?._id, OBJECT?.sleep_section[i]._id, i)}
        </Div>
        <Div className={"d-center mb-20"}>
          <PopUp
            key={i}
            type={"timePicker"}
            position={"top"}
            direction={"center"}
            contents={({closePopup}) => (
              <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
                <DigitalClock
                  timeStep={10}
                  ampm={false}
                  timezone={"Asia/Seoul"}
                  value={moment(OBJECT?.sleep_section[i]?.sleep_night, "HH:mm")}
                  sx={{
                    width: "40vw",
                    height: "40vh"
                  }}
                  onChange={(e) => {
                    setOBJECT((prev) => ({
                      ...prev,
                      sleep_section: prev.sleep_section.map((item, idx) => (
                        idx === i ? {
                          ...item,
                          sleep_night: moment(e).format("HH:mm")
                        } : item
                      ))
                    }));
                    closePopup();
                  }}
                />
              </LocalizationProvider>
            )}>
            {(popTrigger={}) => (
              <TextField
                select={false}
                label={translate("sleep-night")}
                size={"small"}
                variant={"outlined"}
                className={"w-86vw"}
                value={OBJECT?.sleep_section[i].sleep_night}
                InputProps={{
                  readOnly: true,
                  className: "fw-bold",
                  startAdornment: (
                    <img src={sleep2} className={"w-16 h-16 me-10"} alt={"sleep2"}/>
                  ),
                  endAdornment: (
                    <Div className={"fw-normal"}>{translate("common-endHour")}</Div>
                  )
                }}
                onClick={(e) => {
                  popTrigger.openPopup(e.currentTarget)
                }}
              />
            )}
          </PopUp>
        </Div>
        <Div className={"d-center mb-20"}>
          <PopUp
            key={i}
            type={"timePicker"}
            position={"top"}
            direction={"center"}
            contents={({closePopup}) => (
              <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
                <DigitalClock
                  timeStep={10}
                  ampm={false}
                  timezone={"Asia/Seoul"}
                  value={moment(OBJECT?.sleep_section[i]?.sleep_morning, "HH:mm")}
                  sx={{
                    width: "40vw",
                    height: "40vh"
                  }}
                  onChange={(e) => {
                    setOBJECT((prev) => ({
                      ...prev,
                      sleep_section: prev.sleep_section.map((item, idx) => (
                        idx === i ? {
                          ...item,
                          sleep_morning: moment(e).format("HH:mm")
                        } : item
                      ))
                    }));
                    closePopup();
                  }}
                />
              </LocalizationProvider>
            )}>
            {(popTrigger={}) => (
              <TextField
                select={false}
                label={translate("sleep-morning")}
                size={"small"}
                variant={"outlined"}
                className={"w-86vw"}
                value={OBJECT?.sleep_section[i].sleep_morning}
                InputProps={{
                  readOnly: true,
                  className: "fw-bold",
                  startAdornment: (
                    <img src={sleep3} className={"w-16 h-16 me-10"} alt={"sleep3"}/>
                  ),
                  endAdornment: (
                    <Div className={"fw-normal"}>{translate("common-endHour")}</Div>
                  )
                }}
                onClick={(e) => {
                  popTrigger.openPopup(e.currentTarget)
                }}
              />
            )}
          </PopUp>
        </Div>
        <Div className={"d-center mb-20"}>
          <PopUp
            key={i}
            type={"timePicker"}
            position={"bottom"}
            direction={"center"}
            contents={({closePopup}) => (
              <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
                <DigitalClock
                  timeStep={10}
                  ampm={false}
                  timezone={"Asia/Seoul"}
                  value={moment(OBJECT?.sleep_section[i]?.sleep_time, "HH:mm")}
                  sx={{
                    width: "40vw",
                    height: "40vh"
                  }}
                  onChange={(e) => {
                    closePopup();
                  }}
                />
              </LocalizationProvider>
            )}>
            {(popTrigger={}) => (
              <TextField
                select={false}
                label={translate("sleep-time")}
                size={"small"}
                variant={"outlined"}
                className={"w-86vw"}
                value={OBJECT?.sleep_section[i].sleep_time}
                InputProps={{
                  readOnly: true,
                  className: "fw-bold",
                  startAdornment: (
                    <img src={sleep4} className={"w-16 h-16 me-10"} alt={"sleep4"}/>
                  ),
                  endAdornment: (
                    <Div className={"fw-normal"}>{translate("common-endHour")}</Div>
                  )
                }}
                onClick={(e) => {
                  popTrigger.openPopup(e.currentTarget)
                }}
              />
            )}
          </PopUp>
        </Div>
      </Card>
    );
    // 7-6-3. table
    const tableSection = () => (
      <Div className={"block-wrapper w-min90vw h-min67vh"}>
        <Div className={"d-center mb-20"}>
          {dateSection()}
        </Div>
        <Div className={"d-center mb-20"}>
          {countSection()}
        </Div>
        <Div className={"d-column"}>
          {COUNT?.newSectionCnt > 0 && (OBJECT?.sleep_section.map((_, i) => (tableFragment(i))))}
        </Div>
      </Div>
    );
    // 7-7. return
    return (
      <Paper className={"content-wrapper"}>
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
        first: firstStr,
        second: secondStr,
        third: thirdStr,
      }}
      objects={{
        DATE, SEND, COUNT
      }}
      functions={{
        setDATE, setSEND, setCOUNT
      }}
      handlers={{
        navigate, flowSave
      }}
    />
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <>
      {LOADING ? loadingNode() : tableNode()}
      {footerNode()}
    </>
  );
};
