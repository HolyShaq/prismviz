"use client";

import React, { useEffect } from "react";

interface VisualizePageProps {
  cleanedData: any;
  onComplete: () => void;
}

const VisualizePage: React.FC<VisualizePageProps> = ({ cleanedData, onComplete }) => {
  // Mark this step as complete if cleanedData is available
  useEffect(() => {
    if (cleanedData && onComplete) {
      onComplete(); // Signal that this step is complete
    }
  }, [cleanedData, onComplete]);

  if (!cleanedData) {
    return <p>Please complete data cleaning before visualizing.</p>;
  }

  const handleGenerateReport = () => {
    // Placeholder for generating and displaying visualizations or reports
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
