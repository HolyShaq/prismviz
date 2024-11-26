import { useContext } from "react";
import { CsvContext } from "../lib/CsvContext";

// Capitalize the first letter of a string
export const capitalize = (str: any) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Get categories (unique values) for a given axis/column
export const getCategories = (xAxis: string) => {
  const { csvData } = useContext(CsvContext);
  return [
    ...new Set(
      csvData
        .map((row) => row[xAxis])
        .sort((a: any, b: any) => Number(a[xAxis]) - Number(b[xAxis])),
    ),
  ];
};

// Get the data for a given yAxis column for all records with xAxis matching the label
export const filterData = (label: any, xAxis: string, yAxis: string) => {
  const { csvData } = useContext(CsvContext);
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
