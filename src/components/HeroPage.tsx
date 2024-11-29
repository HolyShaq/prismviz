import React from "react";

const HeroPage: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  return (
    <div
      className="flex flex-col items-center justify-center h-screen px-16"
      style={{ backgroundColor: "var(--primary-main)" }}
    >
      {/* Content Container */}
      <div className="flex flex-col items-center text-center space-y-0 max-w-screen-md">
        {/* Heading */}
        <h1
          className="font-medium"
          style={{
            color: "var(--primary-surface)",
            fontSize: "var(--font-size-h4)",
          }}
        >
          Turn your data into magic with
        </h1>

        {/* Logo */}
        <img
          src="/name logo revised.svg"
          alt="PrismViz Logo"
          className="w-128 h-64"
        />

        {/* Description */}
        <p
          className="leading-relaxed max-w-2xl px-6"
          style={{
            color: "var(--primary-pressed)",
            fontSize: "var(--font-size-p1)",
            lineHeight: "var(--line-height-paragraph)",
          }}
        >
          PrismViz is a Next.js-based interactive data visualization web
          application system with a primary focus on data report generation. It
          is designed to transform raw data into insightful, actionable reports.
        </p>

        {/* Get Started Button */}
        <button
          onClick={onGetStarted}
          className="px-8 py-4 text-lg font-semibold text-white bg-primary-hover rounded-lg shadow-lg hover:bg-primary-pressed transition"
          style={{
            marginTop: "var(--spacing-md)",
          }}
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default HeroPage;
