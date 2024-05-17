// PopUp.jsx

import {React, useEffect} from "../../import/ImportReacts.jsx";
import {Popover, bindPopover} from "../../import/ImportMuis.jsx";
import {usePopupState} from 'material-ui-popup-state/hooks';

// ------------------------------------------------------------------------------------------------>
export const PopUp = ({...props}) => {

  const popupState = usePopupState({ variant: "popover", popupId: "popupState" });

  let popupStyle = {};
  if (props.type === "alert") {
    popupStyle = {
      border: '1px solid red',
      boxShadow: '0px 0px 10px rgba(255, 0, 0, 0.5)',
      padding: "6px 6px 6px 6px",
    };
  }
  else if (props.type === "dash") {
    popupStyle = {
      border: '0.2px solid rgba(0, 0, 0, 0.2)',
      boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)',
      padding: "6px 6px 6px 15px",
    };
  }
  else {
    popupStyle = {
      border: '0.2px solid rgba(0, 0, 0, 0.2)',
      boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)',
      padding: "6px 6px 6px 6px",
    };
  }

  // 1. 팝업 고정 --------------------------------------------------------------------------------->
  const chainedPopUp = () => (
    <>
    {props.children({
      openPopup: (anchorEl) => {
        popupState.setAnchorEl(anchorEl);
        popupState.open();
      },
      closePopup: () => {
        popupState.close();
      }
    })}
    <Popover
      {...bindPopover(popupState)}
      id={"popover"}
      className={props.className}
      open={popupState.isOpen}
      anchorEl={popupState.anchorEl}
      onClose={popupState.close}
      anchorOrigin={{
        vertical: props.position === "top" ? "top" : "bottom",
        horizontal: props.direction === "center" ? "center" : (
          props.direction === "right" ? "left" : "right"
        )
      }}
      transformOrigin={{
        vertical: props.position === "top" ? "bottom" : "top",
        horizontal: props.direction === "center" ? "center" : (
          props.direction === "right" ? "left" : "right"
        )
      }}
      slotProps={{
        paper: {
          style: {
            ...popupStyle
          }
        }
      }}
    >
      {typeof props.contents === "function"
        ? props.contents({ closePopup: popupState.close })
        : props.contents
      }
    </Popover>
    </>
  );

  // 2. 팝업 화면 정중앙 -------------------------------------------------------------------------->
  const innerCenterPopUp = () => (
    <>
    {props.children({
      openPopup: (anchorEl) => {
        popupState.setAnchorEl(anchorEl);
        popupState.open();
      },
      closePopup: () => {
        popupState.close();
      }
    })}
    <Popover
      {...bindPopover(popupState)}
      id={"popover"}
      className={props.className}
      open={popupState.isOpen}
      anchorEl={null}
      onClose={popupState.close}
      anchorReference={"anchorPosition"}
      anchorPosition={{
        top: window.innerHeight / 2,
        left: window.innerWidth / 2
      }}
      anchorOrigin={{
        vertical: "center",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "center",
        horizontal: "center",
      }}
      slotProps={{
        paper: {
          style: {
            ...popupStyle
          }
        }
      }}
    >
      {typeof props.contents === "function"
        ? props.contents({ closePopup: popupState.close })
        : props.contents
      }
    </Popover>
    </>
  );

  return (
    <>
      {props.type === "innerCenter" ? innerCenterPopUp() : chainedPopUp()}
    </>
  );
};