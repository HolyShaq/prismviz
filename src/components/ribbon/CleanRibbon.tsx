import React, { useContext } from "react";
import RibbonButton from "./RibbonButton";
import { CsvContext } from "../../lib/CsvContext";
import { useStepContext } from "../../lib/StepContext";

const CleanRibbon: React.FC<{ left?: boolean; right?: boolean }> = ({
  left = false,
  right = false,
}) => {
  // Initialization
  const { completeCurrentStep, handleNext } = useStepContext();

  // Functions

  // Button Set Definition
  type CleanButtonSetType = {
    left: Array<React.ReactElement<typeof RibbonButton>>;
    right: Array<React.ReactElement<typeof RibbonButton>>;
  };

  const CleanButtonSet: CleanButtonSetType = {
    left: [
      // Left Ribbon Buttons
      <RibbonButton
        key={0}
        label="Remove Duplicate"
        onClick={() => {}}
        enabled={true}
      />,
      <RibbonButton
        key={1}
        label="Remove Invalid"
        onClick={() => {}}
        enabled={true}
      />,
      <RibbonButton
        key={2}
        label="Remove Empty"
        onClick={() => {}}
        enabled={true}
      />,
    ],

    right: [
      // Right Ribbon Buttons
      <RibbonButton
        key={0}
        label="Proceed"
        onClick={() => {
          completeCurrentStep();
          handleNext();
        }}
        enabled={true}
      />,
    ],
  };

  return (
    <>
      {left ? CleanButtonSet.left.map((button) => button) : null}
      {right ? CleanButtonSet.right.map((button) => button) : null}
    </>
  );
};

export default CleanRibbon;
