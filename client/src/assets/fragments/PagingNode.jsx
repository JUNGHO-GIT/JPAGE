// PagingNode.jsx

import React from "react";
import {Button} from "react-bootstrap";

// 7. paging -------------------------------------------------------------------------------------->
export const PagingNode = ({
  PAGING, setPAGING, COUNT, setCOUNT
}) => {

  const pages = [];
  const totalPages = Math.ceil(COUNT.totalCnt / PAGING.limit);
  let startPage = Math.max(1, PAGING.page - 2);
  let endPage = Math.min(startPage + 4, totalPages);
  startPage = Math.max(endPage - 4, 1);

  // prev
  function btnPrev() {
    return (
      <React.Fragment>
        <Button key={"prev"} size={"sm"} variant={"primary"} className={"button me-5"}
          disabled={PAGING.page <= 1} onClick={() => (
          setPAGING((prev) => ({
            ...prev,
            page: Math.max(1, PAGING.page - 1)
          })
        ))}>
          <i className={"bi bi-chevron-left"}></i>
      </Button>
      </React.Fragment>
    );
  };

  // number
  function btnNumber() {
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button key={i} size={"sm"} variant={"primary"} className={"button me-5"}
          disabled={PAGING.page === i} onClick={() => (
          setPAGING((prev) => ({
            ...prev,
            page: i
          })
        ))}>
          {i}
        </Button>
      );
    }
    return pages;
  };

  // next
  function btnNext() {
    return (
      <React.Fragment>
        <Button key={"next"} size={"sm"} variant={"primary"} className={"button me-5"}
          disabled={PAGING.page >= totalPages} onClick={() => (
          setPAGING((prev) => ({
            ...prev,
            page: Math.min(totalPages, PAGING.page + 1)
          })
        ))}>
          <i className={"bi bi-chevron-right"}></i>
        </Button>
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      <div className={"d-inline-flex"}>
        {btnPrev()}
        {btnNumber()}
        {btnNext()}
      </div>
    </React.Fragment>
  );
};