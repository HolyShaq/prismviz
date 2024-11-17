import React, { useContext } from "react";
import RibbonButton from "./RibbonButton";
import { CsvContext } from "../../lib/CsvContext";
import { useStepContext } from "../../lib/StepContext";

// Material-UI icons
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";

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
        Icon={RemoveCircleIcon}
        onClick={() => {}}
        enabled={true}
        tooltip="Remove Duplicate: Deletes duplicate entries"
      />,
      <RibbonButton
        key={1}
        Icon={CheckCircleIcon}
        onClick={() => {}}
        enabled={true}
        tooltip="Remove Invalid: Identifies and removes invalid data"
      />,
      <RibbonButton
        key={2}
        Icon={DeleteIcon}
        onClick={() => {}}
        enabled={true}
        tooltip="Remove Empty: Deletes empty entries"
      />,
    ],

    right: [
      // Right Ribbon Buttons
      <RibbonButton
        key={0}
        Icon={DeleteIcon}
        onClick={() => {}}
        enabled={true}
        tooltip="Delete Rows: Remove selected rows"
      />,
      <RibbonButton
        key={1}
        Icon={CheckCircleIcon}
        onClick={() => {
          completeCurrentStep();
          handleNext();
        }}
        enabled={true}
        tooltip="Proceed: Move to the next step"
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
