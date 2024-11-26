import React, { useState, useContext, useRef } from "react";
import RibbonButton from "./RibbonButton";
import { CreateBarChart } from "./chart_modals/BarChartModals";
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
import AddchartIcon from "@mui/icons-material/Addchart";
import FormatShapesIcon from '@mui/icons-material/FormatShapes';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import PreviewIcon from '@mui/icons-material/Preview';
import PrintIcon from '@mui/icons-material/Print';

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
        Icon={AddchartIcon}
        onClick={() => {
          setIsPopoverOpen(true);
        }}
        enabled={true}
        tooltip="Add a Chart:
Create your own chart and customize it"
      />,
      <RibbonButton
        key={1}
        Icon={FormatShapesIcon}
        onClick={() => {
          addFigure(
            <div className="flex flex-row bg-white justify-center items-center w-64 h-32">
              <p className="text-sm">Text</p>
            </div>,
          );
        }}
        enabled={true}
        tooltip="Add Remarks:
Drag and drop text-box for description."
      />,
      <RibbonButton
        key={2}
        Icon={AutoGraphIcon}
        onClick={() => {}}
        enabled={true}
        tooltip="AI Insights:
Elevate your data with AI generated insights."
      />,
    ],

    right: [
      // Right Ribbon Buttons
      <RibbonButton
        key={0}
        Icon={PreviewIcon}
        onClick={() => {}}
        enabled={true}
        tooltip="Preview Report:
See what report looks like."
      />,
      <RibbonButton
        key={1}
        Icon={PrintIcon}
        onClick={() => {}}
        enabled={true}
        tooltip="Print Report:
Save your report as PDF or Image"
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
