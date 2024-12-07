import React, { useEffect, useState } from "react";
import StepModal from "./StepModal";
import { useChartContext } from "@/lib/ChartContext";
import { BarChart } from "../../charts/Bar";
import { v4 as uuidv4 } from "uuid";

interface CreateBarChartProps {
  invoked: boolean;
  setInvoked: (invoked: boolean) => void;
  columnChart?: boolean;
}

export const CreateBarChart: React.FC<CreateBarChartProps> = ({
  invoked,
  setInvoked,
  columnChart = false,
}) => {
  const { addFigure } = useChartContext();

  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [yMetric, setYMetric] = useState("");
  const [yAxisModalOpen, setYAxisModalOpen] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) {
      const chartId = uuidv4();
      addFigure(
        chartId,
        <BarChart
          id={chartId}
          x={xAxis}
          y={yAxis}
          yMetric={yMetric}
          columnChart={columnChart}
        />,
      );
      setDone(false);
      setXAxis("");
      setYAxis("");
      setYMetric("");
    }
  }, [done]);

  return (
    <>
      <StepModal
        header={
          "Please select a column for the " +
          (columnChart ? "x-axis" : "y-axis") +
          " / bars"
        }
        open={invoked}
        onClose={() => {
          setInvoked(false);
        }}
        onConfirm={() => {
          setInvoked(false);
          setYAxisModalOpen(true);
        }}
        setChoice={setXAxis}
        categorical
      />

      <StepModal
        header={
          "Please select a column for the " +
          (columnChart ? "y-axis" : "x-axis") +
          " / bars"
        }
        open={yAxisModalOpen}
        onClose={() => {
          setYAxisModalOpen(false);
        }}
        onConfirm={() => {
          setYAxisModalOpen(false);
          setDone(true);
        }}
        setChoice={setYAxis}
        setChoiceMetric={setYMetric}
        optional
      />
    </>
  );
};
