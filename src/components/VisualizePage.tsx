"use client";

import React, { useEffect, useContext, useState } from "react";
import { CsvContext } from "../lib/CsvContext";
import { useStepContext } from "../lib/StepContext";
import { useChartContext } from "../lib/ChartContext";

const VisualizePage: React.FC = () => {
  const { csvData } = useContext(CsvContext);
  const { chartsRef, figures } = useChartContext();
  const { completeCurrentStep } = useStepContext();
  const [isCompleteNotified, setIsCompleteNotified] = useState(false);

  // Notify step context of completion only once when `csvData` is available
  useEffect(() => {
    if (csvData.length > 0 && !isCompleteNotified) {
      completeCurrentStep(); // Mark the step as complete
      setIsCompleteNotified(true);
    }
  }, [csvData, completeCurrentStep, isCompleteNotified]);

  // If `csvData` is empty, show a message and prevent further rendering
  if (csvData.length === 0) {
    return <p>Please complete data cleaning before visualizing.</p>;
  }

  return (
    <div className="h-full w-full max-h-full max-w-full">
      <div ref={chartsRef} className="flex flex-col space-y-2 w-fit pb-64">
        {Object.keys(figures).map((id) => (
          <React.Fragment key={id}>{figures[id]}</React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default VisualizePage;
