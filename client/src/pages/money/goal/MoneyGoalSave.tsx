// MoneyGoalSave.tsx
// Node -> Section -> Fragment

import { useState, useEffect, useRef, createRef } from "@imports/ImportReacts";
import { useCommon } from "@imports/ImportHooks";
import { moment, axios, numeral } from "@imports/ImportLibs";
import { sync } from "@imports/ImportUtils";
import { Loading, Footer } from "@imports/ImportLayouts";
import { Div, Input, Img, Bg } from "@imports/ImportComponents";
import { Picker, Count, Delete } from "@imports/ImportContainers";
import { Card, Paper, Grid } from "@imports/ImportMuis";
import { money2 } from "@imports/ImportImages";

// -------------------------------------------------------------------------------------------------
export const MoneyGoalSave = () => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    navigate, location_dateType, location_dateStart, location_dateEnd, koreanDate,
  URL_OBJECT, sessionId, translate
  } = useCommon();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState<boolean>(false);
  const [EXIST, setEXIST] = useState([""]);
  const [SEND, setSEND] = useState({
    id: "",
    dateType: "day",
    dateStart: "0000-00-00",
    dateEnd: "0000-00-00",
    toList:"/money/goal/list"
  });
  const [COUNT, setCOUNT] = useState({
    totalCnt: 0,
    sectionCnt: 0,
    newSectionCnt: 0
  });
  const [DATE, setDATE] = useState({
    dateType: location_dateType,
    dateStart: location_dateStart || koreanDate,
    dateEnd: location_dateEnd || koreanDate,
  });

  // 2-2. useState ---------------------------------------------------------------------------------
  const OBJECT_DEF: any = {
    _id: "",
    money_goal_number: 0,
    money_goal_dummy: "N",
    money_goal_dateType: "",
    money_goal_dateStart: "0000-00-00",
    money_goal_dateEnd: "0000-00-00",
    money_goal_income: "0",
    money_goal_expense: "0"
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-2. useState ---------------------------------------------------------------------------------
  const [ERRORS, setERRORS] = useState({
    money_goal_income: false,
    money_goal_expense: false,
  });
  const REFS: any = useRef({
    money_goal_income: createRef(),
    money_goal_expense: createRef(),
  });

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    setLOADING(true);
    axios.get(`${URL_OBJECT}/exist`, {
      params: {
        user_id: sessionId,
        DATE: {
          dateType: DATE.dateType,
          dateStart: moment(DATE.dateStart).startOf("month").format("YYYY-MM-DD"),
          dateEnd: moment(DATE.dateEnd).endOf("month").format("YYYY-MM-DD")
        },
      },
    })
    .then((res: any) => {
      setEXIST(res.data.result || []);
      setLOADING(false);
    })
    .catch((err: any) => {
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  }, [sessionId, DATE.dateStart, DATE.dateEnd]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    setLOADING(true);
    axios.get(`${URL_OBJECT}/goal/detail`, {
      params: {
        user_id: sessionId,
        _id: "",
        DATE: DATE,
      },
    })
    .then((res: any) => {
      setOBJECT(res.data.result || OBJECT_DEF);
      setCOUNT((prev: any) => ({
        ...prev,
        totalCnt: res.data.totalCnt || 0,
        sectionCnt: res.data.sectionCnt || 0,
        newSectionCnt: res.data.sectionCnt || 0
      }));
    })
    .catch((err: any) => {
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  }, [sessionId, DATE.dateStart, DATE.dateEnd]);

  // 2-4. validate ---------------------------------------------------------------------------------
  const validate = (OBJECT: any) => {
    let foundError = false;
    const initialErrors = {
      money_goal_income: false,
      money_goal_expense: false,
    };

    if (COUNT.newSectionCnt === 0) {
      alert(translate("errorCount"));
      foundError = true;
      return;
    }

    const refsCurrent = REFS?.current;
    if (!refsCurrent) {
      console.warn('Ref is undefined, skipping validation');
      return;
    }
    else if (!OBJECT.money_goal_income || OBJECT.money_goal_income === "0") {
      alert(translate("errorMoneyGoalIncome"));
      refsCurrent.money_goal_income.current &&
      refsCurrent.money_goal_income.current?.focus();
      initialErrors.money_goal_income = true;
      foundError = true;
    }
    else if (!OBJECT.money_goal_expense || OBJECT.money_goal_expense === "0") {
      alert(translate("errorMoneyGoalExpense"));
      refsCurrent.money_goal_expense.current &&
      refsCurrent.money_goal_expense.current?.focus();
      initialErrors.money_goal_expense = true;
      foundError = true;
    }
    setERRORS(initialErrors);

    return !foundError;
  };

  // 3. flow ---------------------------------------------------------------------------------------
  const flowSave = async () => {
    if (!validate(OBJECT)) {
      setLOADING(false);
      return;
    }
    axios.post(`${URL_OBJECT}/goal/save`, {
      user_id: sessionId,
      OBJECT: OBJECT,
      DATE: DATE,
    })
    .then((res: any) => {
      if (res.data.status === "success") {
        alert(translate(res.data.msg));
        sync();
        Object.assign(SEND, {
          dateType: "",
          dateStart: DATE.dateStart,
          dateEnd: DATE.dateEnd
        });
        navigate(SEND.toList, {
          state: SEND
        });
      }
      else {
        alert(translate(res.data.msg));
      }
    })
    .catch((err: any) => {
      console.error(err);
    });
  };

  // 3. flow ---------------------------------------------------------------------------------------
  const flowDeletes = async () => {
    if (OBJECT?._id === "") {
      alert(translate("noData"));
      return;
    }
    axios.post(`${URL_OBJECT}/goal/deletes`, {
      user_id: sessionId,
      _id: OBJECT?._id,
      DATE: DATE,
    })
    .then((res: any) => {
      if (res.data.status === "success") {
        alert(translate(res.data.msg));
        sync();
        Object.assign(SEND, {
          dateType: "",
          dateStart: DATE.dateStart,
          dateEnd: DATE.dateEnd
        });
        navigate(SEND.toList, {
          state: SEND
        });
      }
      else {
        alert(translate(res.data.msg));
      }
    })
    .catch((err: any) => {
      console.error(err);
    });
  };

  // 4-3. handler ----------------------------------------------------------------------------------
  const handlerDelete = (index: number) => {
    setOBJECT((prev: any) => ({
      ...prev,
      money_goal_income: "",
      money_goal_expense: ""
    }));
    setCOUNT((prev: any) => ({
      ...prev,
      newSectionCnt: prev.newSectionCnt - 1
    }));
  };

  // 7. save ---------------------------------------------------------------------------------------
  const saveNode = () => {
    // 7-1. date + count
    const dateCountSection = () => (
      <Card className={"border radius p-20"}>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Picker
              DATE={DATE}
              setDATE={setDATE}
              EXIST={EXIST}
              setEXIST={setEXIST}
            />
          </Grid>
          <Grid size={12}>
            <Count
              COUNT={COUNT}
              setCOUNT={setCOUNT}
              limit={1}
            />
          </Grid>
        </Grid>
      </Card>
    );
    const cardSection = () => {
      const cardFragment = (i: number) => (
        <Card className={"border radius p-20"} key={i}>
          <Grid container spacing={2}>
            <Grid size={6} className={"d-left"}>
              <Bg
                badgeContent={i + 1}
                bgcolor={"#1976d2"}
              />
            </Grid>
            <Grid size={6} className={"d-right"}>
              <Delete
                index={i}
                handlerDelete={handlerDelete}
              />
            </Grid>
          </Grid>
          <Grid size={12}>
            <Input
              value={numeral(OBJECT?.money_goal_income).format("0,0")}
              inputRef={REFS?.current?.money_goal_income}
              error={ERRORS?.money_goal_income}
              label={
                DATE.dateType === "day" ? (
                  `${translate("goalIncome")}`
                ) : (
                  `${translate("goalIncome")} (${translate("total")})`
                )
              }
              startadornment={
                <Img src={money2} className={"w-16 h-16"} />
              }
              endadornment={
                translate("currency")
              }
              onChange={(e: any) => {
                const value = e.target.value.replace(/,/g, '');
                if (/^\d*$/.test(value) || value === "") {
                  const newValue = Number(value);
                  if (value === "") {
                    setOBJECT((prev: any) => ({
                      ...prev,
                      money_goal_income: "0",
                    }));
                  }
                  else if (!isNaN(newValue) && newValue <= 9999999999) {
                    setOBJECT((prev: any) => ({
                      ...prev,
                      money_goal_income: value,
                    }));
                  }
                }
              }}
            />
            <Grid size={12}>
              <Input
                value={numeral(OBJECT?.money_goal_expense).format("0,0")}
                inputRef={REFS?.current?.money_goal_expense}
                error={ERRORS?.money_goal_expense}
                label={
                  DATE.dateType === "day" ? (
                    `${translate("goalExpense")}`
                  ) : (
                    `${translate("goalExpense")} (${translate("total")})`
                  )
                }
                startadornment={
                  <Img src={money2} className={"w-16 h-16"} />
                }
                endadornment={
                  translate("currency")
                }
                onChange={(e: any) => {
                  const value = e.target.value.replace(/,/g, '');
                  if (/^\d*$/.test(value) || value === "") {
                    const newValue = Number(value);
                    if (value === "") {
                      setOBJECT((prev: any) => ({
                        ...prev,
                        money_goal_expense: "0",
                      }));
                    }
                    else if (!isNaN(newValue) && newValue <= 9999999999) {
                      setOBJECT((prev: any) => ({
                        ...prev,
                        money_goal_expense: value,
                      }));
                    }
                  }
                }}
              />
            </Grid>
          </Grid>
        </Card>
      );
      return (
        COUNT?.newSectionCnt > 0 && (
          LOADING ? <Loading /> : cardFragment(0)
        )
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper radius border h-min60vh"}>
        <Grid container spacing={2}>
          <Grid size={12}>
            {dateCountSection()}
            {cardSection()}
          </Grid>
        </Grid>
      </Paper>
    );
  };

  // 9. footer -------------------------------------------------------------------------------------
  const footerNode = () => (
    <Footer
      state={{
        DATE, SEND, COUNT, EXIST
      }}
      setState={{
        setDATE, setSEND, setCOUNT, setEXIST
      }}
      flow={{
        navigate, flowSave, flowDeletes
      }}
    />
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {saveNode()}
      {footerNode()}
    </>
  );
};