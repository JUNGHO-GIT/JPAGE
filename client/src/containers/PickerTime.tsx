// PickerTime.tsx

import { useCommonValue } from "@imports/ImportHooks";
import { useLanguageStore } from "@imports/ImportStores";
import { moment } from "@imports/ImportUtils";
import { PopUp, Input } from "@imports/ImportContainers";
import { Img } from "@imports/ImportComponents";
import { Card, DigitalClock, AdapterMoment, LocalizationProvider } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
declare type PickerTimeProps = {
  OBJECT: any;
  setOBJECT: any;
  REFS: any;
  ERRORS: any;
  DATE: any;
  LOCKED: string;
  extra: string;
  i: number;
}

// -------------------------------------------------------------------------------------------------
export const PickerTime = (
  { OBJECT, setOBJECT, REFS, ERRORS, DATE, LOCKED, extra, i }: PickerTimeProps
) => {

  // 1. common -------------------------------------------------------------------------------------
  const { firstStr, secondStr, localLocale, localTimeZone } = useCommonValue();
  const { translate } = useLanguageStore();

  // displayed image, label
  let image = null;
  let translateStr = "";

  if (firstStr === "sleep" && secondStr === "goal") {
    if (extra.split("_")[2] === "bedTime") {
      image = "sleep2";
      translateStr = (
        DATE?.dateType === "day" ? (
          `${translate("goalBedTime")}`
        ) : (
          `${translate("goalBedTime")} (${translate("avg")})`
        )
      )
    }
    else if (extra.split("_")[2] === "wakeTime") {
      image = "sleep3";
      translateStr = (
        DATE?.dateType === "day" ? (
          `${translate("goalWakeTime")}`
        ) : (
          `${translate("goalWakeTime")} (${translate("avg")})`
        )
      )
    }
    else if (extra.split("_")[2] === "sleepTime") {
      image = "sleep4";
      translateStr = (
        DATE?.dateType === "day" ? (
          `${translate("goalSleepTime")}`
        ) : (
          `${translate("goalSleepTime")} (${translate("avg")})`
        )
      )
    }
  }
  else if (firstStr === "sleep" && secondStr !== "goal") {
    if (extra.split("_")[1] === "bedTime") {
      image = "sleep2";
      translateStr = `${translate("bedTime")}`;
    }
    else if (extra.split("_")[1] === "wakeTime") {
      image = "sleep3";
      translateStr = `${translate("wakeTime")}`;
    }
    else if (extra.split("_")[1] === "sleepTime") {
      image = "sleep4";
      translateStr = `${translate("sleepTime")}`;
    }
  }
  else if (firstStr === "exercise" && secondStr === "goal") {
    if (extra.split("_")[2] === "cardio") {
      image = "exercise4";
      translateStr = (
        DATE?.dateType === "day" ? (
          `${translate("goalCardio")}`
        ) : (
          `${translate("goalCardio")} (${translate("total")})`
        )
      );
    }
  }
  else if (firstStr === "exercise" && secondStr !== "goal") {
    if (extra.split("_")[1] === "cardio") {
      image = "exercise4";
      translateStr = `${translate("cardio")}`;
    }
  }

  // 7. time ---------------------------------------------------------------------------------------
  const timeNode = () => {
    const goalSection = () => (
      <PopUp
        key={`${i}`}
        type={"innerCenter"}
        position={"center"}
        direction={"center"}
        contents={({closePopup}: any) => (
          <Card className={"w-max40vw h-max40vh"}>
            <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={localLocale}>
              <DigitalClock
                timeStep={10}
                ampm={false}
                timezone={localTimeZone}
                value={moment(OBJECT?.[`${extra}`], "HH:mm")}
                sx={{
                  width: "40vw",
                  height: "40vh"
                }}
                onChange={(e: any) => {
                  setOBJECT((prev: any) => ({
                    ...prev,
                    [`${extra}`]: moment(e).format("HH:mm")
                  }));
                  closePopup();
                }}
              />
            </LocalizationProvider>
          </Card>
        )}
    >
        {(popTrigger: any) => (
          <Input
            label={translateStr}
            value={OBJECT?.[`${extra}`]}
            inputRef={REFS?.[i]?.[`${extra}`]}
            error={ERRORS?.[i]?.[`${extra}`]}
            readOnly={true}
            locked={LOCKED}
            startadornment={
              <Img
                key={image}
                src={image}
              	className={"w-16 h-16"}
              />
            }
            endadornment={
              translate("hm")
            }
            onClick={(e: any) => {
              LOCKED === "unlocked" && popTrigger.openPopup(e.currentTarget)
            }}
          />
        )}
      </PopUp>
    );
    const realSection = () => (
      <PopUp
        key={`${i}`}
        type={"innerCenter"}
        position={"center"}
        direction={"center"}
        contents={({closePopup}: any) => (
          <Card className={"w-max40vw h-max40vh"}>
            <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={localLocale}>
              <DigitalClock
                timeStep={10}
                ampm={false}
                timezone={localTimeZone}
                value={moment(OBJECT?.[`${firstStr}_section`][i]?.[`${extra}`], "HH:mm")}
                sx={{
                  width: "40vw",
                  height: "40vh"
                }}
                onChange={(e: any) => {
                  setOBJECT((prev: any) => ({
                    ...prev,
                    [`${firstStr}_section`]: prev[`${firstStr}_section`]?.map((item: any, idx: number) => (
                      idx === i ? {
                        ...item,
                        [`${extra}`]: moment(e).format("HH:mm")
                      } : item
                    ))
                  }));
                  closePopup();
                }}
              />
            </LocalizationProvider>
          </Card>
        )}
      >
        {(popTrigger: any) => (
          <Input
            label={translate(translateStr)}
            value={OBJECT?.[`${firstStr}_section`][i]?.[`${extra}`]}
            inputRef={REFS?.[i]?.[`${extra}`]}
            error={ERRORS?.[i]?.[`${extra}`]}
            readOnly={true}
            locked={LOCKED}
            startadornment={
              <Img
                key={image}
                src={image}
              	className={"w-16 h-16"}
              />
            }
            endadornment={
              translate("hm")
            }
            onClick={(e: any) => {
              extra !== "sleep_sleepTime" && (
                LOCKED === "unlocked" && popTrigger.openPopup(e.currentTarget)
              )
            }}
          />
        )}
      </PopUp>
    );
    return (
      secondStr === "goal" ? goalSection() : realSection()
    );
  };

  // 15. return ------------------------------------------------------------------------------------
  return (
    <>
      {timeNode()}
    </>
  );
};