// Btn.jsx

import { Button } from "../../imports/ImportMuis.jsx";

// -------------------------------------------------------------------------------------------------
export const Btn = ({
  ...props
}) => {

  return (
    <Button
      {...props}
      size={props?.size || "small"}
      color={props?.color || "primary"}
      variant={props?.variant || "contained"}
      style={{
        ...props?.style,
        lineHeight: props?.style?.lineHeight || "1.4",
        padding: props?.style?.padding || "4px 10px",
        textTransform: props?.style?.textTransform || "none",
        whiteSpace: props?.style?.whiteSpace || "nowrap",
        overflow: props?.style?.overflow || "hidden",
        textOverflow: props?.style?.textOverflow || "ellipsis",
        fontSize: props?.style?.fontSize || "0.8rem"
      }}
    />
  );
};