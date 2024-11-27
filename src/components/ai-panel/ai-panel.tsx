"use client";

import React, { useState, useContext } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { CsvContext } from "../../lib/CsvContext";

const apiKey = process.env.NEXT_PUBLIC_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);
console.log("API KEY") // Make sure API_KEY is defined in your environment
console.log(process.env.NEXT_PUBLIC_API_KEY); // Make sure API_KEY is defined in your environment


const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const AIInsights = () => {
  const { csvData } = useContext(CsvContext);
  const [userPrompt, setUserPrompt] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const createPdfFromCsv = async (data: Record<string, unknown>[]) => {
    const pdfDoc = await PDFDocument.create();

    // Landscape Orientation (Width > Height)
    let page = pdfDoc.addPage([600, 400]); // Adjust size for landscape (width, height)
    const { width, height } = page.getSize();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 10; // Font size for better readability
    const margin = 30; // Margin on the left for content
    const rowHeight = 20; // Height for each row
    const columnWidth = 100; // Adjust the column width
    let yPosition = height - 50; // Start from the top of the page

    // Draw a line across the top for the header
    const headers = Object.keys(data[0]);

    // Function to draw the table headers and rows with borders
    const drawRow = (rowData: string[], yPosition: number, page: any, drawBorder: boolean = false) => {
      rowData.forEach((cell, index) => {
        // Draw text for each column in the row
        page.drawText(cell, {
          x: margin + index * columnWidth, // Horizontal spacing
          y: yPosition,
          size: fontSize,
          font,
        });

        // Draw the border for each cell
        if (drawBorder) {
          page.drawRectangle({
            x: margin + index * columnWidth - 2, // Add space for the left border
            y: yPosition - 2,
            width: columnWidth + 2,
            height: rowHeight + 4,
            borderColor: rgb(0, 0, 0),
            borderWidth: 0.5,
          });
        }
      });
    };

    // Draw headers with borders
    drawRow(headers, yPosition, page, true);
    yPosition -= rowHeight;

    // Draw rows of data
    data.forEach((row) => {
      // Prevent overlapping by checking yPosition
      if (yPosition - rowHeight < 50) {
        page = pdfDoc.addPage([600, 400]); // Add new page if current page is full
        yPosition = height - 50; // Reset yPosition for new page
        drawRow(headers, yPosition, page, true); // Re-draw headers on new page
        yPosition -= rowHeight;
      }

      // Draw the current row of data
      const rowData = headers.map((header) => String(row[header] ?? ""));
      drawRow(rowData, yPosition, page, true);
      yPosition -= rowHeight;
    });

    // Save the PDF and return it
    return await pdfDoc.save();
  };




  const downloadPdf = (pdfBytes: Uint8Array, fileName: string) => {
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    // Create a link element to trigger the download
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;

    // Append the link to the document, click it, and remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Revoke the URL to free up memory
    URL.revokeObjectURL(url);
  };

  const uploadAndProcessPdf = async (pdfBytes: Uint8Array, prompt: string) => {
    try {
      // Download the PDF file (For checking only if its generated correctly)
      downloadPdf(pdfBytes, "Uploaded_CSV_Data.pdf");

      // Convert PDF bytes to a Blob
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const formData = new FormData();
      formData.append("file", blob, "Uploaded_CSV_Data.pdf");

      // Call the API route
      const response = await fetch("pages/api/uploadFile", {
        method: "POST",
        body: JSON.stringify({
          file: blob, // File to upload
          mimeType: "application/pdf", // Ensure MIME type is correct
          displayName: "Uploaded CSV Data",
        }),
        headers: {
          "Content-Type": "application/json", // Correct content type
        },
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`File upload failed: ${errorMessage}`);
      }

      const { fileUri } = await response.json();

      // Generate insights using the uploaded file
      const result = await model.generateContent([
        {
          fileData: {
            mimeType: "application/pdf",
            fileUri,
          },
        },
        { text: prompt },
      ]);

      return result.response.text();
    } catch (error) {
      console.error("Error processing the file:", error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (csvData.length === 0) {
      alert("No CSV data available.");
      return;
    }

    if (!userPrompt.trim()) {
      alert("Please enter a prompt.");
      return;
    }

    setIsLoading(true);
    setResponse(null);

    try {
      // Step 1: Convert CSV data to PDF
      const pdfBytes = await createPdfFromCsv(csvData);

      // Step 2: Upload and process the PDF with the user's prompt
      const insights = await uploadAndProcessPdf(pdfBytes, userPrompt);
      setResponse(insights);
    } catch (error) {
      console.error("Error generating insights:", error);
      setResponse("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div style={styles.insightsContainer}>
      <h4 style={styles.title}>AI Insights</h4>
      <div style={styles.insightContent}>
        <textarea
          style={styles.inputField}
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          placeholder="Type your prompt here..."
        />
        <button
          onClick={handleSubmit}
          style={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Generate Insights"}
        </button>
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

// CSS Styles as JS Objects
const styles: { [key: string]: React.CSSProperties } = {
  insightsContainer: {
    width: "300px",
    backgroundColor: "#2D2F41",
    color: "#FFF",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    overflowY: "auto", // Ensure this uses a valid CSS property value
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  insightContent: {
    fontSize: "14px",
    lineHeight: "1.6",
  },
  inputField: {
    padding: "10px",
    fontSize: "14px",
    borderRadius: "5px",
    border: "1px solid #CCC",
    outline: "none",
    width: "100%",
    color: "black",
  },
  submitButton: {
    padding: "10px",
    fontSize: "14px",
    backgroundColor: "#545469",
    color: "#FFF",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    textAlign: "center",
  },
  responseContainer: {
    marginTop: "20px",
    backgroundColor: "#1F1F33",
    padding: "10px",
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
