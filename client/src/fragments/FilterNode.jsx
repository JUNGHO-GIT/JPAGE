// FilterNode.jsx

import React from "react";
import {InputLabel, MenuItem, FormControl, Select, Box, FormHelperText} from "@mui/material";

// 10. filter ------------------------------------------------------------------------------------->
export const FilterNode = ({
  FILTER, setFILTER, PAGING, setPAGING, part, plan, type
}) => {

  const session = sessionStorage.getItem("dataset") || "{}";
  const exerciseArray = JSON.parse(session).exercise || [];
  const foodArray = JSON.parse(session).food || [];
  const moneyArray = JSON.parse(session).money || [];
  const sleepArray = JSON.parse(session).sleep || [];

  // 1. default
  const defaultNode = () => (
    <React.Fragment>
      <FormControl size={"small"} variant={"outlined"} className={"ms-2 me-2"}>
        <Select labelId={"type"} id={"type"} value={FILTER?.type} className={"form-select"}
        onChange={(e) => (
          setFILTER((prev) => ({
            ...prev,
            type: e.target.value
          })),
          setPAGING((prev) => ({
            ...prev,
            page: 1
          }))
        )}>
          {["day", "week", "month", "year", "select"]?.map((item) => (
            <MenuItem key={item} value={item} selected={FILTER?.type === item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size={"small"} variant={"outlined"} className={"ms-2 me-2"}>
        <Select labelId={"order"} id={"order"} value={FILTER?.order} className={"form-select"}
        onChange={(e) => (
          setFILTER((prev) => ({
            ...prev,
            order: e.target.value
          }))
        )}>
          {["asc", "desc"]?.map((item) => (
            <MenuItem key={item} value={item} selected={FILTER?.order === item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size={"small"} variant={"outlined"} className={"ms-2 me-2"}>
        <Select labelId={"limit"} id={"limit"} value={FILTER?.limit} className={"form-select"}
        onChange={(e) => (
          setFILTER((prev) => ({
            ...prev,
            limit: Number(e.target.value)
          })),
          setPAGING((prev) => ({
            ...prev,
            limit: Number(e.target.value)
          }))
        )}>
          {["5", "10"]?.map((item) => (
            <MenuItem key={item} value={item} selected={FILTER?.limit === parseInt(item)}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </React.Fragment>
  );

  // 2. exercise
  const exerciseNode = () => (
    <React.Fragment>
      <select className={"form-select me-5"} id={"part"} value={exerciseArray[FILTER?.partIdx]?.exercise_part} onChange={(e) => {
        const selectedOption = e.target.options[e.target.selectedIndex];
        const idxValue = selectedOption.getAttribute("data-idx");
        const newPartIndex = Number(idxValue);
        const newPartVal = String(e.target.value);
        const newTitleIndex = 0;
        const newTitleVal = exerciseArray[newPartIndex]?.exercise_title[0];
        setFILTER((prev) => ({
          ...prev,
          partIdx: newPartIndex,
          part: newPartVal,
          titleIdx: newTitleIndex,
          title: newTitleVal
        }));
      }}>
        {exerciseArray?.map((item, idx) => (
          <option key={idx} data-idx={idx}>
            {item.exercise_part}
          </option>
        ))}
      </select>
      <select className={"form-select me-5"} id={"title"} value={FILTER?.title}
      onChange={(e) => {
        const selectedOption = e.target.options[e.target.selectedIndex];
        const idxValue = selectedOption.getAttribute("data-idx");
        const newTitleIndex = Number(idxValue);
        const newTitleVal = String(e.target.value);
        setFILTER((prev) => ({
          ...prev,
          titleIdx: newTitleIndex,
          title: newTitleVal
        }));
      }}>
        {exerciseArray[FILTER?.partIdx]?.exercise_title?.map((item, idx) => (
          <option key={idx} data-idx={idx}>
            {item}
          </option>
        ))}
      </select>
    </React.Fragment>
  );

  // 3. food
  const foodNode = () => (
    <React.Fragment>
      <select className={"form-select me-5"} id={"part"} value={foodArray[FILTER?.partIdx]?.money_part} onChange={(e) => {
        const selectedOption = e.target.options[e.target.selectedIndex];
        const idxValue = selectedOption.getAttribute("data-idx");
        const newPartIndex = Number(idxValue);
        const newPartVal = String(e.target.value);
        setFILTER((prev) => ({
          ...prev,
          partIdx: newPartIndex,
          part: newPartVal
        }));
      }}>
        {foodArray?.map((item, idx) => (
          <option key={idx} data-idx={idx}>
            {item.food_part}
          </option>
        ))}
      </select>
    </React.Fragment>
  );

  // 4. money
  const moneyNode = () => (
    <React.Fragment>
      <select className={"form-select me-5"} id={"part"} value={moneyArray[FILTER?.partIdx]?.money_part} onChange={(e) => {
        const selectedOption = e.target.options[e.target.selectedIndex];
        const idxValue = selectedOption.getAttribute("data-idx");
        const newPartIndex = Number(idxValue);
        const newPartVal = String(e.target.value);
        const newTitleIndex = 0;
        const newTitleVal = moneyArray[newPartIndex]?.money_title[0];
        setFILTER((prev) => ({
          ...prev,
          partIdx: newPartIndex,
          part: newPartVal,
          titleIdx: newTitleIndex,
          title: newTitleVal
        }));
      }}>
        {moneyArray?.map((item, idx) => (
          <option key={idx} data-idx={idx}>
            {item.money_part}
          </option>
        ))}
      </select>
      <select className={"form-select me-5"} id={"title"} value={FILTER?.title}
      onChange={(e) => {
        const selectedOption = e.target.options[e.target.selectedIndex];
        const idxValue = selectedOption.getAttribute("data-idx");
        const newTitleIndex = Number(idxValue);
        const newTitleVal = String(e.target.value);
        setFILTER((prev) => ({
          ...prev,
          titleIdx: newTitleIndex,
          title: newTitleVal
        }));
      }}>
        {moneyArray[FILTER?.partIdx]?.money_title?.map((item, idx) => (
          <option key={idx} data-idx={idx}>
            {item}
          </option>
        ))}
      </select>
    </React.Fragment>
  );

  // 6. return
  return (
    <React.Fragment>
      <div className={"flex-wrapper h-6vh"}>
        {part === "exercise" && plan === "" ? (
          <React.Fragment>
            {defaultNode()}
            {exerciseNode()}
          </React.Fragment>
        ) : part === "food" && plan === "" ? (
          <React.Fragment>
            {defaultNode()}
            {foodNode()}
          </React.Fragment>
        ) : part === "money" && plan === "" ? (
          <React.Fragment>
            {defaultNode()}
            {moneyNode()}
          </React.Fragment>
        ) : part === "sleep" && plan === "" ? (
          <React.Fragment>
            {defaultNode()}
          </React.Fragment>
        ) : (
          <React.Fragment>
            {defaultNode()}
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  );
};