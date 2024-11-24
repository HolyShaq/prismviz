import React, { useEffect, useState, useRef } from "react";
import StepModal from "./StepModal";
import { useChartContext } from "@/lib/ChartContext";
import { BarChart } from "../../charts/Bar";

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
  const [yAxis, setYAxis] = useState("");
  const [yMetric, setYMetric] = useState("");
  const [yAxisModalOpen, setYAxisModalOpen] = useState(false);
  const isMounted = useRef(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) {
      addFigure(<BarChart x={xAxis} y={yAxis} yMetric={yMetric} />);
      setDone(false);
      setXAxis("");
      setYAxis("");
      setYMetric("");
    }
  }, [done]);

  return (
    <>
      <StepModal
        header="Please select a column for the x-axis / bars"
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
        header="Please select a column for the y-axis / size"
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
