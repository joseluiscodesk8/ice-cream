import React, { useState, useEffect, useRef } from "react";

const DecibelButton: React.FC = () => {
  const [decibels, setDecibels] = useState<number | null>(null);
  const [isListening, setIsListening] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  const startListening = async () => {
    try {
      console.log("Solicitando acceso al micrófono...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Acceso al micrófono concedido.");

      // Crear el contexto de audio y el nodo de análisis
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);

      // Conectar el micrófono al contexto de audio
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
      microphoneRef.current.connect(analyserRef.current);

      console.log("Comenzando a captar decibeles...");
      setIsListening(true);
    } catch (error) {
      console.error("Error al acceder al micrófono:", error);
    }
  };

  const stopListening = () => {
    console.log("Deteniendo la captura de audio...");
    if (microphoneRef.current) microphoneRef.current.disconnect();
    if (analyserRef.current) analyserRef.current.disconnect();
    if (audioContextRef.current) audioContextRef.current.close();

    setIsListening(false);
    console.log("Captura de audio detenida.");
  };

  useEffect(() => {
    if (isListening) {
      const captureDecibels = () => {
        if (analyserRef.current && dataArrayRef.current) {
          analyserRef.current.getByteFrequencyData(dataArrayRef.current);

          // Calcular el nivel promedio de decibeles
          const sum = dataArrayRef.current.reduce((a, b) => a + b, 0);
          const average = sum / dataArrayRef.current.length;
          const decibels = Math.round(average);

          setDecibels(decibels);
          console.log(`Decibeles actuales: ${decibels} dB`);
        }

        // Continuar la captura en cada frame
        if (isListening) requestAnimationFrame(captureDecibels);
      };

      // Iniciar la captura
      requestAnimationFrame(captureDecibels);
    }
  }, [isListening]); // Solo se ejecuta cuando `isListening` cambia

  return (
    <div>
      <button onClick={isListening ? stopListening : startListening}>
        {isListening ? "Detener" : "Capturar Decibeles"}
      </button>
      {decibels !== null && <p>Nivel de decibeles: {decibels} dB</p>}
    </div>
  );
};

export default DecibelButton;
