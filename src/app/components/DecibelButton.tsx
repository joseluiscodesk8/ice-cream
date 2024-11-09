import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import styles from "../styles/index.module.scss";

const DecibelButton: React.FC = () => {
  const [decibels, setDecibels] = useState<number>(0);
  const [isListening, setIsListening] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  const maxDecibels = 50; // Nivel objetivo de decibeles para detener la animación

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      dataArrayRef.current = new Uint8Array(
        analyserRef.current.frequencyBinCount
      );
      microphoneRef.current =
        audioContextRef.current.createMediaStreamSource(stream);
      microphoneRef.current.connect(analyserRef.current);
      setIsListening(true);
    } catch (error) {
      console.error("Error al acceder al micrófono:", error);
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
  }, [isListening]);

  const getBackgroundColor = (decibels: number) => {
    const startColor = { r: 2, g: 130, b: 84 }; // Verde inicial (0% de decibeles)
    const endColor = { r: 100, g: 200, b: 44 }; // Verde final (100% de decibeles)

    const percentage = decibels / maxDecibels;

    const r = Math.round(
      startColor.r + (endColor.r - startColor.r) * percentage
    );
    const g = Math.round(
      startColor.g + (endColor.g - startColor.g) * percentage
    );
    const b = Math.round(
      startColor.b + (endColor.b - startColor.b) * percentage
    );

    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div className={styles.decibels}>
      <button onClick={isListening ? stopListening : startListening}>
        {isListening ? "Grita!!!" : "Preciona"}
      </button>

      <section>
        {/* Imagen de fondo sincronizada */}
        <motion.div
          initial={{ height: "0%" }} // Comienza con la altura completa
          animate={{
            height: `${(decibels / maxDecibels) * 100}%`, // Disminuye la altura al aumentar los decibeles
          }}
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

        {/* Imagen adicional que aparece detrás */}
        <motion.div
          initial={{ y: "20px" }}
          animate={{
            opacity: 1,
            y: "20px",
          }}
          transition={{ ease: "easeOut", duration: 0.5 }}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            zIndex: "-500",
            width: "100%",
            height: "100%",
            display: "grid", // Añadimos display grid
            placeContent: "center", // Centramos el contenido
          }}
        >
          <Image
            src="/ice.png"
            alt="Imagen de fondo"
            width={500}
            height={550}
            priority
          />
        </motion.div>

        {/* Div que tapará la imagen adicional y se destapará a medida que los decibeles aumenten */}
        <motion.div
          initial={{ bottom: "0%" }} // Empieza en la parte inferior (cubriendo la imagen completamente)
          animate={{
            bottom: `${(decibels / maxDecibels) * 100}%`, // A medida que los decibelios aumentan, la imagen se destapa
          }}
          transition={{ ease: "easeOut", duration: 0.5 }}
          style={{
            position: "absolute",
            left: 0,
            zIndex: "-400", // Este div tiene un zIndex mayor al de la imagen adicional
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255, 255, 255, 1)", // Semitransparente para cubrir la imagen adicional
          }}
        ></motion.div>

        {/* Imagen principal que ya estaba cargada */}
        <picture>
          <Image
            src="/ice-base.png"
            alt="Icono"
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