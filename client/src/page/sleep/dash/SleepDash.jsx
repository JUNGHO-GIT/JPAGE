// SleepDash.jsx

import {React} from "../../../import/ImportReacts.jsx";
import {Header, NavBar, Loading, Footer} from "../../../import/ImportLayouts.jsx";
import {SleepDashBar} from "./SleepDashBar.jsx";
import {SleepDashLine} from "./SleepDashLine.jsx";
import {SleepDashAvg} from "./SleepDashAvg.jsx";

// ------------------------------------------------------------------------------------------------>
export const SleepDash = () => {

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <>
      {Header()}
      {NavBar()}
      {SleepDashBar()}
      {SleepDashLine()}
      {SleepDashAvg()}
    </>
  );
};