// Bg.jsx

import { Badge } from "../../imports/ImportMuis.jsx";

// -------------------------------------------------------------------------------------------------
export const Bg = ({
  ...props
}) => {

  return (
    <Badge
      {...props}
      showZero={props?.showZero || true}
      className={props?.className || "mt-n10 me-n10"}
      sx={{
        ...props?.sx,
        '& .MuiBadge-badge': {
          color: props?.sx?.color || "white",
          backgroundColor: props?.bgcolor || "#1976d2",
        },
      }}
    />
  );
};