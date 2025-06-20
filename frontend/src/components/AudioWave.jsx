import React, { useRef, useEffect, useState } from "react";

const AudioWave = ({ isActive, isListening, isSpeaking }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const micSourceRef = useRef(null);
  const outputSourceRef = useRef(null);
  const [audioInitialized, setAudioInitialized] = useState(false);

  const initializeAudio = async () => {
    if (audioInitialized) return;

    try {
      // Create audio context
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();

      // Create analyser
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;

      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);

      // Get microphone access for listening visualization
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });

        micSourceRef.current =
          audioContextRef.current.createMediaStreamSource(stream);
        micSourceRef.current.connect(analyserRef.current);
      }

      setAudioInitialized(true);
    } catch (error) {
      console.error("Error initializing audio:", error);
    }
  };

  // Method to connect audio output (like TTS or media elements) to the analyser
  const connectAudioOutput = (audioElement) => {
    if (!audioContextRef.current || !analyserRef.current) return;

    try {
      // Disconnect microphone when connecting output
      if (micSourceRef.current) {
        micSourceRef.current.disconnect();
      }

      // Connect audio output to analyser
      if (audioElement) {
        outputSourceRef.current =
          audioContextRef.current.createMediaElementSource(audioElement);
        outputSourceRef.current.connect(analyserRef.current);
        outputSourceRef.current.connect(audioContextRef.current.destination);
      }
    } catch (error) {
      console.error("Error connecting audio output:", error);
    }
  };

  // Method to reconnect microphone input
  const connectMicrophoneInput = () => {
    if (
      !audioContextRef.current ||
      !analyserRef.current ||
      !micSourceRef.current
    )
      return;

    try {
      // Disconnect output source if connected
      if (outputSourceRef.current) {
        outputSourceRef.current.disconnect();
      }

      // Reconnect microphone
      micSourceRef.current.connect(analyserRef.current);
    } catch (error) {
      console.error("Error connecting microphone input:", error);
    }
  };

  // Method to create and connect synthesized speech
  const connectSpeechSynthesis = (text, voice = null) => {
    if (!audioContextRef.current || !analyserRef.current) return;

    try {
      // Use Web Audio API for TTS to capture output
      const utterance = new SpeechSynthesisUtterance(text);
      if (voice) utterance.voice = voice;

      // For Web Audio API TTS visualization, we need to create an audio buffer
      // This is a simplified approach - in practice, you might want to use
      // a more sophisticated TTS library that works with Web Audio API

      // Create oscillator for demonstration (replace with actual TTS audio)
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(analyserRef.current);
      gainNode.connect(audioContextRef.current.destination);

      // Configure for speech-like frequency
      oscillator.frequency.setValueAtTime(
        150,
        audioContextRef.current.currentTime
      );
      gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);

      oscillator.start();

      // Stop after speech duration (estimate)
      setTimeout(() => {
        oscillator.stop();
        oscillator.disconnect();
        gainNode.disconnect();
      }, text.length * 100); // Rough estimate: 100ms per character

      // Also trigger browser's speech synthesis
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error("Error connecting speech synthesis:", error);
    }
  };

  // Expose methods globally for use by parent components
  useEffect(() => {
    if (audioInitialized) {
      window.audioWaveControls = {
        connectAudioOutput,
        connectMicrophoneInput,
        connectSpeechSynthesis,
      };
    }

    return () => {
      delete window.audioWaveControls;
    };
  }, [audioInitialized]);

  // Switch audio source based on listening/speaking state
  useEffect(() => {
    if (!audioInitialized) return;

    if (isListening) {
      connectMicrophoneInput();
    }
    // When speaking, we assume external audio is being played
    // The parent component should call connectAudioOutput or connectSpeechSynthesis
  }, [isListening, isSpeaking, audioInitialized]);

  const drawWave = () => {
    if (!canvasRef.current || !analyserRef.current || !dataArrayRef.current)
      return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    if (isActive && (isListening || isSpeaking)) {
      // Get frequency data
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);

      // Calculate average amplitude
      const average =
        dataArrayRef.current.reduce((sum, value) => sum + value, 0) /
        dataArrayRef.current.length;

      // Create wave visualization
      const centerY = height / 2;
      const waveHeight = Math.max(10, (average / 255) * height * 0.7);

      // Draw multiple wave bars
      const barCount = 20;
      const barWidth = width / barCount;

      ctx.fillStyle = isListening ? "#ef4444" : "#3b82f6"; // Red for listening, blue for speaking

      for (let i = 0; i < barCount; i++) {
        const dataIndex = Math.floor(
          (i / barCount) * dataArrayRef.current.length
        );
        const barHeight = Math.max(
          4,
          (dataArrayRef.current[dataIndex] / 255) * height * 0.8
        );

        const x = i * barWidth + barWidth * 0.1;
        const y = centerY - barHeight / 2;

        // Add some animation variation
        const animationOffset = Math.sin(Date.now() * 0.01 + i * 0.5) * 5;

        ctx.fillRect(x, y + animationOffset, barWidth * 0.8, barHeight);
      }

      // Add glow effect
      ctx.shadowBlur = 10;
      ctx.shadowColor = isListening ? "#ef4444" : "#3b82f6";

      // Draw center line
      ctx.strokeStyle = isListening ? "#ef4444" : "#3b82f6";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();

      ctx.shadowBlur = 0;
    } else {
      // Draw static wave when inactive
      const centerY = height / 2;
      ctx.strokeStyle = "#d1d5db";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();

      // Draw small static bars
      const barCount = 20;
      const barWidth = width / barCount;

      ctx.fillStyle = "#e5e7eb";

      for (let i = 0; i < barCount; i++) {
        const x = i * barWidth + barWidth * 0.1;
        const barHeight = 4;
        const y = centerY - barHeight / 2;

        ctx.fillRect(x, y, barWidth * 0.8, barHeight);
      }
    }
  };

  const animate = () => {
    drawWave();
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isActive) {
      initializeAudio();
    }
  }, [isActive]);

  useEffect(() => {
    if (isActive && audioInitialized) {
      animate();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, audioInitialized, isListening, isSpeaking]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (micSourceRef.current) {
        micSourceRef.current.disconnect();
      }
      if (outputSourceRef.current) {
        outputSourceRef.current.disconnect();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className="w-full h-16 bg-gray-50 rounded-lg p-2 border">
      <canvas
        ref={canvasRef}
        width={350}
        height={48}
        className="w-full h-full"
        style={{ imageRendering: "pixelated" }}
      />
      {/* <div className="text-xs text-center mt-1 text-gray-500">
        {isListening
          ? "Listening..."
          : isSpeaking
          ? "Speaking..."
          : "Voice Assistant Ready"}
      </div> */}
    </div>
  );
};

export default AudioWave;
