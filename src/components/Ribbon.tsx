"use client";

import { Skeleton } from "@mui/material";
import React from "react";

interface RibbonProps {
  currentStep: number;
}

interface RibbonButtonProps {
  //  TODO: Implement icons
  // icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const RibbonButton: React.FC<RibbonButtonProps> = ({ label, onClick }) => {
  return (
    <div className="flex flex-col w-16 space-y-1 items-center">
      <div className="h-16 aspect-square bg-slate-500" />
      <span className="text-xs text-wrap text-center w-max-full">{label}</span>
    </div>
  );
};

const Ribbon: React.FC<RibbonProps> = ({ currentStep }) => {
  const temp = () => {};

  const buttonSet = [
    // Upload
    [],

    // Clean
    [
      <RibbonButton key={0} label="Remove Duplicate" onClick={temp} />,
      <RibbonButton key={1} label="Remove Invalid" onClick={temp} />,
      <RibbonButton key={2} label="Remove Empty" onClick={temp} />,
    ],

    // Visualize
    [
      <RibbonButton key={0} label="Add a Chart" onClick={temp} />,
      <RibbonButton key={1} label="Add a Textbox" onClick={temp} />,
      <RibbonButton key={2} label="Add Controls" onClick={temp} />,
    ],
  ];

  return (
    <div className="flex flex-row h-20 space-x-2">
      {buttonSet[currentStep].map((button) => button)}
    </div>
  );
};

export default Ribbon;
