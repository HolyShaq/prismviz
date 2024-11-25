
import React, { useState } from "react";
import { CSSProperties } from "react";
// Import Gemini API SDK
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.API_KEY!);
console.log("API KEY") // Make sure API_KEY is defined in your environment
console.log(process.env.API_KEY) // Make sure API_KEY is defined in your environment
console.log(process.env);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const AIInsights = () => {
  const [userInput, setUserInput] = useState(""); // State to manage user input
  const [response, setResponse] = useState<string | null>(null); // State for API response
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value); // Update state with user's input
  };

  const handleSubmit = async () => {
    if (!userInput.trim()) {
      alert("Please enter a prompt.");
      return;
    }

    setIsLoading(true); // Set loading state
    setResponse(null); // Clear previous response

    try {
      // Send prompt to Gemini API
      const result = await model.generateContent(userInput);
      const generatedText = result.response.text();
      setResponse(generatedText); // Set the response
    } catch (error) {
      console.error("Error generating response:", error);
      setResponse("An error occurred while generating the response. Please try again.");
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div style={styles.insightsContainer}>
      <h4 style={styles.title}>AI Insights</h4>
      <div style={styles.insightContent}>
      
        <ul style={styles.insightList}>
          <li>
           Enter a prompt below to generate AI insights or suggestions.
          </li>
        </ul>
        <div style={styles.inputContainer}>
          <input
            type="text"
            value={userInput}
            onChange={handleInputChange} // Update state on input change
            placeholder="Type your prompt here..."
            style={styles.inputField}
          />
          <button onClick={handleSubmit} style={styles.submitButton} disabled={isLoading}>
            {isLoading ? "Generating..." : "Submit"}
          </button>
        </div>
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
const styles: { [key: string]: CSSProperties } = {
  insightsContainer: {
    width: "300px",
    backgroundColor: "#2D2F41",
    color: "#FFF",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    overflowY: "auto",
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
  insightList: {
    marginTop: "10px",
    paddingLeft: "20px",
  },
  inputContainer: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  inputField: {
    padding: "10px",
    fontSize: "14px",
    borderRadius: "5px",
    border: "1px solid #CCC",
    outline: "none",
    width: "100%",
    color:"black"
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
