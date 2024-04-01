// Dash.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import moment from "moment-timezone";
import axios from "axios";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import {BarChart, Bar} from "recharts";
import {LineChart, Line} from "recharts";
import {ComposedChart} from 'recharts';
import {useDeveloperMode} from "../../assets/js/useDeveloperMode.jsx";

// ------------------------------------------------------------------------------------------------>
export const Test = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_SLEEP = process.env.REACT_APP_URL_SLEEP;
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString();
  const navigate = useNavigate();
  const location = useLocation();
  const location_day = location?.state?.day;
  const user_id = window.sessionStorage.getItem("user_id");

  // 2-2. useState -------------------------------------------------------------------------------->
  const [planYn, setPlanYn] = useState("N");
  const [sleepStart, setSleepStart] = useState("");
  const [sleepEnd, setSleepEnd] = useState("");
  const [sleepTime, setSleepTime] = useState("");

  // 2-2. useState -------------------------------------------------------------------------------->
  const [strDate, setStrDate] = useState(location_day ? location_day : koreanDate);
  const [strDur, setStrDur] = useState(`${strDate} ~ ${strDate}`);

  // 2-2. useState -------------------------------------------------------------------------------->
  const [SLEEP_DEFAULT, setSLEEP_DEFAULT] = useState({
    user_id : user_id,
    sleep_day: "",
    sleep_real : [{
      sleep_start: "",
      sleep_end: "",
      sleep_time: "",
    }],
    sleep_plan : [{
      sleep_start: "",
      sleep_end: "",
      sleep_time: "",
    }]
  });
  const [SLEEP, setSLEEP] = useState([{
    user_id : user_id,
    sleep_day: "",
    sleep_real : [{
      sleep_start: "",
      sleep_end: "",
      sleep_time: "",
    }],
    sleep_plan : [{
      sleep_start: "",
      sleep_end: "",
      sleep_time: "",
    }]
  }]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_SLEEP}/dash`, {
      params: {
        user_id: user_id,
        sleep_dur: strDur
      },
    });
    setSLEEP(response.data.result);
  })()}, [user_id]);

  // 5-1. bar ------------------------------------------------------------------------------------->
  const chartSleepBar = () => {

    const fmtData = (data) => {
      const time = data.split(":");
      return parseFloat((parseInt(time[0], 10) + parseInt(time[1], 10) / 60).toFixed(1));
    };

    const data = SLEEP.map((item) => {
      return {
        name: "취침",
        목표: fmtData(item.sleep_plan[0].sleep_start),
        실제: fmtData(item.sleep_real[0].sleep_start),
      };
    })
    .concat(SLEEP.map((item) => {
      return {
        name: "기상",
        목표: fmtData(item.sleep_plan[0].sleep_end),
        실제: fmtData(item.sleep_real[0].sleep_end),
      };
    }))
    .concat(SLEEP.map((item) => {
      return {
        name: "수면",
        목표: fmtData(item.sleep_plan[0].sleep_time),
        실제: fmtData(item.sleep_real[0].sleep_time),
      };
    }));

    return (
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data} margin={{top: 60, right: 60, bottom: 20, left: 20}}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis
            type="number"
            domain={[0, 30]}
            ticks={[0, 6, 12, 18, 24, 30]}
            tickFormatter={(tick) => {
              return tick > 24 ? tick -= 24 : tick;
            }}
          />
          <Line dataKey="목표" type="monotone" stroke="#ff7300" />
          <Bar dataKey="실제" type="monotone" fill="#8884d8" barSize={30} />
          <Tooltip />
          <Legend />
        </ComposedChart>
      </ResponsiveContainer>
    );
  };
  const tableSleepBar = () => {
    return (
      <table className="table bg-white border">
        <tbody>
          {SLEEP.map((item) => (
            <React.Fragment key={item._id}>
              <tr>
                <td>취침</td>
                <td>
                  {Array.isArray(item.sleep_plan)
                    ? item.sleep_plan.map((plan) => (`${plan.sleep_start}`)).join(", ")
                    : `X`
                  }
                </td>
                <td>
                  {Array.isArray(item.sleep_real)
                    ? item.sleep_real.map((real) => (`${real.sleep_start}`)).join(", ")
                    : `X`
                  }
                </td>
                <td>
                  <span className={successOrNot(item.sleep_plan[0]?.sleep_start, item.sleep_real[0]?.sleep_start)}>
                    ●
                  </span>
                </td>
              </tr>
              <tr>
                <td>기상</td>
                <td>
                  {Array.isArray(item.sleep_plan)
                    ? item.sleep_plan.map((plan) => (`${plan.sleep_end}`)).join(", ")
                    : `X`
                  }
                </td>
                <td>
                  {Array.isArray(item.sleep_real)
                    ? item.sleep_real.map((real) => (`${real.sleep_end}`)).join(", ")
                    : `X`
                  }
                </td>
                <td>
                  <span className={successOrNot(item.sleep_plan[0]?.sleep_end, item.sleep_real[0]?.sleep_end)}>
                    ●
                  </span>
                </td>
              </tr>
              <tr>
                <td>수면</td>
                <td>
                  {Array.isArray(item.sleep_plan)
                    ? item.sleep_plan.map((plan) => (`${plan.sleep_time}`)).join(", ")
                    : `X`
                  }
                </td>
                <td>
                  {Array.isArray(item.sleep_real)
                    ? item.sleep_real.map((real) => (`${real.sleep_time}`)).join(", ")
                    : `X`
                  }
                </td>
                <td>
                  <span className={successOrNot(item.sleep_plan[0]?.sleep_time, item.sleep_real[0]?.sleep_time)}>
                    ●
                  </span>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className="root-wrapper">
      <div className="container">
        <div className="container-wrapper mb-10">
          <div className="row d-center">
            <div className="col-8">
              {chartSleepBar()}
            </div>
            <div className="col-4">
              {tableSleepBar()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
