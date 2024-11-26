import React, { useState, useContext } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import { CsvContext } from "@/lib/CsvContext";
import {
  capitalize,
  getCategories,
  filterData,
  getAggregatedData,
} from "@/lib/utils";

ChartJS.register(...registerables);

interface BarProps {
  x: string;
  y?: string;
  yMetric?: string;
}

export const BarChart: React.FC<BarProps> = ({ x, y, yMetric }) => {
  const { csvData } = useContext(CsvContext);

  const [xAxis, setXAxis] = useState(x);
  const [yAxis, setYAxis] = useState(y);
  const [yMetricAxis, setYMetricAxis] = useState(yMetric);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text:
          (yAxis ? capitalize(yMetricAxis) + " " + yAxis + " per " : "") +
          xAxis,
      },
    },
  };

  const labels = getCategories(xAxis!);
  const data = labels.map((label) => {
    const filteredData = filterData(label, xAxis, yAxis!);
    return getAggregatedData(filteredData, yMetricAxis!);
  });

  const barChartData = {
    labels: labels,
    datasets: [
      {
        data: data,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <div className="flex items-center justify-center p-4 w-fit h-fit max-h-96 bg-white">
      <Bar options={options} data={barChartData} />
    </div>
  );
};
