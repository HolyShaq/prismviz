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
import defaultChartOptions from "./defaultChartOpts";
import { ResizableBox } from "react-resizable";

ChartJS.register(...registerables);

interface BarProps {
  x: string;
  y?: string;
  yMetric?: string;
}

export const BarChart: React.FC<BarProps> = ({ x, y, yMetric }) => {
  const { csvData } = useContext(CsvContext);

  const minDimensions = { width: 300, height: 166 };
  const [{ width, height }, setDimensions] = useState(minDimensions);
  const onResize = (event: any, { _, size, __ }: any) => {
    setDimensions({ width: size.width, height: size.height });
  };

  const [xAxis, setXAxis] = useState(x);
  const [yAxis, setYAxis] = useState(y);
  const [yMetricAxis, setYMetricAxis] = useState(yMetric);

  const options = defaultChartOptions(xAxis, yAxis!, yMetricAxis!);

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
      },
    ],
  };

  return (
    <ResizableBox
      width={width}
      height={height}
      onResize={onResize}
      minConstraints={[minDimensions.width, minDimensions.height]}
      lockAspectRatio={true}
    >
      <div className="flex items-center justify-center p-4 w-full h-full bg-white">
        <Bar options={options} data={barChartData} />
      </div>
    </ResizableBox>
  );
};
