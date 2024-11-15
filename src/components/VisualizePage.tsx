"use client";

import React, { useEffect, useContext, useState } from "react";
import { CsvContext } from "../lib/CsvContext";

interface VisualizePageProps {
  onComplete: () => void;
}

const VisualizePage: React.FC<VisualizePageProps> = ({ onComplete }) => {
  const { csvData } = useContext(CsvContext);
  const [isCompleteNotified, setIsCompleteNotified] = useState(false); // Improved naming for clarity

  // Notify parent component of completion only once when `csvData` is available
  useEffect(() => {
    if (csvData.length > 0 && !isCompleteNotified) {
      onComplete();
      setIsCompleteNotified(true);
    }
  }, [csvData, onComplete, isCompleteNotified]);

  // If `csvData` is empty, show a message and prevent further rendering
  if (csvData.length === 0) {
    return <p>Please complete data cleaning before visualizing.</p>;
  }

  const handleReportGeneration = () => {
    console.log("Generating report based on cleaned data:", csvData);
    alert("Report generated successfully!");
  };

  return (
    <div>
      <h2>Visualization and Reporting</h2>
      <button
        onClick={handleReportGeneration}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
      >
        Generate Report
      </button>
    </div>
  );
};

export default VisualizePage;
