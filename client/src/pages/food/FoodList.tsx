// FoodList.tsx
// Node -> Section -> Fragment

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue, useCommonDate, useTranslate, useStorage } from "@imports/ImportHooks";
import { axios, numeral } from "@imports/ImportLibs";
import { Loading, Footer } from "@imports/ImportLayouts";
import { Div, Hr, Img, Icons } from "@imports/ImportComponents";
import { Empty } from "@imports/ImportContainers";
import { Paper, Card, Grid } from "@imports/ImportMuis";
import { Accordion, AccordionSummary, AccordionDetails } from "@imports/ImportMuis";
import { food2, food3, food4, food5 } from "@imports/ImportImages";

// -------------------------------------------------------------------------------------------------
export const FoodList = () => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    translate,
  } = useTranslate();
  const {
    dayFmt, getDayNotFmt,
  } = useCommonDate();
  const {
    navigate, location_dateType, location_dateStart, location_dateEnd, PATH, URL_OBJECT, sessionId, TITLE, firstStr
  } = useCommonValue();

  // 2-2. useStorage -------------------------------------------------------------------------------
  // 리스트에서만 사용
  const [DATE, setDATE] = useStorage(
    `${TITLE}_date_(${PATH})`, {
      dateType: location_dateType || "",
      dateStart: location_dateStart || dayFmt,
      dateEnd: location_dateEnd || dayFmt,
    }
  );
  const [PAGING, setPAGING] = useStorage(
    `${TITLE}_paging_(${PATH})`, {
      sort: "asc",
      page: 1,
    }
  );

  // 2-2. useState ---------------------------------------------------------------------------------
  const [isExpanded, setIsExpanded] = useState<number[]>([0]);
  const [LOADING, setLOADING] = useState<boolean>(false);
  const [SEND, setSEND] = useState<any>({
    id: "",
    dateType: "day",
    dateStart: "0000-00-00",
    dateEnd: "0000-00-00",
    toList: `/${firstStr}/list`,
    toSave: `/${firstStr}/save`,
    toUpdate: `/${firstStr}/update`,
  });
  const [COUNT, setCOUNT] = useState<any>({
    totalCnt: 0,
    sectionCnt: 0,
    newSectionCnt: 0
  });

  // 2-2. useState ---------------------------------------------------------------------------------
  const OBJECT_DEF = [{
    _id: "",
    food_number: 0,
    food_dummy: "N",
    food_dateType: "",
    food_dateStart: "0000-00-00",
    food_dateEnd: "0000-00-00",
    food_total_kcal: "0",
    food_total_kcal_color: "",
    food_total_carb: "0",
    food_total_carb_color: "",
    food_total_protein: "0",
    food_total_protein_color: "",
    food_total_fat: "0",
    food_total_fat_color: "",
    food_section: [{
      food_part_idx: 1,
      food_part_val: "breakfast",
      food_name: "",
      food_brand: "",
      food_count: "0",
      food_serv: "회",
      food_gram: "0",
      food_kcal: "0",
      food_carb: "0",
      food_protein: "0",
      food_fat: "0",
    }],
  }];
  const [OBJECT, setOBJECT] = useState<any>(OBJECT_DEF);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    setLOADING(true);
    axios.get(`${URL_OBJECT}/list`, {
      params: {
        user_id: sessionId,
        PAGING: PAGING,
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
      // Accordion 초기값 설정
      setIsExpanded(res.data.result.map((item: any, index: number) => (index)));
      // setIsExpanded([]);
    })
    .catch((err: any) => {
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  }, [sessionId, PAGING.sort, PAGING.page, DATE.dateStart, DATE.dateEnd]);

  // 7. list --------------------------------------------------------------------------------------
  const listNode = () => {
    const cardSection = () => {
      const emptyFragment = () => (
        <Empty
          DATE={DATE}
          SEND={SEND}
          navigate={navigate}
          type={"real"}
          extra={"food"}
        />
      );
      const cardFragment = (i: number) => (
        OBJECT?.map((item: any, index: number) => (
          <Card className={"border radius"} key={`${index}-${i}`}>
            <Accordion className={"shadow-none"} expanded={isExpanded.includes(index)}>
              <AccordionSummary expandIcon={
                <Icons
                  name={"ChevronDown"}
                  className={"w-18 h-18 black"}
                  onClick={(e: any) => {
                    setIsExpanded(isExpanded.includes(index)
                    ? isExpanded.filter((el) => el !== index)
                    : [...isExpanded, index]
                  )}}
                />
              }>
                <Grid container spacing={2}
                  onClick={(e: any) => {
                    e.stopPropagation();
                    Object.assign(SEND, {
                      id: item._id,
                      dateType: item.food_dateType,
                      dateStart: item.food_dateStart,
                      dateEnd: item.food_dateEnd,
                    });
                    navigate(SEND.toUpdate, {
                      state: SEND
                    });
                  }}
                >
                  <Grid size={2} className={"d-center"}>
                    <Icons
                      name={"Search"}
                      className={"w-18 h-18 black"}
                    />
                  </Grid>
                  <Grid size={10} className={"d-left"}>
                    {item.food_dateStart === item.food_dateEnd ? (
                      <>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.food_dateStart?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(getDayNotFmt(item.food_dateStart).format("ddd"))}
                        </Div>
                      </>
                    ) : (
                      <>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.food_dateStart?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(getDayNotFmt(item.food_dateStart).format("ddd"))}
                        </Div>
                        <Div className={"fs-1-0rem ms-3vw me-3vw"}>
                          ~
                        </Div>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.food_dateEnd?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(getDayNotFmt(item.food_dateEnd).format("ddd"))}
                        </Div>
                      </>
                    )}
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                {/** row 1 **/}
                <Grid container spacing={1}>
                  <Grid size={2} className={"d-center"}>
                    <Img
                    	src={food2}
                    	className={"w-15 h-15"}
                    />
                  </Grid>
                  <Grid size={3} className={"d-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("kcal")}
                    </Div>
                  </Grid>
                  <Grid size={6} className={"d-right"}>
                    <Div className={`fs-1-0rem fw-600 ${item.food_total_kcal_color}`}>
                      {numeral(item.food_total_kcal).format("0,0")}
                    </Div>
                  </Grid>
                  <Grid size={1} className={"d-right lh-2-4"}>
                    <Div className={"fs-0-6rem"}>
                      {translate("kc")}
                    </Div>
                  </Grid>
                </Grid>
                <Hr px={30} />
                {/** row 2 **/}
                <Grid container spacing={1}>
                  <Grid size={2} className={"d-center"}>
                    <Img
                    	src={food3}
                    	className={"w-15 h-15"}
                    />
                  </Grid>
                  <Grid size={3} className={"d-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("carb")}
                    </Div>
                  </Grid>
                  <Grid size={6} className={"d-right"}>
                    <Div className={`fs-1-0rem fw-600 ${item.food_total_carb_color}`}>
                      {numeral(item.food_total_carb).format("0,0")}
                    </Div>
                  </Grid>
                  <Grid size={1} className={"d-right lh-2-4"}>
                    <Div className={"fs-0-6rem"}>
                      {translate("g")}
                    </Div>
                  </Grid>
                </Grid>
                <Hr px={30} />
                {/** row 3 **/}
                <Grid container spacing={1}>
                  <Grid size={2} className={"d-center"}>
                    <Img
                    	src={food4}
                    	className={"w-15 h-15"}
                    />
                  </Grid>
                  <Grid size={3} className={"d-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("protein")}
                    </Div>
                  </Grid>
                  <Grid size={6} className={"d-right"}>
                    <Div className={`fs-1-0rem fw-600 ${item.food_total_protein_color}`}>
                      {numeral(item.food_total_protein).format("0,0")}
                    </Div>
                  </Grid>
                  <Grid size={1} className={"d-right lh-2-4"}>
                    <Div className={"fs-0-6rem"}>
                      {translate("g")}
                    </Div>
                  </Grid>
                </Grid>
                <Hr px={30} />
                {/** row 4 **/}
                <Grid container spacing={1}>
                  <Grid size={2} className={"d-center"}>
                    <Img
                    	src={food5}
                    	className={"w-15 h-15"}
                    />
                  </Grid>
                  <Grid size={3} className={"d-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("fat")}
                    </Div>
                  </Grid>
                  <Grid size={6} className={"d-right"}>
                    <Div className={`fs-1-0rem fw-600 ${item.food_total_fat_color}`}>
                      {numeral(item.food_total_fat).format("0,0")}
                    </Div>
                  </Grid>
                  <Grid size={1} className={"d-right lh-2-4"}>
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
        LOADING ? <Loading /> : (
          COUNT.totalCnt === 0 ? emptyFragment() : cardFragment(0)
        )
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper radius border h-min75vh"}>
        <Grid container spacing={2}>
          <Grid size={12}>
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
        DATE, SEND, PAGING, COUNT
      }}
      setState={{
        setDATE, setSEND, setPAGING, setCOUNT
      }}
      flow={{
        navigate
      }}
    />
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {listNode()}
      {footerNode()}
    </>
  );
};
