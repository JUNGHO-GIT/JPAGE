// FoodGoalSave.tsx
// Node -> Section -> Fragment

import { useState, useEffect, useRef, createRef } from "@imports/ImportReacts";
import { useCommon } from "@imports/ImportHooks";
import { moment, axios, numeral } from "@imports/ImportLibs";
import { sync } from "@imports/ImportUtils";
import { Loading, Footer } from "@imports/ImportLayouts";
import { Div, Img, Input, Bg  } from "@imports/ImportComponents";
import { Picker, Count, Delete } from "@imports/ImportContainers";
import { Card, Paper, Grid } from "@imports/ImportMuis";
import { food2, food3, food4, food5 } from "@imports/ImportImages";

// -------------------------------------------------------------------------------------------------
export const FoodGoalSave = () => {

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
    dateType: "",
    dateStart: "0000-00-00",
    dateEnd: "0000-00-00",
    toList:"/food/goal/list"
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
    food_goal_number: 0,
    food_goal_dummy: "N",
    food_goal_dateType: "",
    food_goal_dateStart: "0000-00-00",
    food_goal_dateEnd: "0000-00-00",
    food_goal_kcal: "0",
    food_goal_carb: "0",
    food_goal_protein: "0",
    food_goal_fat: "0",
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-2. useState ---------------------------------------------------------------------------------
  const [ERRORS, setERRORS] = useState({
    food_goal_kcal: false,
    food_goal_carb: false,
    food_goal_protein: false,
    food_goal_fat: false,
  });
  const REFS: any = useRef({
    food_goal_kcal: createRef(),
    food_goal_carb: createRef(),
    food_goal_protein: createRef(),
    food_goal_fat: createRef(),
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
      food_goal_kcal: false,
      food_goal_carb: false,
      food_goal_protein: false,
      food_goal_fat: false,
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
    else if (!OBJECT.food_goal_kcal || OBJECT.food_goal_kcal === "0") {
      alert(translate("errorFoodGoalKcal"));
      refsCurrent.food_goal_kcal.current &&
      refsCurrent.food_goal_kcal.current?.focus();
      initialErrors.food_goal_kcal = true;
      foundError = true;
    }
    else if (!OBJECT.food_goal_carb || OBJECT.food_goal_carb === "0") {
      alert(translate("errorFoodGoalCarb"));
      refsCurrent.food_goal_carb.current &&
      refsCurrent.food_goal_carb.current?.focus();
      initialErrors.food_goal_carb = true;
      foundError = true;
    }
    else if (!OBJECT.food_goal_protein || OBJECT.food_goal_protein === "0") {
      alert(translate("errorFoodGoalProtein"));
      refsCurrent.food_goal_protein.current &&
      refsCurrent.food_goal_protein.current?.focus();
      initialErrors.food_goal_protein = true;
      foundError = true;
    }
    else if (!OBJECT.food_goal_fat || OBJECT.food_goal_fat === "0") {
      alert(translate("errorFoodGoalFat"));
      refsCurrent.food_goal_fat.current &&
      refsCurrent.food_goal_fat.current?.focus();
      initialErrors.food_goal_fat = true;
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
      food_goal_kcal: "",
      food_goal_carb: "",
      food_goal_protein: "",
      food_goal_fat: "",
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
            <Grid size={12}>
              <Input
                value={numeral(OBJECT?.food_goal_kcal).format("0,0")}
                inputRef={REFS?.current?.food_goal_kcal}
                error={ERRORS?.food_goal_kcal}
                label={
                  DATE.dateType === "day" ? (
                    `${translate("goalKcal")}`
                  ) : (
                    `${translate("goalKcal")} (${translate("total")})`
                  )
                }
                startadornment={
                  <Img src={food2} className={"w-16 h-16"} />
                }
                endadornment={
                  translate("kc")
                }
                onChange={(e: any) => {
                  const value = e.target.value.replace(/,/g, '');
                  if (/^\d*$/.test(value) || value === "") {
                    const newValue = Number(value);
                    if (value === "") {
                      setOBJECT((prev: any) => ({
                        ...prev,
                        food_goal_kcal: "0"
                      }));
                    }
                    else if (!isNaN(newValue) && newValue <= 9999999) {
                      setOBJECT((prev: any) => ({
                        ...prev,
                        food_goal_kcal: value,
                      }));
                    }
                  }
                }}
              />
            </Grid>
            <Grid size={12}>
              <Input
                value={numeral(OBJECT?.food_goal_carb).format("0,0")}
                inputRef={REFS?.current?.food_goal_carb}
                error={ERRORS?.food_goal_carb}
                label={
                  DATE.dateType === "day" ? (
                    `${translate("goalCarb")}`
                  ) : (
                    `${translate("goalCarb")} (${translate("total")})`
                  )
                }
                startadornment={
                  <Img src={food3} className={"w-16 h-16"} />
                }
                endadornment={
                  translate("g")
                }
                onChange={(e: any) => {
                  const value = e.target.value.replace(/,/g, '');
                  if (/^\d*$/.test(value) || value === "") {
                    const newValue = Number(value);
                    if (value === "") {
                      setOBJECT((prev: any) => ({
                        ...prev,
                        food_goal_carb: "0"
                      }));
                    }
                    else if (!isNaN(newValue) && newValue <= 99999) {
                      setOBJECT((prev: any) => ({
                        ...prev,
                        food_goal_carb: value,
                      }));
                    }
                  }
                }}
              />
            </Grid>
            <Grid size={12}>
              <Input
                value={numeral(OBJECT?.food_goal_protein).format("0,0")}
                inputRef={REFS?.current?.food_goal_protein}
                error={ERRORS?.food_goal_protein}
                label={
                  DATE.dateType === "day" ? (
                    `${translate("goalProtein")}`
                  ) : (
                    `${translate("goalProtein")} (${translate("total")})`
                  )
                }
                startadornment={
                  <Img src={food4} className={"w-16 h-16"} />
                }
                endadornment={
                  translate("g")
                }
                onChange={(e: any) => {
                  const value = e.target.value.replace(/,/g, '');
                  if (/^\d*$/.test(value) || value === "") {
                    const newValue = Number(value);
                    if (value === "") {
                      setOBJECT((prev: any) => ({
                        ...prev,
                        food_goal_protein: "0"
                      }));
                    }
                    else if (!isNaN(newValue) && newValue <= 99999) {
                      setOBJECT((prev: any) => ({
                        ...prev,
                        food_goal_protein: value,
                      }));
                    }
                  }
                }}
              />
            </Grid>
            <Grid size={12}>
              <Input
                value={numeral(OBJECT?.food_goal_fat).format("0,0")}
                inputRef={REFS?.current?.food_goal_fat}
                error={ERRORS?.food_goal_fat}
                label={
                  DATE.dateType === "day" ? (
                    `${translate("goalFat")}`
                  ) : (
                    `${translate("goalFat")} (${translate("total")})`
                  )
                }
                startadornment={
                  <Img src={food5} className={"w-16 h-16"} />
                }
                endadornment={
                  translate("g")
                }
                onChange={(e: any) => {
                  const value = e.target.value.replace(/,/g, '');
                  if (/^\d*$/.test(value) || value === "") {
                    const newValue = Number(value);
                    if (value === "") {
                      setOBJECT((prev: any) => ({
                        ...prev,
                        food_goal_fat: "0"
                      }));
                    }
                    else if (!isNaN(newValue) && newValue <= 99999) {
                      setOBJECT((prev: any) => ({
                        ...prev,
                        food_goal_fat: value,
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