import React, { useState, useContext } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import { CsvContext } from "@/lib/CsvContext";
import {
  getCategories,
  filterData,
  getAggregatedData,
  getColumns,
  getNumericalColumns,
} from "@/lib/utils";
import {
  ColorSelection,
  ColumnSelection,
  PropertiesDrawer,
  TitleSelection,
} from "./PropertiesDrawer";
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
  const columns = getColumns();
  const numericalColumns = getNumericalColumns();

  // Properties Drawer
  const [open, setOpen] = useState(false);

  // For resizing
  const minDimensions = { width: 300, height: 166 };
  const [width, setWidth] = useState(minDimensions.width);
  const [height, setHeight] = useState(minDimensions.height);
  const onResize = (event: any, { _, size, __ }: any) => {
    setWidth(size.width);
    setHeight(size.height);
  };

  // Involved chart columns
  const [xAxis, setXAxis] = useState(x);
  const [yAxis, setYAxis] = useState(y);
  const [yMetricAxis, setYMetricAxis] = useState(yMetric);

  // General Properties
  const [title, setTitle] = useState("");
  const [xAxisLabel, setXAxisLabel] = useState("");
  const [yAxisLabel, setYAxisLabel] = useState("");

  var options = defaultChartOptions(xAxis, yAxis!, yMetricAxis!);
  if (title) options.plugins!.title!.text = title;
  const labels = getCategories(xAxis!);

  // Color properties
  const [color, setColor] = useState("#36a2eb");

  // Data
  const data = labels.map((label) => {
    const filteredData = filterData(csvData, label, xAxis, yAxis!);
    return getAggregatedData(filteredData, yMetricAxis!);
  });

  const barChartData = {
    labels: labels,
    datasets: [
      {
        data: data,
        backgroundColor: color,
      },
    ],
  };

  return (
    <>
      <div
        onClick={() => {
          console.log("gaga");
          setOpen(true);
        }}
      >
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
      </div>

      <PropertiesDrawer open={open} setOpen={setOpen}>
        <ColumnSelection
          label="X Axis"
          axis={xAxis}
          setAxis={setXAxis}
          items={columns}
        />

        <ColumnSelection
          label="Y Axis"
          axis={yAxis!}
          setAxis={setYAxis}
          metric={yMetricAxis}
          setMetric={setYMetricAxis}
          items={numericalColumns}
          optional
        />

        <TitleSelection title={title} setTitle={setTitle} />

        <ColorSelection color={color} setColor={setColor} />
      </PropertiesDrawer>
    </>
  );
};
