import { useContext } from "react";
import { CsvContext } from "../lib/CsvContext";

// Capitalize the first letter of a string
export const capitalize = (str: any) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Determine the data type of a string
export const determineValueType = (str: string) => {
  // Check if the string is a numerical value
  const num = parseFloat(str);
  if (!isNaN(num)) {
    if (num >= 1000 && num <= 9999) {
      // assume it's a year if it's a 4-digit number
      return "date";
    } else {
      return "number";
    }
  }

  // Check if the string is a date value
  const date = new Date(str);
  if (!isNaN(date.getTime())) {
    return "date";
  }

  // If none of the above, assume it's a word value
  return "string";
};

// Get columns from csvData
export const getColumns = () => {
  const { csvData } = useContext(CsvContext);
  return Object.keys(csvData[0]);
};

// Get numerical columns from csvData
export const getNumericalColumns = () => {
  const { csvData } = useContext(CsvContext);
  return getColumns().filter(
    (key) => determineValueType(String(csvData[0][key])) === "number",
  );
};

// Get categories (unique values) for a given axis/column
export const getCategories = (xAxis: string) => {
  const { csvData } = useContext(CsvContext);
  return [
    ...new Set(
      csvData
        .sort((a: any, b: any) => Number(a[xAxis]) - Number(b[xAxis]))
        .map((row) => row[xAxis]),
    ),
  ];
};

// Get the data for a given yAxis column for all records with xAxis matching the label
export const filterData = (
  csvData: any[],
  label: any,
  xAxis: string,
  yAxis: string,
) => {
  return csvData.filter((row) => row[xAxis] === label).map((row) => row[yAxis]);
};

// Get aggregated data for a given axis/column based on a given metric
export const getAggregatedData = (filteredData: any[], yMetricAxis: string) => {
  switch (yMetricAxis) {
    case "count":
      return filteredData.length;
    case "sum":
      return filteredData.reduce((acc, val) => acc + Number(val), 0);
    case "average":
      return (
        filteredData.reduce((acc, val) => acc + Number(val), 0) /
        filteredData.length
      );
    case "min":
      return Math.min(...filteredData.map((val) => Number(val)));
    case "max":
      return Math.max(...filteredData.map((val) => Number(val)));
    case "median":
      const sortedData = filteredData.sort((a, b) => a - b);
      const middleIndex = Math.floor(sortedData.length / 2);
      return sortedData[middleIndex];
    case "mode":
      const counts: { [key: string]: number } = {};
      filteredData.forEach((val) => {
        counts[val] = (counts[val] || 0) + 1;
      });
      const maxCount = Math.max(...Object.values(counts));
      return Object.keys(counts).find((key) => counts[key] === maxCount);
    default:
      return filteredData.length;
  }
};
