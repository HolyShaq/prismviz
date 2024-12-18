import React, { useState, useContext, SyntheticEvent } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import { CsvContext } from "@/lib/CsvContext";
import { filterData, useCategories, useColumns } from "@/lib/utils";
import {
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
  const [titleShow, setTitleShow] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [legendPosition, setLegendPosition] = useState("top");
  const [modalContent, setModalContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const options = defaultChartOptions(column, "", "");
  if (title) options.plugins!.title!.text = title;
  if (!titleShow) options.plugins.title.display = false; // Hide title if disabled
  options.plugins!.legend! = {
    display: showLegend,
    position: legendPosition as "top" | "right" | "bottom" | "left",
  };
  // Remove axis labels
  options.scales = undefined;
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
      Analyze the"${column}" in the provided dataset ${truncatedCsv}.
      Provide meaningful insights. Be brief, direct, and insightful.
    \n` +
      `- Generate a response that states the values of the field directly so the user can understand the answer better and be used for data analytics.`;

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
          <Doughnut options={options} data={donutChartData} />

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
          label="Column"
          axis={column}
          setAxis={setColumn}
          items={columns}
        />

        <TitleSelection
          title={title}
          setTitle={setTitle}
          titleShow={titleShow}
          setTitleShow={setTitleShow}
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
