# PrismViz

This is a **Data Visualization Tool** built with [Next.js](https://nextjs.org) for processing, visualizing, and exporting data from various sources, primarily designed to handle CSV files and generate interactive charts. This tool is ideal for users looking to explore their data through visual analytics, generate reports, and leverage optional AI insights.

## Features
- **Data Upload and Cleaning**: Easily upload CSV files, remove duplicates, handle missing data, and validate entries.
- **Interactive Data Visualization**: Create dynamic and interactive charts powered by [Chart.js](https://www.chartjs.org/) and [react-chartjs-2](https://github.com/reactchartjs/react-chartjs-2).
- **Report Generation and Printing**: Export reports as PDFs using [jsPDF](https://github.com/parallax/jsPDF) and [html2canvas](https://github.com/niklasvh/html2canvas), or print directly with [react-to-print](https://github.com/gregnb/react-to-print).
- **Optional AI Integration**: Integrate AI-powered data insights with the OpenAI API.

## Getting Started

### Prerequisites
- **Node.js** 20.9.0 or later
- **Package Manager**: Choose one of npm, yarn, pnpm, or bun

### Installation
Clone the repository and install dependencies:

```bash
git clone <your-repo-url>
cd dataviz-tool
npm install
```

### Development Server
Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open http://localhost:3000 in your browser to view the application.

### Editing the Application
You can start modifying the tool by editing the primary page component located in app/page.tsx. Changes made to this file will automatically update in the browser.

### Tech Stack
- Frontend Framework: **Next.js** for a robust, React-based user interface.
- Data Visualization: **Chart.js** and **react-chartjs-2** for interactive charting.
- File Handling: **Papaparse** for parsing CSV files.
- Data Cleaning: **Lodash** and **Pandasjs** for data manipulation.
- PDF Generation and Printing: **jsPDF**, **html2canvas**, and **react-to-print** for report generation.
- State Management: **React Query** for data fetching and caching.
- AI Integration (Optional): **OpenAI API** for AI-powered insights and **dotenv** for managing API keys.

### Usage
1. Upload Data: Use the upload interface to select a CSV file. The tool automatically parses and loads the data.
2. Clean Data: Access options for handling missing values, removing duplicates, and validating entries.
3. Visualize Data: Choose from various chart types to represent your data. Customize labels, colors, and styles.
4. Generate Reports: Save or print visualizations and data summaries as PDFs for sharing or offline analysis.

### Folder Structure
```bash
src/
├── app/
│   ├── page.tsx                # Main entry point for the app
│   ├── layout.tsx              # Layout of the app (global)    
├── components/                 # Reusable components with components for single-URL page (Stepper, Charts, etc.)
│   ├── Stepper.tsx
│   ├── UploadFile.tsx
├── lib/                        # Utility functions (API handling, helpers)
│   ├── dataCleaning.js        # Data manipulation functions
```
