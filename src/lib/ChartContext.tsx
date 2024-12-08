"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type ChartContextType = {
  figures: { [key: string]: ReactNode };
  addFigure: (id: string, figure: ReactNode) => void;
  removeFigure: (index: string) => void;
};

export const ChartContext = createContext<ChartContextType | undefined>(
  undefined,
);

export const ChartContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [figures, setFigures] = useState<{ [key: string]: ReactNode }>({});

  const addFigure = (id: string, figure: ReactNode) => {
    setFigures((prevFigures) => ({
      ...prevFigures,
      [id]: figure,
    }));
  };

  const removeFigure = (idToRemove: string) => {
    setFigures((prevFigures) => {
      const newFigures = { ...prevFigures };
      delete newFigures[idToRemove];
      return newFigures;
    });
  };

  return (
    <ChartContext.Provider value={{ figures, addFigure, removeFigure }}>
      {children}
    </ChartContext.Provider>
  );
};

export const useChartContext = () => {
  const context = useContext(ChartContext);
  if (!context) {
    throw new Error(
      "useChartContext must be used within a ChartContextProvider",
    );
  }
  return context;
};
