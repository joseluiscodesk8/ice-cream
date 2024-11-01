'use client'

import dynamic from "next/dynamic";

const DynamicAudio = dynamic(() => import('../components/DecibelButton'));

export default function Home() {
  return (
    <DynamicAudio />
  );
}
