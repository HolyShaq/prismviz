import React, { useState, useContext } from "react";
import { CSSProperties } from "react";
import { CsvContext } from "@/lib/CsvContext"; // Ensure the context is properly provided
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";

const AIInsights = () => {
  const { csvData } = useContext(CsvContext); // Access CSV data
  const [userInput, setUserInput] = useState(""); // State to manage user input
  const [response, setResponse] = useState<string | null>(null); // State for API response
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [alertMessage, setAlertMessage] = useState(""); // State for Alert message
  const [isAlertVisible, setIsAlertVisible] = useState(false); // State for Alert visibility

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value); // Update state with user's input
  };

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

  const handleSubmit = async () => {
    if (!userInput.trim() && !csvData) {
      alert("Please enter a prompt or make sure CSV data is available.");
      return;
    }

    // If userInput is not provided, we want to explicitly show an error
    if (!userInput.trim()) {
      setAlertMessage("Please enter a prompt.");
      setIsAlertVisible(true); // Show alert when prompt is empty
      return;
    }

    setIsLoading(true); // Set loading state
    setResponse(null); // Clear previous response
    setIsAlertVisible(false); // Hide alert when the user submits a prompt

    try {
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
        `- Given the following prompt: ${userInput}\n` +
        `- Generate a response.`;

      // API route to generate content
      const response = await fetch("/api/generate-insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      setResponse(data.text); // Set the response text from the API
    } catch (error) {
      console.error("Error generating response:", error);
      setResponse(
        "An error occurred while generating the response. Please try again.",
      );
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div style={styles.insightsContainer}>
      <h4 style={styles.title}>PrismViz AI Insights</h4>
      <div style={styles.insightContent}>
        <ul style={styles.insightList}>
          <li>Enter a prompt below to generate AI insights or suggestions.</li>
        </ul>
        <div style={styles.inputContainer}>
          <input
            type="text"
            value={userInput}
            onChange={handleInputChange} // Update state on input change
            placeholder="Type your prompt here..."
            style={styles.inputField}
          />
          <button
            onClick={handleSubmit}
            style={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "Submit"}
          </button>
        </div>
        {/* Display the Alert when no prompt is entered */}
        {isAlertVisible && (
          <Stack sx={{ width: "100%" }} spacing={2}>
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              {alertMessage}
            </Alert>
          </Stack>
        )}
        {response && (
          <div style={styles.responseContainer}>
            <h5 style={styles.responseTitle}>Generated Insight:</h5>
            <p style={styles.responseText}>{response}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Updated CSS Styles as JS Objects
const styles: { [key: string]: CSSProperties } = {
  insightsContainer: {
    width: "80%",
    maxWidth: "600px", // Limiting max width to 600px
    height: "auto",
    backgroundColor: "#2D2F41",
    color: "#FFF",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    fontFamily: "Arial, sans-serif",
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 1000,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column", // Ensure content flows vertically
  },
  title: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "15px",
    textAlign: "center",
    position: "relative", // Make space for close button
    background: "linear-gradient(90deg, #ff9a9e, #fad0c4, #fbc2eb, #a18cd1, #5fc3e4, #84fab0, #f6d365)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  insightContent: {
    fontSize: "14px",
    lineHeight: "1.6",
  },
  insightList: {
    marginTop: "10px",
    paddingLeft: "20px",
  },
  inputContainer: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    alignItems: "stretch", // Ensure inputs and button take full width
  },
  inputField: {
    padding: "12px",
    fontSize: "14px",
    borderRadius: "5px",
    border: "1px solid #CCC",
    outline: "none",
    width: "100%",
    color: "black",
  },
  submitButton: {
    padding: "12px",
    fontSize: "14px",
    backgroundColor: "#545469",
    color: "#FFF",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    textAlign: "center",
    width: "100%", // Make button full-width
  },
  responseContainer: {
    marginTop: "20px",
    backgroundColor: "#1F1F33",
    padding: "15px",
    borderRadius: "5px",
    color: "#FFF",
  },
  responseTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "5px",
  },
  responseText: {
    fontSize: "14px",
    lineHeight: "1.4",
  },
};

export default AIInsights;
