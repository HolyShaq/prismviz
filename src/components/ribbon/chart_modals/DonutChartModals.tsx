import React, { useEffect, useState } from "react";
import StepModal from "./StepModal";
import { useChartContext } from "@/lib/ChartContext";
import { DonutChart } from "../../charts/Donut";
import { v4 as uuidv4 } from "uuid";

interface CreateDonutChartProps {
  invoked: boolean;
  setInvoked: (invoked: boolean) => void;
}

export const CreateDonutChart: React.FC<CreateDonutChartProps> = ({
  invoked,
  setInvoked,
}) => {
  const { addFigure } = useChartContext();

  const [column, setColumn] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) {
      const chartId = uuidv4();
      addFigure(chartId, <DonutChart id={chartId} columnInitial={column} />);
      setDone(false);
      setColumn("");
    }
  }, [done]);

  return (
    <>
      <StepModal
        header="Please select a column for the pie chart"
        open={invoked}
        onClose={() => {
          setInvoked(false);
        }}
        onConfirm={() => {
          setInvoked(false);
          setDone(true);
        }}
        setChoice={setColumn}
        categorical
      />
    </>
  );
};
