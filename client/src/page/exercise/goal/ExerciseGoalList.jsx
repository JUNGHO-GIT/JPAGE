// ExerciseGoalList.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../../import/ImportReacts.jsx";
import {useTranslate, useStorage} from "../../../import/ImportHooks.jsx";
import {axios, numeral, moment} from "../../../import/ImportLibs.jsx";
import {Loading, Footer} from "../../../import/ImportLayouts.jsx";
import {Div, Hr30, Br10, Img, Icons} from "../../../import/ImportComponents.jsx";
import {Paper, Card} from "../../../import/ImportMuis.jsx";
import {Accordion, AccordionSummary, AccordionDetails} from "../../../import/ImportMuis.jsx";
import {exercise2, exercise3_1, exercise4, exercise5} from "../../../import/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const ExerciseGoalList = () => {

  // 1. common -------------------------------------------------------------------------------------
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_EXERCISE || "";
  const URL_OBJECT = URL + SUBFIX;
  const navigate = useNavigate();
  const location = useLocation();
  const {translate} = useTranslate();
  const PATH = location?.pathname;
  const firstStr = PATH?.split("/")[1] || "";
  const secondStr = PATH?.split("/")[2] || "";
  const thirdStr = PATH?.split("/")[3] || "";
  const sessionId = sessionStorage.getItem("sessionId");

  // 2-1. useStorage (리스트에서만 사용) -----------------------------------------------------------
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      dateType: "",
      dateStart: moment().tz("Asia/Seoul").startOf("month").format("YYYY-MM-DD"),
      dateEnd: moment().tz("Asia/Seoul").endOf("month").format("YYYY-MM-DD"),
    }
  );

  // 2-2. useState ---------------------------------------------------------------------------------
  const [isExpanded, setIsExpanded] = useState([0]);
  const [LOADING, setLOADING] = useState(false);
  const [SEND, setSEND] = useState({
    id: "",
    dateType: "day",
    dateStart: "0000-00-00",
    dateEnd: "0000-00-00",
    toSave: "/exercise/goal/save",
  });
  const [PAGING, setPAGING] = useState({
    sort: "asc",
    page: 1,
  });
  const [COUNT, setCOUNT] = useState({
    totalCnt: 0,
    sectionCnt: 0,
    newSectionCnt: 0
  });

  // 2-2. useState ---------------------------------------------------------------------------------
  const OBJECT_DEF = [{
    _id: "",
    exercise_goal_number: 0,
    exercise_goal_dummy: "N",
    exercise_goal_dateStart: "0000-00-00",
    exercise_goal_dateEnd: "0000-00-00",
    exercise_goal_count: 0,
    exercise_goal_volume: 0,
    exercise_goal_weight: 0,
    exercise_goal_cardio: "00:00"
  }];
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    setLOADING(true);
    axios.get(`${URL_OBJECT}/goal/list`, {
      params: {
        user_id: sessionId,
        PAGING: PAGING,
        DATE: DATE,
      },
    })
    .then((res) => {
      setOBJECT(res.data.result || OBJECT_DEF);
      setCOUNT((prev) => ({
        ...prev,
        totalCnt: res.data.totalCnt || 0,
        sectionCnt: res.data.sectionCnt || 0,
        newSectionCnt: res.data.sectionCnt || 0
      }));// Accordion 초기값 설정
      // setIsExpanded(res.data.result.map((_, index) => (index)));
      setIsExpanded([]);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  }, [sessionId, PAGING.sort, PAGING.page, DATE.dateEnd]);

  // 7. table --------------------------------------------------------------------------------------
  const tableNode = () => {
    // 7-3. table
    const tableSection = () => {
      const loadingFragment = () => (
        <Loading
          LOADING={LOADING}
          setLOADING={setLOADING}
        />
      );
      const emptyFragment = () => (
        <Card className={"border radius shadow-none p-10"} key={"empty"}>
          <Div className={"d-center"}>
            {translate("empty")}
          </Div>
        </Card>
      );
      const tableFragment = (i) => (
        OBJECT?.map((item, index) => (
          <Card className={"border radius shadow-none"} key={`${index}-${i}`}>
            <Accordion className={"shadow-none"} expanded={isExpanded.includes(index)}>
              <AccordionSummary expandIcon={
                <Icons
                  name={"TbChevronDown"}
                  className={"w-18 h-18 black"}
                  onClick={(e) => {
                    setIsExpanded(isExpanded.includes(index)
                    ? isExpanded.filter((el) => el !== index)
                    : [...isExpanded, index]
                  )}}
                />
              }>
                <Div className={"d-center"}>
                  <Icons
                    name={"TbSearch"}
                    className={"w-18 h-18 black ms-n10 me-15"}
                    onClick={(e) => {
                      e.stopPropagation();
                      Object.assign(SEND, {
                        id: item._id,
                        dateType: item.exercise_goal_dateType,
                        dateStart: item.exercise_goal_dateStart,
                        dateEnd: item.exercise_goal_dateEnd,
                      });
                      navigate(SEND.toSave, {
                        state: SEND
                      });
                    }}
                  />
                  {item.exercise_goal_dateStart === item.exercise_goal_dateEnd ? (
                    <Div className={"d-left fs-1-2rem fw-600"} onClick={(e) => {
                      e.stopPropagation();
                    }}>
                      <Div>{item.exercise_goal_dateStart?.substring(5, 10)}</Div>
                    </Div>
                  ) : (
                    <Div className={"d-left fs-1-2rem fw-600"} onClick={(e) => {
                      e.stopPropagation();
                    }}>
                      <Div>{item.exercise_goal_dateStart?.substring(5, 10)}</Div>
                      <Div className={"ms-1vw me-1vw"}> ~ </Div>
                      <Div>{item.exercise_goal_dateEnd?.substring(5, 10)}</Div>
                    </Div>
                  )}
                </Div>
              </AccordionSummary>
              <AccordionDetails>
                <Div className={"d-between"}>
                  <Div className={"d-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      <Img src={exercise2} className={"w-15 h-15"} />
                    </Div>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("count")}
                    </Div>
                    <Div className={"fs-0-9rem fw-500 dark"}>
                      {translate("goal")}
                    </Div>
                  </Div>
                  <Div className={"d-right"}>
                    <Div className={"fs-1-0rem fw-600"}>
                      {item.exercise_goal_count}
                    </Div>
                    <Div className={"fs-0-7rem dark fw-500 ms-10"}>
                      {translate("c")}
                    </Div>
                  </Div>
                </Div>
                <Hr30 />
                <Div className={"d-between"}>
                  <Div className={"d-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      <Img src={exercise3_1} className={"w-15 h-15"} />
                    </Div>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("volume")}
                    </Div>
                    <Div className={"fs-0-9rem fw-500 dark"}>
                      {translate("goal")}
                    </Div>
                  </Div>
                  <Div className={"d-right"}>
                    <Div className={"fs-1-0rem fw-600"}>
                      {numeral(item.exercise_goal_volume).format("0,0")}
                    </Div>
                    <Div className={"fs-0-7rem dark fw-500 ms-10"}>
                      {translate("vol")}
                    </Div>
                  </Div>
                </Div>
                <Hr30 />
                <Div className={"d-between"}>
                  <Div className={"d-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      <Img src={exercise4} className={"w-15 h-15"} />
                    </Div>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("cardio")}
                    </Div>
                    <Div className={"fs-0-9rem fw-500 dark"}>
                      {translate("goal")}
                    </Div>
                  </Div>
                  <Div className={"d-right"}>
                    <Div className={"fs-1-0rem fw-600"}>
                      {item.exercise_goal_cardio}
                    </Div>
                    <Div className={"fs-0-7rem dark fw-500 ms-10"}>
                      {translate("hm")}
                    </Div>
                  </Div>
                </Div>
                <Hr30 />
                <Div className={"d-between"}>
                  <Div className={"d-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      <Img src={exercise5} className={"w-15 h-15"} />
                    </Div>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("weight")}
                    </Div>
                    <Div className={"fs-0-9rem fw-500 dark"}>
                      {translate("goal")}
                    </Div>
                  </Div>
                  <Div className={"d-right"}>
                    <Div className={"fs-1-0rem fw-600"}>
                      {numeral(item.exercise_goal_weight).format("0,0")}
                    </Div>
                    <Div className={"fs-0-7rem dark fw-500 ms-10"}>
                      {translate("kg")}
                    </Div>
                  </Div>
                </Div>
              </AccordionDetails>
            </Accordion>
          </Card>
        ))
      );
      return (
        LOADING ? loadingFragment() : (
          COUNT.totalCnt === 0 ? emptyFragment() : tableFragment(0)
        )
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper radius border shadow-none pb-30"}>
        <Div className={"block-wrapper h-min75vh"}>
          {tableSection()}
        </Div>
      </Paper>
    );
  };

  // 9. footer -------------------------------------------------------------------------------------
  const footerNode = () => (
    <Footer
      strings={{
        first: firstStr,
        second: secondStr,
        third: thirdStr,
      }}
      objects={{
        DATE, SEND, PAGING, COUNT
      }}
      functions={{
        setDATE, setSEND, setPAGING, setCOUNT
      }}
      handlers={{
        navigate
      }}
    />
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {tableNode()}
      {footerNode()}
    </>
  );
};