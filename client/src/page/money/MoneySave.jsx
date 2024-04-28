// MoneySave.jsx

import axios from "axios";
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {NumericFormat} from "react-number-format";
import InputMask from "react-input-mask";
import {percent} from "../../assets/js/percent.js";
import {useDate} from "../../assets/hooks/useDate.jsx";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import {DateNode} from "../../fragments/DateNode.jsx";
import {ButtonNode} from "../../fragments/ButtonNode.jsx";
import {Container, Row, Col, Card} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const MoneySave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_MONEY || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const customer_id = sessionStorage.getItem("customer_id");
  const session = sessionStorage.getItem("dataset") || "";
  const moneyArray = JSON.parse(session)?.money || [];
  const navParam = useNavigate();
  const location = useLocation();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:SEND, set:setSEND} = useStorage(
    `SEND(${PATH})`, {
      id: "",
      refresh: 0,
      startDt: "0000-00-00",
      endDt: "0000-00-00",
      toList:"/money/list"
    }
  );
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      startDt: location_startDt,
      endDt: location_endDt
    }
  );
  const {val:COUNT, set:setCOUNT} = useStorage(
    `COUNT(${PATH})`, {
      totalCnt: 0,
      sectionCnt: 0
    }
  );
  const {val:CALENDAR, set:setCALENDAR} = useStorage(
    `CALENDAR(${PATH})`, {
      calStartOpen: false,
      calEndOpen: false,
      calOpen: false,
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_DEFAULT = {
    _id: "",
    money_number: 0,
    money_startDt: "0000-00-00",
    money_endDt: "0000-00-00",
    money_total_in: 0,
    money_total_out: 0,
    money_section: [{
      money_part_idx: 0,
      money_part_val: "전체",
      money_title_idx: 0,
      money_title_val: "전체",
      money_amount: 0,
      money_content: "",
    }],
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEFAULT);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_OBJECT}/detail`, {
      params: {
        customer_id: customer_id,
        _id: "",
        duration: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    setOBJECT(response.data.result || OBJECT_DEFAULT);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: response.data.totalCnt || 0,
      sectionCnt: response.data.sectionCnt || 0
    }));
  })()}, [customer_id, DATE.startDt, DATE.endDt]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    // money_part_val 가 수입인경우, 지출인 경우
    const totals = OBJECT?.money_section.reduce((acc, cur) => {
      return {
        totalIn: acc.totalIn + (cur.money_part_val === "수입" ? cur.money_amount : 0),
        totalOut: acc.totalOut + (cur.money_part_val === "지출" ? cur.money_amount : 0)
      };
    }, {totalIn: 0, totalOut: 0});

    setOBJECT((prev) => ({
      ...prev,
      money_total_in: Math.round(totals.totalIn),
      money_total_out: Math.round(totals.totalOut)
    }));

  }, [OBJECT?.money_section]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const response = await axios.post(`${URL_OBJECT}/save`, {
      customer_id: customer_id,
      OBJECT: OBJECT,
      duration: `${DATE.startDt} ~ ${DATE.endDt}`,
    });
    if (response.data.status === "success") {
      alert(response.data.msg);
      percent();
      SEND.startDt = DATE.startDt;
      SEND.endDt = DATE.endDt;
      navParam(SEND.toList, {
        state: SEND
      });
    }
    else {
      alert(response.data.msg);
    }
  };

  // 4. date -------------------------------------------------------------------------------------->
  const dateNode = () => {
    return (
      <DateNode DATE={DATE} setDATE={setDATE} part={"money"} plan={""} type={"save"} />
    );
  };

  // 5. handler ----------------------------------------------------------------------------------->
  const handlerSectionCount = () => {
    function handlerCount(e) {
      let newCount = parseInt(e, 10);
      let defaultSection = {
        money_part_idx: 0,
        money_part_val: "전체",
        money_title_idx: 0,
        money_title_val: "전체",
        money_amount: 0,
        money_content: ""
      };

      setCOUNT((prev) => ({
        ...prev,
        sectionCnt: newCount
      }));

      if (newCount > 0) {
        let updatedSection = Array(newCount).fill(null).map((_, idx) => (
          idx < OBJECT.money_section.length ? OBJECT.money_section[idx] : defaultSection
        ));
        setOBJECT((prev) => ({
          ...prev,
          money_section: updatedSection
        }));
      }
      else {
        setOBJECT((prev) => ({
          ...prev,
          money_section: []
        }));
      }
    };
    function inputFragment () {
      return (
        <Row className={"d-center"}>
          <Col xs={4}>
            <NumericFormat
              min={0}
              max={10}
              minLength={1}
              maxLength={2}
              datatype={"number"}
              displayType={"input"}
              id={"sectionCnt"}
              name={"sectionCnt"}
              className={"form-control mb-30"}
              disabled={false}
              thousandSeparator={false}
              fixedDecimalScale={true}
              value={Math.min(10, COUNT?.sectionCnt)}
              onValueChange={(values) => {
                const limitedValue = Math.min(10, parseInt(values?.value));
                handlerCount(limitedValue.toString());
              }}
            ></NumericFormat>
          </Col>
        </Row>
      );
    };
    return (
      <React.Fragment>
        {inputFragment()}
      </React.Fragment>
    );
  };

  // 5. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    function tableSection (i) {
      return (
        <div key={i} className={"mb-20"}>
          <Row>
            <Col lg={6} md={6} sm={6} xs={6}>
              <div className={"input-group"}>
                <span className={"input-group-text"}>파트</span>
                <select
                  id={`money_part_idx-${i}`}
                  className={"form-select"}
                  value={OBJECT?.money_section[i]?.money_part_idx}
                  onChange={(e) => {
                    const newIndex = parseInt(e.target.value);
                    setOBJECT((prev) => ({
                      ...prev,
                      money_section: prev.money_section.map((item, idx) => (
                        idx === i ? {
                          ...item,
                          money_part_idx: newIndex,
                          money_part_val: moneyArray[newIndex]?.money_part,
                          money_title_idx: 0,
                          money_title_val: moneyArray[newIndex]?.money_title[0],
                        } : item
                      ))
                    }));
                  }}
                >
                  {moneyArray?.map((item, idx) => (
                    <option key={idx} value={idx}>
                      {item.money_part}
                    </option>
                  ))}
                </select>
              </div>
            </Col>
            <Col lg={6} md={6} sm={6} xs={6}>
              <div className={"input-group"}>
                <span className={"input-group-text"}>타이틀</span>
                <select
                  id={`money_title_idx-${i}`}
                  className={"form-select"}
                  value={OBJECT?.money_section[i]?.money_title_idx}
                  onChange={(e) => {
                    const newTitleIdx = parseInt(e.target.value);
                    const newTitleVal = moneyArray[OBJECT?.money_section[i]?.money_part_idx]?.money_title[newTitleIdx];
                    if (newTitleIdx >= 0 && newTitleVal) {
                      setOBJECT((prev) => ({
                        ...prev,
                        money_section: prev.money_section.map((item, idx) => (
                          idx === i ? {
                            ...item,
                            money_title_idx: newTitleIdx,
                            money_title_val: newTitleVal,
                          } : item
                        ))
                      }));
                    }
                  }}
                >
                  {moneyArray[OBJECT?.money_section[i]?.money_part_idx]?.money_title?.map((title, idx) => (
                    <option key={idx} value={idx}>
                      {title}
                    </option>
                  ))}
                </select>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg={6} md={6} sm={6} xs={6}>
              <div className={"input-group"}>
                <span className={"input-group-text"}>금액</span>
                <NumericFormat
                  min={0}
                  max={9999999999}
                  minLength={1}
                  maxLength={14}
                  prefix={"₩  "}
                  datatype={"number"}
                  displayType={"input"}
                  id={`money_amount-${i}`}
                  name={`money_amount-${i}`}
                  className={`form-control ${OBJECT?.money_section[i]?.money_part_val === "수입" ? "text-primary" : "text-danger"}`}
                  disabled={false}
                  allowNegative={false}
                  thousandSeparator={true}
                  fixedDecimalScale={true}
                  value={OBJECT?.money_section[i]?.money_amount}
                  onValueChange={(values) => {
                    const limitedValue = Math.min(9999999999, parseInt(values?.value));
                    setOBJECT((prev) => ({
                      ...prev,
                      money_section: prev.money_section.map((item, idx) => (
                        idx === i ? {
                          ...item,
                          money_amount: limitedValue
                        } : item
                      ))
                    }));
                  }}
                ></NumericFormat>
              </div>
            </Col>
            <Col lg={6} md={6} sm={6} xs={6}>
              <div className={"input-group"}>
                <span className={"input-group-text"}>메모</span>
                <InputMask
                  mask={""}
                  placeholder={"메모"}
                  id={`money_content-${i}`}
                  name={`money_content-${i}`}
                  className={"form-control"}
                  maskChar={null}
                  value={OBJECT?.money_section[i]?.money_content}
                  onChange={(e) => {
                    const limitedContent = e.target.value.slice(0, 100);
                    setOBJECT((prev) =>({
                      ...prev,
                      money_section: prev.money_section.map((item, idx) => (
                        idx === i ? {
                          ...item,
                          money_content: limitedContent
                        } : item
                      ))
                    }));
                  }}
                ></InputMask>
              </div>
            </Col>
          </Row>
        </div>
      );
    };
    function tableFragment () {
      return (
        <Row className={"d-center"}>
          <Col lg={12} md={12} sm={12} xs={12}>
            {Array.from({ length: COUNT.sectionCnt }, (_, i) => tableSection(i))}
          </Col>
        </Row>
      );
    };
    function tableRemain () {
      return (
        <Row className={"d-center"}>
          <Col lg={6} md={6} sm={6} xs={6}>
            <div className={"input-group"}>
              <span className={"input-group-text"}>총수입</span>
              <NumericFormat
                min={0}
                max={9999999999}
                minLength={1}
                maxLength={14}
                prefix={"₩  "}
                datatype={"number"}
                displayType={"input"}
                id={"money_total_in"}
                name={"money_total_in"}
                className={`form-control text-primary`}
                readOnly={true}
                disabled={true}
                allowNegative={false}
                thousandSeparator={true}
                fixedDecimalScale={true}
                value={Math.min(9999999999, OBJECT?.money_total_in)}
              ></NumericFormat>
            </div>
          </Col>
          <Col lg={6} md={6} sm={6} xs={6}>
            <div className={"input-group"}>
              <span className={"input-group-text"}>총지출</span>
              <NumericFormat
                min={0}
                max={9999999999}
                minLength={1}
                maxLength={14}
                prefix={"₩  "}
                datatype={"number"}
                displayType={"input"}
                id={"money_total_out"}
                name={"money_total_out"}
                className={`form-control text-danger`}
                readOnly={true}
                disabled={true}
                allowNegative={false}
                thousandSeparator={true}
                fixedDecimalScale={true}
                value={Math.min(9999999999, OBJECT?.money_total_out)}
              ></NumericFormat>
            </div>
          </Col>
        </Row>
      );
    };
    return (
      <React.Fragment>
        {tableFragment()}
        {tableRemain()}
      </React.Fragment>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    return (
      <ButtonNode CALENDAR={CALENDAR} setCALENDAR={setCALENDAR} DATE={DATE} setDATE={setDATE}
        SEND={SEND}  FILTER={""} setFILTER={""} PAGING={""} setPAGING={""}
        flowSave={flowSave} navParam={navParam} part={"money"} plan={""} type={"save"}
      />
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <div className={"root-wrapper"}>
        <Card className={"container-wrapper"} border={"light"}>
          <Container>
            <Row>
              <Col lg={12} md={12} sm={12} xs={12} className={"mb-20 text-center"}>
                {dateNode()}
              </Col>
              <Col lg={12} md={12} sm={12} xs={12} className={"mb-20 text-center"}>
                {handlerSectionCount()}
              </Col>
              <Col lg={12} md={12} sm={12} xs={12} className={"mb-20 text-center"}>
                {tableNode()}
              </Col>
              <Col lg={12} md={12} sm={12} xs={12} className={"mb-20 text-center"}>
                {buttonNode()}
              </Col>
            </Row>
          </Container>
        </Card>
      </div>
    </React.Fragment>
  );
};
