// CalendarSave.jsx

import {React, useState, useEffect} from "../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {useCallback, useRef} from "../../import/ImportReacts.jsx";
import {axios} from "../../import/ImportLibs.jsx";
import {useTranslate} from "../../import/ImportHooks.jsx";
import {Loading, Footer} from "../../import/ImportLayouts.jsx";
import {percent, log} from "../../import/ImportLogics";
import {Div, Br20, Br40} from "../../import/ImportComponents.jsx";
import {Img, Calendar, Memo, Count, DropDown} from "../../import/ImportComponents.jsx";
import {Card, Paper, Badge, MenuItem, TextField} from "../../import/ImportMuis.jsx";
import {calendar2} from "../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const CalendarSave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_CALENDAR || "";
  const URL_OBJECT = URL + SUBFIX;
  const session = sessionStorage.getItem("dataSet") || "{}";
  const calendarArray = JSON.parse(session)?.calendar || [];
  const navigate = useNavigate();
  const location = useLocation();
  const {translate} = useTranslate();
  const location_id = location?.state?.id;
  const location_dateType = location?.state?.dateType;
  const location_dateStart = location?.state?.dateStart;
  const location_dateEnd = location?.state?.dateEnd;
  const location_category = location?.state?.category;
  const PATH = location?.pathname;
  const firstStr = PATH?.split("/")[1] || "";
  const secondStr = PATH?.split("/")[2] || "";
  const thirdStr = PATH?.split("/")[3] || "";
  const colors = [
    "red", "orange", "yellow", "green", "blue", "navy", "purple", "black", "gray"
  ];

  // 2-2. useState -------------------------------------------------------------------------------->
  /** @type {React.MutableRefObject<IntersectionObserver|null>} **/
  const observer = useRef(null);
  const [LOADING, setLOADING] = useState(false);
  const [isExist, setIsExist] = useState([""]);
  const [MORE, setMORE] = useState(true);
  const sessionId = sessionStorage.getItem("sessionId");

  // 2-2. useState -------------------------------------------------------------------------------->
  const [SEND, setSEND] = useState({
    id: "",
    dateType: "",
    dateStart: "0000-00-00",
    dateEnd: "0000-00-00",
    toList: "/calendar/list"
  });
  const [COUNT, setCOUNT] = useState({
    totalCnt: 0,
    sectionCnt: 0,
    newSectionCnt: 0
  });
  const [DATE, setDATE] = useState({
    dateType: location_dateType,
    dateStart: location_dateStart,
    dateEnd: location_dateEnd
  });

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_DEF = {
    _id: "",
    calendar_number: 0,
    calendar_demo: false,
    calendar_dateType: "",
    calendar_dateStart: "0000-00-00",
    calendar_dateEnd: "0000-00-00",
    calendar_section: [{
      calendar_part_idx: 1,
      calendar_part_val: "일정",
      calendar_title : "",
      calendar_color: "black",
      calendar_content: ""
    }]
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    setLOADING(true);
    const res = await axios.get(`${URL_OBJECT}/detail`, {
      params: {
        user_id: sessionId,
        _id: location_id,
        DATE: DATE,
      },
    });
    // 첫번째 객체를 제외하고 데이터 추가
    setOBJECT((prev) => {
      if (prev.length === 1 && prev[0]._id === "") {
        return res.data.result;
      }
      else {
        return {...prev, ...res.data.result};
      }
    });
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: res.data.totalCnt || 0,
      sectionCnt: res.data.sectionCnt || 0,
      newSectionCnt: res.data.sectionCnt || 0
    }));
    setLOADING(false);
  })()}, [sessionId, location_id, location_category, DATE.dateStart, DATE.dateEnd]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const defaultSection = {
      calendar_part_idx: 0,
      calendar_part_val: "전체",
      calendar_title: "",
      calendar_color: "black",
      calendar_content: ""
    };
    let updatedSection = Array(COUNT?.newSectionCnt).fill(null).map((_, idx) =>
      idx < OBJECT?.calendar_section.length ? OBJECT?.calendar_section[idx] : defaultSection
    );
    setOBJECT((prev) => ({
      ...prev,
      calendar_section: updatedSection
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

  // 3. flow -------------------------------------------------------------------------------------->
  const flowDelete = async (id, section_id) => {
    const res = await axios.delete(`${URL_OBJECT}/deletes`, {
      params: {
        user_id: sessionId,
        _id: id,
        section_id: section_id,
        DATE: DATE,
      },
    });
    if (res.data.status === "success") {
      alert(res.data.msg);
      if (Object.keys(res.data.result).length > 0) {
        setOBJECT(res.data.result);
      }
      else {
        navigate(SEND.toList);
      }
    }
    else {
      alert(res.data.msg);
    }
  };

  // 4-3. handler --------------------------------------------------------------------------------->
  const handlerDelete = (index) => {
    setOBJECT((prev) => ({
      ...prev,
      calendar_section: prev.calendar_section.filter((_, idx) => (idx !== index))
    }));
    setCOUNT((prev) => ({
      ...prev,
      newSectionCnt: prev.newSectionCnt - 1,
    }));
  };

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    // 7-1. date
    const dateSection = () => (
      <Calendar
        DATE={DATE}
        setDATE={setDATE}
        isExist={isExist}
        setIsExist={setIsExist}
      />
    );
    // 7-2. count
    const countSection = () => (
      <Count
        COUNT={COUNT}
        setCOUNT={setCOUNT}
        limit={1}
      />
    );
    // 7-5. total
    // 7-3. badge
    const badgeSection = (index) => (
      <Badge
        badgeContent={index + 1}
        color={"primary"}
        showZero={true}
      />
    );
    // 7-4. dropdown
    const dropdownSection = (id, sectionId, index) => (
      <DropDown
        id={id}
        sectionId={sectionId}
        index={index}
        handlerDelete={handlerDelete}
      />
    );
    // 7-7. fragment
    const tableFragment = (i) => (
      <Card variant={"outlined"} className={"p-20"} key={i}>
        <Div className={"d-between"}>
          {badgeSection(i)}
          {dropdownSection(OBJECT?._id, OBJECT?.calendar_section[i]?._id, i)}
        </Div>
        <Br40/>
        <Div className={"d-center"}>
          <TextField
            select={true}
            type={"text"}
            size={"small"}
            label={"파트"}
            variant={"outlined"}
            className={"w-40vw me-3vw"}
            value={OBJECT?.calendar_section[i]?.calendar_part_idx}
            InputProps={{
              readOnly: false,
              startAdornment: null,
              endAdornment: null
            }}
            onChange={(e) => {
              const newIndex = Number(e.target.value);
              setOBJECT((prev) => ({
                ...prev,
                calendar_section: prev.calendar_section.map((item, idx) => (
                  idx === i ? {
                    ...item,
                    calendar_part_idx: newIndex,
                    calendar_part_val: calendarArray[newIndex]?.calendar_part
                  } : item
                ))
              }));
            }}
          >
            {calendarArray.map((item, idx) => (
              <MenuItem key={idx} value={idx}>
                {item.calendar_part}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select={true}
            type={"text"}
            size={"small"}
            label={"색상"}
            variant={"outlined"}
            className={"w-40vw ms-3vw"}
            value={OBJECT?.calendar_section[i]?.calendar_color}
            InputProps={{
              readOnly: false,
              startAdornment: null,
              endAdornment: null
            }}
            onChange={(e) => {
              const newColor = e.target.value;
              setOBJECT((prev) => ({
                ...prev,
                calendar_section: prev.calendar_section.map((item, idx) => (
                  idx === i ? {
                    ...item,
                    calendar_color: newColor
                  } : item
                ))
              }));
            }}
          >
            {colors.map((item, idx) => (
              <MenuItem key={idx} value={item}>
                <span className={`${item}`}>●</span>
                <span className={"ms-10"}>{item}</span>
              </MenuItem>
            ))}
          </TextField>
        </Div>
        <Br20/>
        <Div className={"d-center"}>
          <TextField
            select={false}
            type={"text"}
            size={"small"}
            label={"제목"}
            variant={"outlined"}
            className={"w-86vw"}
            value={OBJECT?.calendar_section[i]?.calendar_title}
            InputProps={{
              readOnly: false,
              startAdornment: (
                <Img src={calendar2} className={"w-16 h-16"} />
              ),
              endAdornment: null
            }}
            onChange={(e) => {
              const newTitle = e.target.value;
              setOBJECT((prev) => ({
                ...prev,
                calendar_section: prev.calendar_section.map((item, idx) => (
                  idx === i ? {
                    ...item,
                    calendar_title: newTitle
                  } : item
                ))
              }));
            }}
          />
        </Div>
        <Br20/>
        <Div className={"d-center"}>
          <Memo
            OBJECT={OBJECT}
            setOBJECT={setOBJECT}
            extra={"calendar_content"}
            i={i}
          />
        </Div>
        <Br20/>
      </Card>
    );
    // 7-8. table
    const tableSection = () => (
      COUNT?.newSectionCnt > 0 && (OBJECT?.calendar_section.map((_, i) => (
        tableFragment(i)
      )))
    );
    // 7-9. first
    const firstSection = () => (
      <Card variant={"outlined"} className={"p-20"}>
        {dateSection()}
        <Br20/>
        {countSection()}
      </Card>
    );
    // 7-11. third
    const thirdSection = () => (
      tableSection()
    );
    // 7-12. return
    return (
      <Paper className={"content-wrapper border radius"}>
        <Div className={"block-wrapper h-min65vh"}>
          {firstSection()}
          {thirdSection()}
        </Div>
      </Paper>
    );
  };

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
        navigate, flowSave, flowDelete
      }}
    />
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <>
      {tableNode()}
      {footerNode()}
    </>
  );
};