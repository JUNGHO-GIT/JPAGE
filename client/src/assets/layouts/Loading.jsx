// Loading.jsx

import {React} from "../../import/ImportReacts.jsx";
import {Div, Icons} from "../../import/ImportComponents.jsx";
import {Paper} from "../../import/ImportMuis.jsx";

// 14. loading ------------------------------------------------------------------------------------>
export const Loading = ({
  LOADING, setLOADING
}) => {

  if (!LOADING) {
    return null;
  }

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => (
    <Paper className={"content-wrapper"} variant={"outlined"}>
      <Div className={"block-wrapper h-min400"}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%"
        }}>
        <Icons name={"FaSpinner"} className={"w-24 h-24 dark"} />
      </Div>
    </Paper>
  );

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <>
      {tableNode()}
    </>
  );
};