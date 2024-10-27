// Empty.tsx

import { useCommonValue } from "@imports/ImportHooks";
import { useLanguageStore } from "@imports/ImportStores";
import { Div, Icons } from "@imports/ImportComponents";
import { Grid, Accordion, AccordionSummary } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
declare type EmptyProps = {
  DATE: any;
  extra: string;
}

// -------------------------------------------------------------------------------------------------
export const Empty = (
  { DATE, extra }: EmptyProps
) => {

  // 1. common -------------------------------------------------------------------------------------
  const { PATH, navigate } = useCommonValue();
  const { translate } = useLanguageStore();

  const isFindList = PATH.includes("food/find/list");
  const isGoalList = !isFindList && PATH.includes("goal/list");
  const toDetail = isGoalList ? `/${extra}/goal/detail` : `/${extra}/detail`;

  // 7. emptyNode ----------------------------------------------------------------------------------
  const emptyNode = () => {
    // 1. isFindSection
    const isFindSection = () => (
      <Grid container spacing={0} columns={12} className={"border-1 radius-1"}>
        <Grid size={12} className={"p-2"}>
          <Accordion expanded={false}>
            <AccordionSummary>
              <Grid container spacing={2} columns={12}>
                <Grid size={4} className={"d-row-left"}>
                  <Div className={"fs-1-0rem fw-600 dark"}>
                    {translate("search")}
                  </Div>
                </Grid>
                <Grid size={8} className={"d-row-left"}>
                  <Div className={"fs-1-0rem fw-500"}>
                    {translate("notFound")}
                  </Div>
                </Grid>
              </Grid>
            </AccordionSummary>
          </Accordion>
        </Grid>
      </Grid>
    );
    // 2. nonFindSection
    const nonFindSection = () => (
      <Grid container spacing={0} columns={12} className={"border-1 radius-1"}>
        <Grid size={12} className={"p-2"}>
          <Accordion expanded={false}>
            <AccordionSummary
              onClick={() => {
                navigate(toDetail, {
                  state: {
                    from: PATH.includes("today") ? "today" : "list",
                    dateType: DATE?.dateType,
                    dateStart: DATE?.dateStart,
                    dateEnd: DATE?.dateEnd
                  }
                });
              }}
            >
              <Grid container spacing={2} columns={12}>
                <Grid size={2} className={"d-row-center"}>
                  <Icons
                    key={"Search"}
                    name={"Search"}
                    className={"w-18 h-18"}
                  />
                </Grid>
                <Grid size={4} className={"d-row-left"}>
                  <Div className={"fs-0-9rem fw-600 dark"}>
                    {translate(`${extra}`)}
                  </Div>
                </Grid>
                <Grid size={6} className={"d-row-left"}>
                  <Div className={"fs-1-0rem fw-500"}>
                    {translate("empty")}
                  </Div>
                </Grid>
              </Grid>
            </AccordionSummary>
          </Accordion>
        </Grid>
      </Grid>
    );
    // 3. return
    return (
      isFindList ? isFindSection() : nonFindSection()
    );
  };

  // 15. return ------------------------------------------------------------------------------------
  return (
    <>
      {emptyNode()}
    </>
  );
};