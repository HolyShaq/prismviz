import React, { useState, useRef } from "react";
import RibbonButton from "./RibbonButton";
import { CreateBarChart } from "./chart_modals/BarChartModals";
import { CreateDonutChart } from "./chart_modals/DonutChartModals";
import { CreateRadialChart } from "./chart_modals/RadialChartModals";
import { CreateBubbleChart } from "./chart_modals/BubbleChartModals";
import { useChartContext } from "../../lib/ChartContext";
import { v4 as uuidv4 } from "uuid";
import { useReactToPrint } from "react-to-print";

// Material UI
import BarChartIcon from "@mui/icons-material/BarChart";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import TollIcon from "@mui/icons-material/Toll";
import BubbleChartIcon from "@mui/icons-material/BubbleChart";
import Popover from "@mui/material/Popover";
import AddchartIcon from "@mui/icons-material/Addchart";
import FormatShapesIcon from "@mui/icons-material/FormatShapes";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import PreviewIcon from "@mui/icons-material/Preview";
import PrintIcon from "@mui/icons-material/Print";
import { Remarks } from "../charts/Remarks";

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
  const { chartsRef, addFigure } = useChartContext();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isBarChartInvoked, setIsBarChartInvoked] = useState(false);
  const [isColumnChartInvoked, setIsColumnChartInvoked] = useState(false);
  const [isDonutChartInvoked, setIsDonutChartInvoked] = useState(false);
  const [isRadialChartInvoked, setIsRadialChartInvoked] = useState(false);
  const [isBubbleChartInvoked, setIsBubbleChartInvoked] = useState(false);
  const reactToPrintFn = useReactToPrint({
    contentRef: chartsRef,
  });

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
            <PopoverButton
              Icon={BarChartIcon}
              label="Column Chart"
              onClick={() => {
                setIsColumnChartInvoked(true);
                setIsPopoverOpen(false);
              }}
            />
          </div>
          <div className="flex flex-row space-x-6">
            <PopoverButton
              Icon={DonutLargeIcon}
              label="Donut Chart"
              onClick={() => {
                setIsDonutChartInvoked(true);
                setIsPopoverOpen(false);
              }}
            />
            <PopoverButton
              Icon={TollIcon}
              label="Radial Chart"
              onClick={() => {
                setIsRadialChartInvoked(true);
                setIsPopoverOpen(false);
              }}
            />
          </div>
          <div className="flex flex-row space-x-6">
            <PopoverButton
              Icon={BubbleChartIcon}
              label="Bubble Chart"
              onClick={() => {
                setIsBubbleChartInvoked(true);
                setIsPopoverOpen(false);
              }}
            />
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
          const chartId = uuidv4();
          addFigure(chartId, <Remarks id={chartId} />);
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
        onClick={() => {
          console.log("Print");
          reactToPrintFn();
        }}
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

      {/* Bar Chart Modals */}
      <CreateBarChart
        invoked={isBarChartInvoked}
        setInvoked={setIsBarChartInvoked}
      />

      {/* Column Chart Modals */}
      <CreateBarChart
        invoked={isColumnChartInvoked}
        setInvoked={setIsColumnChartInvoked}
        columnChart={true}
      />

      {/* Donut Chart Modal */}
      <CreateDonutChart
        invoked={isDonutChartInvoked}
        setInvoked={setIsDonutChartInvoked}
      />

      {/* Radial Chart Modal */}
      <CreateRadialChart
        invoked={isRadialChartInvoked}
        setInvoked={setIsRadialChartInvoked}
      />

      {/* Bubble Chart Modal */}
      <CreateBubbleChart
        invoked={isBubbleChartInvoked}
        setInvoked={setIsBubbleChartInvoked}
      />
    </>
  );
};

export default VisualizeRibbon;
