import React, { useState, useContext, SyntheticEvent } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import { CsvContext } from "@/lib/CsvContext";
import {
  useCategories,
  filterData,
  getAggregatedData,
  useColumns,
  useNumericalColumns,
} from "@/lib/utils";
import {
  CircumferenceSlider,
  ColumnSelection,
  LegendOption,
  PropertiesDrawer,
  TitleSelection,
} from "./PropertiesDrawer";
import defaultChartOptions from "./defaultChartOpts";
import { ResizableBox, ResizeCallbackData } from "react-resizable";

ChartJS.register(...registerables);

interface RadialChartProps {
  columnInitial: string;
  id: string;
  circumferenceInitial: string;
  circumferenceMetricInitial?: string;
}

export const RadialChart: React.FC<RadialChartProps> = ({
  columnInitial,
  id,
  circumferenceInitial,
  circumferenceMetricInitial,
}) => {
  const { csvData } = useContext(CsvContext);
  const columns = useColumns();
  const numericalColumns = useNumericalColumns();

  // Properties Drawer
  const [open, setOpen] = useState(false);

  // For resizing
  const minDimensions = { width: 300, height: 300 };
  const [width, setWidth] = useState(minDimensions.width);
  const [height, setHeight] = useState(minDimensions.height);
  const onResize = (_e: SyntheticEvent, { size }: ResizeCallbackData) => {
    if (size) {
      setWidth(size.width);
      setHeight(size.height);
    }
  };

  // Involved chart columns
  const [column, setColumn] = useState(columnInitial);
  const [circumference, setCircumference] = useState(circumferenceInitial);
  const [circumferenceMetric, setCircumferenceMetric] = useState(
    circumferenceMetricInitial,
  );

  // General Properties
  const [title, setTitle] = useState("");
  const [showLegend, setShowLegend] = useState(true);
  const [legendPosition, setLegendPosition] = useState("top");
  const [maxCircumference, setMaxCircumference] = useState(270);

  const options = defaultChartOptions(
    column,
    circumference,
    circumferenceMetric!,
  );
  if (title) options.plugins.title.text = title; // Set title if it exists
  options.plugins!.legend! = {
    ...options.plugins!.legend!,
    display: showLegend,
    position: legendPosition as "top" | "right" | "bottom" | "left",
  };
  options.plugins!.tooltip!.callbacks = {
    title: () => "",
  };
  const labels = useCategories(column!).map((val) => String(val));

  options.plugins.legend = {
    ...options.plugins.legend,
    ...{
      labels: {
        generateLabels: (chart: any) => {
          const data = chart.data as any;
          return data.labels.map((label: string, index: number) => ({
            text: label,
            fillStyle: data.datasets[index].backgroundColor,
            strokeStyle: data.datasets[index].backgroundColor,
          }));
        },
      },
    },
  };

  // Data
  const data = labels.map((label) => {
    const filteredData = filterData(csvData, label, column, circumference);
    return getAggregatedData(filteredData, circumferenceMetric!);
  });
  const maximum = Math.max(...data.map((val) => Number(val)));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const donutChartData = {
    type: "doughnut",
    labels: labels,

    datasets: data.map((val, index) => ({
      label: labels[index],
      data: [val],
      circumference: (Number(val) / maximum) * maxCircumference,
    })),
  };

  return (
    <>
      <ResizableBox
        width={width}
        height={height}
        onResize={onResize}
        minConstraints={[minDimensions.width, minDimensions.height]}
        lockAspectRatio={true}
      >
        <div
          className="flex items-center justify-center p-4 w-full h-full bg-white z-50"
          onClick={() => setOpen(true)}
        >
          <Doughnut options={options} data={donutChartData} />
        </div>
      </ResizableBox>

      <PropertiesDrawer id={id} open={open} setOpen={setOpen}>
        <ColumnSelection
          label="Column"
          axis={column}
          setAxis={setColumn}
          items={columns}
        />

        <ColumnSelection
          label="Circumference"
          axis={circumference}
          setAxis={setCircumference}
          items={numericalColumns}
          optional
        />

        <TitleSelection title={title} setTitle={setTitle} />
        <LegendOption
          showLegend={showLegend}
          setShowLegend={setShowLegend}
          legendPosition={legendPosition}
          setLegendPosition={setLegendPosition}
        />

        <CircumferenceSlider
          circumference={maxCircumference}
          setCircumference={setMaxCircumference}
        />
      </PropertiesDrawer>
    </>
  );
};
