// FilterNode.jsx

import React from "react";
import {moneyArray} from "../data/MoneyArray.jsx";
import {workArray} from "../data/WorkArray.jsx";

// 8. filter  ------------------------------------------------------------------------------------->
export const FilterNode = ({
  filter, setFilter, paging, setPaging, type
}) => {
  function selectType() {
    return (
      <div className="mb-3">
        <select className="form-select" id="type" onChange={(e) => (
          setFilter((prev) => ({
            ...prev,
            type: e.target.value
          }))
        )}>
          {["day", "week", "month", "year", "select"].map((item) => (
            <option key={item} value={item} selected={filter.type === item}>
              {item}
            </option>
          ))}
        </select>
      </div>
    );
  };
  function selectOrder() {
    return (
      <div className="mb-3">
        <select className="form-select" id="order" onChange={(e) => (
          setFilter((prev) => ({
            ...prev,
            order: e.target.value
          }))
        )}>
          <option value="asc" selected>오름차순</option>
          <option value="desc">내림차순</option>
        </select>
      </div>
    );
  };
  function selectLimit() {
    return (
      <div className="mb-3">
        <select className="form-select" id="limit" onChange={(e) => (
          setPaging((prev) => ({
            ...prev,
            limit: parseInt(e.target.value)
          })),
          setFilter((prev) => ({
            ...prev,
            limit: parseInt(e.target.value)
          }))
        )}>
          <option value="5" selected>5</option>
          <option value="10">10</option>
        </select>
      </div>
    );
  };
  function selectPartFood () {
    return (
      <div>
        <select className="form-select" id="foodPart" onChange={(e) => {
          setFilter({...filter, part: e.target.value});
        }}>
          <option value="전체" selected>전체</option>
          <option value="아침">아침</option>
          <option value="점심">점심</option>
          <option value="저녁">저녁</option>
          <option value="간식">간식</option>
        </select>
      </div>
    );
  };
  function selectPartFood () {
    return (
      <div>
        <select className="form-select" id="foodPart" onChange={(e) => {
          setFilter({...filter, part: e.target.value});
        }}>
          <option value="전체" selected>전체</option>
          <option value="아침">아침</option>
          <option value="점심">점심</option>
          <option value="저녁">저녁</option>
          <option value="간식">간식</option>
        </select>
      </div>
    );
  };
  function selectPartMoney () {
    return (
      <select className="form-control" id="part" value={moneyArray[filter.partIdx].money_part} onChange={(e) => {
        const selectedOption = e.target.options[e.target.selectedIndex];
        const idxValue = selectedOption.getAttribute("data-idx");
        const newPartIndex = Number(idxValue);
        const newPartVal = String(e.target.value);
        const newTitleVal = moneyArray[newPartIndex].money_title[0];
        setFilter((prev) => ({
          ...prev,
          partIdx: newPartIndex,
          part: newPartVal,
          title: newTitleVal
        }));
      }}>
        {moneyArray.map((item, idx) => (
          <option key={idx} data-idx={idx}>
            {item.money_part}
          </option>
        ))}
      </select>
    );
  };
  function selectTitleMoney () {
    return (
      <select className="form-control" id="title" value={filter.title} onChange={(e) => {
        setFilter((prev) => ({
          ...prev,
          title: e.target.value
        }));
      }}>
        {moneyArray[filter.partIdx].money_title.map((item, idx) => (
          <option key={idx}>
            {item}
          </option>
        ))}
      </select>
    );
  };
  return (
    type === "food" ? (
      <div className="d-inline-flex">
        {selectType()}
        {selectOrder()}
        {selectLimit()}
        {selectPartFood()}
      </div>
    ) : type === "money" ? (
      <div className="d-inline-flex">
        {selectType()}
        {selectOrder()}
        {selectLimit()}
        {selectPartMoney()}
        {selectTitleMoney()}
      </div>
    ) : type === "sleep" ? (
      <div className="d-inline-flex">
        {selectType()}
        {selectOrder()}
        {selectLimit()}
      </div>
    ) : type === "work" ? (
      <div className="d-inline-flex">
        {selectType()}
        {selectOrder()}
        {selectLimit()}
      </div>
    ) : null
  );
};