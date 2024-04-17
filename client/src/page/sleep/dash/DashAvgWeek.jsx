// DashAvgWeek.tsx

import axios from "axios";
import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {useStorage} from "../../../assets/hooks/useStorage.jsx";
import {BarChart, Bar} from "recharts";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";

// ------------------------------------------------------------------------------------------------>
export const DashAvgWeek = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_SLEEP = process.env.REACT_APP_URL_SLEEP;
  const location = useLocation();
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:LINE, set:setLINE} = useStorage(
    `LINE (avg-week) (${PATH})`, ["취침", "수면", "기상"]
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const DASH_DEFAULT = [
    {name:"", 취침: 0, 수면: 0, 기상: 0}
  ];
  const [DASH, setDASH] = useState(DASH_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const responseWeek = await axios.get(`${URL_SLEEP}/dash/avg/week`, {
      params: {
        user_id: user_id
      },
    });
    setDASH(responseWeek.data.result || DASH_DEFAULT);
  })()}, [user_id]);

  // 5-1. chart ----------------------------------------------------------------------------------->
  const chartNode = () => {
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={300}>
          <BarChart data={DASH} margin={{top: 60, right: 60, bottom: 20, left: 20}}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type={"category"} dataKey={"name"} />
            <YAxis
              type={"number"}
              domain={[0, 30]}
              ticks={[0, 6, 12, 18, 24, 30]}
              tickFormatter={(tick) => {
                return tick > 24 ? tick -= 24 : tick;
              }}
            />
            {LINE.includes("취침")
              && <Bar type={"monotone"} dataKey={"취침"} fill={"#8884d8"} />
            }
            {LINE.includes("기상")
              && <Bar type={"monotone"} dataKey={"기상"} fill={"#82ca9d"} />
            }
            {LINE.includes("수면")
              && <Bar type={"monotone"} dataKey={"수면"} fill={"#ffc658"} />
            }
            <Tooltip />
            <Legend />
          </BarChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 6-1. table ----------------------------------------------------------------------------------->
  const tableNode = () => {
    return (
      <table className={"table bg-white border"}>
        <tbody>
          <div className={"mt-10 mb-10"}>
            {["취침", "수면", "기상"]?.map((key, index) => (
              <div key={index}>
                <input
                  type={"checkbox"}
                  checked={LINE.includes(key)}
                  onChange={() => {
                    if (LINE.includes(key)) {
                      setLINE(LINE?.filter((item) => item !== key));
                    }
                    else {
                      setLINE([...LINE, key]);
                    }
                  }}
                />
                {key}
              </div>
            ))}
          </div>
        </tbody>
      </table>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className={"row d-center"}>
      <div className={"col-9"}>
        {chartNode()}
      </div>
      <div className={"col-3"}>
        {tableNode()}
      </div>
    </div>
  );
};