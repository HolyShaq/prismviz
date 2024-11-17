import React from "react";
import { Tooltip } from "@mui/material";

interface RibbonButtonProps {
  Icon: React.ElementType; // Material-UI icon component
  onClick: () => void;
  enabled: boolean;
  tooltip: string;
}

const RibbonButton: React.FC<RibbonButtonProps> = ({
  Icon,
  onClick,
  enabled,
  tooltip,
}) => {
  return enabled ? (
    <Tooltip title={tooltip} arrow>
      <div
        onClick={onClick}
        className="flex flex-col w-20 space-y-1 items-center cursor-pointer p-2 rounded-md"
      >
        <div className="h-10 w-10 flex items-center justify-center text-white">
          <Icon fontSize="large" /> {/* Render the Material-UI Icon */}
        </div>
      </div>
    </Tooltip>
  ) : null;
};

export default RibbonButton;
