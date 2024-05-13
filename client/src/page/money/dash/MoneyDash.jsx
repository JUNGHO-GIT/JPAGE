// MoneyDash.jsx

import {React} from "../../../import/ImportReacts.jsx";
import {Header, NavBar} from "../../../import/ImportLayouts.jsx";
import {MoneyDashBar} from "./MoneyDashBar.jsx";
import {MoneyDashPie} from "./MoneyDashPie.jsx";
import {MoneyDashLine} from "./MoneyDashLine.jsx";
import {MoneyDashAvg} from "./MoneyDashAvg.jsx";

// ------------------------------------------------------------------------------------------------>
export const MoneyDash = () => {

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <>
      {Header()}
      {NavBar()}
      {MoneyDashBar()}
      {MoneyDashPie()}
      {MoneyDashLine()}
      {MoneyDashAvg()}
    </>
  );
};