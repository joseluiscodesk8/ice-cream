'use client'

import dynamic from "next/dynamic";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Dynamically import the components
const DynamicAudio = dynamic(() => import('../components/DecibelButton'));
const Gift = dynamic(() => import('../components/Gift'));

export default function Home() {
  const [showGift, setShowGift] = useState(false); // State to toggle between DecibelButton and Gift components
  const [, setIsListening] = useState(false); // To track listening state
  
  // Function to trigger after decibels limit is reached
  const handleDecibelsLimitReached = () => {
    setIsListening(false); // Stop listening for decibels
    setTimeout(() => {
      setShowGift(true); // Show the gift after the delay
    }, 1500); // Delay in milliseconds (e.g., 2 seconds)
  };

  const handleGiftReturn = () => {
    setShowGift(false); // Hide the gift and show the DecibelButton
    setTimeout(() => {
      setIsListening(true); // Resume listening after the gift is hidden
    }, 500); // Delay before starting to listen again
  };

  return (
    <div>
      <AnimatePresence>
        {showGift ? (
          <motion.div
            key="gift"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 1 }}
          >
            <Gift onReturn={handleGiftReturn} />
          </motion.div>
        ) : (
          <motion.div
            key="decibelButton"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            <DynamicAudio onLimitReached={handleDecibelsLimitReached} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}



// 'use client'

// import dynamic from "next/dynamic";
// import { useState } from "react";

// // Dynamically import the components
// const DynamicAudio = dynamic(() => import('../components/DecibelButton'));
// const Gift = dynamic(() => import('../components/Gift'));

// export default function Home() {
//   const [showGift, setShowGift] = useState(false); // State to toggle between DecibelButton and Gift components

//   const handleGiftReturn = () => {
//     setShowGift(false); // Hide the gift and show the DecibelButton
//   };

//   return (
//     <div>
//       {showGift ? (
//         // Show Gift component when the decibel limit is exceeded
//         <Gift onReturn={handleGiftReturn} />
//       ) : (
//         // Show DecibelButton component
//         <DynamicAudio onLimitReached={() => setShowGift(true)} />
//       )}
//     </div>
//   );
// }
