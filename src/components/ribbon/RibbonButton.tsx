import React from "react";
import { Tooltip } from "@mui/material";

interface RibbonButtonProps {
  Icon: React.ElementType; // Material-UI icon component
  onClick: () => void;
  enabled: boolean;
  tooltip: string;
  ref?: React.RefObject<HTMLDivElement>;
}

const RibbonButton: React.FC<RibbonButtonProps> = ({
  Icon,
  onClick,
  enabled,
  tooltip,
  ref,
}) => {
  return enabled ? (
    <Tooltip
      title={
        <div style={{ textAlign: "center" }}>
          <strong style={{ color: "#B4B4B4" }}>{tooltip.split(":")[0]}</strong>
          <br />
          <span style={{ color: "#B4B4B4", fontWeight: "normal" }}>
            {tooltip.split(":")[1]}
          </span>
        </div>
      }
      placement="bottom"
      componentsProps={{
        tooltip: {
          sx: {
            backgroundColor: "#D9D9D9", // Tooltip background
            color: "#B4B4B4", // Tooltip text color
            fontSize: "0.9rem",
            padding: "8px 12px",
            borderRadius: "8px",
            transform: "translateY(-20px) !important", // Force tooltip up
          },
        },
      }}
    >
      <div
        onClick={onClick}
        ref={ref}
        className="flex flex-col w-10 h-10 items-center cursor-pointer p-2 rounded-md"
      >
        <div className="h-8 w-8 flex items-center justify-center text-white">
          <Icon fontSize="medium" /> {/* Render the Material-UI Icon */}
        </div>
      </div>
    </Tooltip>
  ) : null;
};

export default RibbonButton;
