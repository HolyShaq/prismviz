import React, { useState, useContext, SyntheticEvent } from "react";
import { Doughnut, Pie } from "react-chartjs-2";
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
  TitleSelection,
} from "./PropertiesDrawer";
import defaultChartOptions from "./defaultChartOpts";
import { ResizableBox, ResizeCallbackData } from "react-resizable";

ChartJS.register(...registerables);

interface DonutProps {
  columnInitial: string;
  id: string;
}

export const DonutChart: React.FC<DonutProps> = ({ columnInitial, id }) => {
  const { csvData } = useContext(CsvContext);
  const columns = useColumns();

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

  // General Properties
  const [title, setTitle] = useState("");
  const [showLegend, setShowLegend] = useState(true);
  const [legendPosition, setLegendPosition] = useState("top");

  const options = defaultChartOptions(column, "", "");
  if (title) options.plugins!.title!.text = title;
  options.plugins!.legend! = {
    display: showLegend,
    position: legendPosition as "top" | "right" | "bottom" | "left",
  };
  const labels = useCategories(column!);

  // Data
  const data = labels.map(
    (label) => filterData(csvData, label, column, "").length,
  );

  const donutChartData = {
    type: "doughnut",
    labels: labels,
    datasets: [
      {
        data: data,
      },
    ],
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

        <TitleSelection title={title} setTitle={setTitle} />
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
