// Btn.jsx

import {React} from "../../../import/ImportReacts.jsx";
import {useTranslate} from "../../../import/ImportHooks.jsx";
import {moment, numeral} from "../../../import/ImportLibs.jsx";
import {PopUp, Div} from "../../../import/ImportComponents.jsx";
import {Button, TextField} from "../../../import/ImportMuis.jsx";
import {money2} from "../../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const Btn = ({
  strings, objects, functions, handlers
}) => {

  // 1. common ------------------------------------------------------------------------------------>
  const {translate} = useTranslate();

  // 1. go
  const btnGoToList = () => (
    <Button type={"button"} color={"secondary"} variant={"contained"} className={"me-5"} onClick={() => {
      Object.assign(objects?.SEND, {
        dateStart: objects?.DATE.dateStart,
        dateEnd: objects?.DATE.dateEnd
      });
      handlers.navigate(objects?.SEND.toList, {
        state: objects?.SEND,
      });
    }}>
      {translate("btn-goToList")}
    </Button>
  );
  const btnGoToFind = () => (
    <Button type={"button"} color={"secondary"} variant={"contained"} className={"me-5"} onClick={() => {
      Object.assign(objects?.SEND, {
        dateStart: objects?.DATE.dateStart,
        dateEnd: objects?.DATE.dateEnd
      });
      handlers.navigate(objects?.SEND.toFind, {
        state: objects?.SEND,
      });
    }}>
      {translate("btn-goToFind")}
    </Button>
  );
  const btnGoToSave = () => (
    <Button type={"button"} color={"primary"} variant={"contained"} className={"me-5"} onClick={() => {
      Object.assign(objects?.SEND, {
        dateStart: objects?.DATE.dateStart,
        dateEnd: objects?.DATE.dateEnd
      });
      handlers.navigate(objects?.SEND.toSave, {
        state: objects?.SEND,
      });
    }}>
      {translate("btn-goToSave")}
    </Button>
  );
  const btnGoToFindSave = () => (
    <Button type={"button"} color={"primary"} variant={"contained"} className={"me-5"} onClick={() => {
      Object.assign(objects?.SEND, {
        dateStart: objects?.DATE.dateStart,
        dateEnd: objects?.DATE.dateEnd
      });
      handlers.navigate(objects?.SEND.toSave, {
        state: objects?.SEND,
      });
    }}>
      {translate("btn-goToFindSave")}
    </Button>
  );
  const btnGoToLogin = () => (
    <Button type={"button"} color={"primary"} variant={"contained"} className={"me-5"} onClick={() => {
      handlers.navigate(objects?.SEND.toLogin);
    }}>
      {translate("btn-goToLogin")}
    </Button>
  );
  const btnGoToSignup = () => (
    <Button type={"button"} color={"primary"} variant={"contained"} className={"me-5"} onClick={() => {
      handlers.navigate(objects?.SEND.toSignup);
    }}>
      {translate("btn-goToSignup")}
    </Button>
  );

  // 2. get
  const btnGetToday = () => (
    <Button type={"button"} color={"secondary"} variant={"contained"} className={"me-5"} onClick={() => {
      (objects?.DATE) && (
        functions?.setDATE((prev) => ({
          ...prev,
          dateType: "",
          dateStart: moment().tz("Asia/Seoul").format("YYYY-MM-DD"),
          dateEnd: moment().tz("Asia/Seoul").format("YYYY-MM-DD")
        }))
      );
      (objects?.PAGING) && (
        functions?.setPAGING((prev) => ({
          ...prev,
          page: 1,
        }))
      );
    }}>
      {translate("btn-getToday")}
    </Button>
  );
  const btnGetProperty = () => (
    <PopUp
      type={"innerCenter"}
      position={"center"}
      direction={"center"}
      contents={({closePopup}) => {
        const property = JSON.parse(sessionStorage.getItem("property") || "{}");
        const totalIn = property?.totalIn || 0;
        const totalOut = property?.totalOut || 0;
        const totalProperty = property?.totalProperty || 0;
        const dateStart = property?.dateStart;
        const dateEnd = property?.dateEnd;
        return (
          <Div className={"w-max75vw h-max65vh border d-column p-20"}>
            <Div className={"d-center mb-20"}>
              <Div className={"fs-1-7rem fw-bold"}>
                재무 상태
              </Div>
            </Div>
            <Div className={"d-center mb-40"}>
              <Div className={"fs-1-2rem fw-normal"}>
                {dateStart} ~ {dateEnd}
              </Div>
            </Div>
            <Div className={"d-center mb-20"}>
              <TextField
                select={false}
                label={translate("money-property")}
                size={"medium"}
                variant={"outlined"}
                className={"w-60vw"}
                value={`${numeral(totalProperty).format('0,0')}`}
                InputProps={{
                  readOnly: true,
                  className: "h-8vh fs-1-0rem fw-bold",
                  startAdornment: (
                    <img src={money2} className={"w-16 h-16 me-10"} alt={"money2"}/>
                  ),
                  endAdornment: (
                    <Div className={"fw-normal"}>{translate("money-endCurrency")}</Div>
                  )
                }}
              />
            </Div>
            <Div className={"d-center mb-20"}>
              <TextField
                select={false}
                label={translate("money-in")}
                size={"medium"}
                variant={"outlined"}
                className={"w-60vw"}
                value={`${numeral(totalIn).format('0,0')}`}
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <img src={money2} className={"w-16 h-16 me-10"} alt={"money2"}/>
                  ),
                  endAdornment: (
                    <Div className={"fw-normal"}>{translate("money-endCurrency")}</Div>
                  )
                }}
              />
            </Div>
            <Div className={"d-center"}>
              <TextField
                select={false}
                label={translate("money-out")}
                size={"medium"}
                variant={"outlined"}
                className={"w-60vw"}
                value={`${numeral(totalOut).format('0,0')}`}
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <img src={money2} className={"w-16 h-16 me-10"} alt={"money2"}/>
                  ),
                  endAdornment: (
                    <Div className={"fw-normal"}>{translate("money-endCurrency")}</Div>
                  )
                }}
              />
            </Div>
          </Div>
        );
      }}>
      {(popTrigger={}) => (
        <Button type={"button"} color={"success"} variant={"contained"} className={"me-5"} onClick={(e) => {
          popTrigger.openPopup(e.currentTarget)
        }}>
          {translate("btn-getProperty")}
        </Button>
      )}
    </PopUp>
  );

  // 3. flow
  const btnFlowLogin = () => (
    <Button type={"button"} color={"primary"} variant={"contained"} className={"me-5"} onClick={() => {
      handlers.flowSave();
    }}>
      {translate("btn-flowLogin")}
    </Button>
  );
  const btnFlowSignup = () => (
    <Button type={"button"} color={"primary"} variant={"contained"} className={"me-5"} onClick={() => {
      handlers.flowSave();
    }}>
      {translate("btn-flowSignup")}
    </Button>
  );
  const btnFlowSave = () => (
    <Button type={"button"} color={"primary"} variant={"contained"} className={"me-5"} onClick={() => {
      handlers.flowSave();
      Object.keys(sessionStorage).forEach((key) => {
        if (key.includes("FILTER") || key.includes("foodSection")) {
          sessionStorage.removeItem(key);
        }
      });
    }}>
      {translate("btn-flowSave")}
    </Button>
  );
  const btnFlowFind = () => (
    <Div className={"d-center"}>
      <TextField
        select={false}
        size={"medium"}
        variant={"outlined"}
        className={"w-150"}
        value={objects?.FILTER?.query}
        InputProps={{
          readOnly: false,
          startAdornment: null,
          endAdornment: null,
        }}
        onChange={(e) => {
          functions?.setFILTER((prev) => ({
            ...prev,
            query: e.target.value
          }));
        }}
      />
      <Button type={"button"} color={"primary"} variant={"contained"} className={"me-5"} onClick={async () => {
        handlers.flowFind();
        functions?.setPAGING((prev) => ({
          ...prev,
          page: 0
        }));
      }}>
        {translate("btn-flowFind")}
      </Button>
    </Div>
  );
  const btnFlowDefault = () => (
    <Button type={"button"} color={"error"} variant={"contained"} className={"me-5"} onClick={handlers?.handlerDefault}>
      {translate("btn-flowDefault")}
    </Button>
  );
  const btnFlowDemo = () => (
    <Div className={"d-center"}>
      <TextField
        select={false}
        label={""}
        type={"text"}
        variant={"outlined"}
        size={"medium"}
        value={Math.min(objects?.COUNT?.inputCnt, 100)}
        InputProps={{
          readOnly: false
        }}
        onChange={(e) => {
          const limitedValue = Math.min(Number(e.target.value), 100);
          functions.setCOUNT((prev) => ({
            ...prev,
            inputCnt: limitedValue
          }));
        }}
      />
      <Button className={"me-5"} color={"secondary"} variant={"contained"} onClick={() => (handlers.flowSave(objects.PART))}>
        {translate("btn-flowDemo")}
      </Button>
    </Div>
  );

  // 7. btn --------------------------------------------------------------------------------------->
  const btnNode = () => {

    // 1. calendar
    if (strings?.first === "calendar") {
      if (strings?.second === "diff" && strings?.third === "list") {
        return null
      }
      else if (strings?.second === "plan" && strings?.third === "list") {
        return null
      }
      else if (strings?.second === "plan" && strings?.third === "save") {
        return null
      }
      else if (strings?.third === "" && strings?.second === "list") {
        return null
      }
      else if (strings?.third === "" && strings?.second === "save") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnFlowSave()}
            {btnGoToList()}
            {btnGetProperty()}
          </Div>
        );
      }
    }

    // 2. exercise
    else if (strings?.first === "exercise") {
      if (strings?.second === "diff" && strings?.third === "list") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnGoToSave()}
            {btnGetToday()}
            {btnGetProperty()}
          </Div>
        );
      }
      else if (strings?.second === "plan" && strings?.third === "list") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnGoToSave()}
            {btnGetToday()}
            {btnGetProperty()}
          </Div>
        );
      }
      else if (strings?.second === "plan" && strings?.third === "save") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnFlowSave()}
            {btnGoToList()}
            {btnGetProperty()}
          </Div>
        );
      }
      else if (strings?.third === "" && strings?.second === "list") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnGoToSave()}
            {btnGetToday()}
            {btnGetProperty()}
          </Div>
        );
      }
      else if (strings?.third === "" && strings?.second === "save") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnFlowSave()}
            {btnGoToList()}
            {btnGetProperty()}
          </Div>
        );
      }
    }

    // 3. food
    else if (strings?.first === "food") {
      if (strings?.second === "diff" && strings?.third === "list") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnGoToSave()}
            {btnGetToday()}
            {btnGetProperty()}
          </Div>
        );
      }
      else if (strings?.second === "find" && strings?.third === "list") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnFlowFind()}
            {btnGoToFindSave()}
          </Div>
        );
      }
      else if (strings?.second === "find" && strings?.third === "save") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnFlowSave()}
            {btnGoToFind()}
            {btnGetProperty()}
          </Div>
        );
      }
      else if (strings?.second === "plan" && strings?.third === "list") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnGoToSave()}
            {btnGetToday()}
            {btnGetProperty()}
          </Div>
        );
      }
      else if (strings?.second === "plan" && strings?.third === "save") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnFlowSave()}
            {btnGoToList()}
            {btnGetProperty()}
          </Div>
        );
      }
      else if (strings?.third === "" && strings?.second === "list") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnGoToSave()}
            {btnGetToday()}
            {btnGetProperty()}
          </Div>
        );
      }
      else if (strings?.third === "" && strings?.second === "save") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnFlowSave()}
            {btnGoToList()}
            {btnGetProperty()}
          </Div>
        );
      }
    }

    // 4. money
    else if (strings?.first === "money") {
      if (strings?.second === "diff" && strings?.third === "list") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnGoToSave()}
            {btnGetToday()}
            {btnGetProperty()}
          </Div>
        );
      }
      else if (strings?.second === "plan" && strings?.third === "list") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnGoToSave()}
            {btnGetToday()}
            {btnGetProperty()}
          </Div>
        );
      }
      else if (strings?.second === "plan" && strings?.third === "save") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnFlowSave()}
            {btnGoToList()}
            {btnGetProperty()}
          </Div>
        );
      }
      else if (strings?.third === "" && strings?.second === "list") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnGoToSave()}
            {btnGetToday()}
            {btnGetProperty()}
          </Div>
        );
      }
      else if (strings?.third === "" && strings?.second === "save") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnFlowSave()}
            {btnGoToList()}
            {btnGetProperty()}
          </Div>
        );
      }
    }

    // 5. sleep
    else if (strings?.first === "sleep") {
      if (strings?.second === "diff" && strings?.third === "list") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnGoToSave()}
            {btnGetToday()}
            {btnGetProperty()}
          </Div>
        );
      }
      else if (strings?.second === "plan" && strings?.third === "list") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnGoToSave()}
            {btnGetToday()}
            {btnGetProperty()}
          </Div>
        );
      }
      else if (strings?.second === "plan" && strings?.third === "save") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnFlowSave()}
            {btnGoToList()}
            {btnGetProperty()}
          </Div>
        );
      }
      else if (strings?.third === "" && strings?.second === "list") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnGoToSave()}
            {btnGetToday()}
            {btnGetProperty()}
          </Div>
        );
      }
      else if (strings?.third === "" && strings?.second === "save") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnFlowSave()}
            {btnGoToList()}
            {btnGetProperty()}
          </Div>
        );
      }
    }

    // 6. user
    else if (strings?.first === "user") {
      if (strings?.second === "diff" && strings?.third === "list") {
        return null
      }
      else if (strings?.second === "data" && strings?.third === "list") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnFlowDemo()}
          </Div>
        );
      }
      else if (strings?.second === "data" && strings?.third === "set") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnFlowDefault()}
            {btnFlowSave()}
          </Div>
        );
      }
      else if (strings?.third === "" && strings?.second === "list") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnGoToSave()}
            {btnGetToday()}
          </Div>
        );
      }
      else if (strings?.third === "" && strings?.second === "save") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnFlowSave()}
            {btnGoToList()}
          </Div>
        );
      }
      else if (strings?.third === "" && strings?.second === "login") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnFlowLogin()}
            {btnGoToSignup()}
          </Div>
        );
      }
      else if (strings?.third === "" && strings?.second === "signup") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnFlowSignup()}
            {btnGoToLogin()}
          </Div>
        );
      }
    }
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <>
      {btnNode()}
    </>
  );
};