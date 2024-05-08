// FoodSave.jsx

import moment from "moment-timezone";
import axios from "axios";
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {NumericFormat} from "react-number-format";
import {percent} from "assets/js/percent.js";
import {Header} from "page/architecture/Header";
import {NavBar} from "page/architecture/NavBar";
import {useDate, useStorage} from "import/CustomHooks";
import {DaySave, Btn, Loading} from "import/CustomComponents";
import {Grid2, Menu, MenuItem, TextField, Typography, InputAdornment, Container, Card, Paper, Box, Badge, Divider, IconButton, Button, Table, TableContainer, TableHead, TableBody, TableRow, TableCell} from "import/CustomMuis";

// ------------------------------------------------------------------------------------------------>
export const FoodSave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_FOOD || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id");
  const session = sessionStorage.getItem("dataset") || "";
  const foodArray = JSON.parse(session)?.food || [];
  const navParam = useNavigate();
  const location = useLocation();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location?.pathname.trim().toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const [LOADING, setLOADING] = useState(true);
  const [SEND, setSEND] = useState({
    id: "",
    startDt: "0000-00-00",
    endDt: "0000-00-00",
    toList:"/food/list",
    toSave:"/food/save",
    toSearch:"/food/search",
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
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      startDt: location_startDt,
      endDt: location_endDt
    }
  );

  // 2-3. useState -------------------------------------------------------------------------------->
  const OBJECT_DEF = {
    _id: "",
    food_number: 0,
    food_demo: false,
    food_startDt: "0000-00-00",
    food_endDt: "0000-00-00",
    food_total_kcal: 0,
    food_total_fat: 0,
    food_total_carb: 0,
    food_total_protein: 0,
    food_section: [{
      food_part_idx: 1,
      food_part_val: "아침",
      food_title: "",
      food_count: 0,
      food_serv: "회",
      food_gram:  0,
      food_kcal: 0,
      food_fat: 0,
      food_carb: 0,
      food_protein: 0,
    }],
  };
  const [OBJECT_BEFORE, setOBJECT_BEFORE] = useState(OBJECT_DEF);
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);

  // 2-3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {

    // 스토리지 데이터 가져오기
    const getItem = localStorage.getItem("food_section");
    let storageSection = getItem ? JSON.parse(getItem) : null;

    // 상세 데이터 가져오기
    setLOADING(true);
    const fetchDetail = async () => {
      const res = await axios.get(`${URL_OBJECT}/detail`, {
        params: {
          _id: "",
          user_id: user_id,
          duration: `${DATE.startDt} ~ ${DATE.endDt}`,
        },
      });

      // 결과 있는경우 OBJECT 상태 업데이트
      if (res.data.result !== null && !storageSection) {
        setOBJECT((prev) => ({
          ...prev,
          ...res.data.result,
        }));
      }

      // 결과가 null or !null 이면서 스토리지 데이터가 있는 경우, OBJECT 상태 업데이트
      else if (
        (res.data.result !== null && storageSection) ||
        (res.data.result === null && storageSection)
      ) {
        if (storageSection) {
          setOBJECT((prev) => {
            let newFoodSection = [...prev.food_section];

            // 첫 번째 항목이 빈 값 객체인지 확인하고, 조건에 맞으면 제거
            if (
              newFoodSection.length > 0 &&
              Object.values(newFoodSection[0]).every((value) => (value === ""))
            ) {
              newFoodSection.shift();
            }

            // 새로운 데이터가 배열인 경우 배열, 단일 객체인 경우 단일 객체를 추가
            Array.isArray(storageSection)
            ? newFoodSection.push(...storageSection)
            : newFoodSection.push(storageSection);

            return {
              ...prev,
              food_section: newFoodSection,
            };
          })
        }
      }

      // 결과가 null 일 경우, OBJECT 상태를 명시적으로 초기화
      else {
        setOBJECT(OBJECT_DEF);
      }

      setCOUNT((prev) => ({
        ...prev,
        totalCnt: res.data.totalCnt || 0,
        sectionCnt: res.data.sectionCnt || 0
      }));
    };
    fetchDetail();
    setLOADING(false);
  }, [user_id, DATE.startDt, DATE.endDt]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    // 초기 영양소 값 설정
    setOBJECT_BEFORE((prev) => ({
      ...prev,
      food_section: [...OBJECT?.food_section],
    }));
  }, [OBJECT]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const totals = OBJECT?.food_section?.reduce((acc, current) => {
      return {
        totalKcal: acc.totalKcal + Number(current.food_kcal),
        totalFat: acc.totalFat + Number(current.food_fat),
        totalCarb: acc.totalCarb + Number(current.food_carb),
        totalProtein: acc.totalProtein + Number(current.food_protein),
      };
    }, { totalKcal: 0, totalFat: 0, totalCarb: 0, totalProtein: 0 });

    setOBJECT((prev) => ({
      ...prev,
      food_total_kcal: Number(totals.totalKcal.toFixed(1)),
      food_total_fat: Number(totals.totalFat.toFixed(1)),
      food_total_carb: Number(totals.totalCarb.toFixed(1)),
      food_total_protein: Number(totals.totalProtein.toFixed(1)),
    }));
  }, [OBJECT?.food_section]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const res = await axios.post(`${URL_OBJECT}/save`, {
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
    const handleCountChange = (index, newValue) => {
      const newCountValue = Number(newValue);

      setOBJECT((prev) => {
        const newFoodSection = [...prev.food_section];
        const section = newFoodSection[index];
        const defaultSection = OBJECT_BEFORE.food_section[index];
        const ratio = newCountValue / (defaultSection.food_count || 1);

        if (defaultSection) {
          newFoodSection[index] = {
            ...section,
            food_count: newCountValue,
            food_gram: Number(((defaultSection?.food_gram) * ratio).toFixed(1)),
            food_kcal: Number(((defaultSection?.food_kcal) * ratio).toFixed(1)),
            food_carb: Number(((defaultSection?.food_carb) * ratio).toFixed(1)),
            food_protein: Number(((defaultSection?.food_protein) * ratio).toFixed(1)),
            food_fat: Number(((defaultSection?.food_fat) * ratio).toFixed(1)),
          };
        }
        return {
          ...prev,
          food_section: newFoodSection,
        };
      });
    };
    const handlerFoodDelete = (index) => {
      setOBJECT((prev) => {
        const newFoodSection = [...prev.food_section];
        newFoodSection.splice(index, 1);
        return {
          ...prev,
          food_section: newFoodSection,
        };
      });
    };
    const tableSection = () => (
      <React.Fragment>
        <Box className={"block-wrapper h-75vh"}>
          <TableContainer>
            <Table className={"border"}>
              <TableHead>
                <TableRow className={"table-thead-tr"}>
                  <TableCell>분류</TableCell>
                  <TableCell>음식명</TableCell>
                  <TableCell>수량</TableCell>
                  <TableCell>g</TableCell>
                  <TableCell>kcal</TableCell>
                  <TableCell>fat</TableCell>
                  <TableCell>carb</TableCell>
                  <TableCell>protein</TableCell>
                  <TableCell>x</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {OBJECT?.food_section?.map((item, index) => (
                  <React.Fragment key={index}>
                    <TableRow className={"table-tbody-tr"}>
                      <TableCell>
                        <select
                          id={"food_part_idx"}
                          name={"food_part_idx"}
                          className={"form-select"}
                          value={item.food_part_idx}
                          onChange={(e) => {
                            const newIndex = Number(e.target.value);
                            setOBJECT((prev) => ({
                              ...prev,
                              food_section: prev.food_section.map((item, idx) => (
                                idx === index ? {
                                  ...item,
                                  food_part_idx: newIndex,
                                  food_part_val: foodArray[newIndex]?.food_part
                                } : item
                              ))
                            }));
                          }}
                        >
                          {foodArray?.map((item, idx) => (
                            <option key={idx} value={idx}>
                              {item.food_part}
                            </option>
                          ))}
                        </select>
                      </TableCell>
                      <TableCell>{`${item.food_title}(${item.food_brand})`}</TableCell>
                      <TableCell>
                        <Box className={"d-flex"}>
                          <NumericFormat
                            min={0}
                            max={99}
                            minLength={1}
                            maxLength={2}
                            id={"food_plan_count"}
                            name={"food_plan_count"}
                            datatype={"number"}
                            displayType={"input"}
                            className={"form-control"}
                            disabled={false}
                            allowNegative={false}
                            fixedDecimalScale={true}
                            thousandSeparator={true}
                            value={Math.min(99, Number(item.food_count))}
                            onValueChange={(values) => {
                              const limitedValue = Math.min(99, parseInt(values.value));
                              handleCountChange(index, limitedValue);
                            }}
                          ></NumericFormat>
                          <span>{item.food_serv}</span>
                        </Box>
                      </TableCell>
                      <TableCell>{item.food_gram}</TableCell>
                      <TableCell>{item.food_kcal}</TableCell>
                      <TableCell>{item.food_fat}</TableCell>
                      <TableCell>{item.food_carb}</TableCell>
                      <TableCell>{item.food_protein}</TableCell>
                      <TableCell>
                        <p className={"del-btn"} onClick={() => (
                          handlerFoodDelete(index)
                        )}>
                          x
                        </p>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
                <TableRow className={"table-tbody-tr"}>
                  <TableCell>합계</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell>{OBJECT?.food_total_kcal}</TableCell>
                  <TableCell>{OBJECT?.food_total_fat}</TableCell>
                  <TableCell>{OBJECT?.food_total_carb}</TableCell>
                  <TableCell>{OBJECT?.food_total_protein}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </React.Fragment>
    );
    return (
      <React.Fragment>
        <Paper className={"content-wrapper"} variant={"outlined"}>
          <Container className={"p-0"}>
            <Grid2 container spacing={3}>
              <Grid2 xl={12} lg={12} md={12} sm={12} xs={12} className={"text-center"}>
                {tableSection()}
              </Grid2>
            </Grid2>
          </Container>
        </Paper>
      </React.Fragment>
    );
  };

  // 9. header ------------------------------------------------------------------------------------>
  const headerNode = () => (
    <Header />
  );

  // 10. navBar ----------------------------------------------------------------------------------->
  const navBarNode = () => (
    <NavBar />
  );

  // 11. day -------------------------------------------------------------------------------------->
  const daySaveNode = () => (
    <DaySave DATE={DATE} setDATE={setDATE} DAYPICKER={DAYPICKER} setDAYPICKER={setDAYPICKER}
      part={"food"} plan={""} type={"save"}
    />
  );

  // 13. btn -------------------------------------------------------------------------------------->
  const btnNode = () => (
    <Btn DAYPICKER={DAYPICKER} setDAYPICKER={setDAYPICKER} DATE={DATE} setDATE={setDATE}
      SEND={SEND}  FILTER={""} setFILTER={""} PAGING={""} setPAGING={""}
      flowSave={flowSave} navParam={navParam}
      part={"food"} plan={""} type={"search"}
    />
  );

  // 14. loading ---------------------------------------------------------------------------------->
  const loadingNode = () => (
    <Loading LOADING={LOADING} setLOADING={setLOADING}
    />
  );

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      {headerNode()}
      {navBarNode()}
      {daySaveNode()}
      {LOADING ? loadingNode() : tableNode()}
      {btnNode()}
    </React.Fragment>
  );
};