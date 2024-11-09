"use client";


import React, { useState } from "react";
import DecibelButton from "../components/DecibelButton";
import Gift from "../components/Gift";

const Home: React.FC = () => {
  const [showGift, setShowGift] = useState(false);

  const handleMaxDecibelReached = () => {
    // Delay the appearance of the Gift component by 2 seconds (2000 milliseconds)
    setTimeout(() => {
      setShowGift(true);
    }, 1000); 
  };

  const handleRetry = () => {
    setShowGift(false);
  };

  return (
    <>
      <div>
      <DecibelButton
        onMaxDecibelReached={handleMaxDecibelReached}
        onRetry={handleRetry}
        showGift={showGift}
      />
      {showGift && <Gift />}

    </div>
    <span>by: Fresh Market Since 2003</span>
    </>
  );
};

export default Home;