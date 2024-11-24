import React, { useState, useContext } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import { CsvContext } from "@/lib/CsvContext";

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
        text: "Hello Owrld",
      },
    },
  };

  const labels = [...new Set(csvData.map((row) => row[xAxis]))];
  const data: any[] = [];
  const getAggregatedData = (label: string | unknown) => {
    const filteredData: any[] = csvData
      .filter((row) => row[xAxis] === label)
      .map((row) => row[yAxis!]);

    switch (yMetricAxis) {
      case "count":
        return filteredData.length;
      case "sum":
        return filteredData.reduce((acc, val) => acc + Number(val), 0);
      case "average":
        return (
          filteredData.reduce((acc, val) => acc + Number(val), 0) /
          filteredData.length
        );
      case "min":
        return Math.min(...filteredData.map((val) => Number(val)));
      case "max":
        return Math.max(...filteredData.map((val) => Number(val)));
      case "median":
        const sortedData = filteredData.sort((a, b) => a - b);
        const middleIndex = Math.floor(sortedData.length / 2);
        return sortedData[middleIndex];
      case "mode":
        const counts: { [key: string]: number } = {};
        filteredData.forEach((val) => {
          counts[val] = (counts[val] || 0) + 1;
        });
        const maxCount = Math.max(...Object.values(counts));
        return Object.keys(counts).find((key) => counts[key] === maxCount);
      default:
        return filteredData.length;
    }
  };

  labels.map((label) => data.push(getAggregatedData(label)));

  const barChartData = {
    labels: labels,
    datasets: [
      {
        label: "",
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
