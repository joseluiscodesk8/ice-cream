import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const DecibelButton: React.FC = () => {
  const [decibels, setDecibels] = useState<number>(0);
  const [isListening, setIsListening] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  const maxDecibels = 100; // Nivel objetivo de decibeles para detener la animación

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
      console.error("Error al acceder al micrófono:", error);
    }
  };

  const stopListening = () => {
    if (microphoneRef.current) microphoneRef.current.disconnect();
    if (analyserRef.current) analyserRef.current.disconnect();
    if (audioContextRef.current) audioContextRef.current.close();
    setIsListening(false);
  };

  useEffect(() => {
    if (isListening) {
      const captureDecibels = () => {
        if (analyserRef.current && dataArrayRef.current) {
          analyserRef.current.getByteFrequencyData(dataArrayRef.current);
          const sum = dataArrayRef.current.reduce((a, b) => a + b, 0);
          const average = sum / dataArrayRef.current.length;
          const decibels = Math.min(Math.round(average), maxDecibels);
          setDecibels(decibels);

          if (decibels >= maxDecibels) stopListening();
        }
        if (isListening) requestAnimationFrame(captureDecibels);
      };
      requestAnimationFrame(captureDecibels);
    }
  }, [isListening]);

  return (
    <div style={{ textAlign: "center" }}>
      <button onClick={isListening ? stopListening : startListening}>
        {isListening ? "Detener" : "Capturar Decibeles"}
      </button>

      <div
        style={{
          position: "relative",
          width: "150px",
          height: "300px",
          border: "2px solid #ddd",
          margin: "20px auto",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${(decibels / maxDecibels) * 100}%` }}
          transition={{ ease: "easeOut", duration: 0.5 }}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            backgroundColor: decibels >= maxDecibels ? "red" : "green",
          }}
        />
        
        {/* Imagen en el centro */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
          <Image src="/bart.png" alt="Icono" width={150} height={150} />
        </div>
      </div>
    </div>
  );
};

export default DecibelButton;
