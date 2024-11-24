import React, { useState, useContext, useRef } from "react";
import RibbonButton from "./RibbonButton";
import { CreateBarChart } from "./charts/BarChartModals";
import { CsvContext } from "../../lib/CsvContext";
import { useChartContext } from "../../lib/ChartContext";

// Material UI
import BarChartIcon from "@mui/icons-material/BarChart";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import TollIcon from "@mui/icons-material/Toll";
import BubbleChartIcon from "@mui/icons-material/BubbleChart";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Popover from "@mui/material/Popover";

// Interfaces
interface VisualizeRibbonProps {
  left?: boolean;
  right?: boolean;
}
interface PopoverButtonProps {
  Icon: React.ElementType;
  label: string;
  onClick?: () => void;
  rotated?: boolean;
}

// Static Components
const PopoverButton: React.FC<PopoverButtonProps> = ({
  Icon,
  label,
  onClick,
  rotated = false,
}) => {
  return (
    <div
      onClick={onClick}
      className="w-24 h-24 rounded-md flex flex-col justify-center items-center outline
        text-[#313154] hover:text-white
        bg-[#b4b4b4]
        hover:bg-[#545469]
        outline-[#545469]"
    >
      <Icon className={"text-6xl" + (rotated ? " rotate-90" : "")} />
      <p className="text-sm">{label}</p>
    </div>
  );
};

const VisualizeRibbon: React.FC<VisualizeRibbonProps> = ({
  left = false,
  right = false,
}) => {
  // Initialization
  const addChartRef = useRef(null);
  const { addFigure } = useChartContext();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isBarChartInvoked, setIsBarChartInvoked] = useState(false);

  // Components
  const AddChartPopover: React.FC = () => {
    return (
      <Popover
        open={isPopoverOpen}
        onClose={() => setIsPopoverOpen(false)}
        anchorEl={addChartRef.current}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <div className="flex flex-col space-y-6 p-6 bg-white rounded-xl shadow-md items-center">
          <div className="flex flex-row space-x-6">
            <PopoverButton
              Icon={BarChartIcon}
              rotated
              label="Bar Chart"
              onClick={() => {
                setIsBarChartInvoked(true);
                setIsPopoverOpen(false);
              }}
            />
            <PopoverButton Icon={BarChartIcon} label="Column Chart" />
          </div>
          <div className="flex flex-row space-x-6">
            <PopoverButton Icon={DonutLargeIcon} label="Donut Chart" />
            <PopoverButton Icon={TollIcon} label="Radial Chart" />
          </div>
          <div className="flex flex-row space-x-6">
            <PopoverButton Icon={BubbleChartIcon} label="Bubble Chart" />
          </div>
        </div>
      </Popover>
    );
  };

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
        ref={addChartRef}
        key={0}
        Icon={BarChartIcon}
        onClick={() => {
          setIsPopoverOpen(true);
          console.log("Adding a chart...");
        }}
        enabled={true}
        tooltip="Add a Chart: Visualize your data with a chart"
      />,
      <RibbonButton
        key={1}
        Icon={TextFieldsIcon}
        onClick={() => {
          addFigure(
            <div className="flex flex-row bg-white justify-center items-center w-64 h-32">
              <p className="text-sm">Text</p>
            </div>,
          );
        }}
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
      <AddChartPopover />
      <CreateBarChart
        invoked={isBarChartInvoked}
        setInvoked={setIsBarChartInvoked}
      />
    </>
  );
};

export default VisualizeRibbon;
