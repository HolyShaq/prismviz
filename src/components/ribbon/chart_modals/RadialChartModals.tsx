import React, { useEffect, useState } from "react";
import StepModal from "./StepModal";
import { useChartContext } from "@/lib/ChartContext";
import { RadialChart } from "@/components/charts/Radial";
import { v4 as uuidv4 } from "uuid";

interface CreateRadialChartProps {
  invoked: boolean;
  setInvoked: (invoked: boolean) => void;
}

export const CreateRadialChart: React.FC<CreateRadialChartProps> = ({
  invoked,
  setInvoked,
}) => {
  const { addFigure } = useChartContext();

  const [column, setColumn] = useState("");
  const [circumference, setCircumference] = useState("");
  const [circumferenceMetric, setCircumferenceMetric] = useState("");
  const [circumferenceModalOpen, setCircumferenceModalOpen] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) {
      const chartId = uuidv4();
      addFigure(
        chartId,
        <RadialChart
          id={chartId}
          columnInitial={column}
          circumferenceInitial={circumference}
          circumferenceMetricInitial={circumferenceMetric}
        />,
      );
      setDone(false);
      setColumn("");
      setCircumference("");
      setCircumferenceMetric("");
    }
  }, [done]);

  return (
    <>
      <StepModal
        header="Please select a column for the radial chart"
        open={invoked}
        onClose={() => {
          setInvoked(false);
        }}
        onConfirm={() => {
          setInvoked(false);
          setCircumferenceModalOpen(true);
        }}
        setChoice={setColumn}
        categorical
      />

      <StepModal
        header="Please select a column for the circumference"
        open={circumferenceModalOpen}
        onClose={() => {
          setCircumferenceModalOpen(false);
        }}
        onConfirm={() => {
          setCircumferenceModalOpen(false);
          setDone(true);
        }}
        setChoice={setCircumference}
        setChoiceMetric={setCircumferenceMetric}
        optional
      />
    </>
  );
};
