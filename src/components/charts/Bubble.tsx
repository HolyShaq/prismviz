import React, { useState, useContext, SyntheticEvent } from "react";
import { Bar, Bubble } from "react-chartjs-2";
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
  ColorSelection,
  ColumnSelection,
  LegendOption,
  PropertiesDrawer,
  AxisLabelSelection,
  SampleOption,
  ScaleRadius,
  TitleSelection,
} from "./PropertiesDrawer";
import defaultChartOptions from "./defaultChartOpts";
import { ResizableBox, ResizeCallbackData } from "react-resizable";
import { Box, Button, Modal, Slider, Switch } from "@mui/material";

ChartJS.register(...registerables);

interface BubbleChartProps {
  columnInitial: string;
  x: string;
  xMetric?: string;
  y: string;
  yMetric?: string;
  radius: string;
  radiusMetric?: string;
  aggregatedInitial?: boolean;
  sampleSizeInitial?: number;
  id: string;
}
export const BubbleChart: React.FC<BubbleChartProps> = ({
  columnInitial,
  x,
  xMetric,
  y,
  yMetric,
  radius,
  radiusMetric,
  aggregatedInitial = true,
  sampleSizeInitial = 30,
  id,
}) => {
  const { csvData } = useContext(CsvContext);
  const columns = useColumns();
  const numericalColumns = useNumericalColumns();

  // Properties Drawer
  const [open, setOpen] = useState(false);

  // For resizing
  const minDimensions = { width: 400, height: 266 };
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
  const [xAxis, setXAxis] = useState(x);
  const [xMetricAxis, setXMetricAxis] = useState(xMetric);
  const [yAxis, setYAxis] = useState(y);
  const [yMetricAxis, setYMetricAxis] = useState(yMetric);
  const [radiusAxis, setRadiusAxis] = useState(radius);
  const [radiusMetricAxis, setRadiusMetricAxis] = useState(radiusMetric);

  // General Properties
  const [title, setTitle] = useState("");
  const [xLabel, setXLabel] = useState("");
  const [xLabelShow, setXLabelShow] = useState(true);
  const [yLabel, setYLabel] = useState("");
  const [yLabelShow, setYLabelShow] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [legendPosition, setLegendPosition] = useState("top");
  const [sampleEnabled, setSampleEnabled] = useState(false);
  const [sampleSize, setSampleSize] = useState(sampleSizeInitial);
  const [scaleRadius, setScaleRadius] = useState(true);
  const [radiusRange, setRadiusRange] = useState<[number, number]>([10, 40]);

  const options = defaultChartOptions(xAxis, yAxis!, yMetricAxis!);
  options.plugins.title.text = "Bubble Chart";
  if (xLabel) options.scales!.x.title.text = xLabel; // Set x axis label if it exists
  if (yLabel) options.scales!.y.title.text = yLabel; // Set y axis label if it exists
  if (!xLabelShow) options.scales!.x.title.display = false; // Hide x axis label if disabled
  if (!yLabelShow) options.scales!.y.title.display = false; // Hide y axis label if disabled
  options.plugins!.legend! = {
    display: showLegend,
    position: legendPosition as "top" | "right" | "bottom" | "left",
  };
  if (scaleRadius) {
    options.plugins!.tooltip!.callbacks = {
      label: (context: any) => {
        const items = context.formattedValue.slice(1, -1).split(",");
        items.pop();
        return `${context.label}: (${items.join(", ")})`;
      },
    };
  }
  if (title) options.plugins.title.text = title; // Set title if it exists
  const labels = useCategories(column!);

  const data = labels.map((label) => {
    const xData = filterData(csvData, label, column, xAxis!);
    const yData = filterData(csvData, label, column, yAxis!);

    let radiusData = filterData(csvData, label, column, radiusAxis!);
    if (scaleRadius) {
      const minRadius = Math.min(...radiusData.map((val) => Number(val)));
      const maxRadius = Math.max(...radiusData.map((val) => Number(val)));
      const originalRange = maxRadius - minRadius;
      radiusData = radiusData.map(
        (val) =>
          ((Number(val) - minRadius) / originalRange) *
            (radiusRange[1] - radiusRange[0]) +
          radiusRange[0],
      );
    }

    if (!sampleEnabled) {
      return [
        {
          x: getAggregatedData(xData, xMetricAxis!),
          y: getAggregatedData(yData, yMetricAxis!),
          r: getAggregatedData(radiusData, radiusMetricAxis!),
        },
      ];
    } else {
      return xData.slice(0, sampleSize).map((value, index) => {
        return {
          x: value,
          y: yData[index],
          r: radiusData[index],
        };
      });
    }
  });

  const bubbleChartData = {
    type: "bubble",
    labels: labels,

    datasets: data.map((val, index) => ({
      label: labels[index] as string,
      data: val,
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
          <Bubble options={options} data={bubbleChartData} />
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
          label="X Axis"
          axis={xAxis}
          setAxis={setXAxis}
          metric={xMetricAxis}
          setMetric={setXMetricAxis}
          items={numericalColumns}
          aggregated={!sampleEnabled}
        />

        <ColumnSelection
          label="Y Axis"
          axis={yAxis}
          setAxis={setYAxis}
          metric={yMetricAxis}
          setMetric={setYMetricAxis}
          items={numericalColumns}
          aggregated={!sampleEnabled}
        />

        <ColumnSelection
          label="Radius Axis"
          axis={radiusAxis}
          setAxis={setRadiusAxis}
          metric={radiusMetricAxis}
          setMetric={setRadiusMetricAxis}
          items={numericalColumns}
          aggregated={!sampleEnabled}
        />

        <SampleOption
          enabled={sampleEnabled}
          setEnabled={setSampleEnabled}
          sampleSize={sampleSize}
          setSampleSize={setSampleSize}
        />

        <ScaleRadius
          enabled={scaleRadius}
          setEnabled={setScaleRadius}
          radiusRange={radiusRange}
          setRadiusRange={setRadiusRange}
        />

        <TitleSelection title={title} setTitle={setTitle} />
        <AxisLabelSelection
          xLabel={xLabel}
          setXLabel={setXLabel}
          xLabelShow={xLabelShow}
          setXLabelShow={setXLabelShow}
          yLabel={yLabel}
          setYLabel={setYLabel}
          yLabelShow={yLabelShow}
          setYLabelShow={setYLabelShow}
        />
        <LegendOption
          showLegend={showLegend}
          setShowLegend={setShowLegend}
          legendPosition={legendPosition}
          setLegendPosition={setLegendPosition}
        />
      </PropertiesDrawer>
    </>
  );
};
