// Header.jsx
// Node -> Section -> Fragment

import { React } from "../../import/ImportReacts.jsx";
import { useCommon } from "../../import/ImportHooks.jsx";
import { Div, Img, Icons } from "../../import/ImportComponents.jsx";
import { Paper, Grid } from "../../import/ImportMuis.jsx";
import { logo2, logo3 } from "../../import/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const Header = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { navigate, firstStr, koreanDate } = useCommon();

  // 7. header -------------------------------------------------------------------------------------
  const headerNode = () => {
    const iconSection = () => (
      <Div className={"d-center ms-10"}>
        <Img
          src={logo2}
          className={"pointer h-max30"}
          onClick={() => {
            navigate("/today/list", {
              state: {
                dateType: "day",
                dateStart: koreanDate,
                dateEnd: koreanDate,
              }
            });
          }}
        />
        <Img
          src={logo3}
          className={"h-max30"}
        />
      </Div>
    );
    const btnSection = () => (
      <Div className={"d-center"}>
        {firstStr !== "user" ? (
          <Icons name={"TbSettings"} className={"w-24 h-24 black m-0"} onClick={() => {
            navigate("/user/app/setting");
          }}/>
        ) : (
          <Icons name={"TbArrowRight"} className={"w-24 h-24 black m-0"} onClick={() => {
            navigate(-1);
          }}/>
        )}
      </Div>
    );
    return (
      <Paper className={"layout-wrapper p-sticky top-0vh h-9vh radius border"}>
        <Grid container className={"w-100p"}>
          <Grid size={10} className={"d-left"}>
            {iconSection()}
          </Grid>
          <Grid size={2} className={"d-right"}>
            {btnSection()}
          </Grid>
        </Grid>
      </Paper>
    );
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {headerNode()}
    </>
  );
};