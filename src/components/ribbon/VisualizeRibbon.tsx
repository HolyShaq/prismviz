import React, { useContext } from "react";
import RibbonButton from "./RibbonButton";
import { CsvContext } from "../../lib/CsvContext";
import { useStepContext } from "../../lib/StepContext";

// Material UI
import BarChartIcon from "@mui/icons-material/BarChart";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

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
        Icon={BarChartIcon}
        onClick={() => {}}
        enabled={true}
        tooltip="Add a Chart: Visualize your data with a chart"
      />,
      <RibbonButton
        key={1}
        Icon={TextFieldsIcon}
        onClick={() => {}}
        enabled={true}
        tooltip="Add a Textbox: Annotate your visualization"
      />,
    ],

    right: [
      // Right Ribbon Buttons
      <RibbonButton
        key={0}
        Icon={BarChartIcon}
        onClick={() => {}}
        enabled={true}
        tooltip="Preview: View your chart before finalizing"
      />,
      <RibbonButton
        key={1}
        Icon={CheckCircleIcon}
        onClick={() => {}}
        enabled={true}
        tooltip="Print: Print your chart and annotations"
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
