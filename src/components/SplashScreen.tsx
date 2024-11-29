import React, { useState, useEffect } from "react";

const SplashScreen: React.FC = () => {
  const [showPrimaryLogo, setShowPrimaryLogo] = useState(true);

  useEffect(() => {
    const primaryLogoTimeout = setTimeout(() => {
      setShowPrimaryLogo(false);
    }, 2500);

    return () => clearTimeout(primaryLogoTimeout);
  }, []);

  return (
    <div
      className="flex items-center justify-center h-screen"
      style={{ backgroundColor: "var(--primary-main)" }}
    >
      <img
        src={showPrimaryLogo ? "/name logo revised.svg" : "/PRIMARY LOGO.svg"}
        alt={showPrimaryLogo ? "Primary Name Logo" : "Primary Logo"}
        className="w-64 h-64 animate-fade-in"
      />
    </div>
  );
};

export default SplashScreen;
