// Hover.tsx
// @ts-nocheck

import React, { useEffect} from "react";

// ------------------------------------------------------------------------------------------------>
export const Hover = () => {

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {

    const textHovers = document.querySelectorAll(".text-hover");
    textHovers.forEach((textHover) => {
      textHover.style.transition = "font-size 0.1s ease-in-out";
      textHover.style.display = "inline-block";
      textHover.style.cursor = "pointer";
      textHover.style.caretColor = "transparent";
      textHover.addEventListener("mouseenter", function () {
        this.style.fontSize = `calc(${getComputedStyle(this).fontSize} + 3px)`;
      });
      textHover.addEventListener("mouseleave", function () {
        this.style.fontSize = "";
      });
    });
  }, []);

  return (
    <React.Fragment></React.Fragment>
  );
};