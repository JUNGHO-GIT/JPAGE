// Buttons.tsx
// Node -> Section -> Fragment

import { useCommonValue, useTranslate } from "@imports/ImportHooks";
import { Btn, Div, Hr } from "@imports/ImportComponents";
import { PopUp } from "@imports/ImportContainers";
import { Grid, Card } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
declare interface ButtonsProps {
  state: any;
  setState: any;
  flow: any;
}

// -------------------------------------------------------------------------------------------------
export const Buttons = ( { state, setState, flow }: ButtonsProps ) => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    translate,
  } = useTranslate();
  const {
    PATH, toFind, navigate,
  } = useCommonValue();

  // 3. flow ---------------------------------------------------------------------------------------
  const flowSave = (type: string) => {
    flow?.flowSave(type);
    Object.keys(sessionStorage).forEach((key) => {
      if (key.includes("foodSection") || key.includes("paging")) {
        sessionStorage.removeItem(key);
      }
    });
  };

  // 7. btn ----------------------------------------------------------------------------------------
  const btnNode = () => {

    // 1. find
    const toFindSection = () => (
      <Btn
        color={"warning"}
        className={"ms-1vw me-1vw"}
        onClick={() => {
          Object.assign(state?.SEND, {
            url: PATH,
            dateType: state?.DATE.dateType,
            dateStart: state?.DATE.dateStart,
            dateEnd: state?.DATE.dateEnd
          });
          navigate(toFind, {
            state: state?.SEND,
          });
        }}
      >
        {translate("find")}
      </Btn>
    );

    // 3. save
    const saveSection = () => (
      <PopUp
        key={"innerCenter"}
        type={"innerCenter"}
        position={"center"}
        direction={"center"}
        padding={"6px"}
        contents={
          <Card className={"h-max30vh d-center"}>
            <Grid container spacing={2}>
              <Grid size={12}>
                <Div className={"fs-1-0rem fw-600 pre-line dark-grey"}>
                  {translate("replaceOrInsert")}
                </Div>
              </Grid>
              <Grid
                size={PATH.includes("/sleep") ? 12 : 6}
                className={PATH.includes("/sleep") ? "d-center" : "d-right"}
              >
                <Btn
                  size={"large"}
                  color={"primary"}
                  variant={"text"}
                  className={"fs-1-2rem fw-600 ms-1vw me-1vw"}
                  onClick={() => {
                    flowSave("replace");
                  }}
                >
                  {translate("replace")}
                </Btn>
              </Grid>
              <Grid
                size={PATH.includes("/sleep") ? 0 : 6}
                className={PATH.includes("/sleep") ? "d-none" : "d-left"}
              >
                <Btn
                  size={"large"}
                  color={"primary"}
                  variant={"text"}
                  className={"fs-1-2rem fw-600 ms-1vw me-1vw"}
                  onClick={() => {
                    flowSave("insert");
                  }}
                >
                  {translate("insert")}
                </Btn>
              </Grid>
            </Grid>
          </Card>
        }
      >
        {(popTrigger: any) => (
          <Btn
            color={"primary"}
            className={"ms-1vw me-1vw"}
            onClick={(e: any) => {
              if (state.FLOW?.exist === "true") {
                if (state.FLOW?.itsMe === "true") {
                  flowSave("replace");
                }
                else {
                  popTrigger.openPopup(e.currentTarget);
                }
              }
              else {
                flowSave("create");
              }
            }}
          >
            {translate("save")}
          </Btn>
        )}
      </PopUp>
    );

    // 4. delete
    const deleteSection = () => (
      <Btn
        color={"error"}
        className={"ms-1vw me-1vw"}
        onClick={() => {
          flow?.flowDelete();
        }}
      >
        {translate("delete")}
      </Btn>
    );

    // 10. return
    return (
      PATH.includes("/user/category") || PATH.includes("/user/detail") ? (
        <Grid container spacing={2}>
          <Grid size={10} className={"d-center"}>
            {saveSection()}
          </Grid>
        </Grid>
      )
      : PATH.includes("/detail") ? (
        <Grid container spacing={2}>
          <Grid size={10} className={"d-center"}>
            {PATH.includes("/food") ? toFindSection() : null}
            {saveSection()}
            {deleteSection()}
          </Grid>
        </Grid>
      )
      : null
    );
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {btnNode()}
    </>
  );
};