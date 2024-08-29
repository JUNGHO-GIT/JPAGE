// Memo.jsx

import { useState } from "../../imports/ImportReacts.jsx";
import { useCommon } from "../../imports/ImportHooks.jsx";
import { Img, Div, Br, Input, Btn } from "../../imports/ImportComponents.jsx";
import { PopUp } from "../../imports/ImportContainers.jsx";
import { TextArea, Grid, Card } from "../../imports/ImportMuis.jsx";
import { calendar3 } from "../../imports/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const Memo = ({
  OBJECT, setOBJECT, extra, i
}) => {

  // 1. common -------------------------------------------------------------------------------------
  const {firstStr, translate} = useCommon();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [prevContent, setPrevContent] = useState("");

  // 3. memoNode -----------------------------------------------------------------------------------
  const memoNode = () => (
    <PopUp
      key={i}
      type={"innerCenter"}
      position={"center"}
      direction={"center"}
      contents={({closePopup}) => (
        <Card className={"w-max70vw p-0"}>
          <Grid container columnSpacing={1} rowSpacing={4}>
            <Grid size={12} className={"d-center"}>
              <TextArea
                className={"w-86vw h-55vh border p-10"}
                value={OBJECT?.[`${firstStr}_section`][i]?.[`${extra}`]}
                onChange={(e) => {
                  const newContent = e.target.value;
                  setOBJECT((prev) => ({
                    ...prev,
                    [`${firstStr}_section`]: prev[`${firstStr}_section`]?.map((item, idx) => (
                      idx === i ? {
                        ...item,
                        [`${extra}`]: newContent
                      } : item
                    ))
                  }));
                }}
              />
            </Grid>
            <Grid size={6} className={"d-right"}>
              <Btn
                color={"primary"}
                onClick={() => {
                  closePopup();
                }}
              >
                {translate("confirm")}
              </Btn>
            </Grid>
            <Grid size={6} className={"d-left"}>
              <Btn
                color={"error"}
                onClick={() => {
                  // 이전 상태로 복원
                  setOBJECT((prev) => ({
                    ...prev,
                    [`${firstStr}_section`]: prev[`${firstStr}_section`]?.map((item, idx) => (
                      idx === i ? {
                        ...item,
                        [`${extra}`]: prevContent
                      } : item
                    ))
                  }));
                  closePopup();
                }}
              >
                {translate("close")}
              </Btn>
            </Grid>
          </Grid>
        </Card>
      )}>
      {(popTrigger={}) => (
        <Input
          label={translate("memo")}
          className={"pointer"}
          value={OBJECT?.[`${firstStr}_section`][i]?.[`${extra}`]}
          readOnly={true}
          startadornment={
            <Img src={calendar3} className={"w-16 h-16"} />
          }
          onClick={(e) => {
            // 팝업 열릴 때 현재 상태를 저장
            setPrevContent(OBJECT?.[`${firstStr}_section`][i]?.[`${extra}`]);
            popTrigger.openPopup(e.currentTarget);
          }}
        />
      )}
    </PopUp>
  );

  // 15. return ------------------------------------------------------------------------------------
  return (
    <>
      {memoNode()}
    </>
  );
};