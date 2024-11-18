"use client";

import React, { useEffect, useContext, useState } from "react";
import { CsvContext } from "../lib/CsvContext";
import { useStepContext } from "../lib/StepContext";

const VisualizePage: React.FC = () => {
  const { csvData } = useContext(CsvContext);
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

  const handleReportGeneration = () => {
    console.log("Generating report based on cleaned data:", csvData);
    alert("Report generated successfully!");
  };

  return <div></div>;
};

export default VisualizePage;
