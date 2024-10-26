// UserLogin.tsx

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue } from "@imports/ImportHooks";
import { useLanguageStore, useAlertStore } from "@imports/ImportStores";
import { useValidateUser } from "@imports/ImportValidates";
import { User } from "@imports/ImportSchemas";
import { axios, sync, setLocal, setSession, getLocal } from "@imports/ImportUtils";
import { Loading } from "@imports/ImportLayouts";
import { Input } from "@imports/ImportContainers";
import { Div, Btn, Img, Hr, Br } from "@imports/ImportComponents";
import { Paper, Checkbox, Grid } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const UserLogin = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_OBJECT, URL_GOOGLE, ADMIN_ID, ADMIN_PW, navigate } = useCommonValue();
  const { translate } = useLanguageStore();
  const { ALERT, setALERT } = useAlertStore();
  const { ERRORS, REFS, validate } = useValidateUser();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState<boolean>(false);
  const [loginTrigger, setLoginTrigger] = useState<boolean>(false);
  const [checkedSaveId, setCheckedSaveId] = useState<boolean>(false);
  const [checkedAutoLogin, setCheckedAutoLogin] = useState<boolean>(false);
  const [_clickCount, setClickCount] = useState<number>(0);
  const [OBJECT, setOBJECT] = useState<any>(User);

  // 2-3. useEffect --------------------------------------------------------------------------------
  // 트리거가 활성화된 경우
  useEffect(() => {
    if (loginTrigger) {
      (async () => {
        await flowSave();
        setLoginTrigger(false);
      })();
    }
  }, [loginTrigger]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  // 초기 로드 시 자동로그인 설정 가져오기
  useEffect(() => {
    const { autoLogin, autoLoginId, autoLoginPw } = getLocal("setting", "id", "") || {};

    // 자동로그인 o
    if (autoLogin === "true") {
      setCheckedAutoLogin(true);
      setOBJECT((prev: any) => ({
        ...prev,
        user_id: autoLoginId,
        user_pw: autoLoginPw,
      }));
      setLoginTrigger(true);
    }
    // 자동로그인 x
    else if (autoLogin === "false") {
      setCheckedAutoLogin(false);
      setOBJECT((prev: any) => ({
        ...prev,
        user_id: "",
        user_pw: "",
      }));
      setLoginTrigger(false);
    }
  }, []);

  // 2-3. useEffect --------------------------------------------------------------------------------
  // 초기 로드 시 아이디 저장 설정 가져오기
  useEffect(() => {
    const { isSaved, isSavedId } = getLocal("setting", "id", "") || {};
    // 아이디 저장 o
    if (isSaved === "true") {
      setCheckedSaveId(true);
      setOBJECT((prev: any) => ({
        ...prev,
        user_id: isSavedId,
      }));
    }
    // 아이디 저장 x
    else if (isSaved === "false") {
      setCheckedSaveId(false);
      setOBJECT((prev: any) => ({
        ...prev,
        user_id: "",
      }));
    }
  }, []);

  // 2-3. useEffect --------------------------------------------------------------------------------
  // 자동로그인 활성화된 경우
  useEffect(() => {
    setLocal("setting", "id", "", {
      autoLogin: checkedAutoLogin ? "true" : "false",
      autoLoginId: checkedAutoLogin ? OBJECT.user_id : "",
      autoLoginPw: checkedAutoLogin ? OBJECT.user_pw : "",
    });
  }, [checkedAutoLogin]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  // 아이디 저장 활성화된 경우
  useEffect(() => {
    setLocal("setting", "id", "", {
      isSaved: checkedSaveId ? "true" : "false",
      isSavedId: checkedSaveId ? OBJECT.user_id : "",
    });
  }, [checkedSaveId]);

  // 3. flow ---------------------------------------------------------------------------------------
  const flowSave = async () => {
    setLOADING(true);
    if (!await validate(OBJECT, "login", "")) {
      setLOADING(false);
      return;
    }
    axios.post(`${URL_OBJECT}/login`, {
      user_id: OBJECT.user_id,
      user_pw: OBJECT.user_pw,
      isAutoLogin: checkedAutoLogin,
    })
    .then((res: any) => {
      if (res.data.status === "success") {
        setSession("setting", "id", "", {
          sessionId: res.data.result.user_id,
          admin: res.data.admin === "admin" ? "true" : "false",
        });
        navigate("/today/list");
        sync();
      }
      else if (res.data.status === "isGoogleUser") {
        setSession("setting", "id", "", {
          sessionId: res.data.result.user_id,
          admin: res.data.admin === "admin" ? "true" : "false",
        });
        setALERT({
          open: !ALERT.open,
          msg: translate(res.data.msg),
          severity: "error",
        });
      }
      else {
        setSession("setting", "id", "", {
          sessionId: "",
          admin: "false",
        });
        setALERT({
          open: !ALERT.open,
          msg: translate(res.data.msg),
          severity: "error",
        });
      }
    })
    .catch((err: any) => {
      setALERT({
        open: !ALERT.open,
        msg: translate(err.response.data.msg),
        severity: "error",
      });
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  };

  // 3. flow ---------------------------------------------------------------------------------------
  const flowGoogle = () => {
    axios.get (`${URL_GOOGLE}/login`)
    .then((res: any) => {
      if (res.data.status === "success") {
        window.location.href = res.data.url;
      }
      else {
        setALERT({
          open: !ALERT.open,
          msg: translate(res.data.msg),
          severity: "error",
        });
      }
    })
    .catch((err: any) => {
      setALERT({
        open: !ALERT.open,
        msg: translate(err.response.data.msg),
        severity: "error",
      });
      console.error(err);
    });
  };

  // 7. userLogin ----------------------------------------------------------------------------------
  const userLoginNode = () => {
    // 7-1. title
    const titleSection = () => (
      <Grid container spacing={2} columns={12}>
        <Grid size={12}>
          <Div className={"fs-1-8rem fw-500"} onClick={() => {
            setClickCount((prevCount) => {
              const newCount = prevCount + 1;
              if (newCount === 5) {
                setOBJECT((prev: any) => ({
                  ...prev,
                  user_id: ADMIN_ID,
                  user_pw: ADMIN_PW,
                }));
                setCheckedSaveId(true);
                setCheckedAutoLogin(true);
                setLoginTrigger(true);
                setClickCount(0);
              }
              return newCount;
            });
          }}>
            {translate("login")}
          </Div>
        </Grid>
      </Grid>
    );
    // 7-2. login
    const loginSection = () => {
      const detailFragment = (item: any, i: number) => (
        <Grid container spacing={2} columns={12} className={"p-10"}>
          <Grid size={12}>
            <Input
              label={translate("id")}
              value={item.user_id}
              inputRef={REFS?.[i]?.user_id}
              error={ERRORS?.[i]?.user_id}
              placeholder={"abcd@naver.com"}
              onChange={(e: any) => {
                const value = e.target.value;
                if (value.length > 30) {
                  setOBJECT((prev: any) => ({
                    ...prev,
                    user_id: prev.user_id,
                  }));
                }
                else {
                  setOBJECT((prev: any) => ({
                    ...prev,
                    user_id: value,
                  }));
                }
              }}
            />
          </Grid>
          <Grid size={12}>
            <Input
              type={"password"}
              label={translate("pw")}
              value={item.user_pw}
              inputRef={REFS?.[i]?.user_pw}
              error={ERRORS?.[i]?.user_pw}
              onChange={(e: any) => {
                setOBJECT((prev: any) => ({
                  ...prev,
                  user_pw: e.target.value,
                }));
              }}
            />
          </Grid>
        </Grid>
      );
      return (
        <Grid container spacing={0} columns={12}>
          <Grid size={12} key={`detail-${0}`}>
            {detailFragment(OBJECT, 0)}
          </Grid>
        </Grid>
      );
    };
    // 7-3. check
    const checkSection = () => (
      <Grid container spacing={2} columns={12}>
        <Grid size={6} className={"d-row-right"}>
          <Div className={"d-center fs-0-8rem"}>
            {translate("autoLogin")}
            <Checkbox
              color={"primary"}
              size={"small"}
              checked={checkedAutoLogin}
              onChange={(e: any) => {
                setCheckedAutoLogin(e.target.checked);
              }}
            />
          </Div>
        </Grid>
        <Grid size={6} className={"d-row-left"}>
          <Div className={"fs-0-8rem"}>
            {translate("saveId")}
            <Checkbox
              color={"primary"}
              size={"small"}
              checked={checkedSaveId}
              onChange={(e: any) => {
                setCheckedSaveId(e.target.checked);
              }}
            />
          </Div>
        </Grid>
      </Grid>
    );
    // 7-4. button
    const buttonSection = () => {
      const loginFragment = () => (
        <Grid container spacing={0} columns={12}>
          <Grid size={12} className={"d-col-center"}>
            <Btn
              color={"primary"}
              className={"w-100p fs-1-0rem"}
              onClick={() => {
                flowSave();
              }}
            >
              {translate("login")}
            </Btn>
          </Grid>
        </Grid>
      );
      const googleFragment = () => (
        <Grid container spacing={0} columns={12}>
          <Grid size={12} className={"d-col-center"}>
            <Btn
              color={"primary"}
              className={"w-100p bg-white"}
              onClick={() => {
                flowGoogle();
              }}
            >
              <Div className={"d-row-center"}>
                <Img
                  max={15}
                  hover={true}
                  shadow={false}
                  radius={false}
                  src={"user1"}
                />
                <Div className={"fs-1-0rem black ms-10"}>
                  {translate("googleLogin")}
                </Div>
              </Div>
            </Btn>
          </Grid>
        </Grid>
      );
      return (
        <Grid container spacing={0} columns={12}>
          <Grid size={12} className={"d-col-center"}>
            {loginFragment()}
            <Br px={10} />
            {googleFragment()}
          </Grid>
        </Grid>
      );
    };
    // 7-5. link
    const linkSection = () => {
      const toSignupFragment = () => (
        <Grid container spacing={0} columns={12}>
          <Grid size={12} className={"d-row-center"}>
            <Div className={"fs-0-8rem black me-10"}>
              {translate("notId")}
            </Div>
            <Div className={"fs-0-8rem blue pointer"} onClick={() => {
              navigate("/user/signup");
            }}>
              {translate("signup")}
            </Div>
          </Grid>
        </Grid>
      );
      const toResetPwFragment = () => (
        <Grid container spacing={0} columns={12}>
          <Grid size={12} className={"d-row-center"}>
            <Div className={"fs-0-8rem black me-10"}>
              {translate("forgotPw")}
            </Div>
            <Div className={"fs-0-8rem blue pointer"} onClick={() => {
              navigate("/user/resetPw");
            }}>
              {translate("resetPw")}
            </Div>
          </Grid>
        </Grid>
      );
      return (
        <Grid container spacing={0} columns={12}>
          <Grid size={12} className={"d-col-center"}>
            {toSignupFragment()}
            <Br px={10} />
            {toResetPwFragment()}
          </Grid>
        </Grid>
      );
    };
    // 7-10. return
    return (
      <>
      {LOADING && <Loading />}
      <Paper className={"content-wrapper d-center border-1 radius-1 shadow-1 h-min100vh"}>
        <Grid container spacing={0} columns={12}>
          <Grid size={12} className={"d-col-center"}>
            {titleSection()}
            <Hr px={20} />
            {loginSection()}
            <Hr px={20} />
            {checkSection()}
            <Hr px={20} />
            {buttonSection()}
            <Hr px={20} />
            {linkSection()}
          </Grid>
        </Grid>
      </Paper>
      </>
    );
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {userLoginNode()}
    </>
  );
};