"use client";

import React, { useEffect } from "react";

interface VisualizePageProps {
  cleanedData: any[];
  onComplete: () => void;
}

const VisualizePage: React.FC<VisualizePageProps> = ({ cleanedData, onComplete }) => {
  useEffect(() => {
    if (cleanedData.length > 0) {
      onComplete(); // Mark the step as complete
    }
  }, [cleanedData]); // Only run when cleanedData changes

  if (!cleanedData || cleanedData.length === 0) {
    return <p>Please complete data cleaning before visualizing.</p>;
  }

  const handleGenerateReport = () => {
    console.log("Generating report based on cleaned data:", cleanedData);
    alert("Report generated successfully!");
  };

  return (
    <div>
      <p>Visualization and Reporting</p>
      <button onClick={handleGenerateReport} className="mt-4 px-4 py-2 bg-green-500 text-white rounded">
        Generate Report
      </button>
    </div>
  );
};

export default VisualizePage;
