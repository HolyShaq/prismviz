import React from "react";
import { CSSProperties } from "react";

const AIInsights = () => {
  return (
    <div style ={styles.insightsContainer}>
      <h4 style={styles.title}>AI Insights</h4>
      <div style={styles.insightContent}>
        <p>
          <b>Graph:</b> Employee Productivity Across Departments
        </p>
        <ul style={styles.insightList}>
          <li>
            <b>Insight:</b> The Operations department's productivity has dropped
            30% compared to last quarter, falling below all other departments.
          </li>
          <li>
            <b>Suggestion:</b> Conduct a review to identify bottlenecks, such as
            workflow inefficiencies or resource shortages. Introduce targeted
            training sessions or tools to support the team in meeting
            expectations.
          </li>
        </ul>
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
};


export default AIInsights;
