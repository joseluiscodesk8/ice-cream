import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import styles from "../styles/index.module.scss";

interface DecibelButtonProps {
  onMaxDecibelReached: () => void;
  onRetry: () => void;
  showGift: boolean;
}

const DecibelButton: React.FC<DecibelButtonProps> = ({ onMaxDecibelReached, onRetry, showGift }) => {
  const [decibels, setDecibels] = useState<number>(0);
  const [isListening, setIsListening] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  const maxDecibels = 70;

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
      microphoneRef.current.connect(analyserRef.current);
      setIsListening(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopListening = () => {
    if (microphoneRef.current) {
      microphoneRef.current.disconnect();
      microphoneRef.current = null;
    }
    if (analyserRef.current) {
      analyserRef.current.disconnect();
      analyserRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsListening(false);
  };


  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (isListening) {
      const captureDecibels = () => {
        if (analyserRef.current && dataArrayRef.current) {
          analyserRef.current.getByteFrequencyData(dataArrayRef.current);
          const sum = dataArrayRef.current.reduce((a, b) => a + b, 0);
          const average = sum / dataArrayRef.current.length;
          const decibels = Math.min(Math.round(average), maxDecibels);
          setDecibels(decibels);

          if (decibels >= maxDecibels) {
            stopListening();
            onMaxDecibelReached();
          }
        }

        if (isListening) {
          animationFrameRef.current = requestAnimationFrame(captureDecibels);
        }
      };
      animationFrameRef.current = requestAnimationFrame(captureDecibels);
    } else {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isListening, onMaxDecibelReached]);

  const handleButtonClick = () => {
    if (showGift) {
      onRetry(); // Reset the gift and decibel level
    } else {
      isListening ? stopListening() : startListening();
    }
  };

  const getBackgroundColor = (decibels: number) => {
    const startColor = { r: 2, g: 130, b: 84 };
    const endColor = { r: 100, g: 200, b: 44 };
    const percentage = decibels / maxDecibels;

    const r = Math.round(startColor.r + (endColor.r - startColor.r) * percentage);
    const g = Math.round(startColor.g + (endColor.g - startColor.g) * percentage);
    const b = Math.round(startColor.b + (endColor.b - startColor.b) * percentage);

    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div className={styles.decibels}>
      <button onClick={handleButtonClick}>
        {showGift ? "Intentar de nuevo" : isListening ? "Grita!!!" : "Presiona"}
      </button>

      <section>
        <motion.div
          initial={{ height: "0%" }}
          animate={{ height: `${(decibels / maxDecibels) * 100}%` }}
          transition={{ ease: "easeOut", duration: 0.5 }}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            zIndex: "-1000",
            width: "100%",
            backgroundColor: getBackgroundColor(decibels),
          }}
        >
          <div className={styles.insideCurve}></div>
        </motion.div>

        <motion.div
          initial={{ y: "19px" }}
          animate={{ opacity: 1, y: "19px" }}
          transition={{ ease: "easeOut", duration: 0.5 }}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            zIndex: "-500",
            width: "100%",
            height: "100%",
            display: "grid",
            placeContent: "center",
          }}
        >
          <Image
            src="/ice.png"
            alt="Background Image"
            width={500}
            height={550}
            priority
          />
        </motion.div>

        <motion.div
          initial={{ bottom: "0%" }}
          animate={{ bottom: `${(decibels / maxDecibels) * 100}%` }}
          transition={{ ease: "easeOut", duration: 0.5 }}
          style={{
            position: "absolute",
            left: 0,
            zIndex: "-400",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255, 255, 255, 1)",
          }}
        ></motion.div>

        <picture>
          <Image
            src="/ice-base.png"
            alt="Icon"
            width={500}
            height={550}
            priority
          />
        </picture>
      </section>
    </div>
  );
};

export default DecibelButton;