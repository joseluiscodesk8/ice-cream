"use client";

import dynamic from "next/dynamic";


// Dynamically import the components
const DynamicAudio = dynamic(() => import("../components/DecibelButton"));
// const Gift = dynamic(() => import("../components/Gift"));

export default function Home() {
  return (
    <>
    <DynamicAudio />
    {/* <Gift /> */}
  </>
  );
}
