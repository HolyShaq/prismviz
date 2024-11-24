import React, { useState } from "react";
import StepModal from "./StepModal";
import { useChartContext } from "@/lib/ChartContext";

interface CreateBarChartProps {
  invoked: boolean;
  setInvoked: (invoked: boolean) => void;
}

export const CreateBarChart: React.FC<CreateBarChartProps> = ({
  invoked,
  setInvoked,
}) => {
  const { addFigure } = useChartContext();

  const [xAxis, setXAxis] = useState("");
  const [xMetric, setXMetric] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [yAxisModalOpen, setYAxisModalOpen] = useState(false);

  const handleConfirm = () => {
    console.log("X:", xAxis, xMetric);
    console.log("Y:", yAxis);
  };

  return (
    <>
      <StepModal
        header="Please select a column for the x-axis"
        open={invoked}
        onClose={() => {
          setInvoked(false);
        }}
        onConfirm={() => {
          setInvoked(false);
          setYAxisModalOpen(true);
        }}
        setChoice={setXAxis}
        setChoiceMetric={setXMetric}
        mustBeNumber
      />

      <StepModal
        header="Please select a column for the y-axis"
        open={yAxisModalOpen}
        onClose={() => {
          setYAxisModalOpen(false);
        }}
        onConfirm={() => {
          setYAxisModalOpen(false);
          handleConfirm();
          //addFigure(
          //  <div className="flex flex-col items-center justify-center h-64 w-64 bg-white">
          //    <p className="text-lg bold">Bar Chart!</p>
          //  </div>,
          //);
        }}
        setChoice={setYAxis}
        optional
      />
    </>
  );
};
