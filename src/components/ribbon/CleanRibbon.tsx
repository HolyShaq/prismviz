import React, { useContext } from "react";
import RibbonButton from "./RibbonButton";
import { CsvContext } from "../../lib/CsvContext";
import { useStepContext } from "../../lib/StepContext";

// Material-UI icons
import SearchOffIcon from '@mui/icons-material/SearchOff';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// Material UI Icons for proceed and clearing uploaded data
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';

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
        Icon={SearchOffIcon}
        onClick={() => {}}
        enabled={true}
        tooltip="Handle Missing Data: 
Delete or Replace empty entries"
      />,
      <RibbonButton
        key={1}
        Icon={RemoveCircleIcon}
        onClick={() => {}}
        enabled={true}
        tooltip="Remove Duplicate Entries:
Delete duplicate entries"
      />,
      <RibbonButton
        key={2}
        Icon={CheckCircleIcon}
        onClick={() => {}}
        enabled={true}
        tooltip="Validate Column Entry:
Delete or Replace unsual entries"
      />,
    ],

    right: [
      // Right Ribbon Buttons
      <RibbonButton
        key={0}
        Icon={DeleteIcon}
        onClick={() => {}}
        enabled={true}
        tooltip="Delete Selected Row/s:
Delete specific rows"
      />,
      <RibbonButton
        key={1}
        Icon={ArrowCircleRightIcon}
        onClick={() => {
          completeCurrentStep();
          handleNext();
        }}
        enabled={true}
        tooltip="Proceed to Data Visualization:
Proceed to the next section"
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
