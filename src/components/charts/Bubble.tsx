import React, { useState, useContext, SyntheticEvent } from "react";
import { Bubble } from "react-chartjs-2";
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
import AssistantIcon from "@mui/icons-material/Assistant";

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
  const [titleShow, setTitleShow] = useState(true);
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
  const [modalContent, setModalContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const options = defaultChartOptions(xAxis, yAxis!, yMetricAxis!);
  options.plugins.title.text = "Bubble Chart";
  if (!titleShow) options.plugins.title.display = false; // Hide title if disabled
  if (xLabel) options.scales!.x.title.text = xLabel; // Set x axis label if it exists
  if (yLabel) options.scales!.y.title.text = yLabel; // Set y axis label if it exists
  if (!xLabelShow) options.scales!.x.title.display = false; // Hide x axis label if disabled
  if (!yLabelShow) options.scales!.y.title.display = false; // Hide y axis label if disabled
  options.plugins!.legend! = {
    display: showLegend,
    position: legendPosition as "top" | "right" | "bottom" | "left",
  };

  /* eslint-disable  @typescript-eslint/no-explicit-any */
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
  // Modal visibility state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to convert CSV data (array of objects) to a CSV string
  const convertCsvDataToString = (
    csvData: Record<string, unknown>[],
  ): string => {
    if (csvData.length === 0) return "";

    const headers = Object.keys(csvData[0]); // Extract column names from the first object
    const rows = csvData.map(
      (row) => headers.map((header) => row[header] ?? "").join(","), // Join the values in each row by commas
    );

    return [headers.join(","), ...rows].join("\n");
  };

  // Function to truncate CSV string by rows, excluding the header
  const truncateCsvByRows = (
    csvString: string,
    numRows: number = 500,
  ): string => {
    const rows = csvString.split("\n"); // Split by newline to get rows
    const header = rows[0];
    const dataRows = rows.slice(1); // The rest are data rows

    const truncatedDataRows = dataRows.slice(0, numRows); // Truncate the data rows to 'numRows'

    return [header, ...truncatedDataRows].join("\n");
  };

  const generatePrompt = () => {
    const csvString = convertCsvDataToString(csvData);
    const truncatedCsv = csvString ? truncateCsvByRows(csvString, 500) : "";
    // Combine truncated CSV data with context and user input
    const instructions =
      "You are an expert data analyst. Answer briefly and straight to the point. Do NOT say the size of the dataset. If no question or command was given, do not give an analysis. Answer with confidence.";
    const context = `The CSV data provided is truncated to 500 rows. The original dataset has ${csvData.length} rows. Take into account this limitation and adjust your answers accordingly. Do not mention this feature of the dataset in your response.`;
    const prompt =
      `Instructions: ${instructions} \n` +
      `Context: ${context} \n` +
      `- Given the following CSV data: ${truncatedCsv}\n` +
      `- 
        Analyze the relationship between "${xAxis}" and "${yAxis}" in the provided dataset ${truncatedCsv}.
        Use "${yMetricAxis}" to provide meaningful insights. Be brief, direct, and insightful.
      \n` +
      `- Generate a response that states the values of the field directly so the user can understand the answer better and be used for data analytics. Please just use the highest and lowest values for your response.`;

    return prompt;
  };
  // Open modal and fetch insights
  const handleOpenModal = () => {
    setIsModalOpen(true); // Open modal
    fetchInsights(); // Fetch insights
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Fetch insights from the API
  const fetchInsights = async () => {
    if (modalContent) return; // Don't fetch if there are insights already

    setIsLoading(true); // Start loading
    setModalContent(null); // Clear previous content

    try {
      console.log("IM HERE SA TRY");
      const prompt = generatePrompt();
      const truncatedCsv = csvData.slice(0, 500); // Optional truncation for large datasets

      const response = await fetch("/api/generate-insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, csvData: truncatedCsv }),
      });

      const data = await response.json();
      setModalContent(data.text); // Set the response content
    } catch (error) {
      console.error("Error fetching insights:", error);
      setModalContent(
        "An error occurred while generating insights. Please try again.",
      );
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <>
      <ResizableBox
        width={width}
        height={height}
        onResize={onResize}
        minConstraints={[minDimensions.width, minDimensions.height]}
        lockAspectRatio={true}
        className="group"
      >
        <div
          className="flex items-center justify-center p-4 w-full h-full bg-white rounded-md z-50"
          onClick={() => setOpen(true)}
        >
          <Bubble options={options} data={bubbleChartData} />
          <AssistantIcon
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering parent clicks
              handleOpenModal();
            }}
            className="absolute top-4 right-4 size-8 text-blue-500 rounded-lg opacity-0 group-hover:opacity-100 cursor-pointer"
          />
        </div>
      </ResizableBox>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">AI Insights</h2>
            {isLoading ? (
              <p>Loading insights...</p>
            ) : (
              <p>{modalContent || "No insights available."}</p>
            )}
            <div className="flex justify-end mt-4">
              <button
                onClick={handleCloseModal}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
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

        <TitleSelection
          title={title}
          setTitle={setTitle}
          titleShow={titleShow}
          setTitleShow={setTitleShow}
        />

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
