import React, { useState, useContext, SyntheticEvent } from "react";
import { Bar } from "react-chartjs-2";
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
  AxisLabelSelection,
  ColorSelection,
  ColumnSelection,
  PropertiesDrawer,
  TitleSelection,
} from "./PropertiesDrawer";
import defaultChartOptions from "./defaultChartOpts";
import { ResizableBox, ResizeCallbackData } from "react-resizable";

ChartJS.register(...registerables);

interface BarProps {
  x: string;
  y?: string;
  yMetric?: string;
  id: string;
  columnChart?: boolean;
}

export const BarChart: React.FC<BarProps> = ({
  x,
  y,
  yMetric,
  id,
  columnChart = false,
}) => {
  const { csvData } = useContext(CsvContext);
  const columns = useColumns();
  const numericalColumns = useNumericalColumns();

  // Properties Drawer
  const [open, setOpen] = useState(false);

  // For resizing
  const minDimensions = { width: 300, height: 166 };
  const [width, setWidth] = useState(minDimensions.width);
  const [height, setHeight] = useState(minDimensions.height);
  const onResize = (_e: SyntheticEvent, { size }: ResizeCallbackData) => {
    if (size) {
      setWidth(size.width);
      setHeight(size.height);
    }
  };

  // Involved chart columns
  const [xAxis, setXAxis] = useState(x);
  const [yAxis, setYAxis] = useState(y);
  const [yMetricAxis, setYMetricAxis] = useState(yMetric);

  // General Properties
  const [title, setTitle] = useState("");
  const [titleShow, setTitleShow] = useState(true);
  const [xLabel, setXLabel] = useState("");
  const [xLabelShow, setXLabelShow] = useState(true);
  const [yLabel, setYLabel] = useState("");
  const [yLabelShow, setYLabelShow] = useState(true);
  const [modalContent, setModalContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const options = defaultChartOptions(xAxis, yAxis!, yMetricAxis!);
  if (title) options.plugins.title.text = title; // Set title if it exists
  if (!titleShow) options.plugins.title.display = false; // Hide title if disabled
  if (xLabel) options.scales!.x.title.text = xLabel; // Set x axis label if it exists
  if (yLabel) options.scales!.y.title.text = yLabel; // Set y axis label if it exists
  if (!xLabelShow) options.scales!.x.title.display = false; // Hide x axis label if disabled
  if (!yLabelShow) options.scales!.y.title.display = false; // Hide y axis label if disabled

  if (!columnChart) {
    // Swap x and y axis for column charts
    const _x = options.scales!.x;
    const _y = options.scales!.y;
    options.scales!.x = _y;
    options.scales!.y = _x;
    options.indexAxis = "y" as "x" | "y"; // Set index axis to y (to make the chart vertical)
  }

  const labels = useCategories(xAxis!);

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
  // Modal visibility state
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the event from propagating to the parent container
    setIsModalOpen(true); // Open the modal when button is clicked
  };


  const generatePrompt = () => {
    return `
      Analyze the relationship between "${xAxis}" and "${yAxis}" in the provided dataset.
      Use "${yMetricAxis}" to provide meaningful insights. Be brief, direct, and insightful.
    `;
  };
  // Open modal and fetch insights
  const handleOpenModal = () => {
    setIsModalOpen(true); // Open modal
    fetchInsights(); // Fetch insights
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalContent(null); // Clear content when modal closes
  };

  // Fetch insights from the API
  const fetchInsights = async () => {
    setIsLoading(true); // Start loading
    setModalContent(null); // Clear previous content

    try {
      console.log("IM HERE SA TRY")
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
      setModalContent("An error occurred while generating insights. Please try again.");
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
      >
        <div
          className="flex items-center justify-center p-4 w-full h-full bg-white rounded-md z-50"
          onClick={() => setOpen(true)}
        >
          <Bar options={options} data={barChartData} />
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering parent clicks
              handleOpenModal();
            }}
            className="absolute top-4 right-4 p-2 bg-blue-500 text-white rounded-lg"
          >
            Generate Insights
          </button>
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
          label={columnChart ? "X Axis" : "Y Axis"}
          axis={xAxis}
          setAxis={setXAxis}
          items={columns}
        />

        <ColumnSelection
          label={columnChart ? "Y Axis" : "X Axis"}
          axis={yAxis!}
          setAxis={setYAxis}
          metric={yMetricAxis}
          setMetric={setYMetricAxis}
          items={numericalColumns}
          optional
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

        <ColorSelection color={color} setColor={setColor} />
      </PropertiesDrawer>
    </>
  );
};
