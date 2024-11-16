import React, { useContext } from "react";
import RibbonButton from "./RibbonButton";
import { CsvContext } from "../../lib/CsvContext";
import { useStepContext } from "../../lib/StepContext";

const VisualizeRibbon: React.FC<{ left?: boolean; right?: boolean }> = ({
  left = false,
  right = false,
}) => {
  // Initialization

  // Functions

  // Button Set Definition
  type VisualizeButtonSetType = {
    left: Array<React.ReactElement<typeof RibbonButton>>;
    right: Array<React.ReactElement<typeof RibbonButton>>;
  };

  const VisualizeButtonSet: VisualizeButtonSetType = {
    left: [
      // Left Ribbon Buttons
      <RibbonButton
        key={0}
        label="Add a Chart"
        onClick={() => {}}
        enabled={true}
      />,
      <RibbonButton
        key={1}
        label="Add a Textbox"
        onClick={() => {}}
        enabled={true}
      />,
      <RibbonButton
        key={2}
        label="Add Controls"
        onClick={() => {}}
        enabled={true}
      />,
    ],

    right: [
      // Right Ribbon Buttons
      <RibbonButton
        key={0}
        label="Preview"
        onClick={() => {}}
        enabled={true}
      />,
    ],
  };

  return (
    <>
      {left ? VisualizeButtonSet.left.map((button) => button) : null}
      {right ? VisualizeButtonSet.right.map((button) => button) : null}
    </>
  );
};

export default VisualizeRibbon;
