// ExerciseList.jsx

import axios from "axios";
import numeral from 'numeral';
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../hooks/useStorage.jsx";
import {DayPickerNode} from "../../fragments/DayPickerNode.jsx";
import {PagingNode} from "../../fragments/PagingNode.jsx";
import {FilterNode} from "../../fragments/FilterNode.jsx";
import {ButtonNode} from "../../fragments/ButtonNode.jsx";
import {LoadingNode} from "../../fragments/LoadingNode.jsx";
import {Container, Table, Row, Col, Card} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const ExerciseList = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_EXERCISE || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id");
  const navParam = useNavigate();
  const location = useLocation();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location?.pathname.trim().toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const [LOADING, setLOADING] = useState(true);
  const [SEND, setSEND] = useState({
    id: "",
    refresh: 0,
    startDt: "0000-00-00",
    endDt: "0000-00-00",
    toDetail: "/exercise/detail",
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

  // 2-3. useState -------------------------------------------------------------------------------->
  const OBJECT_DEF = [{
    _id: "",
    exercise_number: 0,
    exercise_demo: false,
    exercise_startDt: "0000-00-00",
    exercise_endDt: "0000-00-00",
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
      exercise_rest: 0,
      exercise_volume: 0,
      exercise_cardio: "00:00",
    }],
  }];
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const res = await axios.get(`${URL_OBJECT}/list`, {
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

  // 4. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    const tableSection = () => (
      <React.Fragment>
        <Table hover responsive className={"border-1"}>
          <thead>
            <tr>
              <th className={"table-thead"}>날짜</th>
              <th className={"table-thead"}>부위</th>
              <th className={"table-thead"}>종목</th>
              <th className={"table-thead"}>세트</th>
              <th className={"table-thead"}>횟수</th>
              <th className={"table-thead"}>중량</th>
            </tr>
          </thead>
          <tbody>
            {OBJECT?.map((item, index) => (
              <React.Fragment key={item._id}>
                {item.exercise_section.slice(0, 3)?.map((section, sectionIndex) => (
                  <tr key={sectionIndex}>
                    {sectionIndex === 0 && (
                      <td rowSpan={Math.min(item.exercise_section.length, 3)}
                        className={"pointer"} onClick={() => {
                          SEND.id = item._id;
                          SEND.startDt = item.exercise_startDt;
                          SEND.endDt = item.exercise_endDt;
                          navParam(SEND.toDetail, {
                            state: SEND
                          });
                        }}>
                        {item.exercise_startDt?.substring(5, 10)}
                        {item.exercise_section.length > 3 && (<div>더보기</div>)}
                      </td>
                    )}
                    <td>{section.exercise_part_val.substring(0, 6)}</td>
                    <td>{section.exercise_title_val.substring(0, 6)}</td>
                    {section.exercise_part_val !== "유산소" ? (
                      <React.Fragment>
                        <td>{`${numeral(section.exercise_set).format('0,0')}`}</td>
                        <td>{`${numeral(section.exercise_rep).format('0,0')}`}</td>
                        <td>{`${numeral(section.exercise_kg).format('0,0')}`}</td>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <td colSpan={3}>{section.exercise_cardio}</td>
                      </React.Fragment>
                    )}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      </React.Fragment>
    );
    return (
      <React.Fragment>
        <div className={"table-wrapper"}>
          {tableSection()}
        </div>
      </React.Fragment>
    );
  };

  // 6. loading ----------------------------------------------------------------------------------->
  const loadingNode = () => (
    <LoadingNode LOADING={LOADING} setLOADING={setLOADING}
    />
  );

  // 8. dayPicker --------------------------------------------------------------------------------->
  const dayPickerNode = () => (
    <DayPickerNode FILTER={FILTER} setFILTER={setFILTER} DATE={DATE} setDATE={setDATE}
      DAYPICKER={DAYPICKER} setDAYPICKER={setDAYPICKER}
      part={"exercise"} plan={""} type={"list"}
    />
  );

  // 10. paging ----------------------------------------------------------------------------------->
  const pagingNode = () => (
    <PagingNode PAGING={PAGING} setPAGING={setPAGING} COUNT={COUNT} setCOUNT={setCOUNT}
      part={"exercise"} plan={""} type={"list"}
    />
  );

  // 9. filter ------------------------------------------------------------------------------------>
  const filterNode = () => (
    <FilterNode FILTER={FILTER} setFILTER={setFILTER} PAGING={PAGING} setPAGING={setPAGING}
      part={"exercise"} plan={""} type={"list"}
    />
  );

  // 11. button ----------------------------------------------------------------------------------->
  const buttonNode = () => (
    <ButtonNode DAYPICKER={DAYPICKER} setDAYPICKER={setDAYPICKER} DATE={DATE} setDATE={setDATE}
      SEND={SEND} FILTER={FILTER} setFILTER={setFILTER} PAGING={PAGING} setPAGING={setPAGING}
      flowSave={""} navParam={navParam} part={"exercise"} plan={"plan"} type={"list"}
    />
  );

  // 12. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <div className={"content-wrapper"}>
        <Card className={"card-wrapper"}>
          <Container fluid={true}>
            <Row>
              <Col lg={12} md={12} sm={12} xs={12} className={"text-center"}>
                {dayPickerNode()}
                {LOADING ? loadingNode() : tableNode()}
              </Col>
            </Row>
          </Container>
        </Card>
      </div>
      <div className={"content-wrapper"}>
        <Card className={"card-wrapper"}>
          <Container fluid={true}>
            <Row>
              <Col lg={12} md={12} sm={12} xs={12} className={"d-center"}>
                {filterNode()}
              </Col>
              <Col lg={12} md={12} sm={12} xs={12} className={"d-center"}>
                {pagingNode()}
              </Col>
              <Col lg={12} md={12} sm={12} xs={12} className={"d-center"}>
                {buttonNode()}
              </Col>
            </Row>
          </Container>
        </Card>
      </div>
    </React.Fragment>
  );
};
