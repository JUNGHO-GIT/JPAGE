// FoodDashBar.jsx

import React, {useEffect, useState} from "react";
import axios from "axios";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import {Bar, Line, ComposedChart} from 'recharts';

// ------------------------------------------------------------------------------------------------>
export const FoodDashBar = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_FOOD = process.env.REACT_APP_URL_FOOD;
  const user_id = window.sessionStorage.getItem("user_id");

  // 2-2. useState -------------------------------------------------------------------------------->
  const DASH_DEFAULT = [
    {name:"칼로리", 목표: 0, 실제: 0},
    {name:"탄수화물", 목표: 0, 실제: 0},
    {name:"단백질", 목표: 0, 실제: 0},
    {name:"지방", 목표: 0, 실제: 0},
  ];
  const [DASH, setDASH] = useState(DASH_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_FOOD}/dashBar`, {
      params: {
        user_id: user_id
      },
    });
    setDASH(response.data.result || DASH_DEFAULT);
  })()}, [user_id]);

  // 4. handler ----------------------------------------------------------------------------------->
  const handlerCalcY = (value) => {
    const ticks = [];
    const maxValue = Math.max(...value?.map((item) => Math.max(item.목표, item.실제)));
    let topValue = Math.ceil(maxValue / 1000) * 1000;

    // topValue에 따른 동적 틱 간격 설정
    let tickInterval = 1000;
    if (topValue > 5000) {
      tickInterval = 5000;
    }
    else if (topValue > 1000) {
      tickInterval = 1000;
    }
    for (let i = 0; i <= topValue; i += tickInterval) {
      ticks.push(i);
    }
    return {
      domain: [0, topValue],
      ticks: ticks,
      tickFormatter: (tick) => (`${Number((tick).toFixed(1))}`)
    };
  };

  // 5-1. chart ----------------------------------------------------------------------------------->
  const chartFoodBar = () => {

    const {domain, ticks, tickFormatter} = handlerCalcY(DASH);

    return (
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={DASH} margin={{top: 60, right: 60, bottom: 20, left: 20}}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis
            type="number"
            domain={domain}
            ticks={ticks}
            tickFormatter={tickFormatter}
          />
          <Line dataKey="목표" type="monotone" stroke="#ff7300" />
          <Bar dataKey="실제" type="monotone" fill="#8884d8" barSize={30} minPointSize={1} />
          <Tooltip />
          <Legend />
        </ComposedChart>
      </ResponsiveContainer>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className="row d-center">
      <div className="col-12">
        {chartFoodBar()}
      </div>
    </div>
  );
};
