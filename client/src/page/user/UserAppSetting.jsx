// UserAppSetting.jsx
// Node -> Section -> Fragment

import { React, useState } from "../../import/ImportReacts.jsx";
import { useCommon } from "../../import/ImportHooks.jsx";
import { Loading } from "../../import/ImportLayouts.jsx";
import { Icons, Hr20, Br10 } from "../../import/ImportComponents.jsx";
import { Card, Paper, Grid } from "../../import/ImportMuis.jsx";

// -------------------------------------------------------------------------------------------------
export const UserAppSetting = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { navigate, translate } = useCommon();

  // 2-1. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState(false);
  const [admin, setIsAdmin] = useState(sessionStorage.getItem("ADMIN"));

  // 7. userAppSetting ----------------------------------------------------------------------------
  const userAppSettingNode = () => {
    // 7-1. card
    const cardSection = () => {
      const cardFragment = (i) => (
        <Card className={"d-column border radius p-0"} key={i}>
          <Grid container className={"w-100p fs-0-8rem"}>
            <Br10 />
            <Grid
              size={12}
              className={"d-between pointer p-10"}
              onClick={() => {
                navigate("/user/detail")
              }}
            >
              <Grid size={6} className={"d-left"}>
                {translate("dataDetail")}
              </Grid>
              <Grid size={6} className={"d-right"}>
                <Icons
                  name={"TbChevronRight"}
                  className={"w-16 h-16 black"}
                  onClick={() => {}}
                />
              </Grid>
            </Grid>
            <Hr20 />
            <Grid
              size={12}
              className={"d-between pointer p-10"}
              onClick={() => {
                navigate("/user/category")
              }}
            >
              <Grid size={6} className={"d-left"}>
                {translate("category")}
              </Grid>
              <Grid size={6} className={"d-right"}>
                <Icons
                  name={"TbChevronRight"}
                  className={"w-16 h-16 black"}
                  onClick={() => {}}
                />
              </Grid>
            </Grid>
            <Hr20 />
            <Grid
              size={12}
              className={`${admin !== "true" ? "d-none" : ""} d-between pointer p-10`}
              onClick={() => {
                navigate("/user/dummy")
              }}
            >
              <Grid size={6} className={"d-left"}>
                {translate("dataList")}
              </Grid>
              <Grid size={6} className={"d-right"}>
                <Icons
                  name={"TbChevronRight"}
                  className={"w-16 h-16 black"}
                  onClick={() => {}}
                />
              </Grid>
            </Grid>
            <Hr20 />
            <Grid
              size={12}
              className={"d-between pointer p-10"}
              onClick={() => {
                navigate("/user/app/info")
              }}
            >
              <Grid size={6} className={"d-left"}>
                {translate("appInfo")}
              </Grid>
              <Grid size={6} className={"d-right"}>
                <Icons
                  name={"TbChevronRight"}
                  className={"w-16 h-16 black"}
                  onClick={() => {}}
                />
              </Grid>
            </Grid>
            <Hr20 />
            <Grid
              size={12}
              className={"d-between pointer p-10"}
              onClick={() => {
                localStorage.setItem("autoLogin", "false")
                localStorage.setItem("autoLoginId", "")
                localStorage.setItem("autoLoginPw", "")
                sessionStorage.clear()
                navigate("/")
              }}
            >
              <Grid size={6} className={"d-left"}>
                {translate("logout")}
              </Grid>
              <Grid size={6} className={"d-right"}>
                <Icons
                  name={"TbChevronRight"}
                  className={"w-16 h-16 black"}
                  onClick={() => {}}
                />
              </Grid>
            </Grid>
            <Hr20 />
            <Grid
              size={12}
              className={"d-between pointer p-10"}
              onClick={() => {
                navigate("/user/deletes")
              }}
            >
              <Grid size={6} className={"d-left red"}>
                {translate("userDeletes")}
              </Grid>
              <Grid size={6} className={"d-right"}>
                <Icons
                  name={"TbChevronRight"}
                  className={"w-16 h-16 black"}
                  onClick={() => {}}
                />
              </Grid>
            </Grid>
            <Br10 />
          </Grid>
        </Card>
      );
      return (
        LOADING ? <Loading /> : cardFragment(0)
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper radius border h-min80vh"}>
        <Grid container className={"w-100p"}>
          <Grid size={12}>
            {cardSection()}
          </Grid>
        </Grid>
      </Paper>
    );
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {userAppSettingNode()}
    </>
  );
};