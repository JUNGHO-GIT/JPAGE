// MoneyDetail.jsx

import {React, useState, useEffect, useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {moment, axios, numeral} from "../../import/ImportLibs.jsx";
import {useDate, useStorage} from "../../import/ImportHooks.jsx";
import {percent} from "../../import/ImportLogics";
import {Loading, Footer} from "../../import/ImportLayouts.jsx";
import {Div, Adorn, Icons, PopUp} from "../../import/ImportComponents.jsx";
import {Card, Paper, Badge, TextField, DateCalendar} from "../../import/ImportMuis.jsx";
import {AdapterMoment, LocalizationProvider, MenuItem} from "../../import/ImportMuis.jsx";
import {
  calendar1, calendar2, calendar3, calendar4,
  exercise1, exercise2, exercise3, exercise4, exercise5, exercise9, exercise10,
  food1, food2, food3, food4, food5, food6, food7, food8,
  money1, money2, money3, money4,
  sleep1, sleep2, sleep3, sleep5, sleep6, sleep7, sleep8, sleep9, sleep10,
  user1, user2, user3, user4, user5, user6, user7, user8, user9, user10, user11, user12,
  setting1, setting2, setting3, setting4, setting5, setting6, setting7, setting8
} from "../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const MoneyDetail = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_MONEY || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id") || "{}";
  const session = sessionStorage.getItem("dataset") || "{}";
  const moneyArray = JSON.parse(session)?.money || [];
  const navigate = useNavigate();
  const location = useLocation();
  const location_id = location?.state?.id?.trim()?.toString();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location?.pathname.trim().toString();
  const partStr = PATH?.split("/")[1] ? PATH?.split("/")[1] : "";
  const typeStr = PATH?.split("/")[2] ? PATH?.split("/")[2] : "";
  const thirdStr = PATH?.split("/")[3] ? PATH?.split("/")[3] : "";

  // 2-1. useStorage ------------------------------------------------------------------------------>
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      startDt: location_startDt || moment().format("YYYY-MM-DD"),
      endDt: location_endDt || moment().format("YYYY-MM-DD"),
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [LOADING, setLOADING] = useState(true);
  const [SEND, setSEND] = useState({
    id: "",
    startDt: "0000-00-00",
    endDt: "0000-00-00",
    toDetail: "/money/detail",
    toList: "/money/list",
    toUpdate: "/money/save",
  });
  const [COUNT, setCOUNT] = useState({
    totalCnt: 0,
    sectionCnt: 0
  });

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_DEF = {
    _id: "",
    money_number: 0,
    money_demo: false,
    money_startDt: "0000-00-00",
    money_endDt: "0000-00-00",
    money_total_in: 0,
    money_total_out: 0,
    money_property: 0,
    money_section: [{
      money_part_idx: 0,
      money_part_val: "전체",
      money_title_idx: 0,
      money_title_val: "전체",
      money_amount: 0,
      money_content: "",
    }],
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const res = await axios.get(`${URL_OBJECT}/detail`, {
      params: {
        user_id: user_id,
        _id: location_id,
        duration: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    setOBJECT(res.data.result || OBJECT_DEF);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: res.data.totalCnt || 0,
      sectionCnt: res.data.sectionCnt || 0,
    }));
    setLOADING(false);
  })()}, [location_id, user_id, DATE.startDt, DATE.endDt]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowDelete = async (id, section_id) => {
    const res = await axios.delete(`${URL_OBJECT}/deletes`, {
      params: {
        user_id: user_id,
        _id: id,
        section_id: section_id,
        duration: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    if (res.data.status === "success") {
      alert(res.data.msg);
      percent();
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

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    // 7-1. date
    const dateSection = () => (
      <PopUp
        type={"calendar"}
        position={"bottom"}
        direction={"center"}
        contents={({closePopup}) => (
          <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
            <DateCalendar
              timezone={"Asia/Seoul"}
              views={["day"]}
              readOnly={false}
              value={moment(DATE.startDt)}
              sx={{
                width: "80vw",
                height: "60vh"
              }}
              onChange={(date) => {
                setDATE((prev) => ({
                  ...prev,
                  startDt: moment(date).format("YYYY-MM-DD"),
                  endDt: moment(date).format("YYYY-MM-DD"),
                }));
                closePopup();
              }}
            />
          </LocalizationProvider>
        )}>
        {(popTrigger={}) => (
          <TextField
            select={false}
            label={"날짜"}
            size={"small"}
            value={DATE.startDt}
            variant={"outlined"}
            className={"w-86vw"}
            onClick={(e) => {
              popTrigger.openPopup(e.currentTarget);
            }}
            InputProps={{
              readOnly: true,
              startAdornment: (
              <img src={calendar2} className={"w-16 h-16 me-10"} alt={"calendar2"} />
              ),
              endAdornment: (
                null
              )
            }}
          />
        )}
      </PopUp>
    );
    // 7-2. count
    const countSection = () => (
      <PopUp
        type={"alert"}
        position={"bottom"}
        direction={"center"}
        contents={({closePopup}) => (
          <Div className={"d-center"}>0이상 10이하의 숫자만 입력하세요</Div>
        )}>
        {(popTrigger={}) => (
          <TextField
            type={"text"}
            label={"항목수"}
            variant={"outlined"}
            size={"small"}
            className={"w-86vw"}
            value={COUNT?.sectionCnt}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <img src={setting5} className={"w-16 h-16 me-10"} alt={"setting5"}/>
              ),
              endAdornment: (
                null
              )
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        )}
      </PopUp>
    );
    // 7-3. total
    const totalSection = () => (
      <Div className={"d-column"}>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            label={"총 수입"}
            size={"small"}
            value={`${numeral(OBJECT?.money_total_in).format('0,0')}`}
            variant={"outlined"}
            className={"w-86vw"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <img src={money1} className={"w-16 h-16 me-10"} alt={"money1"}/>
              ),
              endAdornment: (
                "원"
              )
            }}
          />
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            label={"총 지출"}
            size={"small"}
            value={`${numeral(OBJECT?.money_total_out).format('0,0')}`}
            variant={"outlined"}
            className={"w-86vw"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <img src={money1} className={"w-16 h-16 me-10"} alt={"money1"}/>
              ),
              endAdornment: (
                "원"
              )
            }}
          />
        </Div>
        <Div className={"d-center"}>
          <TextField
            select={false}
            label={"총 자산"}
            size={"small"}
            value={`${numeral(OBJECT?.money_property).format('0,0')}`}
            variant={"outlined"}
            className={"w-86vw"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <img src={money1} className={"w-16 h-16 me-10"} alt={"money1"}/>
              ),
              endAdornment: (
                "원"
              )
            }}
          />
        </Div>
      </Div>
    );
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
        direction={"left"}
        contents={({closePopup}) => (
          <>
            <Div className={"d-row mb-10"}>
              <img src={setting2} className={"w-16 h-16 icon pointer"} alt={"setting2"}
                onClick={() => {
                  flowDelete(id, sectionId);
                  setTimeout(() => {
                    closePopup();
                  }, 1000);
                }}
              />
              <Div className={"fs-0-8rem"}>삭제</Div>
            </Div>
            <Div className={"d-row"}>
              <img src={setting1} className={"w-16 h-16 icon pointer"} alt={"setting1"}
                onClick={() => {
                  Object.assign(SEND, {
                    startDt: DATE.startDt,
                    endDt: DATE.endDt
                  });
                  navigate(SEND.toUpdate, {
                    state: SEND
                  });
                  setTimeout(() => {
                    closePopup();
                  }, 1000);
                }}
              />
              <Div className={"fs-0-8rem"}>수정</Div>
            </Div>
          </>
        )}>
        {(popTrigger={}) => (
          <img src={setting4} className={"w-24 h-24 mt-n10 me-n10 pointer"} alt={"setting4"}
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
          {dropdownSection(OBJECT?._id, OBJECT?.money_section[i]._id, i)}
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={true}
            type={"text"}
            size={"small"}
            label={"파트"}
            variant={"outlined"}
            className={"w-40vw me-3vw"}
            value={OBJECT?.money_section[i]?.money_part_idx}
            InputProps={{
              readOnly: false,
              startAdornment: (
                null
              ),
              endAdornment: (
                null
              )
            }}
          >
            {moneyArray.map((item, idx) => (
              <MenuItem key={idx} value={idx}>
                {item.money_part}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select={true}
            type={"text"}
            size={"small"}
            label={"종목"}
            value={OBJECT?.money_section[i]?.money_title_idx}
            variant={"outlined"}
            className={"w-40vw ms-3vw"}
            InputProps={{
              readOnly: false,
              startAdornment: (
                null
              ),
              endAdornment: (
                null
              )
            }}
          >
            {moneyArray[OBJECT?.money_section[i]?.money_part_idx]?.money_title?.map((title, idx) => (
              <MenuItem key={idx} value={idx}>
                {title}
              </MenuItem>
            ))}
          </TextField>
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            label={"금액"}
            type={"text"}
            variant={"outlined"}
            size={"small"}
            className={"w-86vw"}
            value={`${numeral(OBJECT?.money_section[i]?.money_amount).format('0,0')}`}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <img src={money1} className={"w-16 h-16 me-10"} alt={"money1"}/>
              ),
              endAdornment: (
                "원"
              )
            }}
          />
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            label={"메모"}
            type={"text"}
            variant={"outlined"}
            size={"small"}
            className={"w-86vw"}
            value={OBJECT?.money_section[i]?.money_content}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <img src={money4} className={"w-16 h-16 me-10"} alt={"money4"}/>
              ),
              endAdornment: (
                null
              )
            }}
          />
        </Div>
      </Card>
    );
    // 7-6-3. table
    const tableSection = () => (
      <Div className={"block-wrapper w-min90vw h-min68vh"}>
        <Div className={"d-center mb-20"}>
          {dateSection()}
        </Div>
        <Div className={"d-center mb-20"}>
          {countSection()}
        </Div>
        <Div className={"d-column mb-20"}>
          {totalSection()}
        </Div>
        <Div className={"d-column"}>
          {OBJECT?.money_section.map((_, i) => (tableFragment(i)))}
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
        part: partStr,
        type: typeStr,
        third: thirdStr,
      }}
      objects={{
        DATE, SEND, COUNT
      }}
      functions={{
        setDATE, setSEND, setCOUNT
      }}
      handlers={{
        navigate
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