import React from "react";

interface RibbonButtonProps {
  label: string;
  onClick: () => void;
  enabled: boolean;
}

const RibbonButton: React.FC<RibbonButtonProps> = ({
  label,
  onClick,
  enabled,
}) => {
  return enabled ? (
    <div
      onClick={onClick}
      className="flex flex-col w-16 space-y-1 items-center cursor-pointer"
    >
      <div className="h-10 aspect-square bg-slate-500" />
      <span className="text-xs text-wrap text-center w-max-full">{label}</span>
    </div>
  ) : (
    <></>
  );
};

export default RibbonButton;
