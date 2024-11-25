import React, { useState, useRef } from "react";
import RibbonButton from "./RibbonButton";
import { CreateBarChart } from "./charts/BarChartModals";
import AIInsights from "../ai-panel/ai-panel"; // Import AIInsights component
import { useChartContext } from "../../lib/ChartContext";

// Material UI
import BarChartIcon from "@mui/icons-material/BarChart";
import PieChartIcon from "@mui/icons-material/PieChart";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import StackedLineChartIcon from "@mui/icons-material/StackedLineChart";
import ScatterPlotIcon from "@mui/icons-material/ScatterPlot";
import FormatShapesIcon from "@mui/icons-material/FormatShapes";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import PreviewIcon from "@mui/icons-material/Preview";
import PrintIcon from "@mui/icons-material/Print";
import Popover from "@mui/material/Popover";
import AddchartIcon from "@mui/icons-material/Addchart";

interface VisualizeRibbonProps {
  left?: boolean;
  right?: boolean;
}

const VisualizeRibbon: React.FC<VisualizeRibbonProps> = ({
  left = false,
  right = false,
}) => {
  // Initialization
  const addChartRef = useRef(null);
  const { addFigure } = useChartContext();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isBarChartInvoked, setIsBarChartInvoked] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(false); // State to toggle AIInsights

  // Components
  const AddChartPopover: React.FC = () => (
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
            label="Bar Chart"
            onClick={() => {
              setIsBarChartInvoked(true);
              setIsPopoverOpen(false);
            }}
          />
          <PopoverButton Icon={PieChartIcon} label="Pie Chart" />
        </div>
        <div className="flex flex-row space-x-6">
          <PopoverButton Icon={ShowChartIcon} label="Line Chart" />
          <PopoverButton Icon={StackedLineChartIcon} label="Area Chart" />
        </div>
        <div className="flex flex-row space-x-6">
          <PopoverButton Icon={ScatterPlotIcon} label="Scatter Chart" />
        </div>
      </div>
    </Popover>
  );

  const PopoverButton = ({ Icon, label, onClick }: any) => (
    <div
      onClick={onClick}
      className="w-24 h-24 rounded-md flex flex-col justify-center items-center outline
        text-[#313154] hover:text-white
        bg-[#b4b4b4]
        hover:bg-[#545469]
        outline-[#545469]"
    >
      <Icon className="text-6xl" />
      <p className="text-sm">{label}</p>
    </div>
  );

  // Button Set Definition
  const VisualizeButtonSet = {
    left: [
      // Left Ribbon Buttons
      <RibbonButton
        ref={addChartRef}
        key={0}
        Icon={AddchartIcon}
        onClick={() => setIsPopoverOpen(true)}
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
            </div>
          );
        }}
        enabled={true}
        tooltip="Add Remarks:
Drag and drop text-box for description."
      />,
      <RibbonButton
        key={2}
        Icon={AutoGraphIcon}
        onClick={() => setShowAIInsights((prev) => !prev)} // Toggle AIInsights on click
        enabled={true}
        tooltip="AI Insights:
Elevate your data with AI-generated insights."
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
See what the report looks like."
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
      {/* Conditionally render AIInsights */}
      {showAIInsights && (
        <div
          style={{
            position: "fixed",
            top: "20%",
            right: "10%",
            zIndex: 1000,
            backgroundColor: "rgba(0,0,0,0.6)",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <AIInsights />
          <button
            onClick={() => setShowAIInsights(false)}
            style={{
              marginTop: "10px",
              padding: "10px",
              backgroundColor: "#545469",
              color: "#FFF",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      )}
    </>
  );
};

export default VisualizeRibbon;
