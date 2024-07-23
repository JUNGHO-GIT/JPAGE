// TodayList.jsx

import {React, useState, useEffect} from "../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {axios, numeral, moment} from "../../import/ImportLibs.jsx";
import {useStorage, useTranslate} from "../../import/ImportHooks.jsx";
import {Loading} from "../../import/ImportLayouts.jsx";
import {Div, Hr30, Br30, Br20, Br10, Img, Icons} from "../../import/ImportComponents.jsx";
import {Paper, Card, Grid} from "../../import/ImportMuis.jsx";
import {Accordion, AccordionSummary, AccordionDetails} from "../../import/ImportMuis.jsx";
import {exercise3_1, exercise4, exercise5} from "../../import/ImportImages.jsx";
import {food2, food3, food4, food5} from "../../import/ImportImages.jsx";
import {money2} from "../../import/ImportImages.jsx";
import {sleep2, sleep3, sleep4} from "../../import/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const TodayList = () => {

  // 1. common -------------------------------------------------------------------------------------
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX_EXERCISE = process.env.REACT_APP_EXERCISE || "";
  const SUBFIX_FOOD = process.env.REACT_APP_FOOD || "";
  const SUBFIX_MONEY = process.env.REACT_APP_MONEY || "";
  const SUBFIX_SLEEP = process.env.REACT_APP_SLEEP || "";
  const URL_EXERCISE = URL + SUBFIX_EXERCISE;
  const URL_FOOD = URL + SUBFIX_FOOD;
  const URL_MONEY = URL + SUBFIX_MONEY;
  const URL_SLEEP = URL + SUBFIX_SLEEP;
  const navigate = useNavigate();
  const location = useLocation();
  const {translate} = useTranslate();
  const PATH = location?.pathname;
  const sessionId = sessionStorage.getItem("sessionId");

  // 2-1. useStorage (리스트에서만 사용) -----------------------------------------------------------
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      dateType: "day",
      dateStart: moment().tz("Asia/Seoul").format("YYYY-MM-DD"),
      dateEnd: moment().tz("Asia/Seoul").format("YYYY-MM-DD"),
    }
  );

  // 2-2. useState ---------------------------------------------------------------------------------
  const [isExpandedExercise, setIsExpandedExercise] = useState([0]);
  const [isExpandedFood, setIsExpandedFood] = useState([0]);
  const [isExpandedMoney, setIsExpandedMoney] = useState([0]);
  const [isExpandedSleep, setIsExpandedSleep] = useState([0]);
  const [LOADING, setLOADING] = useState(false);
  const [SEND, setSEND] = useState({
    id: "",
    dateType: "day",
    dateStart: "0000-00-00",
    dateEnd: "0000-00-00",
    toExercise: "/exercise/save",
    toFood: "/food/save",
    toMoney: "/money/save",
    toSleep: "/sleep/save",
  });
  const [PAGING, setPAGING] = useState({
    sort: "asc",
    page: 1,
  });
  const [COUNT_EXERCISE, setCOUNT_EXERCISE] = useState({
    totalCnt: 0,
    sectionCnt: 0,
    newSectionCnt: 0
  });
  const [COUNT_FOOD, setCOUNT_FOOD] = useState({
    totalCnt: 0,
    sectionCnt: 0,
    newSectionCnt: 0
  });
  const [COUNT_MONEY, setCOUNT_MONEY] = useState({
    totalCnt: 0,
    sectionCnt: 0,
    newSectionCnt: 0
  });
  const [COUNT_SLEEP, setCOUNT_SLEEP] = useState({
    totalCnt: 0,
    sectionCnt: 0,
    newSectionCnt: 0
  });

  // 2-2. useState ---------------------------------------------------------------------------------
  const OBJECT_EXERCISE_DEF = [{
    _id: "",
    exercise_number: 0,
    exercise_dummy: "N",
    exercise_dateStart: "0000-00-00",
    exercise_dateEnd: "0000-00-00",
    exercise_total_volume: 0,
    exercise_total_cardio: "00:00",
    exercise_body_weight: 0,
    exercise_section: [{
      exercise_part_idx: 0,
      exercise_part_val: "전체",
      exercise_title_idx: 0,
      exercise_title_val: "전체",
      exercise_set: 0,
      exercise_rep: 0,
      exercise_kg: 0,
      exercise_volume: 0,
      exercise_cardio: "00:00",
    }],
  }];
  const OBJECT_FOOD_DEF = [{
    _id: "",
    food_number: 0,
    food_dummy: "N",
    food_dateStart: "0000-00-00",
    food_dateEnd: "0000-00-00",
    food_total_kcal: 0,
    food_total_fat: 0,
    food_total_carb: 0,
    food_total_protein: 0,
    food_section: [{
      food_part_idx: 1,
      food_part_val: "breakfast",
      food_name: "",
      food_brand: "",
      food_count: 0,
      food_serv: "회",
      food_gram:  0,
      food_kcal: 0,
      food_fat: 0,
      food_carb: 0,
      food_protein: 0,
    }],
  }];
  const OBJECT_MONEY_DEF = [{
    _id: "",
    money_number: 0,
    money_dummy: "N",
    money_dateStart: "0000-00-00",
    money_dateEnd: "0000-00-00",
    money_total_income: 0,
    money_total_expense: 0,
    money_section: [{
      money_part_idx: 0,
      money_part_val: "전체",
      money_title_idx: 0,
      money_title_val: "전체",
      money_amount: 0,
      money_content: "",
    }],
  }];
  const OBJECT_SLEEP_DEF = [{
    _id: "",
    sleep_number: 0,
    sleep_dummy: "N",
    sleep_dateStart: "0000-00-00",
    sleep_dateEnd: "0000-00-00",
    sleep_section: [{
      sleep_bedTime: "00:00",
      sleep_wakeTime: "00:00",
      sleep_sleepTime: "00:00",
    }],
  }];
  const [OBJECT_EXERCISE, setOBJECT_EXERCISE] = useState(OBJECT_EXERCISE_DEF);
  const [OBJECT_FOOD, setOBJECT_FOOD] = useState(OBJECT_FOOD_DEF);
  const [OBJECT_MONEY, setOBJECT_MONEY] = useState(OBJECT_MONEY_DEF);
  const [OBJECT_SLEEP, setOBJECT_SLEEP] = useState(OBJECT_SLEEP_DEF);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    setLOADING(true);
    const fetchData = async (url, setObject, setCount, objectDef, setIsExpanded) => {
      try {
        const res = await axios.get(url, {
          params: {
            user_id: sessionId,
            PAGING: PAGING,
            DATE: DATE,
          },
        });
        setObject(res.data.result || objectDef);
        setCount((prev) => ({
          ...prev,
          totalCnt: res.data.totalCnt || 0,
          sectionCnt: res.data.sectionCnt || 0,
          newSectionCnt: res.data.sectionCnt || 0,
        }));
        // Accordion 초기값 설정
        //setIsExpanded([]);
        setIsExpanded(res.data.result.map((_, index) => (index)));
      }
      catch (err) {
        console.error(err);
      }
    };
    const fetchAllData = async () => {
      await Promise.all([
        fetchData(
          `${URL_EXERCISE}/list`,
          setOBJECT_EXERCISE,
          setCOUNT_EXERCISE,
          OBJECT_EXERCISE_DEF,
          setIsExpandedExercise
        ),
        fetchData(
          `${URL_FOOD}/list`,
          setOBJECT_FOOD,
          setCOUNT_FOOD,
          OBJECT_FOOD_DEF,
          setIsExpandedFood
        ),
        fetchData(
          `${URL_MONEY}/list`,
          setOBJECT_MONEY,
          setCOUNT_MONEY,
          OBJECT_MONEY_DEF,
          setIsExpandedMoney
        ),
        fetchData(
          `${URL_SLEEP}/list`,
          setOBJECT_SLEEP,
          setCOUNT_SLEEP,
          OBJECT_SLEEP_DEF,
          setIsExpandedSleep
        ),
      ]);

      setLOADING(false);
    };

    fetchAllData();
  }, [sessionId, PAGING.sort, PAGING.page, DATE.dateEnd]);

  // 7. table --------------------------------------------------------------------------------------
  const tableNode = () => {
    // 7-3. exercise
    const exerciseSection = () => {
      const loadingFragment = () => (
        <Loading
          LOADING={LOADING}
          setLOADING={setLOADING}
        />
      );
      const emptyFragment = () => (
        <Card className={"border radius shadow-none p-10"} key={"empty-exercise"}>
          <Div className={"d-center"}>
            {translate("exercise")}
            <Div className={"ms-1vw me-1vw"} />
            {translate("empty")}
          </Div>
        </Card>
      );
      const tableFragment = (i) => (
        OBJECT_EXERCISE?.map((item, index) => (
          <Card className={"border radius shadow-none"} key={`${index}-${i}`}>
            <Accordion className={"shadow-none"} expanded={isExpandedExercise.includes(index)}>
              <AccordionSummary expandIcon={
                <Icons
                  name={"TbChevronDown"}
                  className={"w-18 h-18 black"}
                  onClick={(e) => {
                    setIsExpandedExercise(isExpandedExercise.includes(index)
                    ? isExpandedExercise.filter((el) => el !== index)
                    : [...isExpandedExercise, index]
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
                        dateType: item.exercise_dateType,
                        dateStart: item.exercise_dateStart,
                        dateEnd: item.exercise_dateEnd,
                      });
                      navigate(SEND.toExercise, {
                        state: SEND
                      });
                    }}
                  />
                  {item.exercise_dateStart === item.exercise_dateEnd ? (
                    <Div className={"d-left fs-1-2rem fw-600"} onClick={(e) => {
                      e.stopPropagation();
                    }}>
                      <Div>{item.exercise_dateStart?.substring(5, 10)}</Div>
                      <Div className={"fs-1-0rem fw-600 dark ms-2vw"}>{translate("exercise")}</Div>
                    </Div>
                  ) : (
                    <Div className={"d-left fs-1-2rem fw-600"} onClick={(e) => {
                      e.stopPropagation();
                    }}>
                      <Div>{item.exercise_dateStart?.substring(5, 10)}</Div>
                      <Div className={"ms-1vw me-1vw"}> ~ </Div>
                      <Div>{item.exercise_dateEnd?.substring(5, 10)}</Div>
                    </Div>
                  )}
                </Div>
              </AccordionSummary>
              <AccordionDetails><Br10 />
                {/** row 1 **/}
                <Grid container spacing={1}>
                  <Grid item xs={2} className={"d-column align-center"}>
                    <Img src={exercise3_1} className={"w-15 h-15"} />
                  </Grid>
                  <Grid item xs={3} className={"d-column align-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("volume")}
                    </Div>
                  </Grid>
                  <Grid item xs={6} className={"d-column align-right"}>
                    <Div className={"fs-1-0rem fw-600"}>
                      {numeral(item.exercise_total_volume).format("0,0")}
                    </Div>
                  </Grid>
                  <Grid item xs={1} className={"d-column align-right lh-2-4"}>
                    <Div className={"fs-0-6rem"}>
                      {translate("vol")}
                    </Div>
                  </Grid>
                </Grid>
                <Hr30 />
                {/** row 2 **/}
                <Grid container spacing={1}>
                  <Grid item xs={2} className={"d-column align-center"}>
                    <Img src={exercise4} className={"w-15 h-15"} />
                  </Grid>
                  <Grid item xs={3} className={"d-column align-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("cardio")}
                    </Div>
                  </Grid>
                  <Grid item xs={6} className={"d-column align-right"}>
                    <Div className={"fs-1-0rem fw-600"}>
                      {item.exercise_total_cardio}
                    </Div>
                  </Grid>
                  <Grid item xs={1} className={"d-column align-right lh-2-4"}>
                    <Div className={"fs-0-6rem"}>
                      {translate("hm")}
                    </Div>
                  </Grid>
                </Grid>
                <Hr30 />
                {/** row 4 **/}
                <Grid container spacing={1}>
                  <Grid item xs={2} className={"d-column align-center"}>
                    <Img src={exercise5} className={"w-15 h-15"} />
                  </Grid>
                  <Grid item xs={3} className={"d-column align-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("weight")}
                    </Div>
                  </Grid>
                  <Grid item xs={6} className={"d-column align-right"}>
                    <Div className={"fs-1-0rem fw-600"}>
                      {numeral(item.exercise_body_weight).format("0,0")}
                    </Div>
                  </Grid>
                  <Grid item xs={1} className={"d-column align-right lh-2-4"}>
                    <Div className={"fs-0-6rem"}>
                      {translate("kg")}
                    </Div>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Card>
        ))
      );
      return (
        LOADING ? loadingFragment() : (
          COUNT_EXERCISE.totalCnt === 0 ? emptyFragment() : tableFragment(0)
        )
      );
    };
    // 7-4. food
    const foodSection = () => {
      const loadingFragment = () => (
        <Loading
          LOADING={LOADING}
          setLOADING={setLOADING}
        />
      );
      const emptyFragment = () => (
        <Card className={"border radius shadow-none p-10"} key={"empty-food"}>
          <Div className={"d-center"}>
            {translate("food")}
            <Div className={"ms-1vw me-1vw"} />
            {translate("empty")}
          </Div>
        </Card>
      );
      const tableFragment = (i) => (
        OBJECT_FOOD?.map((item, index) => (
          <Card className={"border radius shadow-none"} key={`${index}-${i}`}>
            <Accordion className={"shadow-none"} expanded={isExpandedFood.includes(index)}>
              <AccordionSummary expandIcon={
                <Icons
                  name={"TbChevronDown"}
                  className={"w-18 h-18 black"}
                  onClick={(e) => {
                    setIsExpandedFood(isExpandedFood.includes(index)
                    ? isExpandedFood.filter((el) => el !== index)
                    : [...isExpandedFood, index]
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
                        dateType: item.food_dateType,
                        dateStart: item.food_dateStart,
                        dateEnd: item.food_dateEnd,
                      });
                      navigate(SEND.toFood, {
                        state: SEND
                      });
                    }}
                  />
                  {item.food_dateStart === item.food_dateEnd ? (
                    <Div className={"d-left fs-1-2rem fw-600"} onClick={(e) => {
                      e.stopPropagation();
                    }}>
                      <Div>{item.food_dateStart?.substring(5, 10)}</Div>
                      <Div className={"fs-1-0rem fw-600 dark ms-2vw"}>{translate("food")}</Div>
                    </Div>
                  ) : (
                    <Div className={"d-left fs-1-2rem fw-600"} onClick={(e) => {
                      e.stopPropagation();
                    }}>
                      <Div>{item.food_dateStart?.substring(5, 10)}</Div>
                      <Div className={"ms-1vw me-1vw"}> ~ </Div>
                      <Div>{item.food_dateEnd?.substring(5, 10)}</Div>
                    </Div>
                  )}
                </Div>
              </AccordionSummary>
              <AccordionDetails><Br10 />
                {/** row 1 **/}
                <Grid container spacing={1}>
                  <Grid item xs={2} className={"d-column align-center"}>
                    <Img src={food2} className={"w-15 h-15"} />
                  </Grid>
                  <Grid item xs={3} className={"d-column align-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("kcal")}
                    </Div>
                  </Grid>
                  <Grid item xs={6} className={"d-column align-right"}>
                    <Div className={"fs-1-0rem fw-600"}>
                      {numeral(item.food_total_kcal).format("0,0")}
                    </Div>
                  </Grid>
                  <Grid item xs={1} className={"d-column align-right lh-2-4"}>
                    <Div className={"fs-0-6rem"}>
                      {translate("k")}
                    </Div>
                  </Grid>
                </Grid>
                <Hr30 />
                {/** row 2 **/}
                <Grid container spacing={1}>
                  <Grid item xs={2} className={"d-column align-center"}>
                    <Img src={food3} className={"w-15 h-15"} />
                  </Grid>
                  <Grid item xs={3} className={"d-column align-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("carb")}
                    </Div>
                  </Grid>
                  <Grid item xs={6} className={"d-column align-right"}>
                    <Div className={"fs-1-0rem fw-600"}>
                      {numeral(item.food_total_carb).format("0,0")}
                    </Div>
                  </Grid>
                  <Grid item xs={1} className={"d-column align-right lh-2-4"}>
                    <Div className={"fs-0-6rem"}>
                      {translate("g")}
                    </Div>
                  </Grid>
                </Grid>
                <Hr30 />
                {/** row 3 **/}
                <Grid container spacing={1}>
                  <Grid item xs={2} className={"d-column align-center"}>
                    <Img src={food4} className={"w-15 h-15"} />
                  </Grid>
                  <Grid item xs={3} className={"d-column align-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("protein")}
                    </Div>
                  </Grid>
                  <Grid item xs={6} className={"d-column align-right"}>
                    <Div className={"fs-1-0rem fw-600"}>
                      {numeral(item.food_total_protein).format("0,0")}
                    </Div>
                  </Grid>
                  <Grid item xs={1} className={"d-column align-right lh-2-4"}>
                    <Div className={"fs-0-6rem"}>
                      {translate("g")}
                    </Div>
                  </Grid>
                </Grid>
                <Hr30 />
                {/** row 4 **/}
                <Grid container spacing={1}>
                  <Grid item xs={2} className={"d-column align-center"}>
                    <Img src={food5} className={"w-15 h-15"} />
                  </Grid>
                  <Grid item xs={3} className={"d-column align-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("fat")}
                    </Div>
                  </Grid>
                  <Grid item xs={6} className={"d-column align-right"}>
                    <Div className={"fs-1-0rem fw-600"}>
                      {numeral(item.food_total_fat).format("0,0")}
                    </Div>
                  </Grid>
                  <Grid item xs={1} className={"d-column align-right lh-2-4"}>
                    <Div className={"fs-0-6rem"}>
                      {translate("g")}
                    </Div>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Card>
        ))
      );
      return (
        LOADING ? loadingFragment() : (
          COUNT_FOOD.totalCnt === 0 ? emptyFragment() : tableFragment(0)
        )
      );
    };
    // 7-5. money
    const moneySection = () => {
      const loadingFragment = () => (
        <Loading
          LOADING={LOADING}
          setLOADING={setLOADING}
        />
      );
      const emptyFragment = () => (
        <Card className={"border radius shadow-none p-10"} key={"empty-money"}>
          <Div className={"d-center"}>
            {translate("money")}
            <Div className={"ms-1vw me-1vw"} />
            {translate("empty")}
          </Div>
        </Card>
      );
      const tableFragment = (i) => (
        OBJECT_MONEY?.map((item, index) => (
          <Card className={"border radius shadow-none"} key={`${index}-${i}`}>
            <Accordion className={"shadow-none"} expanded={isExpandedMoney.includes(index)}>
              <AccordionSummary expandIcon={
                <Icons
                  name={"TbChevronDown"}
                  className={"w-18 h-18 black"}
                  onClick={(e) => {
                    setIsExpandedMoney(isExpandedMoney.includes(index)
                    ? isExpandedMoney.filter((el) => el !== index)
                    : [...isExpandedMoney, index]
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
                        dateType: item.money_dateType,
                        dateStart: item.money_dateStart,
                        dateEnd: item.money_dateEnd,
                      });
                      navigate(SEND.toMoney, {
                        state: SEND
                      });
                    }}
                  />
                  {item.money_dateStart === item.money_dateEnd ? (
                    <Div className={"d-left fs-1-2rem fw-600"} onClick={(e) => {
                      e.stopPropagation();
                    }}>
                      <Div>{item.money_dateStart?.substring(5, 10)}</Div>
                      <Div className={"fs-1-0rem fw-600 dark ms-2vw"}>{translate("money")}</Div>
                    </Div>
                  ) : (
                    <Div className={"d-left fs-1-2rem fw-600"} onClick={(e) => {
                      e.stopPropagation();
                    }}>
                      <Div>{item.money_dateStart?.substring(5, 10)}</Div>
                      <Div className={"ms-1vw me-1vw"}> ~ </Div>
                      <Div>{item.money_dateEnd?.substring(5, 10)}</Div>
                    </Div>
                  )}
                </Div>
              </AccordionSummary>
              <AccordionDetails><Br10 />
                {/** row 1 **/}
                <Grid container spacing={1}>
                  <Grid item xs={2} className={"d-column align-center"}>
                    <Img src={money2} className={"w-15 h-15"} />
                  </Grid>
                  <Grid item xs={3} className={"d-column align-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("income")}
                    </Div>
                  </Grid>
                  <Grid item xs={6} className={"d-column align-right"}>
                    <Div className={"fs-1-0rem fw-600"}>
                      {numeral(item.money_total_income).format("0,0")}
                    </Div>
                  </Grid>
                  <Grid item xs={1} className={"d-column align-right lh-2-4"}>
                    <Div className={"fs-0-6rem"}>
                      {translate("currency")}
                    </Div>
                  </Grid>
                </Grid>
                <Hr30 />
                {/** row 2 **/}
                <Grid container spacing={1}>
                  <Grid item xs={2} className={"d-column align-center"}>
                    <Img src={money2} className={"w-15 h-15"} />
                  </Grid>
                  <Grid item xs={3} className={"d-column align-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("expense")}
                    </Div>
                  </Grid>
                  <Grid item xs={6} className={"d-column align-right"}>
                    <Div className={"fs-1-0rem fw-600"}>
                      {numeral(item.money_total_expense).format("0,0")}
                    </Div>
                  </Grid>
                  <Grid item xs={1} className={"d-column align-right lh-2-4"}>
                    <Div className={"fs-0-6rem"}>
                      {translate("currency")}
                    </Div>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Card>
        ))
      );
      return (
        LOADING ? loadingFragment() : (
          COUNT_MONEY.totalCnt === 0 ? emptyFragment() : tableFragment(0)
        )
      );
    };
    // 7-6. sleep
    const sleepSection = () => {
      const loadingFragment = () => (
        <Loading
          LOADING={LOADING}
          setLOADING={setLOADING}
        />
      );
      const emptyFragment = () => (
        <Card className={"border radius shadow-none p-10"} key={"empty-sleep"}>
          <Div className={"d-center"}>
            {translate("sleep")}
            <Div className={"ms-1vw me-1vw"} />
            {translate("empty")}
          </Div>
        </Card>
      );
      const tableFragment = (i) => (
        OBJECT_SLEEP?.map((item, index) => (
          <Card className={"border radius shadow-none"} key={`${index}-${i}`}>
            <Accordion className={"shadow-none"} expanded={isExpandedSleep.includes(index)}>
              <AccordionSummary expandIcon={
                <Icons
                  name={"TbChevronDown"}
                  className={"w-18 h-18 black"}
                  onClick={(e) => {
                    setIsExpandedSleep(isExpandedSleep.includes(index)
                    ? isExpandedSleep.filter((el) => el !== index)
                    : [...isExpandedSleep, index]
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
                        dateType: item.sleep_dateType,
                        dateStart: item.sleep_dateStart,
                        dateEnd: item.sleep_dateEnd,
                      });
                      navigate(SEND.toSleep, {
                        state: SEND
                      });
                    }}
                  />
                  {item.sleep_dateStart === item.sleep_dateEnd ? (
                    <Div className={"d-left fs-1-2rem fw-600"} onClick={(e) => {
                      e.stopPropagation();
                    }}>
                      <Div>{item.sleep_dateStart?.substring(5, 10)}</Div>
                      <Div className={"fs-1-0rem fw-600 dark ms-2vw"}>{translate("sleep")}</Div>
                    </Div>
                  ) : (
                    <Div className={"d-left fs-1-2rem fw-600"} onClick={(e) => {
                      e.stopPropagation();
                    }}>
                      <Div>{item.sleep_dateStart?.substring(5, 10)}</Div>
                      <Div className={"ms-1vw me-1vw"}> ~ </Div>
                      <Div>{item.sleep_dateEnd?.substring(5, 10)}</Div>
                    </Div>
                  )}
                </Div>
              </AccordionSummary>
              <AccordionDetails><Br10 />
                {/** row 1 **/}
                <Grid container spacing={1}>
                  <Grid item xs={2} className={"d-column align-center"}>
                    <Img src={sleep2} className={"w-15 h-15"} />
                  </Grid>
                  <Grid item xs={3} className={"d-column align-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("bedTime")}
                    </Div>
                  </Grid>
                  <Grid item xs={6} className={"d-column align-right"}>
                    <Div className={"fs-1-0rem fw-600"}>
                      {item.sleep_section[0]?.sleep_bedTime}
                    </Div>
                  </Grid>
                  <Grid item xs={1} className={"d-column align-right lh-2-4"}>
                    <Div className={"fs-0-6rem"}>
                      {translate("hm")}
                    </Div>
                  </Grid>
                </Grid>
                <Hr30 />
                {/** row 2 **/}
                <Grid container spacing={1}>
                  <Grid item xs={2} className={"d-column align-center"}>
                    <Img src={sleep3} className={"w-15 h-15"} />
                  </Grid>
                  <Grid item xs={3} className={"d-column align-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("wakeTime")}
                    </Div>
                  </Grid>
                  <Grid item xs={6} className={"d-column align-right"}>
                    <Div className={"fs-1-0rem fw-600"}>
                      {item.sleep_section[0]?.sleep_wakeTime}
                    </Div>
                  </Grid>
                  <Grid item xs={1} className={"d-column align-right lh-2-4"}>
                    <Div className={"fs-0-6rem"}>
                      {translate("hm")}
                    </Div>
                  </Grid>
                </Grid>
                <Hr30 />
                {/** row 3 **/}
                <Grid container spacing={1}>
                  <Grid item xs={2} className={"d-column align-center"}>
                    <Img src={sleep4} className={"w-15 h-15"} />
                  </Grid>
                  <Grid item xs={3} className={"d-column align-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("sleepTime")}
                    </Div>
                  </Grid>
                  <Grid item xs={6} className={"d-column align-right"}>
                    <Div className={"fs-1-0rem fw-600"}>
                      {item.sleep_section[0]?.sleep_sleepTime}
                    </Div>
                  </Grid>
                  <Grid item xs={1} className={"d-column align-right lh-2-4"}>
                    <Div className={"fs-0-6rem"}>
                      {translate("hm")}
                    </Div>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Card>
        ))
      );
      return (
        LOADING ? loadingFragment() : (
          COUNT_SLEEP.totalCnt === 0 ? emptyFragment() : tableFragment(0)
        )
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper radius border shadow-none pb-50"}>
        <Div className={"block-wrapper h-min75vh"}>
          {exerciseSection()}
          <Br30 />
          {foodSection()}
          <Br30 />
          {moneySection()}
          <Br30 />
          {sleepSection()}
        </Div>
      </Paper>
    );
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {tableNode()}
    </>
  );
};