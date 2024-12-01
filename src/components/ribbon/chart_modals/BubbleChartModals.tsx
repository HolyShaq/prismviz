import React, { useEffect, useState } from "react";
import StepModal from "./StepModal";
import { useChartContext } from "@/lib/ChartContext";
import { BarChart } from "../../charts/Bar";
import { v4 as uuidv4 } from "uuid";
import { BubbleChart } from "@/components/charts/Bubble";
import { Box, Button, Modal, Slider, Switch } from "@mui/material";
import { sampleSize } from "lodash";

interface CreateBubbleChartProps {
  invoked: boolean;
  setInvoked: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CreateBubbleChart: React.FC<CreateBubbleChartProps> = ({
  invoked,
  setInvoked,
}) => {
  const { addFigure } = useChartContext();

  const [column, setColumn] = useState("");

  const [xAxis, setXAxis] = useState("");
  const [xMetric, setXMetric] = useState("");
  const [xAxisModalOpen, setXAxisModalOpen] = useState(false);

  const [yAxis, setYAxis] = useState("");
  const [yMetric, setYMetric] = useState("");
  const [yAxisModalOpen, setYAxisModalOpen] = useState(false);

  const [radius, setRadius] = useState("");
  const [radiusMetric, setRadiusMetric] = useState("");
  const [radiusModalOpen, setRadiusModalOpen] = useState(false);

  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) {
      const chartId = uuidv4();
      addFigure(
        chartId,
        <BubbleChart
          id={chartId}
          columnInitial={column}
          x={xAxis}
          xMetric={xMetric}
          y={yAxis}
          yMetric={yMetric}
          radius={radius}
          radiusMetric={radiusMetric}
          aggregatedInitial
        />,
      );
      setDone(false);
      setColumn("");
      setXAxis("");
      setXMetric("");
      setYAxis("");
      setYMetric("");
      setRadius("");
      setRadiusMetric("");
    }
  }, [done]);

  return (
    <>
      <StepModal
        header={"Please select a column for the bubble chart"}
        open={invoked}
        onClose={() => {
          setInvoked(false);
        }}
        onConfirm={() => {
          setInvoked(false);
          setXAxisModalOpen(true);
        }}
        setChoice={setColumn}
        categorical
      />

      <StepModal
        header={"Please select a column for the x axis"}
        open={xAxisModalOpen}
        onClose={() => {
          setXAxisModalOpen(false);
        }}
        onConfirm={() => {
          setXAxisModalOpen(false);
          setYAxisModalOpen(true);
        }}
        setChoice={setXAxis}
        setChoiceMetric={setXMetric}
      />

      <StepModal
        header={"Please select a column for the y axis"}
        open={yAxisModalOpen}
        onClose={() => {
          setYAxisModalOpen(false);
        }}
        onConfirm={() => {
          setYAxisModalOpen(false);
          setRadiusModalOpen(true);
        }}
        setChoice={setYAxis}
        setChoiceMetric={setYMetric}
      />

      <StepModal
        header={"Please select a column for the radius"}
        open={radiusModalOpen}
        onClose={() => {
          setRadiusModalOpen(false);
        }}
        onConfirm={() => {
          setRadiusModalOpen(false);
          setDone(true);
        }}
        setChoice={setRadius}
        setChoiceMetric={setRadiusMetric}
      />
    </>
  );
};
